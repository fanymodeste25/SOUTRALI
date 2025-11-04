"""
MTN Mobile Money payment provider implementation.
"""
import requests
import hmac
import hashlib
import uuid
from decimal import Decimal
from typing import Dict, Any, Optional
from .base import BasePaymentProvider, PaymentProviderConfigException, PaymentProviderAPIException


class MTNMoMoProvider(BasePaymentProvider):
    """MTN Mobile Money payment provider."""

    REQUIRED_CONFIG_KEYS = ['api_key', 'subscription_key', 'api_base_url']

    def validate_config(self) -> None:
        """Validate MTN MoMo configuration."""
        for key in self.REQUIRED_CONFIG_KEYS:
            if not self.config.get(key):
                raise PaymentProviderConfigException(
                    f"Missing required configuration: {key}"
                )

    def _get_api_user(self) -> str:
        """
        Get or create API user ID.
        In production, this should be stored in configuration.

        Returns:
            API user UUID
        """
        # In a real implementation, you would:
        # 1. Create API user via /v1_0/apiuser endpoint (one-time setup)
        # 2. Store the UUID in your configuration
        # For now, we'll use a configured value or generate one
        return self.config.get('api_user_id') or str(uuid.uuid4())

    def _get_api_key(self) -> str:
        """
        Get API key for the API user.
        In production, this should be stored securely.

        Returns:
            API key
        """
        # In a real implementation, you would:
        # 1. Generate API key via /v1_0/apiuser/{apiUserId}/apikey endpoint
        # 2. Store it securely in your configuration
        return self.config.get('api_key')

    def _get_auth_token(self) -> str:
        """
        Get OAuth token from MTN MoMo API.

        Returns:
            Access token

        Raises:
            PaymentProviderAPIException: If authentication fails
        """
        api_user = self._get_api_user()
        api_key = self._get_api_key()

        # Create Basic Auth: base64(api_user:api_key)
        import base64
        credentials = f"{api_user}:{api_key}"
        encoded_credentials = base64.b64encode(credentials.encode()).decode()

        headers = {
            'Authorization': f'Basic {encoded_credentials}',
            'Ocp-Apim-Subscription-Key': self.config['subscription_key'],
            'Content-Type': 'application/json'
        }

        try:
            url = f"{self.config['api_base_url']}/collection/token/"
            response = requests.post(url, headers=headers, timeout=30)
            response.raise_for_status()

            token_data = response.json()
            return token_data.get('access_token')

        except requests.RequestException as e:
            self.log_error("Failed to get auth token", exc=e)
            raise PaymentProviderAPIException(f"Authentication failed: {str(e)}")

    def _get_headers(self, reference_id: Optional[str] = None) -> Dict[str, str]:
        """Get API request headers."""
        token = self._get_auth_token()
        headers = {
            'Authorization': f'Bearer {token}',
            'X-Target-Environment': 'sandbox' if self.is_sandbox_mode() else 'production',
            'Ocp-Apim-Subscription-Key': self.config['subscription_key'],
            'Content-Type': 'application/json'
        }

        if reference_id:
            headers['X-Reference-Id'] = reference_id

        return headers

    def _make_request(
        self,
        method: str,
        endpoint: str,
        data: Optional[Dict] = None,
        params: Optional[Dict] = None,
        reference_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Make API request to MTN MoMo.

        Args:
            method: HTTP method
            endpoint: API endpoint
            data: Request body
            params: Query parameters
            reference_id: Transaction reference ID

        Returns:
            API response

        Raises:
            PaymentProviderAPIException: If request fails
        """
        url = f"{self.config['api_base_url']}/{endpoint.lstrip('/')}"
        headers = self._get_headers(reference_id)

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

            # MTN MoMo returns 202 for successful payment initiation
            if response.status_code == 202:
                return {'status': 'PENDING', 'reference_id': reference_id}

            response_data = response.json() if response.content else {}

            if not response.ok:
                self.log_error(
                    f"API request failed: {response.status_code}",
                    status_code=response.status_code,
                    response=response_data
                )
                raise PaymentProviderAPIException(
                    message=f"MTN MoMo API error: {response_data.get('message', 'Unknown error')}",
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
        """Initiate MTN MoMo payment (Request to Pay)."""
        # Generate unique reference ID for this transaction
        reference_id = str(uuid.uuid4())

        # Normalize phone number (MTN expects format without + or country code prefix)
        # Example: 221771234567 (not +221771234567)
        clean_phone = phone_number.replace('+', '').replace(' ', '').replace('-', '')

        payload = {
            'amount': str(amount),
            'currency': currency,
            'externalId': reference,
            'payer': {
                'partyIdType': 'MSISDN',
                'partyId': clean_phone
            },
            'payerMessage': metadata.get('message', 'Payment for Soutrali donation') if metadata else 'Payment for Soutrali donation',
            'payeeNote': f'Donation via Soutrali - {reference}'
        }

        response = self._make_request(
            'POST',
            '/collection/v1_0/requesttopay',
            data=payload,
            reference_id=reference_id
        )

        return {
            'transaction_id': reference_id,
            'status': self._map_status(response.get('status')),
            'redirect_url': None,  # MTN MoMo doesn't require redirect, payment is done via USSD
            'payment_instructions': f'Please approve the payment request on your phone (dial *182#)',
            'raw_response': response
        }

    def verify_payment(self, transaction_id: str) -> Dict[str, Any]:
        """Verify MTN MoMo payment status."""
        response = self._make_request(
            'GET',
            f'/collection/v1_0/requesttopay/{transaction_id}'
        )

        return {
            'transaction_id': transaction_id,
            'status': self._map_status(response.get('status')),
            'amount': Decimal(str(response.get('amount', 0))),
            'currency': response.get('currency'),
            'paid_at': response.get('completedAt') or response.get('finishDateTime'),
            'customer_phone': response.get('payer', {}).get('partyId'),
            'raw_response': response
        }

    def verify_webhook_signature(
        self,
        payload: bytes,
        signature: str,
        **kwargs
    ) -> bool:
        """Verify MTN MoMo webhook signature."""
        webhook_secret = self.config.get('webhook_secret', '')

        if not webhook_secret:
            self.log_error("Webhook secret not configured")
            return False

        # MTN MoMo uses HMAC-SHA256
        expected_signature = hmac.new(
            key=webhook_secret.encode('utf-8'),
            msg=payload,
            digestmod=hashlib.sha256
        ).hexdigest()

        return hmac.compare_digest(expected_signature, signature)

    def parse_webhook(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Parse MTN MoMo webhook payload."""
        event_type_map = {
            'SUCCESSFUL': 'PAYMENT_SUCCESS',
            'SUCCEEDED': 'PAYMENT_SUCCESS',
            'FAILED': 'PAYMENT_FAILED',
            'PENDING': 'PAYMENT_PENDING',
        }

        status = payload.get('status')
        mapped_event = event_type_map.get(status, 'OTHER')

        return {
            'event_id': payload.get('externalId') or payload.get('referenceId'),
            'event_type': mapped_event,
            'transaction_id': payload.get('referenceId') or payload.get('financialTransactionId'),
            'status': self._map_status(status),
            'amount': Decimal(str(payload.get('amount', 0))),
            'currency': payload.get('currency'),
            'customer_phone': payload.get('payer', {}).get('partyId'),
            'raw_data': payload
        }

    def initiate_refund(
        self,
        transaction_id: str,
        amount: Decimal,
        reason: str
    ) -> Dict[str, Any]:
        """
        Initiate MTN MoMo refund (Transfer).
        Note: MTN MoMo uses transfers for refunds.
        """
        # Generate unique reference ID for refund
        reference_id = str(uuid.uuid4())

        # First, get the original transaction to get payer details
        original_tx = self.verify_payment(transaction_id)
        customer_phone = original_tx.get('customer_phone')

        if not customer_phone:
            raise PaymentProviderAPIException("Cannot refund: customer phone not found")

        payload = {
            'amount': str(amount),
            'currency': original_tx.get('currency', 'XOF'),
            'externalId': f'refund-{transaction_id}',
            'payee': {
                'partyIdType': 'MSISDN',
                'partyId': customer_phone
            },
            'payerMessage': f'Refund for transaction {transaction_id}',
            'payeeNote': reason
        }

        response = self._make_request(
            'POST',
            '/disbursement/v1_0/transfer',
            data=payload,
            reference_id=reference_id
        )

        return {
            'refund_id': reference_id,
            'status': self._map_status(response.get('status')),
            'raw_response': response
        }

    def get_transaction_details(self, transaction_id: str) -> Dict[str, Any]:
        """Get MTN MoMo transaction details."""
        return self._make_request('GET', f'/collection/v1_0/requesttopay/{transaction_id}')

    def _map_status(self, provider_status: Optional[str]) -> str:
        """Map MTN MoMo status to internal status."""
        if not provider_status:
            return 'PENDING'

        status_map = {
            'successful': 'SUCCESS',
            'succeeded': 'SUCCESS',
            'failed': 'FAILED',
            'pending': 'PENDING',
            'ongoing': 'PROCESSING',
            'rejected': 'FAILED',
            'timeout': 'EXPIRED',
        }

        return status_map.get(provider_status.lower(), 'PENDING')
