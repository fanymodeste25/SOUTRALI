"""
Core models for Soutrali platform.
"""
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
import uuid


class AuditLog(models.Model):
    """Model for tracking all important actions in the system."""

    class Action(models.TextChoices):
        CREATE = 'CREATE', _('Create')
        UPDATE = 'UPDATE', _('Update')
        DELETE = 'DELETE', _('Delete')
        APPROVE = 'APPROVE', _('Approve')
        REJECT = 'REJECT', _('Reject')
        PUBLISH = 'PUBLISH', _('Publish')
        UNPUBLISH = 'UNPUBLISH', _('Unpublish')
        PAYMENT = 'PAYMENT', _('Payment')
        REFUND = 'REFUND', _('Refund')
        LOGIN = 'LOGIN', _('Login')
        LOGOUT = 'LOGOUT', _('Logout')
        PASSWORD_CHANGE = 'PASSWORD_CHANGE', _('Password Change')
        KYC_SUBMIT = 'KYC_SUBMIT', _('KYC Submit')
        KYC_APPROVE = 'KYC_APPROVE', _('KYC Approve')
        KYC_REJECT = 'KYC_REJECT', _('KYC Reject')
        OTHER = 'OTHER', _('Other')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # User who performed the action
    user = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='audit_logs'
    )

    # Action details
    action = models.CharField(
        _('action'),
        max_length=50,
        choices=Action.choices
    )
    description = models.TextField(_('description'), blank=True)

    # Target object (using generic foreign key)
    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    object_id = models.CharField(_('object ID'), max_length=100, blank=True)
    content_object = GenericForeignKey('content_type', 'object_id')

    # Changes
    old_values = models.JSONField(_('old values'), default=dict, blank=True)
    new_values = models.JSONField(_('new values'), default=dict, blank=True)

    # Request details
    ip_address = models.GenericIPAddressField(_('IP address'), null=True, blank=True)
    user_agent = models.TextField(_('user agent'), blank=True)

    # Timestamp
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)

    class Meta:
        verbose_name = _('audit log')
        verbose_name_plural = _('audit logs')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['action', '-created_at']),
            models.Index(fields=['content_type', 'object_id']),
            models.Index(fields=['-created_at']),
        ]

    def __str__(self):
        user_display = self.user.email if self.user else 'System'
        return f"{user_display} - {self.action} - {self.created_at}"


class SystemSetting(models.Model):
    """Model for storing system-wide settings."""

    key = models.CharField(_('key'), max_length=100, unique=True, db_index=True)
    value = models.JSONField(_('value'))
    description = models.TextField(_('description'), blank=True)
    is_public = models.BooleanField(_('public'), default=False)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        verbose_name = _('system setting')
        verbose_name_plural = _('system settings')
        ordering = ['key']

    def __str__(self):
        return self.key


class Notification(models.Model):
    """Model for user notifications."""

    class Type(models.TextChoices):
        DONATION_RECEIVED = 'DONATION_RECEIVED', _('Donation Received')
        CAMPAIGN_APPROVED = 'CAMPAIGN_APPROVED', _('Campaign Approved')
        CAMPAIGN_REJECTED = 'CAMPAIGN_REJECTED', _('Campaign Rejected')
        CAMPAIGN_UPDATE = 'CAMPAIGN_UPDATE', _('Campaign Update')
        CAMPAIGN_COMPLETED = 'CAMPAIGN_COMPLETED', _('Campaign Completed')
        PAYMENT_SUCCESS = 'PAYMENT_SUCCESS', _('Payment Success')
        PAYMENT_FAILED = 'PAYMENT_FAILED', _('Payment Failed')
        KYC_APPROVED = 'KYC_APPROVED', _('KYC Approved')
        KYC_REJECTED = 'KYC_REJECTED', _('KYC Rejected')
        COMMENT_RECEIVED = 'COMMENT_RECEIVED', _('Comment Received')
        OTHER = 'OTHER', _('Other')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    recipient = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='notifications'
    )

    # Notification details
    notification_type = models.CharField(
        _('type'),
        max_length=50,
        choices=Type.choices
    )
    title = models.CharField(_('title'), max_length=200)
    message = models.TextField(_('message'))

    # Link
    link = models.URLField(_('link'), blank=True, max_length=500)

    # Target object (using generic foreign key)
    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    object_id = models.CharField(_('object ID'), max_length=100, blank=True)
    content_object = GenericForeignKey('content_type', 'object_id')

    # Status
    is_read = models.BooleanField(_('read'), default=False)
    read_at = models.DateTimeField(_('read at'), null=True, blank=True)

    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)

    class Meta:
        verbose_name = _('notification')
        verbose_name_plural = _('notifications')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'is_read', '-created_at']),
            models.Index(fields=['-created_at']),
        ]

    def __str__(self):
        return f"{self.recipient.email} - {self.title}"

    def mark_as_read(self):
        """Mark notification as read."""
        from django.utils import timezone
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save(update_fields=['is_read', 'read_at'])
