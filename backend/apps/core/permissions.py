"""
Custom permissions for Soutrali platform.
"""
from rest_framework import permissions


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permission to only allow owners of an object or admins to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Admins can do anything
        if request.user.is_staff:
            return True

        # Check if object has organizer attribute (for campaigns)
        if hasattr(obj, 'organizer'):
            return obj.organizer == request.user

        # Check if object has user/author attribute
        if hasattr(obj, 'user'):
            return obj.user == request.user

        if hasattr(obj, 'author'):
            return obj.author == request.user

        # Check if object has donor attribute (for donations)
        if hasattr(obj, 'donor'):
            return obj.donor == request.user

        return False


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permission to only allow admins to edit, but allow read access to anyone.
    """

    def has_permission(self, request, view):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to admins
        return request.user and request.user.is_staff


class IsOrganizerOrAdmin(permissions.BasePermission):
    """
    Permission to only allow organizers or admins to access.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        return (
            request.user.is_staff or
            request.user.role == request.user.Role.ORGANIZER
        )


class IsCampaignOrganizer(permissions.BasePermission):
    """
    Permission to check if user is the campaign organizer.
    """

    def has_object_permission(self, request, view, obj):
        # Admins can do anything
        if request.user.is_staff:
            return True

        # Check if it's the campaign object
        if hasattr(obj, 'organizer'):
            return obj.organizer == request.user

        # Check if it's related to a campaign (e.g., CampaignUpdate)
        if hasattr(obj, 'campaign'):
            return obj.campaign.organizer == request.user

        return False


class HasCompletedKYC(permissions.BasePermission):
    """
    Permission to check if user has completed KYC (for organizers creating campaigns).
    """

    message = 'KYC verification is required to perform this action.'

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        # Admins bypass KYC
        if request.user.is_staff:
            return True

        # Donors don't need KYC
        if request.user.role == request.user.Role.DONOR:
            return True

        # Organizers need KYC approval
        if request.user.role == request.user.Role.ORGANIZER:
            from django.conf import settings
            if settings.KYC_REQUIRED_FOR_ORGANIZERS:
                return request.user.kyc_approved

        return True


class CanManagePayments(permissions.BasePermission):
    """
    Permission to manage payments (admins or campaign organizers).
    """

    def has_object_permission(self, request, view, obj):
        # Admins can manage all payments
        if request.user.is_staff:
            return True

        # Campaign organizers can view payments for their campaigns
        if hasattr(obj, 'campaign'):
            if request.method in permissions.SAFE_METHODS:
                return obj.campaign.organizer == request.user

        return False


class CanApproveContent(permissions.BasePermission):
    """
    Permission to approve content (campaigns, KYC, etc.) - admin only.
    """

    message = 'Only administrators can approve content.'

    def has_permission(self, request, view):
        return request.user and request.user.is_staff

    def has_object_permission(self, request, view, obj):
        return request.user and request.user.is_staff


class IsVerifiedUser(permissions.BasePermission):
    """
    Permission to check if user has verified their email.
    """

    message = 'Please verify your email address to perform this action.'

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        return request.user.is_verified or not hasattr(request.user, 'is_verified')
