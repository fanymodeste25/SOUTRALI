"""
Views for webhooks app.
"""
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.utils import timezone
from django.shortcuts import get_object_or_404
import logging
import json

from .models import WebhookEvent
from apps.payments.models import Payment
from apps.payments.providers import PaymentProviderFactory
from apps.core.models import AuditLog

logger = logging.getLogger(__name__)


@method_decorator(csrf_exempt, name='dispatch')
class BaseWebhookView(APIView):
    """Base class for webhook views."""

    permission_classes = [AllowAny]
    provider_name = None

    def post(self, request):
        """Handle webhook POST request."""
        # Get raw payload for signature verification
        raw_payload = request.body

        # Parse JSON payload
        try:
            payload = json.loads(raw_payload) if raw_payload else {}
        except json.JSONDecodeError:
            logger.error(f"[{self.provider_name}] Invalid JSON payload")
            return Response(
                {'error': 'Invalid JSON'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get signature from headers
        signature = self._get_signature(request)

        if not signature:
            logger.warning(f"[{self.provider_name}] No signature provided")
            # Don't reject immediately - some providers may not use signatures in sandbox

        # Create webhook event record
        webhook_event = WebhookEvent.objects.create(
            event_id=self._extract_event_id(payload),
            provider=self._get_provider_code(),
            event_type=WebhookEvent.EventType.OTHER,
            payload=payload,
            headers=dict(request.headers),
            ip_address=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT', ''),
            http_method=request.method,
            signature=signature or '',
            signature_verified=False,
            status=WebhookEvent.Status.PENDING
        )

        try:
            # Verify signature
            if signature:
                provider = PaymentProviderFactory.create(self.provider_name)
                is_valid = provider.verify_webhook_signature(
                    payload=raw_payload,
                    signature=signature
                )

                webhook_event.signature_verified = is_valid
                webhook_event.save(update_fields=['signature_verified'])

                if not is_valid:
                    logger.warning(
                        f"[{self.provider_name}] Invalid webhook signature for event {webhook_event.event_id}"
                    )
                    webhook_event.status = WebhookEvent.Status.IGNORED
                    webhook_event.save(update_fields=['status'])

                    return Response(
                        {'error': 'Invalid signature'},
                        status=status.HTTP_401_UNAUTHORIZED
                    )

            # Process webhook
            self._process_webhook(webhook_event, payload)

            # Mark as processed
            webhook_event.mark_processed()

            return Response(
                {'status': 'success'},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            logger.error(
                f"[{self.provider_name}] Webhook processing failed: {str(e)}",
                exc_info=True
            )

            webhook_event.mark_failed(str(e))

            return Response(
                {'error': 'Processing failed'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def _get_signature(self, request):
        """Extract signature from headers (override in subclass if needed)."""
        # Common signature header names
        possible_headers = [
            'HTTP_X_SIGNATURE',
            'HTTP_X_WEBHOOK_SIGNATURE',
            'HTTP_SIGNATURE',
            'X-Signature',
            'X-Webhook-Signature',
            'Signature',
        ]

        for header in possible_headers:
            sig = request.META.get(header) or request.headers.get(header.replace('HTTP_', '').replace('_', '-'))
            if sig:
                return sig

        return None

    def _extract_event_id(self, payload):
        """Extract event ID from payload (override in subclass if needed)."""
        return (
            payload.get('id') or
            payload.get('event_id') or
            payload.get('transaction_id') or
            str(timezone.now().timestamp())
        )

    def _get_provider_code(self):
        """Get provider code for WebhookEvent model."""
        provider_map = {
            'WAVE': WebhookEvent.Provider.WAVE,
            'ORANGE_MONEY': WebhookEvent.Provider.ORANGE_MONEY,
            'MTN_MOMO': WebhookEvent.Provider.MTN_MOMO,
        }
        return provider_map.get(self.provider_name, WebhookEvent.Provider.OTHER)

    def _process_webhook(self, webhook_event, payload):
        """Process the webhook payload."""
        try:
            # Parse webhook using provider
            provider = PaymentProviderFactory.create(self.provider_name)
            parsed_data = provider.parse_webhook(payload)

            # Update webhook event
            webhook_event.event_type = self._map_event_type(parsed_data['event_type'])
            webhook_event.save(update_fields=['event_type'])

            # Find associated payment
            transaction_id = parsed_data.get('transaction_id')
            if not transaction_id:
                logger.warning(
                    f"[{self.provider_name}] No transaction ID in webhook {webhook_event.event_id}"
                )
                return

            # Try to find payment by provider transaction ID or our transaction ID
            payment = (
                Payment.objects.filter(provider_transaction_id=transaction_id).first() or
                Payment.objects.filter(transaction_id=transaction_id).first()
            )

            if not payment:
                logger.warning(
                    f"[{self.provider_name}] Payment not found for transaction {transaction_id}"
                )
                return

            # Associate payment with webhook
            webhook_event.payment = payment
            webhook_event.save(update_fields=['payment'])

            # Update payment status
            new_status = parsed_data.get('status')
            if new_status and new_status != payment.status:
                old_status = payment.status
                payment.status = new_status

                if new_status == Payment.Status.SUCCESS:
                    payment.paid_at = timezone.now()
                    payment.provider_response = parsed_data.get('raw_data', {})

                    # Generate receipt number
                    if not payment.receipt_number:
                        payment.receipt_number = f"RCP-{payment.transaction_id}"

                elif new_status == Payment.Status.FAILED:
                    payment.error_message = parsed_data.get('error_message', 'Payment failed')

                payment.save()

                logger.info(
                    f"[{self.provider_name}] Payment {payment.transaction_id} status updated: "
                    f"{old_status} -> {new_status}"
                )

                # Log status change
                AuditLog.objects.create(
                    user=payment.donor,
                    action=AuditLog.Action.PAYMENT,
                    description=f"Payment status updated via webhook: {old_status} -> {new_status}",
                    new_values={'status': new_status, 'transaction_id': payment.transaction_id}
                )

        except Exception as e:
            logger.error(
                f"[{self.provider_name}] Error processing webhook: {str(e)}",
                exc_info=True
            )
            raise

    def _map_event_type(self, event_type_str):
        """Map event type string to WebhookEvent.EventType."""
        event_map = {
            'PAYMENT_SUCCESS': WebhookEvent.EventType.PAYMENT_SUCCESS,
            'PAYMENT_FAILED': WebhookEvent.EventType.PAYMENT_FAILED,
            'PAYMENT_PENDING': WebhookEvent.EventType.PAYMENT_PENDING,
            'PAYMENT_CANCELLED': WebhookEvent.EventType.PAYMENT_CANCELLED,
            'REFUND_SUCCESS': WebhookEvent.EventType.REFUND_SUCCESS,
            'REFUND_FAILED': WebhookEvent.EventType.REFUND_FAILED,
        }
        return event_map.get(event_type_str, WebhookEvent.EventType.OTHER)


class WaveWebhookView(BaseWebhookView):
    """Webhook handler for Wave payments."""

    provider_name = 'WAVE'


class OrangeMoneyWebhookView(BaseWebhookView):
    """Webhook handler for Orange Money payments."""

    provider_name = 'ORANGE_MONEY'


class MTNMoMoWebhookView(BaseWebhookView):
    """Webhook handler for MTN Mobile Money payments."""

    provider_name = 'MTN_MOMO'
