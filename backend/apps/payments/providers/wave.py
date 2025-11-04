"""
Wave payment provider implementation.
"""
import requests
import hmac
import hashlib
import json
from decimal import Decimal
from typing import Dict, Any, Optional
from .base import BasePaymentProvider, PaymentProviderConfigException, PaymentProviderAPIException


class WaveProvider(BasePaymentProvider):
    """Wave mobile money payment provider."""

    REQUIRED_CONFIG_KEYS = ['api_key', 'api_secret', 'merchant_id', 'api_base_url']

    def validate_config(self) -> None:
        """Validate Wave configuration."""
        for key in self.REQUIRED_CONFIG_KEYS:
            if not self.config.get(key):
                raise PaymentProviderConfigException(
                    f"Missing required configuration: {key}"
                )

    def _get_headers(self) -> Dict[str, str]:
        """Get API request headers."""
        return {
            'Authorization': f"Bearer {self.config['api_key']}",
            'Content-Type': 'application/json',
            'X-Api-Key': self.config['api_key'],
        }

    def _make_request(
        self,
        method: str,
        endpoint: str,
        data: Optional[Dict] = None,
        params: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """
        Make API request to Wave.

        Args:
            method: HTTP method
            endpoint: API endpoint
            data: Request body
            params: Query parameters

        Returns:
            API response

        Raises:
            PaymentProviderAPIException: If request fails
        """
        url = f"{self.config['api_base_url']}/{endpoint.lstrip('/')}"
        headers = self._get_headers()

        try:
            self.log_info(f"Making {method} request to {url}")

            response = requests.request(
                method=method,
                url=url,
                headers=headers,
                json=data,
                params=params,
                timeout=30
            )

            response_data = response.json() if response.content else {}

            if not response.ok:
                self.log_error(
                    f"API request failed: {response.status_code}",
                    status_code=response.status_code,
                    response=response_data
                )
                raise PaymentProviderAPIException(
                    message=f"Wave API error: {response_data.get('message', 'Unknown error')}",
                    status_code=response.status_code,
                    response=response_data
                )

            return response_data

        except requests.RequestException as e:
            self.log_error("Network error during API request", exc=e)
            raise PaymentProviderAPIException(
                message=f"Network error: {str(e)}"
            )

    def initiate_payment(
        self,
        amount: Decimal,
        currency: str,
        phone_number: str,
        email: str,
        reference: str,
        callback_url: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Initiate Wave payment."""
        # Normalize phone number (Wave expects format: +221XXXXXXXXX)
        if not phone_number.startswith('+'):
            # Assume Senegal country code if not provided
            phone_number = f"+221{phone_number.lstrip('0')}"

        payload = {
            'amount': str(amount),
            'currency': currency,
            'merchant_id': self.config['merchant_id'],
            'customer_phone': phone_number,
            'customer_email': email,
            'transaction_ref': reference,
            'callback_url': callback_url,
            'description': metadata.get('description', 'Donation via Soutrali') if metadata else 'Donation via Soutrali',
            'metadata': metadata or {}
        }

        response = self._make_request('POST', '/payments', data=payload)

        return {
            'transaction_id': response.get('id') or response.get('transaction_id'),
            'status': self._map_status(response.get('status')),
            'redirect_url': response.get('payment_url') or response.get('checkout_url'),
            'payment_instructions': response.get('instructions'),
            'raw_response': response
        }

    def verify_payment(self, transaction_id: str) -> Dict[str, Any]:
        """Verify Wave payment status."""
        response = self._make_request('GET', f'/payments/{transaction_id}')

        return {
            'transaction_id': response.get('id') or response.get('transaction_id'),
            'status': self._map_status(response.get('status')),
            'amount': Decimal(str(response.get('amount', 0))),
            'currency': response.get('currency'),
            'paid_at': response.get('paid_at') or response.get('completed_at'),
            'customer_phone': response.get('customer_phone'),
            'raw_response': response
        }

    def verify_webhook_signature(
        self,
        payload: bytes,
        signature: str,
        **kwargs
    ) -> bool:
        """Verify Wave webhook signature using HMAC-SHA256."""
        webhook_secret = self.config.get('webhook_secret', '')

        if not webhook_secret:
            self.log_error("Webhook secret not configured")
            return False

        # Calculate expected signature
        expected_signature = hmac.new(
            key=webhook_secret.encode('utf-8'),
            msg=payload,
            digestmod=hashlib.sha256
        ).hexdigest()

        # Compare signatures
        return hmac.compare_digest(expected_signature, signature)

    def parse_webhook(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Parse Wave webhook payload."""
        event_type_map = {
            'payment.completed': 'PAYMENT_SUCCESS',
            'payment.succeeded': 'PAYMENT_SUCCESS',
            'payment.failed': 'PAYMENT_FAILED',
            'payment.cancelled': 'PAYMENT_CANCELLED',
            'payment.pending': 'PAYMENT_PENDING',
        }

        event_type = payload.get('event') or payload.get('type')
        mapped_event = event_type_map.get(event_type, 'OTHER')

        data = payload.get('data', {})

        return {
            'event_id': payload.get('id') or payload.get('event_id'),
            'event_type': mapped_event,
            'transaction_id': data.get('id') or data.get('transaction_id'),
            'status': self._map_status(data.get('status')),
            'amount': Decimal(str(data.get('amount', 0))),
            'currency': data.get('currency'),
            'customer_phone': data.get('customer_phone'),
            'raw_data': payload
        }

    def initiate_refund(
        self,
        transaction_id: str,
        amount: Decimal,
        reason: str
    ) -> Dict[str, Any]:
        """Initiate Wave refund."""
        payload = {
            'transaction_id': transaction_id,
            'amount': str(amount),
            'reason': reason
        }

        response = self._make_request('POST', f'/payments/{transaction_id}/refund', data=payload)

        return {
            'refund_id': response.get('id') or response.get('refund_id'),
            'status': self._map_status(response.get('status')),
            'raw_response': response
        }

    def get_transaction_details(self, transaction_id: str) -> Dict[str, Any]:
        """Get Wave transaction details."""
        return self._make_request('GET', f'/payments/{transaction_id}')

    def _map_status(self, provider_status: Optional[str]) -> str:
        """Map Wave status to internal status."""
        if not provider_status:
            return 'PENDING'

        status_map = {
            'completed': 'SUCCESS',
            'succeeded': 'SUCCESS',
            'successful': 'SUCCESS',
            'failed': 'FAILED',
            'cancelled': 'CANCELLED',
            'canceled': 'CANCELLED',
            'pending': 'PENDING',
            'processing': 'PROCESSING',
            'expired': 'EXPIRED',
        }

        return status_map.get(provider_status.lower(), 'PENDING')
