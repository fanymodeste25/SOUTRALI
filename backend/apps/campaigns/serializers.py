"""
Serializers for campaigns app.
"""
from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from django.utils.text import slugify
from .models import (
    Campaign, CampaignImage, CampaignDocument,
    CampaignUpdate, CampaignComment
)
from apps.users.serializers import PublicUserSerializer


class CampaignImageSerializer(serializers.ModelSerializer):
    """Serializer for campaign images."""

    class Meta:
        model = CampaignImage
        fields = ['id', 'image', 'caption', 'order', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']


class CampaignDocumentSerializer(serializers.ModelSerializer):
    """Serializer for campaign documents."""

    class Meta:
        model = CampaignDocument
        fields = ['id', 'title', 'document', 'document_type', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']


class CampaignListSerializer(serializers.ModelSerializer):
    """Serializer for campaign list view."""

    organizer = PublicUserSerializer(read_only=True)
    progress_percentage = serializers.FloatField(read_only=True)
    days_remaining = serializers.IntegerField(read_only=True)
    is_fully_funded = serializers.BooleanField(read_only=True)

    class Meta:
        model = Campaign
        fields = [
            'id', 'slug', 'title', 'short_description', 'organizer',
            'category', 'status', 'goal_amount', 'current_amount',
            'currency', 'progress_percentage', 'donation_count',
            'featured_image', 'days_remaining', 'is_fully_funded',
            'country', 'city', 'created_at', 'end_date', 'is_featured'
        ]
        read_only_fields = ['id', 'slug', 'current_amount', 'donation_count', 'created_at']


class CampaignDetailSerializer(serializers.ModelSerializer):
    """Serializer for campaign detail view."""

    organizer = PublicUserSerializer(read_only=True)
    images = CampaignImageSerializer(many=True, read_only=True)
    documents = CampaignDocumentSerializer(many=True, read_only=True)
    progress_percentage = serializers.FloatField(read_only=True)
    days_remaining = serializers.IntegerField(read_only=True)
    is_fully_funded = serializers.BooleanField(read_only=True)
    amount_remaining = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = Campaign
        fields = [
            'id', 'slug', 'title', 'description', 'short_description',
            'organizer', 'category', 'status', 'goal_amount',
            'current_amount', 'currency', 'progress_percentage',
            'amount_remaining', 'donation_count', 'view_count',
            'share_count', 'featured_image', 'video_url', 'images',
            'documents', 'start_date', 'end_date', 'days_remaining',
            'is_fully_funded', 'country', 'city', 'location_details',
            'allow_anonymous_donations', 'show_donors', 'is_featured',
            'created_at', 'updated_at', 'published_at'
        ]
        read_only_fields = [
            'id', 'slug', 'organizer', 'status', 'current_amount',
            'donation_count', 'view_count', 'share_count', 'created_at',
            'updated_at', 'published_at'
        ]


class CampaignCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating campaigns."""

    images = CampaignImageSerializer(many=True, required=False)
    documents = CampaignDocumentSerializer(many=True, required=False)

    class Meta:
        model = Campaign
        fields = [
            'title', 'description', 'short_description', 'category',
            'goal_amount', 'currency', 'featured_image', 'video_url',
            'start_date', 'end_date', 'country', 'city', 'location_details',
            'allow_anonymous_donations', 'show_donors', 'send_receipts',
            'meta_description', 'meta_keywords', 'images', 'documents'
        ]

    def validate(self, attrs):
        """Validate campaign data."""
        # Check if user can create campaigns
        user = self.context['request'].user
        if not user.has_permission('create_campaign'):
            raise serializers.ValidationError(
                _('You do not have permission to create campaigns. '
                  'Please complete KYC verification if you are an organizer.')
            )

        # Validate end date
        if attrs.get('end_date') and attrs.get('start_date'):
            if attrs['end_date'] <= attrs['start_date']:
                raise serializers.ValidationError({
                    'end_date': _('End date must be after start date.')
                })

        return attrs

    def create(self, validated_data):
        """Create campaign."""
        images_data = validated_data.pop('images', [])
        documents_data = validated_data.pop('documents', [])

        # Set organizer
        validated_data['organizer'] = self.context['request'].user

        # Generate slug
        base_slug = slugify(validated_data['title'])
        unique_slug = base_slug
        counter = 1
        while Campaign.objects.filter(slug=unique_slug).exists():
            unique_slug = f"{base_slug}-{counter}"
            counter += 1
        validated_data['slug'] = unique_slug

        # Set initial status
        validated_data['status'] = Campaign.Status.PENDING_REVIEW

        campaign = Campaign.objects.create(**validated_data)

        # Create images
        for image_data in images_data:
            CampaignImage.objects.create(campaign=campaign, **image_data)

        # Create documents
        for document_data in documents_data:
            CampaignDocument.objects.create(campaign=campaign, **document_data)

        return campaign


class CampaignUpdateInputSerializer(serializers.ModelSerializer):
    """Serializer for updating campaigns."""

    class Meta:
        model = Campaign
        fields = [
            'title', 'description', 'short_description', 'category',
            'goal_amount', 'featured_image', 'video_url', 'end_date',
            'country', 'city', 'location_details',
            'allow_anonymous_donations', 'show_donors',
            'meta_description', 'meta_keywords'
        ]

    def validate(self, attrs):
        """Validate that campaign can be updated."""
        campaign = self.instance

        # Only draft and active campaigns can be updated
        if campaign.status not in [Campaign.Status.DRAFT, Campaign.Status.ACTIVE]:
            raise serializers.ValidationError(
                _('Only draft or active campaigns can be updated.')
            )

        # Can't reduce goal if donations already received
        if 'goal_amount' in attrs and campaign.current_amount > 0:
            if attrs['goal_amount'] < campaign.current_amount:
                raise serializers.ValidationError({
                    'goal_amount': _('Goal amount cannot be less than current donations.')
                })

        return attrs


class CampaignUpdatePostSerializer(serializers.ModelSerializer):
    """Serializer for campaign updates/news."""

    author = PublicUserSerializer(read_only=True)

    class Meta:
        model = CampaignUpdate
        fields = [
            'id', 'campaign', 'author', 'title', 'content',
            'image', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'author', 'created_at', 'updated_at']

    def create(self, validated_data):
        """Create campaign update."""
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)


class CampaignCommentSerializer(serializers.ModelSerializer):
    """Serializer for campaign comments."""

    user = PublicUserSerializer(read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = CampaignComment
        fields = [
            'id', 'campaign', 'user', 'parent', 'content',
            'is_approved', 'created_at', 'replies'
        ]
        read_only_fields = ['id', 'user', 'is_approved', 'created_at']

    def get_replies(self, obj):
        """Get comment replies."""
        if obj.replies.exists():
            return CampaignCommentSerializer(
                obj.replies.filter(is_approved=True),
                many=True
            ).data
        return []

    def create(self, validated_data):
        """Create comment."""
        validated_data['user'] = self.context['request'].user
        validated_data['is_approved'] = True  # Auto-approve for now
        return super().create(validated_data)


class CampaignStatsSerializer(serializers.Serializer):
    """Serializer for campaign statistics."""

    total_campaigns = serializers.IntegerField()
    active_campaigns = serializers.IntegerField()
    total_raised = serializers.DecimalField(max_digits=15, decimal_places=2)
    total_donations = serializers.IntegerField()
    average_donation = serializers.DecimalField(max_digits=12, decimal_places=2)
