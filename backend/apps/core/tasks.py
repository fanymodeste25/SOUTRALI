"""
Celery tasks for core app.
"""
from celery import shared_task
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def send_email_task(self, subject, message, recipient_list, html_message=None):
    """
    Send email via Celery.

    Args:
        subject: Email subject
        message: Plain text message
        recipient_list: List of recipient emails
        html_message: HTML version of message (optional)
    """
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipient_list,
            html_message=html_message,
            fail_silently=False
        )

        logger.info(f"Email sent to {recipient_list}: {subject}")
        return {'status': 'sent', 'recipients': len(recipient_list)}

    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}", exc_info=True)

        # Retry with exponential backoff
        raise self.retry(exc=e, countdown=60 * (2 ** self.request.retries))


@shared_task
def send_welcome_email(user_id):
    """Send welcome email to new user."""
    from apps.users.models import User

    try:
        user = User.objects.get(id=user_id)

        subject = 'Welcome to Soutrali!'
        message = f"""
        Hello {user.first_name},

        Welcome to Soutrali! Thank you for joining our community.

        Soutrali is a platform that makes it easy to raise funds for causes you care about.

        {"As an organizer, you can create campaigns to collect donations for your projects." if user.role == User.Role.ORGANIZER else ""}

        Please verify your email address to get started.

        Best regards,
        The Soutrali Team
        """

        send_email_task.delay(
            subject=subject,
            message=message,
            recipient_list=[user.email]
        )

        logger.info(f"Welcome email queued for {user.email}")

    except User.DoesNotExist:
        logger.error(f"User {user_id} not found for welcome email")
    except Exception as e:
        logger.error(f"Failed to queue welcome email: {str(e)}", exc_info=True)


@shared_task
def send_verification_email(user_id, token):
    """Send email verification link."""
    from apps.users.models import User

    try:
        user = User.objects.get(id=user_id)

        # Generate verification URL using frontend URL from settings
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
        verification_url = f"{frontend_url}/verify-email?token={token}"

        subject = 'Vérifiez votre adresse email - Soutrali'
        message = f"""
        Bonjour {user.first_name},

        Merci de vous être inscrit sur Soutrali !

        Veuillez vérifier votre adresse email en cliquant sur le lien ci-dessous :

        {verification_url}

        Ce lien expirera dans 7 jours.

        Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.

        Cordialement,
        L'équipe Soutrali
        """

        send_email_task.delay(
            subject=subject,
            message=message,
            recipient_list=[user.email]
        )

        logger.info(f"Verification email queued for {user.email}")

    except User.DoesNotExist:
        logger.error(f"User {user_id} not found for verification email")
    except Exception as e:
        logger.error(f"Failed to queue verification email: {str(e)}", exc_info=True)


@shared_task
def send_notification_email(notification_id):
    """Send notification via email."""
    from apps.core.models import Notification

    try:
        notification = Notification.objects.select_related('recipient').get(id=notification_id)
        user = notification.recipient

        # Check if user wants email notifications
        if not user.email_notifications:
            logger.info(f"User {user.email} has disabled email notifications")
            return

        subject = notification.title
        message = notification.message

        send_email_task.delay(
            subject=subject,
            message=message,
            recipient_list=[user.email]
        )

        logger.info(f"Notification email queued for {user.email}: {notification.title}")

    except Notification.DoesNotExist:
        logger.error(f"Notification {notification_id} not found")
    except Exception as e:
        logger.error(f"Failed to queue notification email: {str(e)}", exc_info=True)


@shared_task
def cleanup_old_notifications():
    """Clean up old read notifications (older than 30 days)."""
    from apps.core.models import Notification
    from datetime import timedelta

    try:
        cutoff_date = timezone.now() - timedelta(days=30)
        deleted_count = Notification.objects.filter(
            is_read=True,
            read_at__lt=cutoff_date
        ).delete()[0]

        logger.info(f"Cleaned up {deleted_count} old notifications")
        return {'deleted': deleted_count}

    except Exception as e:
        logger.error(f"Failed to cleanup notifications: {str(e)}", exc_info=True)


@shared_task
def cleanup_old_audit_logs():
    """Clean up old audit logs (older than 90 days)."""
    from apps.core.models import AuditLog
    from datetime import timedelta

    try:
        cutoff_date = timezone.now() - timedelta(days=90)

        # Keep important actions longer
        important_actions = [
            AuditLog.Action.PAYMENT,
            AuditLog.Action.REFUND,
            AuditLog.Action.KYC_APPROVE,
            AuditLog.Action.KYC_REJECT
        ]

        deleted_count = AuditLog.objects.filter(
            created_at__lt=cutoff_date
        ).exclude(
            action__in=important_actions
        ).delete()[0]

        logger.info(f"Cleaned up {deleted_count} old audit logs")
        return {'deleted': deleted_count}

    except Exception as e:
        logger.error(f"Failed to cleanup audit logs: {str(e)}", exc_info=True)


@shared_task
def notify_admins_kyc_submission(user_id):
    """Notify admins when a KYC is submitted."""
    from apps.users.models import User
    from apps.core.models import Notification

    try:
        user = User.objects.get(id=user_id)
        admins = User.objects.filter(role=User.Role.ADMIN, is_active=True)

        for admin in admins:
            notification = Notification.objects.create(
                recipient=admin,
                title='Nouvelle soumission KYC',
                message=f'{user.get_full_name()} ({user.email}) a soumis ses documents KYC pour vérification.',
                notification_type=Notification.Type.KYC_SUBMISSION
            )

            # Send email notification if admin has email notifications enabled
            if admin.email_notifications:
                send_notification_email.delay(str(notification.id))

        logger.info(f"Admins notified of KYC submission by user {user.email}")

    except User.DoesNotExist:
        logger.error(f"User {user_id} not found for KYC notification")
    except Exception as e:
        logger.error(f"Failed to notify admins of KYC submission: {str(e)}", exc_info=True)


@shared_task
def notify_user_kyc_review(user_id, status, rejection_reason=''):
    """Notify user of KYC review decision."""
    from apps.users.models import User
    from apps.core.models import Notification

    try:
        user = User.objects.get(id=user_id)

        if status == User.KYCStatus.APPROVED:
            title = 'KYC Approuvé'
            message = 'Félicitations ! Votre vérification d\'identité a été approuvée. Vous pouvez maintenant créer des campagnes.'
            notification_type = Notification.Type.KYC_APPROVED
        else:  # REJECTED
            title = 'KYC Rejeté'
            message = f'Votre vérification d\'identité a été rejetée. Raison: {rejection_reason}'
            notification_type = Notification.Type.KYC_REJECTED

        notification = Notification.objects.create(
            recipient=user,
            title=title,
            message=message,
            notification_type=notification_type
        )

        # Send email notification if user has email notifications enabled
        if user.email_notifications:
            send_notification_email.delay(str(notification.id))

        logger.info(f"User {user.email} notified of KYC review: {status}")

    except User.DoesNotExist:
        logger.error(f"User {user_id} not found for KYC review notification")
    except Exception as e:
        logger.error(f"Failed to notify user of KYC review: {str(e)}", exc_info=True)
