from django.contrib import admin
from django.contrib.admin import register
from accounts.models import User

# Register your models here.
@register(User)
class UserAdmin(admin.ModelAdmin):
    fields = ['email','first_name','last_name', 'avatar', 'phone_number']
