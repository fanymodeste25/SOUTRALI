"""
Serializers for users app.
"""
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.utils.translation import gettext_lazy as _
from .models import User, UserVerification
from datetime import timedelta
from django.utils import timezone
import secrets


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""

    full_name = serializers.CharField(read_only=True)
    can_create_campaigns = serializers.BooleanField(read_only=True)
    kyc_approved = serializers.BooleanField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name',
            'phone_number', 'profile_picture', 'bio', 'role',
            'country', 'city', 'kyc_status', 'is_verified',
            'can_create_campaigns', 'kyc_approved',
            'language', 'timezone', 'email_notifications',
            'sms_notifications', 'created_at'
        ]
        read_only_fields = ['id', 'role', 'kyc_status', 'is_verified', 'created_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""

    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    role = serializers.ChoiceField(
        choices=[User.Role.DONOR, User.Role.ORGANIZER],
        default=User.Role.DONOR
    )

    class Meta:
        model = User
        fields = [
            'email', 'password', 'password_confirm', 'first_name',
            'last_name', 'phone_number', 'role', 'country', 'city'
        ]

    def validate(self, attrs):
        """Validate password match."""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': _('Passwords do not match.')
            })
        return attrs

    def create(self, validated_data):
        """Create new user."""
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')

        # Use create_user method from UserManager for proper user creation
        user = User.objects.create_user(
            password=password,
            **validated_data
        )

        # Create email verification token
        token = secrets.token_urlsafe(32)
        UserVerification.objects.create(
            user=user,
            token=token,
            purpose='EMAIL_VERIFY',
            expires_at=timezone.now() + timedelta(days=7)
        )

        # Send verification email via Celery task
        from apps.core.tasks import send_verification_email
        send_verification_email.delay(str(user.id), token)

        return user


class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login."""

    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )

    def validate(self, attrs):
        """Validate credentials."""
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(
                request=self.context.get('request'),
                username=email,
                password=password
            )

            if not user:
                raise serializers.ValidationError(
                    _('Invalid email or password.'),
                    code='authorization'
                )

            if not user.is_active:
                raise serializers.ValidationError(
                    _('Account is deactivated.'),
                    code='authorization'
                )

            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError(
                _('Must include email and password.'),
                code='authorization'
            )


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile."""

    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'phone_number',
            'profile_picture', 'bio', 'country', 'city',
            'language', 'timezone', 'email_notifications',
            'sms_notifications'
        ]


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for changing password."""

    old_password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )
    new_password = serializers.CharField(
        required=True,
        write_only=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    new_password_confirm = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )

    def validate_old_password(self, value):
        """Validate old password."""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError(_('Old password is incorrect.'))
        return value

    def validate(self, attrs):
        """Validate new passwords match."""
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({
                'new_password_confirm': _('New passwords do not match.')
            })
        return attrs

    def save(self):
        """Change user password."""
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user


class KYCSubmissionSerializer(serializers.Serializer):
    """Serializer for KYC submission."""

    id_number = serializers.CharField(required=True, max_length=100)
    kyc_document = serializers.FileField(required=True)

    def validate_kyc_document(self, value):
        """Validate document file."""
        # Validate file size (max 5MB)
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError(_('File size must not exceed 5MB.'))

        # Validate file type
        allowed_types = ['application/pdf', 'image/jpeg', 'image/png']
        if value.content_type not in allowed_types:
            raise serializers.ValidationError(
                _('Only PDF, JPEG, and PNG files are allowed.')
            )

        return value

    def save(self):
        """Submit KYC for review."""
        user = self.context['request'].user
        user.id_number = self.validated_data['id_number']
        user.kyc_document = self.validated_data['kyc_document']
        user.kyc_status = User.KYCStatus.PENDING
        user.kyc_submitted_at = timezone.now()
        user.save()

        # Notify admins via Celery task
        from apps.core.tasks import notify_admins_kyc_submission
        notify_admins_kyc_submission.delay(str(user.id))

        return user


class KYCReviewSerializer(serializers.Serializer):
    """Serializer for KYC review by admin."""

    status = serializers.ChoiceField(
        choices=[User.KYCStatus.APPROVED, User.KYCStatus.REJECTED],
        required=True
    )
    rejection_reason = serializers.CharField(
        required=False,
        allow_blank=True
    )

    def validate(self, attrs):
        """Validate rejection reason is provided if rejected."""
        if attrs['status'] == User.KYCStatus.REJECTED:
            if not attrs.get('rejection_reason'):
                raise serializers.ValidationError({
                    'rejection_reason': _('Rejection reason is required when rejecting KYC.')
                })
        return attrs

    def save(self, user):
        """Update KYC status."""
        reviewer = self.context['request'].user
        user.kyc_status = self.validated_data['status']
        user.kyc_reviewed_at = timezone.now()
        user.kyc_reviewed_by = reviewer

        if self.validated_data['status'] == User.KYCStatus.REJECTED:
            user.kyc_rejection_reason = self.validated_data.get('rejection_reason', '')
        else:
            user.kyc_rejection_reason = ''

        user.save()

        # Notify user via Celery task
        from apps.core.tasks import notify_user_kyc_review
        notify_user_kyc_review.delay(
            str(user.id),
            self.validated_data['status'],
            user.kyc_rejection_reason
        )

        return user


class PublicUserSerializer(serializers.ModelSerializer):
    """Public serializer for displaying user info (for donors, etc.)."""

    full_name = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'full_name', 'profile_picture']
