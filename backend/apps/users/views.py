"""
Views for users app.
"""
from rest_framework import status, generics, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from .serializers import (
    UserSerializer, UserRegistrationSerializer, UserLoginSerializer,
    UserProfileUpdateSerializer, PasswordChangeSerializer,
    KYCSubmissionSerializer, KYCReviewSerializer
)
from apps.core.models import AuditLog

User = get_user_model()


class UserRegistrationView(generics.CreateAPIView):
    """API view for user registration."""

    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        """Register new user and return tokens."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate tokens
        refresh = RefreshToken.for_user(user)

        # Log registration
        AuditLog.objects.create(
            user=user,
            action=AuditLog.Action.CREATE,
            description=f"User registered: {user.email}",
            ip_address=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )

        return Response({
            'success': True,
            'message': _('Registration successful. Please check your email to verify your account.'),
            'data': {
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }
        }, status=status.HTTP_201_CREATED)


class UserLoginView(generics.GenericAPIView):
    """API view for user login."""

    serializer_class = UserLoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        """Login user and return tokens."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']

        # Generate tokens
        refresh = RefreshToken.for_user(user)

        # Update last login IP
        user.last_login_ip = request.META.get('REMOTE_ADDR')
        user.save(update_fields=['last_login_ip'])

        # Log login
        AuditLog.objects.create(
            user=user,
            action=AuditLog.Action.LOGIN,
            description=f"User logged in: {user.email}",
            ip_address=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )

        return Response({
            'success': True,
            'message': _('Login successful.'),
            'data': {
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }
        })


class UserProfileView(generics.RetrieveUpdateAPIView):
    """API view for user profile."""

    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        """Return appropriate serializer based on method."""
        if self.request.method == 'GET':
            return UserSerializer
        return UserProfileUpdateSerializer

    def get_object(self):
        """Return current user."""
        return self.request.user

    def update(self, request, *args, **kwargs):
        """Update user profile."""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response({
            'success': True,
            'message': _('Profile updated successfully.'),
            'data': UserSerializer(instance).data
        })


class PasswordChangeView(generics.GenericAPIView):
    """API view for changing password."""

    serializer_class = PasswordChangeSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """Change user password."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Log password change
        AuditLog.objects.create(
            user=request.user,
            action=AuditLog.Action.PASSWORD_CHANGE,
            description="Password changed",
            ip_address=request.META.get('REMOTE_ADDR')
        )

        return Response({
            'success': True,
            'message': _('Password changed successfully.')
        })


class KYCSubmissionView(generics.GenericAPIView):
    """API view for KYC submission."""

    serializer_class = KYCSubmissionSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """Submit KYC for review."""
        user = request.user

        # Check if user is an organizer
        if user.role != User.Role.ORGANIZER:
            return Response({
                'success': False,
                'error': {'message': _('Only organizers can submit KYC.')}
            }, status=status.HTTP_403_FORBIDDEN)

        # Check if KYC already approved
        if user.kyc_status == User.KYCStatus.APPROVED:
            return Response({
                'success': False,
                'error': {'message': _('Your KYC is already approved.')}
            }, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Log KYC submission
        AuditLog.objects.create(
            user=user,
            action=AuditLog.Action.KYC_SUBMIT,
            description="KYC submitted for review",
            ip_address=request.META.get('REMOTE_ADDR')
        )

        return Response({
            'success': True,
            'message': _('KYC submitted successfully. You will be notified once reviewed.'),
            'data': UserSerializer(user).data
        })


class KYCReviewViewSet(viewsets.GenericViewSet):
    """ViewSet for KYC review (admin only)."""

    queryset = User.objects.filter(kyc_status=User.KYCStatus.PENDING)
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

    def list(self, request):
        """List pending KYC submissions."""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        return Response({
            'success': True,
            'data': serializer.data
        })

    @action(detail=True, methods=['post'])
    def review(self, request, pk=None):
        """Review KYC submission."""
        user = self.get_object()

        if user.kyc_status != User.KYCStatus.PENDING:
            return Response({
                'success': False,
                'error': {'message': _('This KYC submission is not pending.')}
            }, status=status.HTTP_400_BAD_REQUEST)

        serializer = KYCReviewSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save(user)

        # Log KYC review
        action = (AuditLog.Action.KYC_APPROVE
                 if user.kyc_status == User.KYCStatus.APPROVED
                 else AuditLog.Action.KYC_REJECT)

        AuditLog.objects.create(
            user=request.user,
            action=action,
            description=f"KYC {user.kyc_status} for user {user.email}",
            ip_address=request.META.get('REMOTE_ADDR')
        )

        return Response({
            'success': True,
            'message': _('KYC review completed.'),
            'data': UserSerializer(user).data
        })
