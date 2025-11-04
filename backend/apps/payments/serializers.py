"""
Serializers for payments app.
"""
from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from decimal import Decimal
from .models import Payment, Donation, Refund
from apps.campaigns.models import Campaign
from apps.users.serializers import PublicUserSerializer
import uuid


class DonationSerializer(serializers.ModelSerializer):
    """Serializer for donations."""

    donor = PublicUserSerializer(read_only=True)
    display_name = serializers.CharField(read_only=True)
    campaign_title = serializers.CharField(source='campaign.title', read_only=True)

    class Meta:
        model = Donation
        fields = [
            'id', 'campaign', 'campaign_title', 'donor', 'display_name',
            'amount', 'currency', 'donor_name', 'message',
            'show_message_publicly', 'is_anonymous', 'is_verified',
            'is_featured', 'created_at'
        ]
        read_only_fields = [
            'id', 'donor', 'display_name', 'is_verified',
            'is_featured', 'created_at'
        ]


class PaymentInitiationSerializer(serializers.Serializer):
    """Serializer for initiating payment."""

    campaign_id = serializers.UUIDField(required=True)
    amount = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        min_value=Decimal('100'),  # Minimum donation
        required=True
    )
    currency = serializers.ChoiceField(
        choices=settings.SUPPORTED_CURRENCIES,
        default=settings.DEFAULT_CURRENCY
    )
    provider = serializers.ChoiceField(
        choices=Payment.Provider.choices,
        required=True
    )
    donor_email = serializers.EmailField(required=True)
    donor_phone = serializers.CharField(required=True, max_length=20)
    donor_name = serializers.CharField(required=False, max_length=200)
    is_anonymous = serializers.BooleanField(default=False)
    message = serializers.CharField(required=False, allow_blank=True)
    show_message_publicly = serializers.BooleanField(default=True)
    idempotency_key = serializers.CharField(required=False, max_length=100)

    def validate_campaign_id(self, value):
        """Validate campaign exists and is active."""
        try:
            campaign = Campaign.objects.get(id=value)
        except Campaign.DoesNotExist:
            raise serializers.ValidationError(_('Campaign not found.'))

        if not campaign.is_active:
            raise serializers.ValidationError(
                _('This campaign is not currently accepting donations.')
            )

        return value

    def validate_donor_phone(self, value):
        """Validate and normalize phone number."""
        # Remove spaces, dashes, and other non-numeric characters
        cleaned = ''.join(filter(str.isdigit, value.replace('+', '')))

        if len(cleaned) < 9:
            raise serializers.ValidationError(
                _('Please provide a valid phone number.')
            )

        return value

    def validate(self, attrs):
        """Additional validation."""
        # Generate idempotency key if not provided
        if not attrs.get('idempotency_key'):
            attrs['idempotency_key'] = str(uuid.uuid4())

        return attrs


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for payment details."""

    campaign_title = serializers.CharField(source='campaign.title', read_only=True)
    donor_display = serializers.SerializerMethodField()
    provider_display = serializers.CharField(source='get_provider_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id', 'transaction_id', 'campaign', 'campaign_title',
            'donor', 'donor_display', 'amount', 'currency',
            'platform_fee', 'provider_fee', 'net_amount',
            'provider', 'provider_display', 'status', 'status_display',
            'is_anonymous', 'created_at', 'paid_at', 'receipt_number'
        ]
        read_only_fields = [
            'id', 'transaction_id', 'platform_fee', 'provider_fee',
            'net_amount', 'status', 'created_at', 'paid_at', 'receipt_number'
        ]

    def get_donor_display(self, obj):
        """Get donor display name."""
        if obj.is_anonymous:
            return _('Anonymous')
        return obj.donor_name or obj.donor_email or _('Anonymous')


class PaymentVerificationSerializer(serializers.Serializer):
    """Serializer for payment verification response."""

    transaction_id = serializers.CharField()
    status = serializers.CharField()
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    currency = serializers.CharField()
    paid_at = serializers.DateTimeField(allow_null=True)
    campaign_id = serializers.UUIDField()
    receipt_number = serializers.CharField(allow_null=True, allow_blank=True)


class RefundSerializer(serializers.ModelSerializer):
    """Serializer for refund."""

    payment_transaction_id = serializers.CharField(
        source='payment.transaction_id',
        read_only=True
    )
    initiated_by_name = serializers.CharField(
        source='initiated_by.full_name',
        read_only=True
    )

    class Meta:
        model = Refund
        fields = [
            'id', 'payment', 'payment_transaction_id', 'amount',
            'currency', 'status', 'reason', 'initiated_by',
            'initiated_by_name', 'created_at', 'completed_at'
        ]
        read_only_fields = [
            'id', 'status', 'initiated_by', 'created_at', 'completed_at'
        ]


class RefundRequestSerializer(serializers.Serializer):
    """Serializer for requesting a refund."""

    payment_id = serializers.UUIDField(required=True)
    amount = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        required=False
    )
    reason = serializers.CharField(required=True)

    def validate_payment_id(self, value):
        """Validate payment exists and can be refunded."""
        try:
            payment = Payment.objects.get(id=value)
        except Payment.DoesNotExist:
            raise serializers.ValidationError(_('Payment not found.'))

        if not payment.can_be_refunded:
            raise serializers.ValidationError(
                _('This payment cannot be refunded.')
            )

        return value

    def validate(self, attrs):
        """Validate refund amount."""
        payment = Payment.objects.get(id=attrs['payment_id'])

        # If amount not specified, refund full amount
        if 'amount' not in attrs:
            attrs['amount'] = payment.amount
        else:
            # Validate amount doesn't exceed payment amount
            if attrs['amount'] > payment.amount:
                raise serializers.ValidationError({
                    'amount': _('Refund amount cannot exceed payment amount.')
                })

        attrs['payment'] = payment
        return attrs


class DonationListSerializer(serializers.ModelSerializer):
    """Serializer for listing donations (for campaign page)."""

    display_name = serializers.CharField(read_only=True)

    class Meta:
        model = Donation
        fields = [
            'id', 'display_name', 'amount', 'currency',
            'message', 'show_message_publicly', 'is_anonymous',
            'is_featured', 'created_at'
        ]
        read_only_fields = ['id', 'display_name', 'created_at']


class DonationStatsSerializer(serializers.Serializer):
    """Serializer for donation statistics."""

    total_amount = serializers.DecimalField(max_digits=15, decimal_places=2)
    total_count = serializers.IntegerField()
    average_amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    largest_amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    recent_donations = DonationListSerializer(many=True)


class PaymentProviderSerializer(serializers.Serializer):
    """Serializer for available payment providers."""

    name = serializers.CharField()
    code = serializers.CharField()
    description = serializers.CharField()
    logo_url = serializers.URLField(allow_null=True)
    is_available = serializers.BooleanField()
    sandbox_mode = serializers.BooleanField()
