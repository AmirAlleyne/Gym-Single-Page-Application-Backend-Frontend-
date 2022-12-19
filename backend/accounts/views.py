from django.contrib import auth
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import QueryDict

from accounts.models import User
from accounts.serializers import RegistrationSerializer, UserPropertiesSerializer, \
    UserUpdateSerializer


def validate_email(email):
    user = None
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return None

    if user != None:
        return email


@api_view(['POST', ])
@permission_classes([])
@authentication_classes([])
def registration_view(request):
    """
    Registration view for user creation
    """
    if request.method == 'POST':
        data = {}
        email = request.data.get('email', '0').lower()
        if validate_email(email) != None:
            data['error_message'] = 'That email is already in use.'
            data['response'] = 'Error'
            return Response(data)
       
        query_dict = QueryDict('', mutable=True)
        query_dict.update(request.data)
        print(query_dict)
        serializer = RegistrationSerializer(data=query_dict)

        if serializer.is_valid():
            user = serializer.save()
            data['response'] = 'successfully registered new user.'
            data['email'] = user.email
            data['first_name'] = user.first_name
            data['last_name'] = user.last_name
            data['phone_number'] = user.phone_number
            data['avatar'] = "/media/" + str(user.avatar)
            data['pk'] = user.pk
            token = Token.objects.get(user=user).key
            data['token'] = token
        else:
            data = serializer.errors
        return Response(data)


@api_view(['GET', 'POST'])
@permission_classes((IsAuthenticated,))
def user_view(request):
    """
    User view for viewing the currently logged in user's information
    """
    try:
        user = request.user
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        print(user)
        serializer = UserPropertiesSerializer(user)
        print("serializer", serializer.data)
        return Response(serializer.data)


@api_view(['PUT', 'POST'])
@permission_classes((IsAuthenticated,))
def edit_user(request):
    """
    View for editing currently logged in user's information
    """
    user = request.user

    if request.method == 'PUT' or request.method == 'POST':
        
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        data = {}
        if serializer.is_valid():
            serializer.save()
            data['response'] = 'Updated Successfully'
            data['pk'] = user.pk
            data['email'] = user.email
            data['first_name'] = serializer.data['first_name']
            data['last_name'] = serializer.data['last_name']
            data['phone_number'] = serializer.data['phone_number']
            data['avatar'] = "/media/" + str(serializer.data['avatar'])

            return Response(data=data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_logout(request):
    """
    View for logging users out
    """
    Token.objects.filter(user=request.user).delete()
    auth.logout(request)

    return Response('User Logged out successfully')
