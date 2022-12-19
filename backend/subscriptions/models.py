"""All Models for Subscriptions"""
import datetime
from django.utils import timezone
from django.db import models
from django.db.models import CASCADE
from accounts.models import User


class SubscriptionPlans(models.Model):
    """The admin can create a Subscription plan in the admin panel and specify its details"""
    name = models.CharField(max_length=250, null=True)
    cost_per_unit = models.IntegerField(null=True, blank=True)
    length_in_days = models.IntegerField(default=30)

    class Meta:
        verbose_name = 'Subscription'

    def __str__(self) -> str:
        """Name the SubscriptionPlans object"""
        return self.name


class UserMembership(models.Model):
    """ All information related to a User and their membership including payment information
        -- the user
        -- credit card info including 16 digit card number, card expiry date & card cvv number
        -- the subscription plan that the user is subscribed to
        -- if the user has an active subscription
        -- the next bill date
        -- has the user paid for the current month
    """
    user = models.OneToOneField(to=User, on_delete=CASCADE, null=True)
    card_number = models.CharField(max_length=16, null=True, blank=True)
    card_expiry = models.DateField(null=True, blank=True)
    card_cvv_code = models.CharField(null=True, blank=True, max_length=3)
    membership_plan = models.ForeignKey(to=SubscriptionPlans, null=True,
                                        blank=True, max_length=250, on_delete=CASCADE)
    active_membership = models.BooleanField(default=True)
    billing_boolean = models.BooleanField(default=True)


    def __str__(self) -> str:
        """Name the UserMembership object"""
        return self.user.email


class UserPaymentHistory(models.Model):
    """All the transactions made by Users"""
    user = models.ForeignKey(User, on_delete=CASCADE)
    amount = models.IntegerField(null=True)
    card_number = models.CharField(max_length=16, null=True, blank=True)
    payment_date = models.DateField(null=True, blank=True)
    next_billing_date = models.DateField(null=True, blank=True)
    days_for_next_payment = models.IntegerField(null=True, blank=True)
    bill_at_end_of_cycle = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Payment History'
        verbose_name_plural = 'Payment History'

    def __str__(self) -> str:
        """Name the UserPaymentHistory object"""
        return self.user.email
