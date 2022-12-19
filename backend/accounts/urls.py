from django.urls import  path
from accounts.serializers import MyTokenObtainPairView
from rest_framework.authtoken.views import obtain_auth_token
from accounts.views import edit_user, registration_view, user_logout, user_view
from django.conf import settings
from django.conf.urls.static import static
# from rest_framework_simplejwt.views import (
#     TokenObtainPairView,)

app_name = 'accounts'
urlpatterns = [
    path('register/', registration_view),
    path('login/', MyTokenObtainPairView.as_view(), name='loginview'),
    path('logout/', user_logout, name='logoutview'),
    path('profile/', user_view, name='profileview'),
    path('edit/', edit_user, name='profileedit'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
