"""
Users app configuration.
"""
from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class UsersConfig(AppConfig):
    """Configuration for users app."""

    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.users'
    verbose_name = _('Users')

    def ready(self):
        """Import signals when app is ready."""
        import apps.users.signals  # noqa
