from django.apps import AppConfig


class ConsentsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'consents'
    
    def ready(self):
        import consents.signals  # Register signals