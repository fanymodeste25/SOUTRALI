"""
URL configuration for campaigns app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CampaignViewSet, CampaignUpdateViewSet, CampaignCommentViewSet

app_name = 'campaigns'

router = DefaultRouter()
router.register(r'updates', CampaignUpdateViewSet, basename='campaign-update')
router.register(r'comments', CampaignCommentViewSet, basename='campaign-comment')
router.register(r'', CampaignViewSet, basename='campaign')

urlpatterns = [
    path('', include(router.urls)),
]
