"""
Signals for payments app.
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from django.contrib.contenttypes.models import ContentType
from .models import Payment, Donation
from apps.core.models import AuditLog, Notification


@receiver(post_save, sender=Payment)
def handle_successful_payment(sender, instance, created, **kwargs):
    """Handle successful payment processing."""
    # Only process if payment just became successful
    if instance.status == Payment.Status.SUCCESS and instance.paid_at:
        # Create donation record if not exists
        if not hasattr(instance, 'donation') or not instance.donation:
            donation = Donation.objects.create(
                campaign=instance.campaign,
                donor=instance.donor,
                amount=instance.amount,
                currency=instance.currency,
                donor_name=instance.donor_name,
                donor_email=instance.donor_email,
                donor_phone=instance.donor_phone,
                is_anonymous=instance.is_anonymous,
                is_verified=True
            )
            instance.donation = donation
            instance.save(update_fields=['donation'])

        # Update campaign donation count and amount
        instance.campaign.increment_donation(instance.net_amount)

        # Notify campaign organizer
        Notification.objects.create(
            recipient=instance.campaign.organizer,
            notification_type=Notification.Type.DONATION_RECEIVED,
            title='New Donation Received',
            message=f'You received a donation of {instance.amount} {instance.currency} for "{instance.campaign.title}"',
            content_type=ContentType.objects.get_for_model(Payment),
            object_id=str(instance.id)
        )

        # Notify donor if not anonymous
        if not instance.is_anonymous and instance.donor:
            Notification.objects.create(
                recipient=instance.donor,
                notification_type=Notification.Type.PAYMENT_SUCCESS,
                title='Payment Successful',
                message=f'Your donation of {instance.amount} {instance.currency} to "{instance.campaign.title}" was successful.',
                content_type=ContentType.objects.get_for_model(Payment),
                object_id=str(instance.id)
            )

        # Log the payment
        AuditLog.objects.create(
            user=instance.donor,
            action=AuditLog.Action.PAYMENT,
            description=f"Successful payment: {instance.amount} {instance.currency} to {instance.campaign.title}",
            content_type=ContentType.objects.get_for_model(Payment),
            object_id=str(instance.id),
            new_values={
                'amount': str(instance.amount),
                'campaign': instance.campaign.title,
                'status': instance.status,
            }
        )
