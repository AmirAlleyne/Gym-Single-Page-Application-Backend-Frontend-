from django.contrib import admin
from django.contrib.admin import register
from studios.models import Amenity
from studios.models import Studio, Image, Class, Keywords


# Register your models here.

class ImageInline(admin.TabularInline):
    model = Image
    fields = ['image']
    extra = 1


class AmenityInline(admin.TabularInline):
    model = Amenity
    fields = ['type', 'quantity']
    extra = 1


@register(Studio)
class StudioAdmin(admin.ModelAdmin):
    fields = ['name', 'address', 'longitude', 'latitude', 'postal_code',
              'phone_number']
    inlines = [ImageInline, AmenityInline]
    readonly_fields = ('id',)


class KeywordInLine(admin.TabularInline):
    model = Keywords
    fields = ['keyword1', 'keyword2', 'keyword3']
    extra = 1


@register(Class)
class ClassAdmin(admin.ModelAdmin):
    list_display = ['name', 'date', 'start_time', 'cancelled']
    search_fields = ['name', 'date', 'studio__name', 'description', 'coach',
                     'keywords']
    # inlines = [KeywordInLine]

    def get_readonly_fields(self, request, obj=None):

        if obj:
            # edit
            return 'studio', 'recurse'
        else:
            # create
            return tuple()

    def get_fields(self, request, obj=None):

        if obj:
            # edit
            return ['studio', 'name', 'description', 'coach', 'keywords',
                    'capacity', 'date', 'start_time', 'end_time', 'cancelled',
                    'recurse', 'edit_all']
        else:
            # create
            return ['studio', 'name', 'description', 'coach', 'keywords',
                    'capacity', 'date', 'start_time', 'end_time', 'recurse',
                    'end_recursion']
