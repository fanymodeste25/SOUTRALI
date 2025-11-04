"""
URL configuration for users app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

app_name = 'users'

router = DefaultRouter()
# ViewSets will be registered here

urlpatterns = [
    path('', include(router.urls)),
    # Additional URL patterns will be added here
    # path('register/', RegisterView.as_view(), name='register'),
    # path('login/', LoginView.as_view(), name='login'),
    # path('profile/', ProfileView.as_view(), name='profile'),
]
