"""
Signals for campaigns app.
"""
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.utils.text import slugify
from django.contrib.contenttypes.models import ContentType
from .models import Campaign
from apps.core.models import AuditLog, Notification
import uuid


@receiver(pre_save, sender=Campaign)
def generate_campaign_slug(sender, instance, **kwargs):
    """Generate unique slug for campaign if not provided."""
    if not instance.slug:
        base_slug = slugify(instance.title)
        unique_slug = base_slug
        counter = 1

        while Campaign.objects.filter(slug=unique_slug).exclude(id=instance.id).exists():
            unique_slug = f"{base_slug}-{counter}"
            counter += 1

        instance.slug = unique_slug


@receiver(post_save, sender=Campaign)
def log_campaign_changes(sender, instance, created, **kwargs):
    """Log campaign creation and status changes."""
    if created:
        AuditLog.objects.create(
            user=instance.organizer,
            action=AuditLog.Action.CREATE,
            description=f"Campaign created: {instance.title}",
            content_type=ContentType.objects.get_for_model(Campaign),
            object_id=str(instance.id),
            new_values={
                'title': instance.title,
                'status': instance.status,
                'goal_amount': str(instance.goal_amount),
            }
        )
    elif instance.status == Campaign.Status.ACTIVE:
        # Notify organizer when campaign is approved
        Notification.objects.create(
            recipient=instance.organizer,
            notification_type=Notification.Type.CAMPAIGN_APPROVED,
            title='Campaign Approved',
            message=f'Your campaign "{instance.title}" has been approved and is now active.',
            content_type=ContentType.objects.get_for_model(Campaign),
            object_id=str(instance.id)
        )
