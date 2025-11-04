"""
Signals for users app.
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType
from .models import User
from apps.core.models import AuditLog


@receiver(post_save, sender=User)
def log_user_changes(sender, instance, created, **kwargs):
    """Log user creation and updates."""
    if created:
        AuditLog.objects.create(
            user=instance if not created else None,
            action=AuditLog.Action.CREATE,
            description=f"User account created: {instance.email}",
            content_type=ContentType.objects.get_for_model(User),
            object_id=str(instance.id),
            new_values={
                'email': instance.email,
                'role': instance.role,
            }
        )
