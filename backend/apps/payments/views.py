"""
Views for payments app.
"""
from rest_framework import generics, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from decimal import Decimal
import uuid
import logging

from .models import Payment, Donation, Refund
from .serializers import (
    PaymentInitiationSerializer, PaymentSerializer,
    PaymentVerificationSerializer, DonationSerializer,
    RefundSerializer, RefundRequestSerializer,
    PaymentProviderSerializer
)
from .providers import PaymentProviderFactory
from apps.campaigns.models import Campaign
from apps.core.models import AuditLog

logger = logging.getLogger(__name__)


class PaymentInitiationView(generics.GenericAPIView):
    """API view for initiating payments."""

    serializer_class = PaymentInitiationSerializer
    permission_classes = [AllowAny]  # Allow anonymous donations

    def post(self, request, *args, **kwargs):
        """Initiate a payment transaction."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        # Get campaign
        campaign = get_object_or_404(Campaign, id=data['campaign_id'])

        # Check for duplicate transaction
        idempotency_key = data['idempotency_key']
        existing_payment = Payment.objects.filter(idempotency_key=idempotency_key).first()

        if existing_payment:
            # Return existing payment
            return Response({
                'success': True,
                'message': _('Payment already initiated.'),
                'data': PaymentSerializer(existing_payment).data
            })

        # Generate transaction ID
        transaction_id = f"TXN-{uuid.uuid4().hex[:12].upper()}"

        # Calculate fees
        amount = data['amount']
        platform_fee = amount * Decimal(str(settings.PLATFORM_COMMISSION_RATE))

        # Provider fee calculation (simplified - provider will calculate actual)
        provider_fees = {
            Payment.Provider.WAVE: Decimal('0.01'),
            Payment.Provider.ORANGE_MONEY: Decimal('0.015'),
            Payment.Provider.MTN_MOMO: Decimal('0.01'),
        }
        provider_fee_rate = provider_fees.get(data['provider'], Decimal('0'))
        provider_fee = amount * provider_fee_rate
        net_amount = amount - platform_fee - provider_fee

        # Create payment record
        payment = Payment.objects.create(
            transaction_id=transaction_id,
            idempotency_key=idempotency_key,
            campaign=campaign,
            donor=request.user if request.user.is_authenticated else None,
            provider=data['provider'],
            status=Payment.Status.PENDING,
            amount=amount,
            currency=data['currency'],
            platform_fee=platform_fee,
            provider_fee=provider_fee,
            net_amount=net_amount,
            donor_email=data['donor_email'],
            donor_phone=data['donor_phone'],
            donor_name=data.get('donor_name', ''),
            is_anonymous=data['is_anonymous'],
            ip_address=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT', ''),
            callback_url=f"{request.build_absolute_uri('/api/webhooks/')}{data['provider'].lower()}/"
        )

        # Create donation record
        donation = Donation.objects.create(
            campaign=campaign,
            donor=request.user if request.user.is_authenticated else None,
            amount=amount,
            currency=data['currency'],
            donor_name=data.get('donor_name', ''),
            donor_email=data['donor_email'],
            donor_phone=data['donor_phone'],
            is_anonymous=data['is_anonymous'],
            message=data.get('message', ''),
            show_message_publicly=data.get('show_message_publicly', True),
            is_verified=False  # Will be verified after payment
        )

        payment.donation = donation
        payment.save(update_fields=['donation'])

        # Initiate payment with provider
        try:
            provider = PaymentProviderFactory.create(data['provider'])

            result = provider.initiate_payment(
                amount=amount,
                currency=data['currency'],
                phone_number=data['donor_phone'],
                email=data['donor_email'],
                reference=transaction_id,
                callback_url=payment.callback_url,
                metadata={
                    'campaign_id': str(campaign.id),
                    'campaign_title': campaign.title,
                    'donor_name': data.get('donor_name', ''),
                    'message': data.get('message', '')
                }
            )

            # Update payment with provider response
            payment.provider_transaction_id = result.get('transaction_id')
            payment.provider_response = result.get('raw_response', {})
            payment.redirect_url = result.get('redirect_url', '')
            payment.status = Payment.Status.PROCESSING
            payment.save(update_fields=['provider_transaction_id', 'provider_response',
                                       'redirect_url', 'status'])

            # Log payment initiation
            AuditLog.objects.create(
                user=request.user if request.user.is_authenticated else None,
                action=AuditLog.Action.PAYMENT,
                description=f"Payment initiated: {transaction_id}",
                ip_address=request.META.get('REMOTE_ADDR')
            )

            response_data = {
                'transaction_id': payment.transaction_id,
                'provider_transaction_id': payment.provider_transaction_id,
                'status': payment.status,
                'amount': str(payment.amount),
                'currency': payment.currency,
                'redirect_url': payment.redirect_url,
                'payment_instructions': result.get('payment_instructions'),
            }

            return Response({
                'success': True,
                'message': _('Payment initiated successfully.'),
                'data': response_data
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(f"Payment initiation failed: {str(e)}", exc_info=True)

            payment.status = Payment.Status.FAILED
            payment.error_message = str(e)
            payment.save(update_fields=['status', 'error_message'])

            return Response({
                'success': False,
                'error': {
                    'message': _('Failed to initiate payment. Please try again.'),
                    'details': str(e) if settings.DEBUG else {}
                }
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PaymentVerificationView(generics.RetrieveAPIView):
    """API view for verifying payment status."""

    permission_classes = [AllowAny]

    def get(self, request, transaction_id):
        """Verify payment status."""
        payment = get_object_or_404(Payment, transaction_id=transaction_id)

        # If payment is already successful, return cached status
        if payment.status == Payment.Status.SUCCESS:
            serializer = PaymentVerificationSerializer({
                'transaction_id': payment.transaction_id,
                'status': payment.status,
                'amount': payment.amount,
                'currency': payment.currency,
                'paid_at': payment.paid_at,
                'campaign_id': payment.campaign.id,
                'receipt_number': payment.receipt_number
            })
            return Response({
                'success': True,
                'data': serializer.data
            })

        # Verify with provider
        try:
            provider = PaymentProviderFactory.create(payment.provider)
            result = provider.verify_payment(payment.provider_transaction_id)

            # Update payment status
            payment.status = result.get('status', payment.status)
            payment.provider_response = result.get('raw_response', {})

            if payment.status == Payment.Status.SUCCESS:
                payment.paid_at = result.get('paid_at')
                # Payment success is handled by signals

            payment.save()

            serializer = PaymentVerificationSerializer({
                'transaction_id': payment.transaction_id,
                'status': payment.status,
                'amount': payment.amount,
                'currency': payment.currency,
                'paid_at': payment.paid_at,
                'campaign_id': payment.campaign.id,
                'receipt_number': payment.receipt_number
            })

            return Response({
                'success': True,
                'data': serializer.data
            })

        except Exception as e:
            logger.error(f"Payment verification failed: {str(e)}", exc_info=True)

            return Response({
                'success': False,
                'error': {
                    'message': _('Failed to verify payment status.'),
                    'details': str(e) if settings.DEBUG else {}
                }
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PaymentListView(generics.ListAPIView):
    """API view for listing payments (admin/organizer)."""

    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter payments based on user role."""
        user = self.request.user

        if user.is_staff:
            # Admins see all payments
            return Payment.objects.select_related('campaign', 'donor').order_by('-created_at')

        # Organizers see payments for their campaigns
        return Payment.objects.filter(
            campaign__organizer=user
        ).select_related('campaign', 'donor').order_by('-created_at')


class AvailableProvidersView(generics.GenericAPIView):
    """API view for getting available payment providers."""

    permission_classes = [AllowAny]

    def get(self, request):
        """Get list of available payment providers."""
        providers = [
            {
                'name': 'Wave',
                'code': 'WAVE',
                'description': _('Fast and secure mobile money payment'),
                'logo_url': None,
                'is_available': bool(settings.WAVE_CONFIG.get('api_key')),
                'sandbox_mode': settings.WAVE_CONFIG.get('sandbox_mode', True)
            },
            {
                'name': 'Orange Money',
                'code': 'ORANGE_MONEY',
                'description': _('Pay with Orange Money'),
                'logo_url': None,
                'is_available': bool(settings.ORANGE_MONEY_CONFIG.get('api_key')),
                'sandbox_mode': settings.ORANGE_MONEY_CONFIG.get('sandbox_mode', True)
            },
            {
                'name': 'MTN Mobile Money',
                'code': 'MTN_MOMO',
                'description': _('Pay with MTN Mobile Money'),
                'logo_url': None,
                'is_available': bool(settings.MTN_MOMO_CONFIG.get('api_key')),
                'sandbox_mode': settings.MTN_MOMO_CONFIG.get('sandbox_mode', True)
            }
        ]

        serializer = PaymentProviderSerializer(providers, many=True)

        return Response({
            'success': True,
            'data': serializer.data
        })


class RefundViewSet(viewsets.ModelViewSet):
    """ViewSet for refunds (admin only)."""

    queryset = Refund.objects.select_related('payment', 'initiated_by').order_by('-created_at')
    serializer_class = RefundSerializer
    permission_classes = [IsAdminUser]

    @action(detail=False, methods=['post'])
    def request(self, request):
        """Request a refund."""
        serializer = RefundRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        payment = serializer.validated_data['payment']
        amount = serializer.validated_data['amount']
        reason = serializer.validated_data['reason']

        # Create refund record
        refund = Refund.objects.create(
            payment=payment,
            amount=amount,
            currency=payment.currency,
            status=Refund.Status.PENDING,
            reason=reason,
            initiated_by=request.user
        )

        # TODO: Initiate refund with provider via Celery task

        # Log refund request
        AuditLog.objects.create(
            user=request.user,
            action=AuditLog.Action.REFUND,
            description=f"Refund requested for payment {payment.transaction_id}",
            ip_address=request.META.get('REMOTE_ADDR')
        )

        return Response({
            'success': True,
            'message': _('Refund request submitted.'),
            'data': RefundSerializer(refund).data
        }, status=status.HTTP_201_CREATED)
