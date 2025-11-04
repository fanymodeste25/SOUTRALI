"""
Celery tasks for payments app.
"""
from celery import shared_task
from django.utils import timezone
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


@shared_task
def send_payment_receipt(payment_id):
    """Generate and send payment receipt."""
    from apps.payments.models import Payment
    from apps.core.tasks import send_email_task

    try:
        payment = Payment.objects.select_related('campaign', 'donor').get(id=payment_id)

        if payment.status != Payment.Status.SUCCESS:
            logger.warning(f"Payment {payment.transaction_id} is not successful, skipping receipt")
            return

        if payment.receipt_sent:
            logger.info(f"Receipt already sent for payment {payment.transaction_id}")
            return

        # Generate receipt content
        subject = f'Receipt for your donation to {payment.campaign.title}'
        message = f"""
        Dear {payment.donor_name or 'Donor'},

        Thank you for your generous donation!

        Receipt Details:
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        Receipt Number: {payment.receipt_number}
        Transaction ID: {payment.transaction_id}
        Date: {payment.paid_at.strftime('%B %d, %Y at %I:%M %p')}

        Campaign: {payment.campaign.title}
        Amount: {payment.amount} {payment.currency}
        Payment Method: {payment.get_provider_display()}

        Platform Fee: {payment.platform_fee} {payment.currency}
        Provider Fee: {payment.provider_fee} {payment.currency}
        Net Amount to Campaign: {payment.net_amount} {payment.currency}
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        Your contribution makes a real difference. Thank you for your support!

        For any questions about this donation, please contact us at support@soutrali.com

        Best regards,
        The Soutrali Team

        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        This is an automatically generated receipt for your records.
        """

        # Send email
        send_email_task.delay(
            subject=subject,
            message=message,
            recipient_list=[payment.donor_email]
        )

        # Mark receipt as sent
        payment.receipt_sent = True
        payment.receipt_sent_at = timezone.now()
        payment.save(update_fields=['receipt_sent', 'receipt_sent_at'])

        logger.info(f"Receipt sent for payment {payment.transaction_id}")

    except Payment.DoesNotExist:
        logger.error(f"Payment {payment_id} not found")
    except Exception as e:
        logger.error(f"Failed to send receipt: {str(e)}", exc_info=True)


@shared_task
def send_donation_confirmation(payment_id):
    """Send donation confirmation to donor."""
    from apps.payments.models import Payment
    from apps.core.models import Notification

    try:
        payment = Payment.objects.select_related('campaign', 'donor').get(id=payment_id)

        if payment.status != Payment.Status.SUCCESS:
            return

        # Create notification for donor
        if payment.donor:
            Notification.objects.create(
                recipient=payment.donor,
                notification_type=Notification.Type.PAYMENT_SUCCESS,
                title='Donation Successful',
                message=f'Your donation of {payment.amount} {payment.currency} to "{payment.campaign.title}" was successful. Thank you for your generosity!',
                link=f'/campaigns/{payment.campaign.slug}'
            )

        logger.info(f"Donation confirmation sent for payment {payment.transaction_id}")

    except Payment.DoesNotExist:
        logger.error(f"Payment {payment_id} not found")
    except Exception as e:
        logger.error(f"Failed to send donation confirmation: {str(e)}", exc_info=True)


@shared_task
def send_donation_notification_to_organizer(payment_id):
    """Notify campaign organizer about new donation."""
    from apps.payments.models import Payment
    from apps.core.models import Notification
    from apps.core.tasks import send_email_task

    try:
        payment = Payment.objects.select_related('campaign', 'campaign__organizer').get(id=payment_id)

        if payment.status != Payment.Status.SUCCESS:
            return

        organizer = payment.campaign.organizer
        donor_name = 'Anonymous' if payment.is_anonymous else (payment.donor_name or 'A supporter')

        # Create notification
        Notification.objects.create(
            recipient=organizer,
            notification_type=Notification.Type.DONATION_RECEIVED,
            title='New Donation Received!',
            message=f'{donor_name} donated {payment.amount} {payment.currency} to your campaign "{payment.campaign.title}"',
            link=f'/campaigns/{payment.campaign.slug}'
        )

        # Send email
        subject = f'New donation for {payment.campaign.title}'
        message = f"""
        Hello {organizer.first_name},

        Great news! You received a new donation for your campaign "{payment.campaign.title}".

        Donation Details:
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        Donor: {donor_name}
        Amount: {payment.amount} {payment.currency}
        Net Amount (after fees): {payment.net_amount} {payment.currency}
        Date: {payment.paid_at.strftime('%B %d, %Y at %I:%M %p')}
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        Campaign Progress:
        Total Raised: {payment.campaign.current_amount} {payment.currency}
        Goal: {payment.campaign.goal_amount} {payment.currency}
        Progress: {payment.campaign.progress_percentage:.1f}%

        Keep up the great work!

        Best regards,
        The Soutrali Team
        """

        send_email_task.delay(
            subject=subject,
            message=message,
            recipient_list=[organizer.email]
        )

        logger.info(f"Organizer notification sent for payment {payment.transaction_id}")

    except Payment.DoesNotExist:
        logger.error(f"Payment {payment_id} not found")
    except Exception as e:
        logger.error(f"Failed to notify organizer: {str(e)}", exc_info=True)


@shared_task
def check_pending_payments():
    """Check status of pending payments and update if needed."""
    from apps.payments.models import Payment
    from apps.payments.providers import PaymentProviderFactory
    from datetime import timedelta

    try:
        # Get payments that are pending/processing for more than 15 minutes
        cutoff_time = timezone.now() - timedelta(minutes=15)

        pending_payments = Payment.objects.filter(
            status__in=[Payment.Status.PENDING, Payment.Status.PROCESSING],
            created_at__lt=cutoff_time
        ).exclude(
            provider_transaction_id__isnull=True
        ).exclude(
            provider_transaction_id=''
        )[:100]  # Limit to 100 at a time

        updated_count = 0

        for payment in pending_payments:
            try:
                provider = PaymentProviderFactory.create(payment.provider)
                result = provider.verify_payment(payment.provider_transaction_id)

                new_status = result.get('status')
                if new_status and new_status != payment.status:
                    payment.status = new_status

                    if new_status == Payment.Status.SUCCESS:
                        payment.paid_at = result.get('paid_at', timezone.now())

                    payment.save()
                    updated_count += 1

                    logger.info(f"Updated payment {payment.transaction_id} status to {new_status}")

            except Exception as e:
                logger.error(f"Failed to check payment {payment.transaction_id}: {str(e)}")
                continue

        logger.info(f"Checked {len(pending_payments)} pending payments, updated {updated_count}")
        return {'checked': len(pending_payments), 'updated': updated_count}

    except Exception as e:
        logger.error(f"Failed to check pending payments: {str(e)}", exc_info=True)


@shared_task
def expire_old_pending_payments():
    """Expire payments that have been pending for too long."""
    from apps.payments.models import Payment
    from datetime import timedelta

    try:
        # Expire payments pending for more than 1 hour
        cutoff_time = timezone.now() - timedelta(hours=1)

        expired_count = Payment.objects.filter(
            status__in=[Payment.Status.PENDING, Payment.Status.PROCESSING],
            created_at__lt=cutoff_time
        ).update(
            status=Payment.Status.EXPIRED
        )

        logger.info(f"Expired {expired_count} old pending payments")
        return {'expired': expired_count}

    except Exception as e:
        logger.error(f"Failed to expire old payments: {str(e)}", exc_info=True)


@shared_task
def process_refund(refund_id):
    """Process refund with payment provider."""
    from apps.payments.models import Refund
    from apps.payments.providers import PaymentProviderFactory

    try:
        refund = Refund.objects.select_related('payment').get(id=refund_id)

        if refund.status != Refund.Status.PENDING:
            logger.warning(f"Refund {refund.id} is not pending")
            return

        # Update status to processing
        refund.status = Refund.Status.PROCESSING
        refund.save(update_fields=['status'])

        # Process with provider
        provider = PaymentProviderFactory.create(refund.payment.provider)
        result = provider.initiate_refund(
            transaction_id=refund.payment.provider_transaction_id,
            amount=refund.amount,
            reason=refund.reason
        )

        # Update refund
        refund.provider_refund_id = result.get('refund_id')
        refund.provider_response = result.get('raw_response', {})
        refund.status = Refund.Status.SUCCESS if result.get('status') == 'SUCCESS' else Refund.Status.FAILED
        refund.completed_at = timezone.now()
        refund.save()

        # Update payment status if refund successful
        if refund.status == Refund.Status.SUCCESS:
            refund.payment.status = Payment.Status.REFUNDED
            refund.payment.save(update_fields=['status'])

        logger.info(f"Refund {refund.id} processed: {refund.status}")

    except Refund.DoesNotExist:
        logger.error(f"Refund {refund_id} not found")
    except Exception as e:
        logger.error(f"Failed to process refund {refund_id}: {str(e)}", exc_info=True)

        # Mark refund as failed
        try:
            refund.status = Refund.Status.FAILED
            refund.save(update_fields=['status'])
        except:
            pass
