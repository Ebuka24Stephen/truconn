import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'truconn.settings')

app = Celery('truconn')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()
