"""
URL configuration for users app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    UserRegistrationView, UserLoginView, UserProfileView,
    PasswordChangeView, KYCSubmissionView, KYCReviewViewSet
)

app_name = 'users'

router = DefaultRouter()
router.register(r'kyc/pending', KYCReviewViewSet, basename='kyc-review')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('password/change/', PasswordChangeView.as_view(), name='password-change'),
    path('kyc/submit/', KYCSubmissionView.as_view(), name='kyc-submit'),
]
