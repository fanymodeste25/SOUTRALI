"""
Payment models for Soutrali platform.
"""
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator
from decimal import Decimal
import uuid


class Payment(models.Model):
    """Model for payment transactions."""

    class Status(models.TextChoices):
        PENDING = 'PENDING', _('Pending')
        PROCESSING = 'PROCESSING', _('Processing')
        SUCCESS = 'SUCCESS', _('Success')
        FAILED = 'FAILED', _('Failed')
        CANCELLED = 'CANCELLED', _('Cancelled')
        REFUNDED = 'REFUNDED', _('Refunded')
        EXPIRED = 'EXPIRED', _('Expired')

    class Provider(models.TextChoices):
        WAVE = 'WAVE', _('Wave')
        ORANGE_MONEY = 'ORANGE_MONEY', _('Orange Money')
        MTN_MOMO = 'MTN_MOMO', _('MTN Mobile Money')
        CARD = 'CARD', _('Credit/Debit Card')
        BANK_TRANSFER = 'BANK_TRANSFER', _('Bank Transfer')

    # Unique identifiers
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    transaction_id = models.CharField(_('transaction ID'), max_length=100, unique=True)
    idempotency_key = models.CharField(_('idempotency key'), max_length=100, unique=True, db_index=True)

    # Relationships
    donation = models.OneToOneField(
        'payments.Donation',
        on_delete=models.CASCADE,
        related_name='payment',
        null=True,
        blank=True
    )
    campaign = models.ForeignKey(
        'campaigns.Campaign',
        on_delete=models.PROTECT,
        related_name='payments'
    )
    donor = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='payments'
    )

    # Payment Details
    provider = models.CharField(
        _('payment provider'),
        max_length=20,
        choices=Provider.choices
    )
    status = models.CharField(
        _('status'),
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )

    # Amounts
    amount = models.DecimalField(
        _('amount'),
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('1'))]
    )
    currency = models.CharField(_('currency'), max_length=3, default='XOF')
    platform_fee = models.DecimalField(
        _('platform fee'),
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00')
    )
    provider_fee = models.DecimalField(
        _('provider fee'),
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00')
    )
    net_amount = models.DecimalField(
        _('net amount'),
        max_digits=12,
        decimal_places=2,
        help_text=_('Amount after deducting fees')
    )

    # Donor Information
    donor_email = models.EmailField(_('donor email'), blank=True)
    donor_phone = models.CharField(_('donor phone'), max_length=20, blank=True)
    donor_name = models.CharField(_('donor name'), max_length=200, blank=True)
    is_anonymous = models.BooleanField(_('anonymous donation'), default=False)

    # Provider-specific data
    provider_transaction_id = models.CharField(
        _('provider transaction ID'),
        max_length=200,
        blank=True,
        help_text=_('Transaction ID from payment provider')
    )
    provider_reference = models.CharField(
        _('provider reference'),
        max_length=200,
        blank=True
    )
    provider_response = models.JSONField(
        _('provider response'),
        default=dict,
        blank=True,
        help_text=_('Raw response from payment provider')
    )

    # Payment metadata
    payment_method = models.CharField(_('payment method'), max_length=100, blank=True)
    ip_address = models.GenericIPAddressField(_('IP address'), null=True, blank=True)
    user_agent = models.TextField(_('user agent'), blank=True)
    redirect_url = models.URLField(_('redirect URL'), blank=True, max_length=500)
    callback_url = models.URLField(_('callback URL'), blank=True, max_length=500)

    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    paid_at = models.DateTimeField(_('paid at'), null=True, blank=True)
    expires_at = models.DateTimeField(_('expires at'), null=True, blank=True)

    # Error handling
    error_code = models.CharField(_('error code'), max_length=50, blank=True)
    error_message = models.TextField(_('error message'), blank=True)
    retry_count = models.PositiveIntegerField(_('retry count'), default=0)

    # Reconciliation
    reconciled = models.BooleanField(_('reconciled'), default=False)
    reconciled_at = models.DateTimeField(_('reconciled at'), null=True, blank=True)
    reconciliation_notes = models.TextField(_('reconciliation notes'), blank=True)

    # Receipt
    receipt_sent = models.BooleanField(_('receipt sent'), default=False)
    receipt_sent_at = models.DateTimeField(_('receipt sent at'), null=True, blank=True)
    receipt_number = models.CharField(_('receipt number'), max_length=50, blank=True, unique=True)

    class Meta:
        verbose_name = _('payment')
        verbose_name_plural = _('payments')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['campaign', 'status']),
            models.Index(fields=['donor', '-created_at']),
            models.Index(fields=['transaction_id']),
            models.Index(fields=['idempotency_key']),
            models.Index(fields=['provider', 'status']),
            models.Index(fields=['-paid_at']),
            models.Index(fields=['reconciled', 'status']),
        ]

    def __str__(self):
        return f"{self.transaction_id} - {self.amount} {self.currency}"

    @property
    def is_successful(self):
        """Check if payment was successful."""
        return self.status == self.Status.SUCCESS

    @property
    def can_be_refunded(self):
        """Check if payment can be refunded."""
        return self.status == self.Status.SUCCESS and not self.reconciled

    def calculate_fees(self, commission_rate=None):
        """Calculate platform and provider fees."""
        from django.conf import settings
        if commission_rate is None:
            commission_rate = settings.PLATFORM_COMMISSION_RATE

        self.platform_fee = self.amount * Decimal(str(commission_rate))

        # Provider fees (these would typically come from provider APIs)
        provider_fees = {
            self.Provider.WAVE: Decimal('0.01'),  # 1%
            self.Provider.ORANGE_MONEY: Decimal('0.015'),  # 1.5%
            self.Provider.MTN_MOMO: Decimal('0.01'),  # 1%
            self.Provider.CARD: Decimal('0.029'),  # 2.9%
        }
        fee_rate = provider_fees.get(self.provider, Decimal('0'))
        self.provider_fee = self.amount * fee_rate

        self.net_amount = self.amount - self.platform_fee - self.provider_fee
        self.save(update_fields=['platform_fee', 'provider_fee', 'net_amount'])


class Donation(models.Model):
    """Model for donations to campaigns."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Relationships
    campaign = models.ForeignKey(
        'campaigns.Campaign',
        on_delete=models.CASCADE,
        related_name='donations'
    )
    donor = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='donations'
    )

    # Donation Details
    amount = models.DecimalField(
        _('amount'),
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('1'))]
    )
    currency = models.CharField(_('currency'), max_length=3, default='XOF')

    # Donor Information
    donor_name = models.CharField(_('donor name'), max_length=200, blank=True)
    donor_email = models.EmailField(_('donor email'), blank=True)
    donor_phone = models.CharField(_('donor phone'), max_length=20, blank=True)
    is_anonymous = models.BooleanField(_('anonymous'), default=False)

    # Message
    message = models.TextField(_('message'), blank=True)
    show_message_publicly = models.BooleanField(_('show message publicly'), default=True)

    # Status
    is_verified = models.BooleanField(_('verified'), default=False)
    is_featured = models.BooleanField(_('featured'), default=False)

    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    # Thank you
    thank_you_sent = models.BooleanField(_('thank you sent'), default=False)
    thank_you_sent_at = models.DateTimeField(_('thank you sent at'), null=True, blank=True)

    class Meta:
        verbose_name = _('donation')
        verbose_name_plural = _('donations')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['campaign', '-created_at']),
            models.Index(fields=['donor', '-created_at']),
            models.Index(fields=['-created_at']),
        ]

    def __str__(self):
        donor_display = self.donor_name if not self.is_anonymous else 'Anonymous'
        return f"{donor_display} - {self.amount} {self.currency} to {self.campaign.title}"

    @property
    def display_name(self):
        """Get display name for donor."""
        if self.is_anonymous:
            return _('Anonymous')
        return self.donor_name or (self.donor.full_name if self.donor else _('Anonymous'))


class Refund(models.Model):
    """Model for payment refunds."""

    class Status(models.TextChoices):
        PENDING = 'PENDING', _('Pending')
        PROCESSING = 'PROCESSING', _('Processing')
        SUCCESS = 'SUCCESS', _('Success')
        FAILED = 'FAILED', _('Failed')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    payment = models.ForeignKey(
        Payment,
        on_delete=models.CASCADE,
        related_name='refunds'
    )

    # Refund Details
    amount = models.DecimalField(
        _('amount'),
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    currency = models.CharField(_('currency'), max_length=3)
    status = models.CharField(
        _('status'),
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )

    # Reason
    reason = models.TextField(_('reason'))
    initiated_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='initiated_refunds'
    )

    # Provider details
    provider_refund_id = models.CharField(_('provider refund ID'), max_length=200, blank=True)
    provider_response = models.JSONField(_('provider response'), default=dict, blank=True)

    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    completed_at = models.DateTimeField(_('completed at'), null=True, blank=True)

    class Meta:
        verbose_name = _('refund')
        verbose_name_plural = _('refunds')
        ordering = ['-created_at']

    def __str__(self):
        return f"Refund {self.id} - {self.amount} {self.currency}"
