"""
Campaigns app configuration.
"""
from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class CampaignsConfig(AppConfig):
    """Configuration for campaigns app."""

    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.campaigns'
    verbose_name = _('Campaigns')

    def ready(self):
        """Import signals when app is ready."""
        import apps.campaigns.signals  # noqa
