"""
URL configuration for payments app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PaymentInitiationView, PaymentVerificationView,
    PaymentListView, AvailableProvidersView, RefundViewSet
)

app_name = 'payments'

router = DefaultRouter()
router.register(r'refunds', RefundViewSet, basename='refund')

urlpatterns = [
    path('', include(router.urls)),
    path('initiate/', PaymentInitiationView.as_view(), name='initiate'),
    path('verify/<str:transaction_id>/', PaymentVerificationView.as_view(), name='verify'),
    path('list/', PaymentListView.as_view(), name='list'),
    path('providers/', AvailableProvidersView.as_view(), name='providers'),
]
