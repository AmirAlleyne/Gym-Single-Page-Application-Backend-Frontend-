from django import forms
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.http import request
from django.contrib.auth import get_user_model



def isEmailAddressValid( email ):
    try:
        forms.EmailField().clean(email)

        return True
    except forms.ValidationError:
        return False

class RegisterForm(forms.Form):
    username = forms.CharField(required=True, max_length=200)
    first_name = forms.CharField(required=True, max_length=200)
    last_name = forms.CharField(required=True, max_length=200)
    password1 = forms.CharField(required=True,max_length=200)
    password2 = forms.CharField(required=True,max_length=200)
    email = forms.EmailField(required=True, max_length=200)
    phone = forms.CharField(required=True,max_length=60)
    avatar = forms.ImageField()


    def clean(self):
        cleaned_data = super().clean()
        print(cleaned_data)
        username = cleaned_data.get('username')
        password1 = cleaned_data.get('password1')
        password2 = cleaned_data.get('password2')
        email= cleaned_data.get('email')
        phone= cleaned_data.get('phone_number')
        User = get_user_model()
        if User.objects.filter(email=email).exists():
              self.add_error('username',"A user with that username already exists")
        if password1:
            if len(password1) < 8:
                self.add_error('password1',"This password is too short. It must contain at least 8 characters")
            if password2:
                if password1 != password2:
                    self.add_error('password2',"The two password fields didn't match")
        if email:
            if not isEmailAddressValid(email):
                self.add_error('email',"Enter a valid email address")


        return cleaned_data

class LoginForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField()

    def clean(self):
        data = super().clean()
        print(data)
        User = get_user_model()
        user = User.objects.get(email=data.get('email'))
        if user.password != data.get('password'):
            self.add_error('password', 'Email or password is invalid')

        data['user'] = user

        return data

class EditProfile(forms.Form):
    password1 = forms.CharField(required=False,max_length=200)
    password2 = forms.CharField(required=False,max_length=200)
    email = forms.EmailField(required=False, max_length=200)
    first_name = forms.CharField(required=False, max_length=200)
    last_name = forms.CharField(required=False, max_length=200)

    def clean(self):
        cleaned_data = super().clean()
        password1 = cleaned_data.get('password1')
        password2 = cleaned_data.get('password2')
        email= cleaned_data.get('email')
        first_name = cleaned_data.get('first_name')
        last_name = cleaned_data.get('last_name')

        if password1 :
            if len(password1) < 8:
                self.add_error('password1',"This password is too short. It must contain at least 8 characters")

            if password1 != password2:
                self.add_error('password2',"The two password fields didn't match")
        if email:
            if not isEmailAddressValid(email):
                self.add_error('email',"Enter a valid email address")


        return cleaned_data

class MyForm(forms.ModelForm):
  class Meta:
    model = User
    fields = ['username','password','email','first_name', 'last_name']

