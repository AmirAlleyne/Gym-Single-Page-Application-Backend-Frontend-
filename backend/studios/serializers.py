from rest_framework import serializers
from rest_framework.fields import SerializerMethodField
from rest_framework.views import APIView

from accounts.serializers import UserPropertiesSerializer
from studios.models import Studio, Class


class StudioSerializer(serializers.ModelSerializer):


    """
    Studio serializer for getting studio information
    """

    class Meta:
        model = Studio
        fields = [
            "name",
            "address",
            "latitude",
            "longitude",
            "postal_code",
            "phone_number",
            "pk",
        ]

    def save(self):
        studio = Studio(
            name=self.validated_data['name'],
            address=self.validated_data['address'],
            latitude=self.validated_data['latitude'],
            longitude=self.validated_data['longitude'],
            phone_number = self.validated_data['phone_number'],
            postal_code = self.validated_data['postal_code'],
            pk=self.validated_data['pk']
        )

        studio.save()
        return studio


class ClassSerializer(serializers.ModelSerializer):
    studio_name = serializers.CharField(source='studio.name')
    enrolled_users = UserPropertiesSerializer(many=True)

    class Meta:
        model = Class
        fields = ['id', 'studio_name', 'name', 'description', 'coach',
                  'keywords', 'capacity', 'date', 'start_time', 'end_time',
                  'recurse', 'end_recursion', 'cancelled', 'enrolled_users']