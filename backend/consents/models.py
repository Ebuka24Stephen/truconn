from django.db import models
from django.conf import settings  

class Consent(models.Model):
    name = models.CharField(max_length=50)
    access = models.BooleanField(default=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='consents'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({'Granted' if self.access else 'Denied'})"
