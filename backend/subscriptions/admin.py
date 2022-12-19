from django.contrib import admin
from django.contrib.admin import register
from subscriptions.models import *


# Register your models here.
@register(SubscriptionPlans)
class SubAdmin(admin.ModelAdmin):
    """All the SubscriptionPlans fields that have to be displayed to the admin panel"""

    fields = ['name', 'cost_per_unit', 'length_in_days']


@register(UserMembership)
class UserMembershipAdmin(admin.ModelAdmin):
    """All the UserMembership fields that have to be displayed to the admin panel"""
    fields = ['user', 'card_number', 'card_expiry', 'card_cvv_code', 'membership_plan',
              'active_membership', 'billing_boolean']


@register(UserPaymentHistory)
class UserPaymentHistoryAdmin(admin.ModelAdmin):
    """All the UserPaymentHistory fields that have to be displayed to the admin panel"""
    fields = ['user', 'amount', 'payment_date', 'next_billing_date',
              'days_for_next_payment']
