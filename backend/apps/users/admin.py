"""
Admin configuration for users app.
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User, UserVerification


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin configuration for User model."""

    list_display = ('email', 'full_name', 'role', 'kyc_status', 'is_active', 'created_at')
    list_filter = ('role', 'kyc_status', 'is_active', 'is_verified', 'created_at')
    search_fields = ('email', 'first_name', 'last_name', 'phone_number')
    ordering = ('-created_at',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'phone_number', 'profile_picture', 'bio')}),
        (_('Location'), {'fields': ('country', 'city')}),
        (_('Role & Permissions'), {'fields': ('role', 'is_active', 'is_verified', 'is_staff', 'is_superuser')}),
        (_('KYC Information'), {
            'fields': ('kyc_status', 'kyc_document', 'id_number', 'kyc_submitted_at',
                      'kyc_reviewed_at', 'kyc_reviewed_by', 'kyc_rejection_reason')
        }),
        (_('Preferences'), {'fields': ('language', 'timezone', 'email_notifications', 'sms_notifications')}),
        (_('Important dates'), {'fields': ('last_login', 'last_login_ip', 'created_at', 'updated_at')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password1', 'password2', 'role'),
        }),
    )

    readonly_fields = ('created_at', 'updated_at', 'last_login')

    def full_name(self, obj):
        return obj.full_name
    full_name.short_description = _('Full Name')


@admin.register(UserVerification)
class UserVerificationAdmin(admin.ModelAdmin):
    """Admin configuration for UserVerification model."""

    list_display = ('user', 'purpose', 'is_used', 'created_at', 'expires_at')
    list_filter = ('purpose', 'is_used', 'created_at')
    search_fields = ('user__email', 'token')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
