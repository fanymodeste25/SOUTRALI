"""
URL configuration for webhooks app.
"""
from django.urls import path
from .views import WaveWebhookView, OrangeMoneyWebhookView, MTNMoMoWebhookView

app_name = 'webhooks'

urlpatterns = [
    path('wave/', WaveWebhookView.as_view(), name='wave'),
    path('orange_money/', OrangeMoneyWebhookView.as_view(), name='orange_money'),
    path('mtn_momo/', MTNMoMoWebhookView.as_view(), name='mtn_momo'),
]
