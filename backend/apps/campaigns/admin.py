"""
Admin configuration for campaigns app.
"""
from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from django.utils.html import format_html
from .models import Campaign, CampaignImage, CampaignDocument, CampaignUpdate, CampaignComment


class CampaignImageInline(admin.TabularInline):
    """Inline admin for campaign images."""
    model = CampaignImage
    extra = 1
    fields = ('image', 'caption', 'order')


class CampaignDocumentInline(admin.TabularInline):
    """Inline admin for campaign documents."""
    model = CampaignDocument
    extra = 1
    fields = ('title', 'document', 'document_type')


@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    """Admin configuration for Campaign model."""

    list_display = ('title', 'organizer', 'status', 'category', 'goal_display', 'progress_display',
                    'donation_count', 'is_featured', 'created_at')
    list_filter = ('status', 'category', 'is_featured', 'created_at', 'published_at')
    search_fields = ('title', 'description', 'organizer__email')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('current_amount', 'donation_count', 'view_count', 'share_count',
                      'created_at', 'updated_at', 'published_at', 'completed_at')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    inlines = [CampaignImageInline, CampaignDocumentInline]

    fieldsets = (
        (_('Basic Information'), {
            'fields': ('title', 'slug', 'short_description', 'description', 'organizer')
        }),
        (_('Classification'), {
            'fields': ('category', 'status', 'is_featured')
        }),
        (_('Financial Goals'), {
            'fields': ('goal_amount', 'current_amount', 'currency')
        }),
        (_('Media'), {
            'fields': ('featured_image', 'video_url')
        }),
        (_('Timeline'), {
            'fields': ('start_date', 'end_date', 'published_at', 'completed_at')
        }),
        (_('Location'), {
            'fields': ('country', 'city', 'location_details')
        }),
        (_('Statistics'), {
            'fields': ('donation_count', 'view_count', 'share_count')
        }),
        (_('Approval'), {
            'fields': ('reviewed_by', 'reviewed_at', 'rejection_reason')
        }),
        (_('Settings'), {
            'fields': ('allow_anonymous_donations', 'show_donors', 'send_receipts')
        }),
        (_('SEO'), {
            'fields': ('meta_description', 'meta_keywords')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at')
        }),
    )

    def goal_display(self, obj):
        return f"{obj.goal_amount} {obj.currency}"
    goal_display.short_description = _('Goal')

    def progress_display(self, obj):
        percentage = obj.progress_percentage
        color = 'green' if percentage >= 75 else 'orange' if percentage >= 50 else 'red'
        return format_html(
            '<span style="color: {};">{:.1f}%</span>',
            color,
            percentage
        )
    progress_display.short_description = _('Progress')

    actions = ['approve_campaigns', 'reject_campaigns', 'feature_campaigns']

    def approve_campaigns(self, request, queryset):
        from django.utils import timezone
        count = queryset.filter(status=Campaign.Status.PENDING_REVIEW).update(
            status=Campaign.Status.ACTIVE,
            reviewed_by=request.user,
            reviewed_at=timezone.now()
        )
        self.message_user(request, f'{count} campaign(s) approved successfully.')
    approve_campaigns.short_description = _('Approve selected campaigns')

    def reject_campaigns(self, request, queryset):
        from django.utils import timezone
        count = queryset.filter(status=Campaign.Status.PENDING_REVIEW).update(
            status=Campaign.Status.REJECTED,
            reviewed_by=request.user,
            reviewed_at=timezone.now()
        )
        self.message_user(request, f'{count} campaign(s) rejected.')
    reject_campaigns.short_description = _('Reject selected campaigns')

    def feature_campaigns(self, request, queryset):
        count = queryset.update(is_featured=True)
        self.message_user(request, f'{count} campaign(s) featured.')
    feature_campaigns.short_description = _('Feature selected campaigns')


@admin.register(CampaignImage)
class CampaignImageAdmin(admin.ModelAdmin):
    """Admin configuration for CampaignImage model."""

    list_display = ('campaign', 'caption', 'order', 'uploaded_at')
    list_filter = ('uploaded_at',)
    search_fields = ('campaign__title', 'caption')


@admin.register(CampaignDocument)
class CampaignDocumentAdmin(admin.ModelAdmin):
    """Admin configuration for CampaignDocument model."""

    list_display = ('campaign', 'title', 'document_type', 'uploaded_at')
    list_filter = ('document_type', 'uploaded_at')
    search_fields = ('campaign__title', 'title')


@admin.register(CampaignUpdate)
class CampaignUpdateAdmin(admin.ModelAdmin):
    """Admin configuration for CampaignUpdate model."""

    list_display = ('campaign', 'title', 'author', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('campaign__title', 'title', 'content')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(CampaignComment)
class CampaignCommentAdmin(admin.ModelAdmin):
    """Admin configuration for CampaignComment model."""

    list_display = ('campaign', 'user', 'is_approved', 'created_at')
    list_filter = ('is_approved', 'created_at')
    search_fields = ('campaign__title', 'user__email', 'content')
    readonly_fields = ('created_at', 'updated_at')
    actions = ['approve_comments', 'unapprove_comments']

    def approve_comments(self, request, queryset):
        count = queryset.update(is_approved=True)
        self.message_user(request, f'{count} comment(s) approved.')
    approve_comments.short_description = _('Approve selected comments')

    def unapprove_comments(self, request, queryset):
        count = queryset.update(is_approved=False)
        self.message_user(request, f'{count} comment(s) unapproved.')
    unapprove_comments.short_description = _('Unapprove selected comments')
