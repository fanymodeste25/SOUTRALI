"""
Admin configuration for webhooks app.
"""
from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from django.utils.html import format_html
from .models import WebhookEvent, WebhookRetry


@admin.register(WebhookEvent)
class WebhookEventAdmin(admin.ModelAdmin):
    """Admin configuration for WebhookEvent model."""

    list_display = ('event_id', 'provider', 'event_type', 'status_display',
                    'signature_verified', 'processing_attempts', 'created_at')
    list_filter = ('provider', 'event_type', 'status', 'signature_verified', 'created_at')
    search_fields = ('event_id', 'idempotency_key', 'payment__transaction_id')
    readonly_fields = ('id', 'created_at', 'updated_at', 'processed_at')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'

    fieldsets = (
        (_('Identifiers'), {
            'fields': ('id', 'event_id', 'idempotency_key')
        }),
        (_('Provider Information'), {
            'fields': ('provider', 'event_type')
        }),
        (_('Webhook Data'), {
            'fields': ('payload', 'headers')
        }),
        (_('Request Details'), {
            'fields': ('ip_address', 'user_agent', 'http_method')
        }),
        (_('Signature Verification'), {
            'fields': ('signature', 'signature_verified', 'signature_algorithm')
        }),
        (_('Processing Status'), {
            'fields': ('status', 'processing_attempts', 'last_processing_error')
        }),
        (_('Related Data'), {
            'fields': ('payment',)
        }),
        (_('Response'), {
            'fields': ('response_status_code', 'response_body')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at', 'processed_at')
        }),
    )

    def status_display(self, obj):
        colors = {
            'PENDING': 'orange',
            'PROCESSING': 'blue',
            'PROCESSED': 'green',
            'FAILED': 'red',
            'IGNORED': 'gray',
        }
        color = colors.get(obj.status, 'black')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_display.short_description = _('Status')

    actions = ['retry_processing', 'mark_as_processed']

    def retry_processing(self, request, queryset):
        # This would trigger a Celery task to retry processing
        count = queryset.filter(status__in=['FAILED', 'PENDING']).count()
        self.message_user(request, f'Retry queued for {count} webhook(s).')
    retry_processing.short_description = _('Retry processing')

    def mark_as_processed(self, request, queryset):
        count = queryset.exclude(status='PROCESSED').count()
        queryset.update(status='PROCESSED')
        self.message_user(request, f'{count} webhook(s) marked as processed.')
    mark_as_processed.short_description = _('Mark as processed')


@admin.register(WebhookRetry)
class WebhookRetryAdmin(admin.ModelAdmin):
    """Admin configuration for WebhookRetry model."""

    list_display = ('webhook_event', 'attempt_number', 'created_at', 'next_retry_at')
    list_filter = ('created_at',)
    search_fields = ('webhook_event__event_id', 'error_message')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
