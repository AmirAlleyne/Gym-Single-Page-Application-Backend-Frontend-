""" Views for the Subscriptions App"""
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from subscriptions.serializers import *


# works
@api_view(('GET', ))
# @permission_classes((IsAuthenticated,))
def subscriptions_view(request):
    """The view for seeing all subscriptions"""
    if request.method == 'GET':
        response = SubscriptionPlans.objects.all()
        serializer = SubscriptionSerializer(response, many=True)
        return Response(serializer.data)


# works but cannot resubscribe
@api_view(('POST', ))
# @permission_classes((IsAuthenticated,))
def subscribe_view(request):
    """The view for a User subscribing"""
    if request.method == 'POST':

        data = {}
        request.data._mutable = True
        request.data.update({'user': request.user.pk})
        plan = SubscriptionPlans.objects.get(name=request.data['membership_plan'])
        request.data['membership_plan'] = plan.pk

        payment_info = UserPaymentHistory(user=request.user)
        print("payment info and plan", payment_info, plan)
        payment_info.user = request.user
        payment_info.amount = plan.cost_per_unit
        payment_info.payment_date = timezone.localdate()
        payment_info.next_billing_date = timezone.localdate() + datetime.timedelta(plan.length_in_days)
        payment_info.days_for_next_payment = plan.length_in_days
        payment_info.save()

        serializer = SubscribeSerializer(data=request.data)

        if serializer.is_valid():
            response = serializer.save()
            data['response'] = 'successfully subscribed to new subscription.'
            data['user'] = request.user.email
            data['membership_plan'] = response.membership_plan.name
            data['card_number'] = response.card_number
            data['card_expiry'] = response.card_expiry
            data['card_cvv_code'] = response.card_cvv_code
            return Response(data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# works
@api_view(('POST', 'PUT', 'OPTIONS'))
@permission_classes((IsAuthenticated,))
def edit_subscription_view(request):
    if request.method == 'PUT' or request.method == 'POST':
        user = UserMembership.objects.get(user=request.user)
        print(user)
        membership = SubscriptionPlans.objects.get(name=request.data['membership_plan'])
        print("user membership", membership)
        serializer = UserUpdateSubscriptionSerializer(data=request.data, partial=True)
        user.membership_plan = membership
        user.save()
        data = {}

        if serializer.is_valid():
            data['response'] = 'Subscription Updated Successfully'
            print(serializer.data)

            return Response(data=data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# works: but cant resubscribe after this
@api_view(["GET"])
@permission_classes((IsAuthenticated,))
def cancel_subscription_view(request):
    if request.method == 'GET':
        user = UserMembership.objects.get(user=request.user)
        print(user, user.active_membership)
        user.billing_boolean = False
        user.save()
        serializer = UserCancelSubscriptionSerializer(data=request.data, partial=True)
        data = {}
        if serializer.is_valid():
            # serializer.save()
            data['response'] = 'Subscription Deleted Successfully'
            return Response(data=data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# works
@api_view(('GET', 'POST'))
@permission_classes((IsAuthenticated,))
def user_payment_info_view(request):
    """The view for a User's payment information"""
    try:
        user = request.user
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        response = UserMembership.objects.get(user=request.user)
        print(response)
        serializer = UserPaymentInfoSerializer(response)
        return Response(serializer.data)


@api_view(('GET', 'POST'))
@permission_classes((IsAuthenticated,))
def user_payment_history_view(request):
    """The view for a User's payment history"""
    try:
        user = request.user
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        # response = SubscriptionPlans.objects.all(), user=request.user
        response = UserPaymentHistory.objects.all().filter(user=request.user)
        # print(response)
        serializer = UserPaymentHistorySerializer(response, many=True)
        return Response(serializer.data)


@api_view(['GET', 'POST'])
@permission_classes((IsAuthenticated,))
def user_membership_view(request):
    """The view for a User's membership information"""
    try:
        user = request.user
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        response = UserMembership.objects.get(user=request.user)
        print(response)
        serializer = UserMembershipSerializer(response)
        print(serializer.data)
        return Response(serializer.data)


@api_view(['PUT', 'POST'])
@permission_classes((IsAuthenticated,))
def edit_user_payment_view(request):
    """The view for editing a User's payment information"""
    if request.method == 'PUT' or request.method == 'POST':
        user = UserMembership.objects.get(user=request.user)  # get that user's info
        serializer = UserUpdatePaymentSerializer(data=request.data, partial=True)
        print(request.data)
        user.card_number = request.data['card_number']
        user.card_expiry = request.data['card_expiry']
        user.card_cvv_code = request.data['card_cvv_code']
        user.save()
        data = {}
        if serializer.is_valid():
            print("the serializer is valid")
            data['response'] = 'Payment Info Updated Successfully'
            data['card_number'] = serializer.data['card_number']
            data['card_expiry'] = serializer.data['card_expiry']
            data['card_cvv_code'] = serializer.data['card_cvv_code']
            print(data)
            return Response(data=data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
