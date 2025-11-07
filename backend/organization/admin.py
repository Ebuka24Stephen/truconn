from django.contrib import admin

from .models import Org, AccessRequest

admin.site.register(Org)
admin.site.register(AccessRequest)