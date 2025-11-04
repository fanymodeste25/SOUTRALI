"""
URL configuration for payments app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

app_name = 'payments'

router = DefaultRouter()
# ViewSets will be registered here

urlpatterns = [
    path('', include(router.urls)),
    # Additional URL patterns will be added here
    # path('initiate/', InitiatePaymentView.as_view(), name='initiate'),
    # path('verify/<str:transaction_id>/', VerifyPaymentView.as_view(), name='verify'),
]
