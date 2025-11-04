"""
Base payment provider abstract class.
"""
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from decimal import Decimal
import logging

logger = logging.getLogger(__name__)


class PaymentProviderException(Exception):
    """Base exception for payment provider errors."""
    pass


class PaymentProviderConfigException(PaymentProviderException):
    """Exception for configuration errors."""
    pass


class PaymentProviderAPIException(PaymentProviderException):
    """Exception for API errors."""
    def __init__(self, message: str, status_code: Optional[int] = None, response: Optional[Dict] = None):
        super().__init__(message)
        self.status_code = status_code
        self.response = response or {}


class BasePaymentProvider(ABC):
    """
    Abstract base class for payment providers.

    All payment providers must implement this interface to ensure
    consistent behavior across different payment methods.
    """

    def __init__(self, config: Dict[str, Any]):
        """
        Initialize the payment provider.

        Args:
            config: Provider-specific configuration dictionary
        """
        self.config = config
        self.validate_config()

    @abstractmethod
    def validate_config(self) -> None:
        """
        Validate provider configuration.

        Raises:
            PaymentProviderConfigException: If configuration is invalid
        """
        pass

    @abstractmethod
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
        """
        Initiate a payment transaction.

        Args:
            amount: Payment amount
            currency: Currency code (XOF, EUR, USD, etc.)
            phone_number: Customer phone number
            email: Customer email
            reference: Unique transaction reference
            callback_url: Webhook URL for payment notifications
            metadata: Additional metadata

        Returns:
            Dictionary containing:
                - transaction_id: Provider's transaction ID
                - status: Payment status
                - redirect_url: URL to redirect customer (if applicable)
                - payment_instructions: Instructions for customer (if applicable)
                - raw_response: Raw API response

        Raises:
            PaymentProviderAPIException: If API call fails
        """
        pass

    @abstractmethod
    def verify_payment(self, transaction_id: str) -> Dict[str, Any]:
        """
        Verify payment status.

        Args:
            transaction_id: Provider's transaction ID

        Returns:
            Dictionary containing:
                - transaction_id: Provider's transaction ID
                - status: Payment status (SUCCESS, FAILED, PENDING, etc.)
                - amount: Payment amount
                - currency: Currency code
                - paid_at: Payment timestamp (if successful)
                - raw_response: Raw API response

        Raises:
            PaymentProviderAPIException: If API call fails
        """
        pass

    @abstractmethod
    def verify_webhook_signature(
        self,
        payload: bytes,
        signature: str,
        **kwargs
    ) -> bool:
        """
        Verify webhook signature.

        Args:
            payload: Raw webhook payload
            signature: Signature from webhook headers
            **kwargs: Additional provider-specific parameters

        Returns:
            True if signature is valid, False otherwise
        """
        pass

    @abstractmethod
    def parse_webhook(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Parse webhook payload.

        Args:
            payload: Webhook payload

        Returns:
            Dictionary containing:
                - event_id: Unique event identifier
                - event_type: Type of event (PAYMENT_SUCCESS, PAYMENT_FAILED, etc.)
                - transaction_id: Provider's transaction ID
                - status: Payment status
                - amount: Payment amount
                - currency: Currency code
                - raw_data: Raw webhook data
        """
        pass

    @abstractmethod
    def initiate_refund(
        self,
        transaction_id: str,
        amount: Decimal,
        reason: str
    ) -> Dict[str, Any]:
        """
        Initiate a refund.

        Args:
            transaction_id: Original transaction ID
            amount: Refund amount
            reason: Refund reason

        Returns:
            Dictionary containing:
                - refund_id: Provider's refund ID
                - status: Refund status
                - raw_response: Raw API response

        Raises:
            PaymentProviderAPIException: If API call fails
        """
        pass

    @abstractmethod
    def get_transaction_details(self, transaction_id: str) -> Dict[str, Any]:
        """
        Get detailed transaction information.

        Args:
            transaction_id: Provider's transaction ID

        Returns:
            Dictionary with transaction details

        Raises:
            PaymentProviderAPIException: If API call fails
        """
        pass

    def get_provider_name(self) -> str:
        """Get the provider name."""
        return self.__class__.__name__.replace('Provider', '')

    def is_sandbox_mode(self) -> bool:
        """Check if provider is in sandbox mode."""
        return self.config.get('sandbox_mode', False)

    def calculate_provider_fee(self, amount: Decimal) -> Decimal:
        """
        Calculate provider fee.

        Args:
            amount: Transaction amount

        Returns:
            Provider fee amount
        """
        # Override in subclass if provider has specific fee structure
        fee_rate = self.config.get('fee_rate', Decimal('0.01'))
        return amount * fee_rate

    def log_error(self, message: str, exc: Optional[Exception] = None, **kwargs):
        """Log provider error."""
        logger.error(
            f"[{self.get_provider_name()}] {message}",
            exc_info=exc,
            extra=kwargs
        )

    def log_info(self, message: str, **kwargs):
        """Log provider info."""
        logger.info(
            f"[{self.get_provider_name()}] {message}",
            extra=kwargs
        )
