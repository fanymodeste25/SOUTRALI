"""
User models for Soutrali platform.
"""
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    """Custom user manager for email-based authentication."""

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular user."""
        if not email:
            raise ValueError(_('The Email field must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Create and save a superuser."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'ADMIN')
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """Custom User model with role-based access control."""

    class Role(models.TextChoices):
        ADMIN = 'ADMIN', _('Admin')
        ORGANIZER = 'ORGANIZER', _('Organizer')
        DONOR = 'DONOR', _('Donor')

    class KYCStatus(models.TextChoices):
        NOT_SUBMITTED = 'NOT_SUBMITTED', _('Not Submitted')
        PENDING = 'PENDING', _('Pending Review')
        APPROVED = 'APPROVED', _('Approved')
        REJECTED = 'REJECTED', _('Rejected')

    username = None  # Remove username field
    email = models.EmailField(_('email address'), unique=True)
    phone_number = models.CharField(_('phone number'), max_length=20, blank=True)

    # Role and permissions
    role = models.CharField(
        _('role'),
        max_length=20,
        choices=Role.choices,
        default=Role.DONOR
    )

    # Profile information
    first_name = models.CharField(_('first name'), max_length=150)
    last_name = models.CharField(_('last name'), max_length=150)
    profile_picture = models.ImageField(
        _('profile picture'),
        upload_to='profiles/',
        blank=True,
        null=True
    )
    bio = models.TextField(_('bio'), blank=True)

    # Location
    country = models.CharField(_('country'), max_length=100, blank=True)
    city = models.CharField(_('city'), max_length=100, blank=True)

    # KYC Information
    kyc_status = models.CharField(
        _('KYC status'),
        max_length=20,
        choices=KYCStatus.choices,
        default=KYCStatus.NOT_SUBMITTED
    )
    kyc_document = models.FileField(
        _('KYC document'),
        upload_to='kyc_documents/',
        blank=True,
        null=True
    )
    id_number = models.CharField(_('ID number'), max_length=100, blank=True)
    kyc_submitted_at = models.DateTimeField(_('KYC submitted at'), null=True, blank=True)
    kyc_reviewed_at = models.DateTimeField(_('KYC reviewed at'), null=True, blank=True)
    kyc_reviewed_by = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='kyc_reviews'
    )
    kyc_rejection_reason = models.TextField(_('KYC rejection reason'), blank=True)

    # Preferences
    language = models.CharField(_('language'), max_length=10, default='fr')
    timezone = models.CharField(_('timezone'), max_length=50, default='Africa/Dakar')
    email_notifications = models.BooleanField(_('email notifications'), default=True)
    sms_notifications = models.BooleanField(_('SMS notifications'), default=False)

    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    last_login_ip = models.GenericIPAddressField(_('last login IP'), null=True, blank=True)

    # Flags
    is_verified = models.BooleanField(_('email verified'), default=False)
    is_active = models.BooleanField(_('active'), default=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = UserManager()

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['role']),
            models.Index(fields=['kyc_status']),
        ]

    def __str__(self):
        return self.email

    @property
    def full_name(self):
        """Get user's full name."""
        return f"{self.first_name} {self.last_name}".strip()

    @property
    def can_create_campaigns(self):
        """Check if user can create campaigns."""
        return self.role in [self.Role.ORGANIZER, self.Role.ADMIN]

    @property
    def kyc_required(self):
        """Check if KYC is required for this user."""
        from django.conf import settings
        return self.role == self.Role.ORGANIZER and settings.KYC_REQUIRED_FOR_ORGANIZERS

    @property
    def kyc_approved(self):
        """Check if user's KYC is approved."""
        return self.kyc_status == self.KYCStatus.APPROVED

    def has_permission(self, permission):
        """Check if user has a specific permission."""
        permissions_map = {
            'create_campaign': self.can_create_campaigns and (not self.kyc_required or self.kyc_approved),
            'approve_campaigns': self.role == self.Role.ADMIN,
            'view_all_campaigns': self.role == self.Role.ADMIN,
            'reconcile_payments': self.role == self.Role.ADMIN,
            'approve_kyc': self.role == self.Role.ADMIN,
        }
        return permissions_map.get(permission, False)


class UserVerification(models.Model):
    """Email verification tokens."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='verifications')
    token = models.CharField(_('token'), max_length=100, unique=True)
    purpose = models.CharField(
        _('purpose'),
        max_length=20,
        choices=[
            ('EMAIL_VERIFY', 'Email Verification'),
            ('PASSWORD_RESET', 'Password Reset'),
        ]
    )
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    expires_at = models.DateTimeField(_('expires at'))
    used_at = models.DateTimeField(_('used at'), null=True, blank=True)
    is_used = models.BooleanField(_('is used'), default=False)

    class Meta:
        verbose_name = _('user verification')
        verbose_name_plural = _('user verifications')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.purpose}"

    @property
    def is_valid(self):
        """Check if token is still valid."""
        from django.utils import timezone
        return not self.is_used and timezone.now() < self.expires_at
