from django.core.paginator import Paginator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
import math
from django.utils import timezone
from project.settings import GOOGLE_API_KEY
from studios.models import Studio, Image, Class, Recurrence, Amenity
from accounts.models import User
import googlemaps
from datetime import datetime
from django.shortcuts import get_object_or_404
from subscriptions.models import UserMembership

from studios.serializers import ClassSerializer, StudioSerializer

gmaps = googlemaps.Client(key=GOOGLE_API_KEY)

import requests
import json

api_key = '543b83e68c7f499596f3c0e1fd1bc18a'

api_url = 'https://ipgeolocation.abstractapi.com/v1/?api_key=' + api_key


def get_ip_geolocation_data(ip_address):
    """
    Gets location details from ip address
    """
    response = requests.get(api_url)
    return response.content


# Create your views here.


def getDistance(p1, p2):
    """
    Calculates distance between two points
    """
    R = 6378137;
    dLat = math.radians(p2[0] - p1[0])
    dLong = math.radians(p2[1] - p1[1])
    a = math.sin(dLat / 2) * math.sin(dLat / 2) + math.cos(
        math.radians(p1[0])) * \
        math.cos(math.radians(p2[0])) * math.sin(dLong / 2) * math.sin(
        dLong / 2);
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    d = R * c
    return d


class StudiosView(APIView):
    """
    View to show all studios sorted by closest location either to the the current user
    or to an entered location.
    GET requests are for current user's location and POST for another location
    """
    serializer_class = StudioSerializer

    def get(self, request, *args, **kwargs):
        studios = Studio.objects.all()

        distances = []
        page_number = self.request.query_params.get('page_number ', 1)
        page_size = self.request.query_params.get('page_size ', 10)
        paginator = Paginator(studios, page_size)
        serializer = self.serializer_class(paginator.page(page_number),
                                           many=True, context={'request': request})

        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')

        if x_forwarded_for:

            ip = x_forwarded_for.split(',')[0]

        else:

            ip = request.META.get('REMOTE_ADDR')

        geolocation_json = get_ip_geolocation_data(ip)
    # amens = studio.amenities.all()
    #     tamenities= []
    #     qamenities= []
    #     for amen in amens:
    #         tamenities.append(amen.type)
    #         qamenities.append(amen.quantity)

        geolocation_data = json.loads(geolocation_json)
        print(geolocation_data['longitude'])
        long = float(geolocation_data['longitude'])
        lat = float(geolocation_data['latitude'])
        
        for key in serializer.data:
            if key['latitude'] != None:
                distances.append((key, getDistance((lat, long), \
                                                   (float(key['latitude']),
                                                    float(key['longitude'])))))
        ds = sorted(distances, key=lambda tup: tup[1])
        

        data = [x[0] for x in ds]
        for dicts in data:
            studio = Studio.objects.get(pk=int(dicts['pk']))
            
            amens = studio.amenities.all()
            tamenities= []
            qamenities= []
            for amen in amens:
                tamenities.append(amen.type)
                qamenities.append(amen.quantity)
            dicts['amenities'] = tamenities
            dicts['qamenities'] = qamenities
            
        
        return Response(data)

    def post(self, request, *args, **kwargs):
        studios = Studio.objects.all()
        distances = []
        page_number = self.request.query_params.get('page_number ', 1)
        page_size = self.request.query_params.get('page_size ', 10)

        paginator = Paginator(studios, page_size)
        serializer = self.serializer_class(paginator.page(page_number), \
                                           many=True, context={'request': request})

        lat = float(request.data['latitude'])

        long = float(request.data['longitude'])
        for key in serializer.data:
            if key['latitude'] != None:
                distances.append((key, getDistance((lat, long), \
                                                   (float(key['latitude']),
                                                    float(key['longitude'])))))
        ds = sorted(distances, key=lambda tup: tup[1])

        data = [x[0] for x in ds]

        return Response(data)


@csrf_exempt
@api_view(('GET', 'POST'))
def StudioInfo(request, pk):
    """
    Retrieve and display the info of a specified studio, it also displays directions
    to that studio from the users current location
    """
    try:
        studio = Studio.objects.get(pk=pk)
        imgs = studio.images.all()
        amens = studio.amenities.all()
        tamenities= []
        qamenities= []
        for amen in amens:
            tamenities.append(amen.type)
            qamenities.append(amen.quantity)

        imglst= []
        for img in imgs:
            imglst.append(img.image.url)

    except Studio.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = StudioSerializer(studio)
    if request.method == 'GET':
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')

        if x_forwarded_for:

            ip = x_forwarded_for.split(',')[0]

        else:

            ip = request.META.get('REMOTE_ADDR')

        geolocation_json = get_ip_geolocation_data(ip)

        geolocation_data = json.loads(geolocation_json)
        long = float(geolocation_data['longitude'])
        lat = float(geolocation_data['latitude'])
    else:
        lat = float(request.data['latitude'])
        long = float(request.data['longitude'])

    url = "https://www.google.com/maps/dir/?api=1"
    origin = "&origin=" + str(lat) + "," + str(long)
    destination = "&destination=" + serializer.data['latitude'] + "," \
                  + serializer.data['longitude']
    newUrl = url + origin + destination
    data = serializer.data
    data['images'] = imglst
   
    data['amenities'] = tamenities
    data['qamenities'] = qamenities
    data['directions'] = newUrl
    return Response(data)

@csrf_exempt
@api_view(('GET',))
def ClassInfo(request, c_id):
    """
    Retrieve and display the info of a specified class.  
    """
    try:
        cur_class = Class.objects.get(id=c_id)
    except Studio.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = ClassSerializer(cur_class)
    data = serializer.data
    return Response(data)

class ListAllClasses(ListAPIView):
    serializer_class = ClassSerializer

    def get_queryset(self):
        return Class.objects.all()


class ListStudioClasses(ListAPIView):
    serializer_class = ClassSerializer

    def get_queryset(self):
        studio = get_object_or_404(Studio, id=self.kwargs['s_id'])
        classes = Class.objects.filter(studio=studio, cancelled=False,
                                       date__gte=timezone.now().date())
        excl_ids = []
        for sclass in classes:
            if sclass.date == timezone.now().date() and sclass.start_time < timezone.now().time():
                excl_ids.append(sclass.id)

        if excl_ids:
            excl_classes = Class.objects.filter(id__in=excl_ids)
            classes = classes.difference(excl_classes)
        return classes.order_by('date', 'start_time')


class ListUserClasses(ListAPIView):
    serializer_class = ClassSerializer

    def get_queryset(self):
        userp = get_object_or_404(User, id=self.request.user.id)
        # should this include classes currently running?
        classes = userp.classes.all().filter(cancelled=False,
                                             date__gte=timezone.now().date())
        excl_ids = []
        for uclass in classes:
            if uclass.date == timezone.now().date() and uclass.start_time < timezone.now().time():
                excl_ids.append(uclass.id)

        if excl_ids:
            excl_classes = Class.objects.filter(id__in=excl_ids)
            classes = classes.difference(excl_classes)
        return classes.order_by('date', 'start_time')


class ListUserClassHistory(ListAPIView):
    serializer_class = ClassSerializer

    def get_queryset(self):
        userp = get_object_or_404(User, id=self.request.user.id)
        classes = userp.classes.all().filter(cancelled=False,
                                             date__lte=timezone.now().date())
        excl_ids = []
        for uclass in classes:
            if uclass.date == timezone.now().date() and uclass.start_time >= timezone.now().time():
                excl_ids.append(uclass.id)

        if excl_ids:
            excl_classes = Class.objects.filter(id__in=excl_ids)
            classes = classes.difference(excl_classes)
        return classes.order_by('date', 'start_time')


class EnrollClass(APIView):
    serializer_class = ClassSerializer

    def get_queryset(self):
        class_enrol = get_object_or_404(Class, id=self.kwargs['c_id'])
        return class_enrol

    def get(self, request, *args, **kwargs):
        # first check if active subscription
        user = get_object_or_404(User, id=request.user.id)
        user_mem = get_object_or_404(UserMembership, user=user)
        if not user_mem.active_membership:
            return Response(status=status.HTTP_403_FORBIDDEN)
        # then check if capacity is max with
        class_enrol = self.get_queryset()
        if class_enrol and class_enrol.enrolled_users.all().count() < class_enrol.capacity:
            # then add user to class.enrolled_users, and return success
            class_enrol.enrolled_users.add(User.objects.get(id=request.user.id))
            class_enrol.save()
            # return 200 status code here
            serializer = ClassSerializer(class_enrol)
            return Response(serializer.data, status=status.HTTP_200_OK)
        # if anything fails return an error
        return Response({'error': 'Not enough capacity in the class'},
                        status=status.HTTP_404_NOT_FOUND)


class DropClass(APIView):
    serializer_class = ClassSerializer

    def get_queryset(self):
        class_drop = get_object_or_404(Class, id=self.kwargs['c_id'])
        return class_drop

    def get(self, request, *args, **kwargs):
        # first check if active subscription
        user = get_object_or_404(User, id=request.user.id)
        user_mem = get_object_or_404(UserMembership, user=user)
        if not user_mem.active_membership:
            return Response(status=status.HTTP_403_FORBIDDEN)
        class_drop = self.get_queryset()
        if class_drop:
            class_drop.enrolled_users.remove(
                User.objects.get(id=request.user.id))
            class_drop.save()
            serializer = ClassSerializer(class_drop)
            return Response(serializer.data, status=status.HTTP_200_OK)
        # if anything fails return an error
        return Response(status=status.HTTP_404_NOT_FOUND)


class EnrollAll(APIView):
    serializer_class = ClassSerializer

    def get_queryset(self):
        cl = get_object_or_404(Class, id=self.kwargs['c_id'])
        rec = cl.recurrence
        classes = Class.objects.filter(recurrence=rec,
                                       date__gte=timezone.now().today())
        excl_ids = []
        for uclass in classes:
            if uclass.date == timezone.now().date() and uclass.start_time < timezone.now().time():
                excl_ids.append(uclass.id)

        if excl_ids:
            excl_classes = Class.objects.filter(id__in=excl_ids)
            classes = classes.difference(excl_classes)
        return classes

    def get(self, request, *args, **kwargs):
        user = get_object_or_404(User, id=request.user.id)
        user_mem = get_object_or_404(UserMembership, user=user)
        if not user_mem.active_membership:
            return Response(status=status.HTTP_403_FORBIDDEN)

        classes_enrol = self.get_queryset()
        if classes_enrol:
            for class_enrol in classes_enrol:
                if class_enrol.enrolled_users.all().count() < class_enrol.capacity:
                    # then add user to class.enrolled_users, and return success
                    # error check here if the user is in the class already
                    class_enrol.enrolled_users.add(
                        User.objects.get(id=request.user.id))
                    class_enrol.save()
            serializer = ClassSerializer(classes_enrol, many=True)
            # if some classes aren't enrolled in, the user will see and its
            # only cause of max capacity
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'error': 'all classes full'},
                        status=status.HTTP_404_NOT_FOUND)


class DropAll(APIView):
    serializer_class = ClassSerializer

    def get_queryset(self):
        cl = get_object_or_404(Class, id=self.kwargs['c_id'])
        rec = cl.recurrence

        classes = Class.objects.filter(recurrence=rec,
                                       date__gte=timezone.now().today())
        excl_ids = []
        for uclass in classes:
            if uclass.date == timezone.now().date() and uclass.start_time < timezone.now().time():
                excl_ids.append(uclass.id)

        if excl_ids:
            excl_classes = Class.objects.filter(id__in=excl_ids)
            classes = classes.difference(excl_classes)
        return classes

    def get(self, request, *args, **kwargs):
        user = get_object_or_404(User, id=request.user.id)
        user_mem = get_object_or_404(UserMembership, user=user)
        if not user_mem.active_membership:
            return Response(status=status.HTTP_403_FORBIDDEN)
        classes_drop = self.get_queryset()
        if classes_drop:
            for class_drop in classes_drop:
                # error check here before running remove?
                class_drop.enrolled_users.remove(
                    User.objects.get(id=request.user.id))
                class_drop.save()
            serializer = ClassSerializer(classes_drop, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)


class StudioSearchFilterView(ListAPIView):
    serializer_class = StudioSerializer

    def get_queryset(self):
        # takes in one value for each
        studio_name = self.request.GET.get('studio_name')
        allamenities = self.request.GET.getlist('amenities')
        class_names = self.request.GET.getlist('class_names')
        coaches = self.request.GET.getlist('coaches')

        final_studios = Studio.objects.all()

        if studio_name:
            final_studios = final_studios.filter(name=studio_name)

        if allamenities and any(x for x in allamenities):
            amenity_objs = Amenity.objects.filter(type__in=allamenities)
            studios = Studio.objects.filter(amenities__in=amenity_objs)
            final_studios = final_studios.intersection(studios)

        if class_names and any(x for x in class_names):
            classes = Class.objects.filter(name__in=class_names)
            studios = Studio.objects.filter(c_class__in=classes)
            final_studios = final_studios.intersection(studios)

        if coaches and any(x for x in coaches):
            classes = Class.objects.filter(coach__in=coaches)
            studios = Studio.objects.filter(c_class__in=classes)
            final_studios = final_studios.intersection(studios)

        return final_studios


class ClassSearchFilterView(ListAPIView):
    serializer_class = ClassSerializer

    def get_queryset(self):
        class_name = self.request.GET.get('class_name')
        coaches = self.request.GET.getlist('coaches')
        # format: ddmmyyyy
        dates_allowed = self.request.GET.getlist('dates_allowed')
        # format: hhmm
        start_time = self.request.GET.get('start_time')
        end_time = self.request.GET.get('end_time')

        final_class = Class.objects.all()

        if class_name:
            final_class = final_class.filter(name=class_name)
        if coaches and any(x for x in coaches):
            final_class = final_class.filter(coach__in=coaches)
        if dates_allowed and any(x for x in dates_allowed):
            classes = Class.objects.none()
            for date_allowed in dates_allowed:
                classes = classes.union(
                    final_class.filter(date__year=int(date_allowed[-4:]),
                                       date__month=int(date_allowed[2:4]),
                                       date__day=int(date_allowed[:2])))
            # should be the same as
            final_class = final_class.intersection(classes)

        excl_ids = []
        if start_time:
            s_time = timezone.make_aware(datetime.strptime(start_time, "%H%M"))
            for fclass in final_class:
                if fclass.start_time < s_time.time():
                    excl_ids.append(fclass.id)
        if end_time:
            e_time = timezone.make_aware(datetime.strptime(end_time, "%H%M"))
            for fclass in final_class:
                if fclass.end_time > e_time.time():
                    excl_ids.append(fclass.id)

        if excl_ids:
            excl_classes = Class.objects.filter(id__in=excl_ids)
            final_class = final_class.difference(excl_classes)

        return final_class
