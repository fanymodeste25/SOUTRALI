"""
Webhook models for Soutrali platform.
"""
from django.db import models
from django.utils.translation import gettext_lazy as _
import uuid


class WebhookEvent(models.Model):
    """Model for tracking webhook events from payment providers."""

    class Provider(models.TextChoices):
        WAVE = 'WAVE', _('Wave')
        ORANGE_MONEY = 'ORANGE_MONEY', _('Orange Money')
        MTN_MOMO = 'MTN_MOMO', _('MTN Mobile Money')
        OTHER = 'OTHER', _('Other')

    class Status(models.TextChoices):
        PENDING = 'PENDING', _('Pending')
        PROCESSING = 'PROCESSING', _('Processing')
        PROCESSED = 'PROCESSED', _('Processed')
        FAILED = 'FAILED', _('Failed')
        IGNORED = 'IGNORED', _('Ignored')

    class EventType(models.TextChoices):
        PAYMENT_SUCCESS = 'PAYMENT_SUCCESS', _('Payment Success')
        PAYMENT_FAILED = 'PAYMENT_FAILED', _('Payment Failed')
        PAYMENT_PENDING = 'PAYMENT_PENDING', _('Payment Pending')
        PAYMENT_CANCELLED = 'PAYMENT_CANCELLED', _('Payment Cancelled')
        REFUND_SUCCESS = 'REFUND_SUCCESS', _('Refund Success')
        REFUND_FAILED = 'REFUND_FAILED', _('Refund Failed')
        OTHER = 'OTHER', _('Other')

    # Unique identifier
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event_id = models.CharField(
        _('event ID'),
        max_length=200,
        unique=True,
        db_index=True,
        help_text=_('Unique identifier from the provider')
    )

    # Provider information
    provider = models.CharField(
        _('provider'),
        max_length=20,
        choices=Provider.choices
    )
    event_type = models.CharField(
        _('event type'),
        max_length=50,
        choices=EventType.choices,
        default=EventType.OTHER
    )

    # Webhook data
    payload = models.JSONField(
        _('payload'),
        help_text=_('Raw webhook payload')
    )
    headers = models.JSONField(
        _('headers'),
        default=dict,
        blank=True,
        help_text=_('HTTP headers from webhook request')
    )

    # Request details
    ip_address = models.GenericIPAddressField(_('IP address'), null=True, blank=True)
    user_agent = models.TextField(_('user agent'), blank=True)
    http_method = models.CharField(_('HTTP method'), max_length=10, default='POST')

    # Signature verification
    signature = models.CharField(_('signature'), max_length=500, blank=True)
    signature_verified = models.BooleanField(_('signature verified'), default=False)
    signature_algorithm = models.CharField(_('signature algorithm'), max_length=50, blank=True)

    # Processing status
    status = models.CharField(
        _('status'),
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    processing_attempts = models.PositiveIntegerField(_('processing attempts'), default=0)
    last_processing_error = models.TextField(_('last processing error'), blank=True)

    # Related payment
    payment = models.ForeignKey(
        'payments.Payment',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='webhook_events'
    )

    # Idempotency
    idempotency_key = models.CharField(
        _('idempotency key'),
        max_length=200,
        db_index=True,
        blank=True,
        help_text=_('Key to prevent duplicate processing')
    )

    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    processed_at = models.DateTimeField(_('processed at'), null=True, blank=True)

    # Response
    response_status_code = models.PositiveIntegerField(
        _('response status code'),
        null=True,
        blank=True,
        help_text=_('HTTP status code sent back to provider')
    )
    response_body = models.TextField(_('response body'), blank=True)

    class Meta:
        verbose_name = _('webhook event')
        verbose_name_plural = _('webhook events')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['event_id']),
            models.Index(fields=['provider', 'status']),
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['payment', '-created_at']),
            models.Index(fields=['idempotency_key']),
            models.Index(fields=['-created_at']),
        ]

    def __str__(self):
        return f"{self.provider} - {self.event_type} - {self.event_id}"

    @property
    def is_processed(self):
        """Check if webhook has been processed."""
        return self.status == self.Status.PROCESSED

    @property
    def needs_retry(self):
        """Check if webhook needs retry."""
        return self.status == self.Status.FAILED and self.processing_attempts < 5

    def mark_processed(self):
        """Mark webhook as processed."""
        from django.utils import timezone
        self.status = self.Status.PROCESSED
        self.processed_at = timezone.now()
        self.save(update_fields=['status', 'processed_at', 'updated_at'])

    def mark_failed(self, error_message):
        """Mark webhook as failed."""
        self.status = self.Status.FAILED
        self.last_processing_error = error_message
        self.processing_attempts += 1
        self.save(update_fields=['status', 'last_processing_error', 'processing_attempts', 'updated_at'])


class WebhookRetry(models.Model):
    """Model for tracking webhook retry attempts."""

    webhook_event = models.ForeignKey(
        WebhookEvent,
        on_delete=models.CASCADE,
        related_name='retries'
    )
    attempt_number = models.PositiveIntegerField(_('attempt number'))
    error_message = models.TextField(_('error message'), blank=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    next_retry_at = models.DateTimeField(_('next retry at'), null=True, blank=True)

    class Meta:
        verbose_name = _('webhook retry')
        verbose_name_plural = _('webhook retries')
        ordering = ['-created_at']

    def __str__(self):
        return f"Retry {self.attempt_number} for {self.webhook_event.event_id}"
