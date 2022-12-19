from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static

from studios.views import DropClass, StudioInfo, StudiosView, \
    ListStudioClasses, ListUserClasses, ListUserClassHistory, EnrollClass, \
    StudioSearchFilterView, ClassSearchFilterView, EnrollAll, DropAll, ClassInfo, ListAllClasses

app_name = 'studios'
urlpatterns = [
    path('all/', StudiosView.as_view(), name='viewstudios'),
    path('<int:pk>/', StudioInfo, name='studiodetails'),
    path('classes/<int:c_id>/', ClassInfo),
    path('<int:s_id>/classes/', ListStudioClasses.as_view()),
    path('classes/all/', ListAllClasses.as_view()),
    path('users/classes/upcoming/', ListUserClasses.as_view()),
    path('users/classes/past/', ListUserClassHistory.as_view()),
    path('<int:c_id>/enroll/', EnrollClass.as_view()),
    path('<int:c_id>/drop/', DropClass.as_view()),
    path('<int:c_id>/enrollall/', EnrollAll.as_view()),
    path('<int:c_id>/dropall/', DropAll.as_view()),
    path('search/', StudioSearchFilterView.as_view()),
    path('classes/search/', ClassSearchFilterView.as_view()),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
