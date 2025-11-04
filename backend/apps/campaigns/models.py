"""
Campaign models for Soutrali platform.
"""
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator
from django.utils import timezone
from decimal import Decimal


class Campaign(models.Model):
    """Model for fundraising campaigns."""

    class Status(models.TextChoices):
        DRAFT = 'DRAFT', _('Draft')
        PENDING_REVIEW = 'PENDING_REVIEW', _('Pending Review')
        ACTIVE = 'ACTIVE', _('Active')
        PAUSED = 'PAUSED', _('Paused')
        COMPLETED = 'COMPLETED', _('Completed')
        CLOSED = 'CLOSED', _('Closed')
        REJECTED = 'REJECTED', _('Rejected')

    class Category(models.TextChoices):
        MEDICAL = 'MEDICAL', _('Medical')
        EDUCATION = 'EDUCATION', _('Education')
        EMERGENCY = 'EMERGENCY', _('Emergency')
        COMMUNITY = 'COMMUNITY', _('Community Development')
        CHARITY = 'CHARITY', _('Charity')
        RELIGIOUS = 'RELIGIOUS', _('Religious')
        SPORTS = 'SPORTS', _('Sports')
        CULTURE = 'CULTURE', _('Culture & Arts')
        OTHER = 'OTHER', _('Other')

    # Basic Information
    title = models.CharField(_('title'), max_length=200)
    slug = models.SlugField(_('slug'), max_length=250, unique=True)
    description = models.TextField(_('description'))
    short_description = models.CharField(_('short description'), max_length=500, blank=True)

    # Organizer
    organizer = models.ForeignKey(
        'users.User',
        on_delete=models.PROTECT,
        related_name='campaigns'
    )

    # Category and Status
    category = models.CharField(
        _('category'),
        max_length=20,
        choices=Category.choices,
        default=Category.OTHER
    )
    status = models.CharField(
        _('status'),
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT
    )

    # Financial Goals
    goal_amount = models.DecimalField(
        _('goal amount'),
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('100'))]
    )
    currency = models.CharField(_('currency'), max_length=3, default='XOF')
    current_amount = models.DecimalField(
        _('current amount'),
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00')
    )

    # Media
    featured_image = models.ImageField(
        _('featured image'),
        upload_to='campaigns/featured/',
        blank=True,
        null=True
    )
    video_url = models.URLField(_('video URL'), blank=True)

    # Timeline
    start_date = models.DateTimeField(_('start date'), null=True, blank=True)
    end_date = models.DateTimeField(_('end date'), null=True, blank=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    published_at = models.DateTimeField(_('published at'), null=True, blank=True)
    completed_at = models.DateTimeField(_('completed at'), null=True, blank=True)

    # Statistics
    donation_count = models.PositiveIntegerField(_('donation count'), default=0)
    view_count = models.PositiveIntegerField(_('view count'), default=0)
    share_count = models.PositiveIntegerField(_('share count'), default=0)

    # Location
    country = models.CharField(_('country'), max_length=100, blank=True)
    city = models.CharField(_('city'), max_length=100, blank=True)
    location_details = models.TextField(_('location details'), blank=True)

    # Approval & Verification
    reviewed_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_campaigns'
    )
    reviewed_at = models.DateTimeField(_('reviewed at'), null=True, blank=True)
    rejection_reason = models.TextField(_('rejection reason'), blank=True)

    # Settings
    allow_anonymous_donations = models.BooleanField(_('allow anonymous donations'), default=True)
    show_donors = models.BooleanField(_('show donors'), default=True)
    send_receipts = models.BooleanField(_('send receipts'), default=True)
    is_featured = models.BooleanField(_('featured'), default=False)

    # SEO
    meta_description = models.CharField(_('meta description'), max_length=160, blank=True)
    meta_keywords = models.CharField(_('meta keywords'), max_length=255, blank=True)

    class Meta:
        verbose_name = _('campaign')
        verbose_name_plural = _('campaigns')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['organizer', 'status']),
            models.Index(fields=['slug']),
            models.Index(fields=['-published_at']),
            models.Index(fields=['category', 'status']),
        ]

    def __str__(self):
        return self.title

    @property
    def is_active(self):
        """Check if campaign is currently active."""
        if self.status != self.Status.ACTIVE:
            return False
        now = timezone.now()
        if self.end_date and now > self.end_date:
            return False
        return True

    @property
    def progress_percentage(self):
        """Calculate progress percentage."""
        if self.goal_amount == 0:
            return 0
        return min(float(self.current_amount / self.goal_amount * 100), 100)

    @property
    def days_remaining(self):
        """Calculate days remaining."""
        if not self.end_date:
            return None
        delta = self.end_date - timezone.now()
        return max(delta.days, 0)

    @property
    def is_fully_funded(self):
        """Check if campaign reached its goal."""
        return self.current_amount >= self.goal_amount

    @property
    def amount_remaining(self):
        """Calculate amount remaining to reach goal."""
        return max(self.goal_amount - self.current_amount, Decimal('0.00'))

    def increment_donation(self, amount):
        """Increment donation amount and count."""
        self.current_amount += amount
        self.donation_count += 1
        self.save(update_fields=['current_amount', 'donation_count', 'updated_at'])

    def increment_views(self):
        """Increment view count."""
        self.view_count += 1
        self.save(update_fields=['view_count'])

    def increment_shares(self):
        """Increment share count."""
        self.share_count += 1
        self.save(update_fields=['share_count'])


class CampaignImage(models.Model):
    """Additional images for campaigns."""

    campaign = models.ForeignKey(
        Campaign,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(_('image'), upload_to='campaigns/gallery/')
    caption = models.CharField(_('caption'), max_length=255, blank=True)
    order = models.PositiveIntegerField(_('order'), default=0)
    uploaded_at = models.DateTimeField(_('uploaded at'), auto_now_add=True)

    class Meta:
        verbose_name = _('campaign image')
        verbose_name_plural = _('campaign images')
        ordering = ['order', '-uploaded_at']

    def __str__(self):
        return f"{self.campaign.title} - Image {self.order}"


class CampaignDocument(models.Model):
    """Supporting documents for campaigns."""

    campaign = models.ForeignKey(
        Campaign,
        on_delete=models.CASCADE,
        related_name='documents'
    )
    title = models.CharField(_('title'), max_length=200)
    document = models.FileField(_('document'), upload_to='campaigns/documents/')
    document_type = models.CharField(
        _('document type'),
        max_length=50,
        choices=[
            ('AUTHORIZATION', _('Authorization')),
            ('PROOF', _('Proof of Need')),
            ('BUDGET', _('Budget')),
            ('OTHER', _('Other')),
        ],
        default='OTHER'
    )
    uploaded_at = models.DateTimeField(_('uploaded at'), auto_now_add=True)

    class Meta:
        verbose_name = _('campaign document')
        verbose_name_plural = _('campaign documents')
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"{self.campaign.title} - {self.title}"


class CampaignUpdate(models.Model):
    """Updates posted by campaign organizers."""

    campaign = models.ForeignKey(
        Campaign,
        on_delete=models.CASCADE,
        related_name='updates'
    )
    author = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='campaign_updates'
    )
    title = models.CharField(_('title'), max_length=200)
    content = models.TextField(_('content'))
    image = models.ImageField(_('image'), upload_to='campaigns/updates/', blank=True, null=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        verbose_name = _('campaign update')
        verbose_name_plural = _('campaign updates')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.campaign.title} - {self.title}"


class CampaignComment(models.Model):
    """Comments on campaigns."""

    campaign = models.ForeignKey(
        Campaign,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    user = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='campaign_comments'
    )
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='replies'
    )
    content = models.TextField(_('content'))
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    is_approved = models.BooleanField(_('approved'), default=True)

    class Meta:
        verbose_name = _('campaign comment')
        verbose_name_plural = _('campaign comments')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.full_name} on {self.campaign.title}"
