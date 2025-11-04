"""
URL configuration for Soutrali project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    # API Endpoints
    path('api/users/', include('apps.users.urls')),
    path('api/campaigns/', include('apps.campaigns.urls')),
    path('api/payments/', include('apps.payments.urls')),
    path('api/webhooks/', include('apps.webhooks.urls')),
    path('api/', include('apps.core.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Customize admin site
admin.site.site_header = 'Soutrali Administration'
admin.site.site_title = 'Soutrali Admin'
admin.site.index_title = 'Welcome to Soutrali Administration'
