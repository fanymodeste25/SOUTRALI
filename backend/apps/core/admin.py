"""
Admin configuration for core app.
"""
from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import AuditLog, SystemSetting, Notification


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    """Admin configuration for AuditLog model."""

    list_display = ('user_display', 'action', 'content_type', 'object_id', 'created_at')
    list_filter = ('action', 'content_type', 'created_at')
    search_fields = ('user__email', 'description', 'object_id')
    readonly_fields = ('id', 'user', 'action', 'description', 'content_type', 'object_id',
                      'old_values', 'new_values', 'ip_address', 'user_agent', 'created_at')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'

    def user_display(self, obj):
        return obj.user.email if obj.user else 'System'
    user_display.short_description = _('User')

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(SystemSetting)
class SystemSettingAdmin(admin.ModelAdmin):
    """Admin configuration for SystemSetting model."""

    list_display = ('key', 'is_public', 'created_at', 'updated_at')
    list_filter = ('is_public', 'created_at')
    search_fields = ('key', 'description')
    readonly_fields = ('created_at', 'updated_at')

    fieldsets = (
        (_('Setting'), {
            'fields': ('key', 'value', 'description')
        }),
        (_('Visibility'), {
            'fields': ('is_public',)
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    """Admin configuration for Notification model."""

    list_display = ('recipient', 'notification_type', 'title', 'is_read', 'created_at')
    list_filter = ('notification_type', 'is_read', 'created_at')
    search_fields = ('recipient__email', 'title', 'message')
    readonly_fields = ('id', 'created_at', 'read_at')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'

    fieldsets = (
        (_('Recipient'), {
            'fields': ('id', 'recipient')
        }),
        (_('Notification'), {
            'fields': ('notification_type', 'title', 'message', 'link')
        }),
        (_('Target Object'), {
            'fields': ('content_type', 'object_id')
        }),
        (_('Status'), {
            'fields': ('is_read', 'read_at')
        }),
        (_('Timestamps'), {
            'fields': ('created_at',)
        }),
    )

    actions = ['mark_as_read', 'mark_as_unread']

    def mark_as_read(self, request, queryset):
        from django.utils import timezone
        count = queryset.filter(is_read=False).update(is_read=True, read_at=timezone.now())
        self.message_user(request, f'{count} notification(s) marked as read.')
    mark_as_read.short_description = _('Mark as read')

    def mark_as_unread(self, request, queryset):
        count = queryset.filter(is_read=True).update(is_read=False, read_at=None)
        self.message_user(request, f'{count} notification(s) marked as unread.')
    mark_as_unread.short_description = _('Mark as unread')
