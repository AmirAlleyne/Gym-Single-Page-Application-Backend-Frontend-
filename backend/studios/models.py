from django.db import models
from django.db.models import SET_NULL

from accounts.models import User
from django.utils import timezone


# Create your models here.
class Studio(models.Model):
    """
        Studio Model with attributes:
        name - name of studio
        address - address name of studio
        latitude - latitude position of studio
        longitude - longitude position of studio
        phone_number - phone number of studio
        postal_code - postal code relating to studio's location
     """
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200, null=False, blank=False)
    address = models.CharField(max_length=200, null=False, blank=False)
    latitude = models.DecimalField(max_digits=18, decimal_places=16, null=True,
                                   blank=False)
    longitude = models.DecimalField(max_digits=19, decimal_places=16, null=True,
                                    blank=False)
    postal_code = models.CharField(max_length=10, blank=False)
    phone_number = models.CharField(max_length=200, null=False, blank=False)

    def __str__(self) -> str:
        return self.name


class Image(models.Model):

    """
    Image Model with attributes:
    studio - a reference to the studio which can have zero or more of these Image objects
    image - an image relating to the aforementioned studio
    """
    studio = models.ForeignKey(to=Studio, on_delete=SET_NULL, null=True, related_name='images')
    image = models.ImageField(null=True, blank=True, upload_to="media")


class Amenity(models.Model):

    """
    Amenity model with attributes:
    studio - a reference to the studio which can have zero or more of these Amenity objects
    type - type of amenity offered by the aforementioned studio
    quantity - the number of amenities the aforementioned studio has
    """

    studio = models.ForeignKey(to=Studio, on_delete=SET_NULL, null=True,
                               related_name='amenities')
    type = models.CharField(max_length=200, null=False)
    quantity = models.CharField(max_length=200, null=False)


class Keywords(models.Model):
    # supports upto 3 keywords
    keyword1 = models.CharField(max_length=20, null=False, blank=False)
    keyword2 = models.CharField(max_length=20, null=False, blank=False)
    keyword3 = models.CharField(max_length=20, null=False, blank=False)


class Recurrence(models.Model):
    pass


class Class(models.Model):

    class Meta:
        verbose_name = "Classes"
        verbose_name_plural = "Classes"

    studio = models.ForeignKey(to=Studio, on_delete=SET_NULL, null=True,
                               related_name='c_class')
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    coach = models.CharField(max_length=50)
    keywords = models.CharField(max_length=120)
    # models.ForeignKey(to=Keywords, on_delete=SET_NULL, null=True, related_name='keywords')
    capacity = models.PositiveIntegerField()
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    cancelled = models.BooleanField(default=False)
    enrolled_users = models.ManyToManyField(User, related_name='classes')
    recurse = models.BooleanField(default=False)
    edit_all = models.BooleanField(default=False)
    created_by_admin = models.BooleanField(default=True)
    end_recursion = models.DateField(null=True, blank=True)
    recurrence = models.ForeignKey(to=Recurrence, on_delete=SET_NULL, null=True)

    # name_id = models.IntegerField(default=1, null=False, blank=False)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.recurse and self.created_by_admin:
            r = Recurrence()
            r.save()
            self.recurrence = r
            i = 2
            # once we've created the recurrence model, we create all of the
            # other classes
            next_date = self.date + timezone.timedelta(weeks=1)
            while next_date <= self.end_recursion:
                new_recur_class = Class(studio=self.studio,
                                        name=self.name + " - " + str(i),
                                        description=self.description,
                                        coach=self.coach,
                                        keywords=self.keywords,
                                        capacity=self.capacity,
                                        date=next_date,
                                        start_time=self.start_time,
                                        end_time=self.end_time,
                                        cancelled=self.cancelled,
                                        recurse=self.recurse,
                                        edit_all=self.edit_all,
                                        created_by_admin=False,
                                        end_recursion=self.end_recursion,
                                        recurrence=self.recurrence)
                new_recur_class.save()
                next_date += timezone.timedelta(weeks=1)
                i += 1

            self.created_by_admin = False

        if self.recurse and self.edit_all:
            # checking for self.recurse is a safety check to ensure that it
            # is actually recursive and will have a recurrence if all classes
            # are being cancelled (one way not also if classes are being
            # 'un-cancelled') then we ignore everything else

            rec = self.recurrence
            classes = Class.objects.filter(recurrence=rec)

            if self.cancelled:
                classes.update(cancelled=self.cancelled)
            else:
                classes.update(description=self.description,
                               coach=self.coach, keywords=self.keywords,
                               capacity=self.capacity,
                               start_time=self.start_time,
                               end_time=self.end_time,
                               cancelled=self.cancelled)

                # we check if names need to be updated
                ori_name = Class.objects.get(id=self.id).name
                if self.name != ori_name:
                    classes.update(name=self.name)

                # to do the date shifting, we first get the shift, and then we
                # add or subtract from each class
                # self.date is the updated date, we do a db query for the
                # original
                ori_date = Class.objects.get(id=self.id).date
                date_shift = self.date - ori_date
                for class_upd in classes:
                    # class_upd.name = self.name + ' ' + str(class_upd.name_id)
                    if class_upd.id != self.id:
                        class_upd.date += date_shift
                        class_upd.save()

            self.edit_all = False

        super().save(*args, **kwargs)
