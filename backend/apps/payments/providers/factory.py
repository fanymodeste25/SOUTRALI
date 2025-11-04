"""
Payment provider factory.
"""
from typing import Optional
from django.conf import settings
from .base import BasePaymentProvider, PaymentProviderConfigException
from .wave import WaveProvider
from .orange_money import OrangeMoneyProvider
from .mtn_momo import MTNMoMoProvider


class PaymentProviderFactory:
    """Factory for creating payment provider instances."""

    _providers = {
        'WAVE': WaveProvider,
        'ORANGE_MONEY': OrangeMoneyProvider,
        'MTN_MOMO': MTNMoMoProvider,
    }

    @classmethod
    def create(cls, provider_name: str) -> BasePaymentProvider:
        """
        Create a payment provider instance.

        Args:
            provider_name: Name of the provider (WAVE, ORANGE_MONEY, MTN_MOMO)

        Returns:
            Payment provider instance

        Raises:
            PaymentProviderConfigException: If provider not found or config invalid
        """
        provider_name = provider_name.upper()

        if provider_name not in cls._providers:
            raise PaymentProviderConfigException(
                f"Unknown payment provider: {provider_name}. "
                f"Available providers: {', '.join(cls._providers.keys())}"
            )

        # Get configuration for the provider
        config = cls._get_provider_config(provider_name)

        # Create and return provider instance
        provider_class = cls._providers[provider_name]
        return provider_class(config)

    @classmethod
    def _get_provider_config(cls, provider_name: str) -> dict:
        """
        Get configuration for a payment provider.

        Args:
            provider_name: Name of the provider

        Returns:
            Configuration dictionary

        Raises:
            PaymentProviderConfigException: If configuration not found
        """
        config_map = {
            'WAVE': settings.WAVE_CONFIG,
            'ORANGE_MONEY': settings.ORANGE_MONEY_CONFIG,
            'MTN_MOMO': settings.MTN_MOMO_CONFIG,
        }

        config = config_map.get(provider_name)

        if not config:
            raise PaymentProviderConfigException(
                f"Configuration not found for provider: {provider_name}"
            )

        return config

    @classmethod
    def get_available_providers(cls) -> list:
        """
        Get list of available payment providers.

        Returns:
            List of provider names
        """
        return list(cls._providers.keys())

    @classmethod
    def register_provider(cls, name: str, provider_class: type) -> None:
        """
        Register a new payment provider.

        Args:
            name: Provider name
            provider_class: Provider class (must inherit from BasePaymentProvider)

        Raises:
            PaymentProviderConfigException: If provider class is invalid
        """
        if not issubclass(provider_class, BasePaymentProvider):
            raise PaymentProviderConfigException(
                f"Provider class must inherit from BasePaymentProvider"
            )

        cls._providers[name.upper()] = provider_class
