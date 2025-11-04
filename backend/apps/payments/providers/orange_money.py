"""
Orange Money payment provider implementation.
"""
import requests
import hmac
import hashlib
import base64
from decimal import Decimal
from typing import Dict, Any, Optional
from .base import BasePaymentProvider, PaymentProviderConfigException, PaymentProviderAPIException


class OrangeMoneyProvider(BasePaymentProvider):
    """Orange Money payment provider."""

    REQUIRED_CONFIG_KEYS = ['api_key', 'api_secret', 'merchant_id', 'api_base_url']

    def validate_config(self) -> None:
        """Validate Orange Money configuration."""
        for key in self.REQUIRED_CONFIG_KEYS:
            if not self.config.get(key):
                raise PaymentProviderConfigException(
                    f"Missing required configuration: {key}"
                )

    def _get_auth_token(self) -> str:
        """
        Get OAuth token from Orange Money API.

        Returns:
            Access token

        Raises:
            PaymentProviderAPIException: If authentication fails
        """
        # Create Basic Auth header
        credentials = f"{self.config['api_key']}:{self.config['api_secret']}"
        encoded_credentials = base64.b64encode(credentials.encode()).decode()

        headers = {
            'Authorization': f'Basic {encoded_credentials}',
            'Content-Type': 'application/x-www-form-urlencoded'
        }

        data = {
            'grant_type': 'client_credentials'
        }

        try:
            url = f"{self.config['api_base_url']}/oauth/v3/token"
            response = requests.post(url, headers=headers, data=data, timeout=30)
            response.raise_for_status()

            token_data = response.json()
            return token_data.get('access_token')

        except requests.RequestException as e:
            self.log_error("Failed to get auth token", exc=e)
            raise PaymentProviderAPIException(f"Authentication failed: {str(e)}")

    def _get_headers(self) -> Dict[str, str]:
        """Get API request headers with OAuth token."""
        token = self._get_auth_token()
        return {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }

    def _make_request(
        self,
        method: str,
        endpoint: str,
        data: Optional[Dict] = None,
        params: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """
        Make API request to Orange Money.

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
                    message=f"Orange Money API error: {response_data.get('message', 'Unknown error')}",
                    status_code=response.status_code,
                    response=response_data
                )

            return response_data

        except requests.RequestException as e:
            self.log_error("Network error during API request", exc=e)
            raise PaymentProviderAPIException(f"Network error: {str(e)}")

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
        """Initiate Orange Money payment."""
        # Normalize phone number for Orange Money format
        if not phone_number.startswith('+'):
            # Assume country code if not provided
            phone_number = f"+{phone_number.lstrip('0')}"

        payload = {
            'merchant_key': self.config['merchant_id'],
            'currency': currency,
            'order_id': reference,
            'amount': int(amount),  # Orange Money expects amount in minor units (cents)
            'return_url': callback_url,
            'cancel_url': callback_url,
            'notif_url': callback_url,
            'lang': 'fr',
            'reference': reference,
            'customer': {
                'phone': phone_number,
                'email': email
            }
        }

        if metadata:
            payload['custom_field'] = metadata

        response = self._make_request('POST', '/webpayment/v1/paymentorder', data=payload)

        return {
            'transaction_id': response.get('payment_token') or response.get('order_id'),
            'status': self._map_status(response.get('status')),
            'redirect_url': response.get('payment_url') or response.get('pay_url'),
            'payment_instructions': response.get('message'),
            'raw_response': response
        }

    def verify_payment(self, transaction_id: str) -> Dict[str, Any]:
        """Verify Orange Money payment status."""
        params = {
            'order_id': transaction_id,
            'merchant_key': self.config['merchant_id']
        }

        response = self._make_request('GET', '/webpayment/v1/transactionstatus', params=params)

        return {
            'transaction_id': response.get('order_id') or response.get('txnid'),
            'status': self._map_status(response.get('status')),
            'amount': Decimal(str(response.get('amount', 0))) / 100,  # Convert from minor units
            'currency': response.get('currency'),
            'paid_at': response.get('payment_date'),
            'customer_phone': response.get('customer', {}).get('phone'),
            'raw_response': response
        }

    def verify_webhook_signature(
        self,
        payload: bytes,
        signature: str,
        **kwargs
    ) -> bool:
        """Verify Orange Money webhook signature."""
        webhook_secret = self.config.get('webhook_secret', '')

        if not webhook_secret:
            self.log_error("Webhook secret not configured")
            return False

        # Orange Money uses HMAC-SHA256
        expected_signature = hmac.new(
            key=webhook_secret.encode('utf-8'),
            msg=payload,
            digestmod=hashlib.sha256
        ).hexdigest()

        return hmac.compare_digest(expected_signature, signature)

    def parse_webhook(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Parse Orange Money webhook payload."""
        event_type_map = {
            'SUCCESS': 'PAYMENT_SUCCESS',
            'SUCCESSFUL': 'PAYMENT_SUCCESS',
            'FAILED': 'PAYMENT_FAILED',
            'CANCELLED': 'PAYMENT_CANCELLED',
            'CANCELED': 'PAYMENT_CANCELLED',
            'PENDING': 'PAYMENT_PENDING',
        }

        status = payload.get('status') or payload.get('payment_status')
        mapped_event = event_type_map.get(status, 'OTHER')

        return {
            'event_id': payload.get('txnid') or payload.get('transaction_id'),
            'event_type': mapped_event,
            'transaction_id': payload.get('order_id') or payload.get('reference'),
            'status': self._map_status(status),
            'amount': Decimal(str(payload.get('amount', 0))) / 100,  # Convert from minor units
            'currency': payload.get('currency'),
            'customer_phone': payload.get('msisdn') or payload.get('customer_phone'),
            'raw_data': payload
        }

    def initiate_refund(
        self,
        transaction_id: str,
        amount: Decimal,
        reason: str
    ) -> Dict[str, Any]:
        """Initiate Orange Money refund."""
        payload = {
            'merchant_key': self.config['merchant_id'],
            'order_id': transaction_id,
            'amount': int(amount * 100),  # Convert to minor units
            'reason': reason
        }

        response = self._make_request('POST', '/webpayment/v1/refund', data=payload)

        return {
            'refund_id': response.get('refund_id') or response.get('txnid'),
            'status': self._map_status(response.get('status')),
            'raw_response': response
        }

    def get_transaction_details(self, transaction_id: str) -> Dict[str, Any]:
        """Get Orange Money transaction details."""
        params = {
            'order_id': transaction_id,
            'merchant_key': self.config['merchant_id']
        }
        return self._make_request('GET', '/webpayment/v1/transactionstatus', params=params)

    def _map_status(self, provider_status: Optional[str]) -> str:
        """Map Orange Money status to internal status."""
        if not provider_status:
            return 'PENDING'

        status_map = {
            'success': 'SUCCESS',
            'successful': 'SUCCESS',
            'succeeded': 'SUCCESS',
            'failed': 'FAILED',
            'cancelled': 'CANCELLED',
            'canceled': 'CANCELLED',
            'pending': 'PENDING',
            'initiated': 'PENDING',
            'processing': 'PROCESSING',
            'expired': 'EXPIRED',
        }

        return status_map.get(provider_status.lower(), 'PENDING')
