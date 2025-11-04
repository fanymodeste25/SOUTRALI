"""
Admin configuration for payments app.
"""
from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from django.utils.html import format_html
from .models import Payment, Donation, Refund


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    """Admin configuration for Payment model."""

    list_display = ('transaction_id', 'campaign', 'donor_display', 'amount_display',
                    'provider', 'status_display', 'reconciled', 'created_at')
    list_filter = ('status', 'provider', 'reconciled', 'receipt_sent', 'created_at', 'paid_at')
    search_fields = ('transaction_id', 'idempotency_key', 'provider_transaction_id',
                    'donor_email', 'donor_phone', 'campaign__title')
    readonly_fields = ('id', 'transaction_id', 'idempotency_key', 'created_at', 'updated_at',
                      'paid_at', 'platform_fee', 'provider_fee', 'net_amount')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'

    fieldsets = (
        (_('Identifiers'), {
            'fields': ('id', 'transaction_id', 'idempotency_key')
        }),
        (_('Relationships'), {
            'fields': ('campaign', 'donation', 'donor')
        }),
        (_('Payment Details'), {
            'fields': ('provider', 'status', 'payment_method')
        }),
        (_('Amounts'), {
            'fields': ('amount', 'currency', 'platform_fee', 'provider_fee', 'net_amount')
        }),
        (_('Donor Information'), {
            'fields': ('donor_email', 'donor_phone', 'donor_name', 'is_anonymous')
        }),
        (_('Provider Data'), {
            'fields': ('provider_transaction_id', 'provider_reference', 'provider_response')
        }),
        (_('URLs'), {
            'fields': ('redirect_url', 'callback_url')
        }),
        (_('Metadata'), {
            'fields': ('ip_address', 'user_agent')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at', 'paid_at', 'expires_at')
        }),
        (_('Error Handling'), {
            'fields': ('error_code', 'error_message', 'retry_count')
        }),
        (_('Reconciliation'), {
            'fields': ('reconciled', 'reconciled_at', 'reconciliation_notes')
        }),
        (_('Receipt'), {
            'fields': ('receipt_sent', 'receipt_sent_at', 'receipt_number')
        }),
    )

    def donor_display(self, obj):
        if obj.is_anonymous:
            return _('Anonymous')
        return obj.donor_name or obj.donor_email or _('Unknown')
    donor_display.short_description = _('Donor')

    def amount_display(self, obj):
        return f"{obj.amount} {obj.currency}"
    amount_display.short_description = _('Amount')

    def status_display(self, obj):
        colors = {
            'PENDING': 'orange',
            'PROCESSING': 'blue',
            'SUCCESS': 'green',
            'FAILED': 'red',
            'CANCELLED': 'gray',
            'REFUNDED': 'purple',
            'EXPIRED': 'gray',
        }
        color = colors.get(obj.status, 'black')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_display.short_description = _('Status')

    actions = ['mark_as_reconciled', 'send_receipts']

    def mark_as_reconciled(self, request, queryset):
        from django.utils import timezone
        count = queryset.filter(status=Payment.Status.SUCCESS, reconciled=False).update(
            reconciled=True,
            reconciled_at=timezone.now()
        )
        self.message_user(request, f'{count} payment(s) marked as reconciled.')
    mark_as_reconciled.short_description = _('Mark as reconciled')

    def send_receipts(self, request, queryset):
        # This would trigger a Celery task to send receipts
        count = queryset.filter(status=Payment.Status.SUCCESS, receipt_sent=False).count()
        self.message_user(request, f'Receipt sending queued for {count} payment(s).')
    send_receipts.short_description = _('Send receipts')


@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    """Admin configuration for Donation model."""

    list_display = ('campaign', 'donor_display', 'amount_display', 'is_anonymous',
                    'is_verified', 'is_featured', 'created_at')
    list_filter = ('is_anonymous', 'is_verified', 'is_featured', 'created_at')
    search_fields = ('campaign__title', 'donor_name', 'donor_email', 'donor_phone', 'message')
    readonly_fields = ('id', 'created_at', 'updated_at')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'

    fieldsets = (
        (_('Basic Information'), {
            'fields': ('id', 'campaign', 'donor')
        }),
        (_('Amount'), {
            'fields': ('amount', 'currency')
        }),
        (_('Donor Information'), {
            'fields': ('donor_name', 'donor_email', 'donor_phone', 'is_anonymous')
        }),
        (_('Message'), {
            'fields': ('message', 'show_message_publicly')
        }),
        (_('Status'), {
            'fields': ('is_verified', 'is_featured')
        }),
        (_('Thank You'), {
            'fields': ('thank_you_sent', 'thank_you_sent_at')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at')
        }),
    )

    def donor_display(self, obj):
        return obj.display_name
    donor_display.short_description = _('Donor')

    def amount_display(self, obj):
        return f"{obj.amount} {obj.currency}"
    amount_display.short_description = _('Amount')

    actions = ['feature_donations', 'send_thank_you']

    def feature_donations(self, request, queryset):
        count = queryset.update(is_featured=True)
        self.message_user(request, f'{count} donation(s) featured.')
    feature_donations.short_description = _('Feature selected donations')

    def send_thank_you(self, request, queryset):
        # This would trigger a Celery task to send thank you emails
        count = queryset.filter(thank_you_sent=False).count()
        self.message_user(request, f'Thank you emails queued for {count} donation(s).')
    send_thank_you.short_description = _('Send thank you emails')


@admin.register(Refund)
class RefundAdmin(admin.ModelAdmin):
    """Admin configuration for Refund model."""

    list_display = ('payment', 'amount_display', 'status', 'initiated_by', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('payment__transaction_id', 'reason')
    readonly_fields = ('id', 'created_at', 'updated_at', 'completed_at')
    ordering = ('-created_at',)

    fieldsets = (
        (_('Basic Information'), {
            'fields': ('id', 'payment', 'initiated_by')
        }),
        (_('Amount'), {
            'fields': ('amount', 'currency', 'status')
        }),
        (_('Reason'), {
            'fields': ('reason',)
        }),
        (_('Provider Data'), {
            'fields': ('provider_refund_id', 'provider_response')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at', 'completed_at')
        }),
    )

    def amount_display(self, obj):
        return f"{obj.amount} {obj.currency}"
    amount_display.short_description = _('Amount')
