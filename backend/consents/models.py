from django.db import models
from django.conf import settings  

class Consent(models.Model):
    name = models.CharField(max_length=50)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    

class UserConsent(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_consents')
    consent = models.ForeignKey(Consent, on_delete=models.CASCADE)
    access = models.BooleanField(default=False)  # True = granted, False = revoked

    class Meta:
        unique_together = ('user', 'consent')
    
