"""
URL configuration for campaigns app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

app_name = 'campaigns'

router = DefaultRouter()
# ViewSets will be registered here
# router.register(r'', CampaignViewSet, basename='campaign')

urlpatterns = [
    path('', include(router.urls)),
    # Additional URL patterns will be added here
]
