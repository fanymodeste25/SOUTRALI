"""
Views for campaigns app.
"""
from rest_framework import viewsets, status, filters, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum, Avg, Count, Q
from django.utils.translation import gettext_lazy as _
from .models import Campaign, CampaignUpdate, CampaignComment
from .serializers import (
    CampaignListSerializer, CampaignDetailSerializer,
    CampaignCreateSerializer, CampaignUpdateInputSerializer,
    CampaignUpdatePostSerializer, CampaignCommentSerializer,
    CampaignStatsSerializer
)
from apps.payments.models import Donation
from apps.payments.serializers import DonationListSerializer
from apps.core.models import AuditLog


class CampaignViewSet(viewsets.ModelViewSet):
    """ViewSet for campaigns."""

    queryset = Campaign.objects.select_related('organizer').prefetch_related('images', 'documents')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'category', 'country', 'is_featured']
    search_fields = ['title', 'description', 'organizer__first_name', 'organizer__last_name']
    ordering_fields = ['created_at', 'current_amount', 'donation_count', 'end_date']
    ordering = ['-created_at']

    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'list':
            return CampaignListSerializer
        elif self.action == 'create':
            return CampaignCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return CampaignUpdateInputSerializer
        return CampaignDetailSerializer

    def get_permissions(self):
        """Return appropriate permissions based on action."""
        if self.action in ['list', 'retrieve', 'donations', 'stats']:
            permission_classes = [AllowAny]
        elif self.action == 'create':
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """Filter queryset based on user permissions."""
        queryset = super().get_queryset()

        # Public users only see active campaigns
        if not self.request.user.is_authenticated:
            return queryset.filter(status=Campaign.Status.ACTIVE)

        # Organizers see their own campaigns
        if not self.request.user.is_staff:
            return queryset.filter(
                Q(status=Campaign.Status.ACTIVE) |
                Q(organizer=self.request.user)
            )

        # Admins see all campaigns
        return queryset

    def retrieve(self, request, *args, **kwargs):
        """Retrieve campaign and increment view count."""
        instance = self.get_object()

        # Increment view count
        instance.increment_views()

        serializer = self.get_serializer(instance)
        return Response({
            'success': True,
            'data': serializer.data
        })

    def create(self, request, *args, **kwargs):
        """Create new campaign."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        campaign = serializer.save()

        # Log campaign creation
        AuditLog.objects.create(
            user=request.user,
            action=AuditLog.Action.CREATE,
            description=f"Campaign created: {campaign.title}",
            ip_address=request.META.get('REMOTE_ADDR')
        )

        return Response({
            'success': True,
            'message': _('Campaign created successfully. It will be reviewed by our team.'),
            'data': CampaignDetailSerializer(campaign).data
        }, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """Update campaign."""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        # Check ownership
        if instance.organizer != request.user and not request.user.is_staff:
            return Response({
                'success': False,
                'error': {'message': _('You do not have permission to edit this campaign.')}
            }, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response({
            'success': True,
            'message': _('Campaign updated successfully.'),
            'data': CampaignDetailSerializer(instance).data
        })

    def destroy(self, request, *args, **kwargs):
        """Delete campaign (only if no donations)."""
        instance = self.get_object()

        # Check ownership
        if instance.organizer != request.user and not request.user.is_staff:
            return Response({
                'success': False,
                'error': {'message': _('You do not have permission to delete this campaign.')}
            }, status=status.HTTP_403_FORBIDDEN)

        # Check if campaign has donations
        if instance.donation_count > 0:
            return Response({
                'success': False,
                'error': {'message': _('Cannot delete campaign with donations.')}
            }, status=status.HTTP_400_BAD_REQUEST)

        self.perform_destroy(instance)

        return Response({
            'success': True,
            'message': _('Campaign deleted successfully.')
        }, status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['get'])
    def donations(self, request, pk=None):
        """Get campaign donations."""
        campaign = self.get_object()

        # Filter anonymous donations if not organizer/admin
        donations = Donation.objects.filter(campaign=campaign, is_verified=True)

        if request.user != campaign.organizer and not request.user.is_staff:
            # Only show public donations
            donations = donations.filter(
                Q(is_anonymous=False) | Q(show_message_publicly=True)
            )

        # Order by most recent
        donations = donations.select_related('donor').order_by('-created_at')

        # Pagination
        page = self.paginate_queryset(donations)
        if page is not None:
            serializer = DonationListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = DonationListSerializer(donations, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })

    @action(detail=True, methods=['post'])
    def share(self, request, pk=None):
        """Increment share count."""
        campaign = self.get_object()
        campaign.increment_shares()

        return Response({
            'success': True,
            'message': _('Thank you for sharing!')
        })

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get overall campaign statistics."""
        active_campaigns = Campaign.objects.filter(status=Campaign.Status.ACTIVE)

        stats = active_campaigns.aggregate(
            total_campaigns=Count('id'),
            total_raised=Sum('current_amount'),
            total_donations=Sum('donation_count')
        )

        # Get average donation
        avg_donation = Donation.objects.filter(
            campaign__status=Campaign.Status.ACTIVE
        ).aggregate(avg=Avg('amount'))

        stats['average_donation'] = avg_donation['avg'] or 0
        stats['total_raised'] = stats['total_raised'] or 0
        stats['total_donations'] = stats['total_donations'] or 0
        stats['active_campaigns'] = stats['total_campaigns']

        serializer = CampaignStatsSerializer(stats)
        return Response({
            'success': True,
            'data': serializer.data
        })

    @action(detail=False, methods=['get'])
    def my_campaigns(self, request):
        """Get current user's campaigns."""
        if not request.user.is_authenticated:
            return Response({
                'success': False,
                'error': {'message': _('Authentication required.')}
            }, status=status.HTTP_401_UNAUTHORIZED)

        campaigns = Campaign.objects.filter(organizer=request.user).order_by('-created_at')
        serializer = CampaignListSerializer(campaigns, many=True)

        return Response({
            'success': True,
            'data': serializer.data
        })


class CampaignUpdateViewSet(viewsets.ModelViewSet):
    """ViewSet for campaign updates."""

    queryset = CampaignUpdate.objects.select_related('campaign', 'author')
    serializer_class = CampaignUpdatePostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        """Filter by campaign if provided."""
        queryset = super().get_queryset()
        campaign_id = self.request.query_params.get('campaign')

        if campaign_id:
            queryset = queryset.filter(campaign_id=campaign_id)

        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        """Check if user is campaign organizer."""
        campaign = serializer.validated_data['campaign']

        if campaign.organizer != self.request.user and not self.request.user.is_staff:
            raise serializers.ValidationError(
                _('Only campaign organizers can post updates.')
            )

        serializer.save()


class CampaignCommentViewSet(viewsets.ModelViewSet):
    """ViewSet for campaign comments."""

    queryset = CampaignComment.objects.select_related('campaign', 'user').filter(is_approved=True)
    serializer_class = CampaignCommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        """Filter by campaign if provided."""
        queryset = super().get_queryset()
        campaign_id = self.request.query_params.get('campaign')

        if campaign_id:
            queryset = queryset.filter(campaign_id=campaign_id, parent__isnull=True)

        return queryset.order_by('-created_at')

    def perform_destroy(self, instance):
        """Only allow comment author or admin to delete."""
        if instance.user != self.request.user and not self.request.user.is_staff:
            raise serializers.ValidationError(
                _('You can only delete your own comments.')
            )
        instance.delete()
