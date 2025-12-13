import os
from celery import Celery
# Set the default Django settings module for Celery
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'truconn.settings')
app = Celery('truconn')
# Use Django's settings with a CELERY_ namespace
app.config_from_object('django.conf:settings', namespace='CELERY')
# Auto-discover tasks from installed apps
app.autodiscover_tasks()
@app.task(bind=True)
def debug_task(self):
   print(f'Request: {self.request!r}')