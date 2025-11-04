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

        # TODO: Generate actual verification URL
        verification_url = f"https://soutrali.com/verify-email?token={token}"

        subject = 'Verify your email address'
        message = f"""
        Hello {user.first_name},

        Please verify your email address by clicking the link below:

        {verification_url}

        This link will expire in 7 days.

        If you didn't create an account, you can ignore this email.

        Best regards,
        The Soutrali Team
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
