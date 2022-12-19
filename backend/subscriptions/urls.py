"""URLs for the Subscriptions App"""
from django.urls import include, path
from subscriptions.views import *

app_name = 'subscriptions'
urlpatterns = [
    path('plans/', subscriptions_view),
    path('subscribe/', subscribe_view),
    path('edit_membership/', edit_subscription_view),
    path('cancel_membership/', cancel_subscription_view),
    path('payment_info/', user_payment_info_view),
    path('edit_payments/', edit_user_payment_view),
    path('membership/', user_membership_view),
    path('payment_history/', user_payment_history_view),
]
