"""Serializer for Subscriptions"""
from rest_framework import serializers

from accounts.serializers import UserPropertiesSerializer
from subscriptions.models import *


class SubscriptionSerializer(serializers.ModelSerializer):
    """Serializer for SubscriptionPlans"""
    class Meta:
        model = SubscriptionPlans
        fields = [
            "name", "cost_per_unit", "length_in_days"
        ]


class UserMembershipSerializer(serializers.ModelSerializer):
    """Serializer for UserMembershipSerializer"""
    user = serializers.StringRelatedField()
    membership_plan = serializers.StringRelatedField()
    class Meta:
        model = UserMembership
        fields = [
            "user", "card_number", "card_expiry", "card_cvv_code",
            "membership_plan", "active_membership", "billing_boolean"
        ]


class UserMembershipPlanSerializer(serializers.ModelSerializer):
    """Serializer for UserMembershipPlanSerializer"""
    # membership_plan = serializers.StringRelatedField()
    class Meta:
        model = UserMembership
        fields = [
            "membership_plan", "active_membership"
        ]


class UserPaymentInfoSerializer(serializers.ModelSerializer):
    """Serializer for UserPaymentInfoSerializer"""
    class Meta:
        model = UserMembership
        fields = [
            "card_number", "card_expiry", "card_cvv_code"
        ]


class UserPaymentHistorySerializer(serializers.ModelSerializer):
    """Serializer for UserPaymentHistorySerializer"""
    user = serializers.StringRelatedField()
    class Meta:
        model = UserPaymentHistory
        fields = [
            "user", "amount", "payment_date", "next_billing_date", "days_for_next_payment"
        ]


class UserUpdatePaymentSerializer(serializers.ModelSerializer):
    """Serializer for UserUpdatePaymentSerializer"""
    class Meta:
        model = UserMembership
        fields = [
            "card_number", "card_expiry", "card_cvv_code"
        ]

    def update(self, instance, validated_data):
        print(validated_data)
        instance.card_number = validated_data.get('card_number', instance.card_number)
        instance.card_expiry = validated_data.get('card_expiry', instance.card_expiry)
        instance.card_cvv_code = validated_data.get('card_cvv_code', instance.card_cvv_code)
        instance.save()
        return instance


class UserUpdateSubscriptionSerializer(serializers.ModelSerializer):
    """Serializer for UserUpdateSubscriptionSerializer"""
    membership_plan = serializers.StringRelatedField()
    class Meta:
        model = UserMembership
        fields = [
            "membership_plan"
        ]

    def update(self, instance, validated_data):
        print(validated_data)
        instance.membership_plan = validated_data.get('membership_plan', instance.membership_plan)
        instance.active_membership = True
        instance.save()
        return instance


class UserCancelSubscriptionSerializer(serializers.ModelSerializer):
    """Serializer for UserUpdateSubscriptionSerializer"""
    class Meta:
        model = UserMembership
        fields = [
            "active_membership"
        ]

    def update(self, instance, validated_data):
        print(validated_data)
        instance.membership_plan = ''
        instance.active_membership = False
        instance.save()
        return instance


class SubscribeSerializer(serializers.ModelSerializer):
    """Serializer for SubscribeSerializer"""
    # membership_plan = serializers.StringRelatedField()
    class Meta:
        model = UserMembership
        fields = ["user", "membership_plan", "card_number", "card_expiry", "card_cvv_code",
                  "active_membership", "billing_boolean"]

    def save(self):
        subscription = UserMembership(
            user=self.validated_data['user'],
            membership_plan=self.validated_data['membership_plan'],
            card_number=self.validated_data['card_number'],
            card_expiry=self.validated_data['card_expiry'],
            card_cvv_code=self.validated_data['card_cvv_code'],
            active_membership=True,
        )
        subscription.save()
        return subscription
