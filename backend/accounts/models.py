from django.db import models
import uuid

from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email must be specified!')
        self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_superuser', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get('is_superuser') is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    
    """
    id = Column(String, primary_key=True)
    full_name = Column(String)
    email = Column(String, unique=True)
    password_hash = Column(Text)
    user_role = Column(Enum(UserRoleEnum))
    created_at = Column(TIMESTAMP)
    updated_at = Column(TIMESTAMP)
    """
    USER_ROLE_CHOICES = (
        ('CITIZEN', 'citizen'), 
        ('ORGANIZATION', 'organization'), 
    )
    id = models.UUIDField(default=uuid.uuid4, primary_key=True)
    first_name = models.CharField(max_length=25, blank=False, null=False)
    last_name = models.CharField(max_length=25, blank=False, null=False)
    email = models.EmailField(unique=True)
    user_role = models.CharField(max_length=12, choices=USER_ROLE_CHOICES, default='CITIZEN')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']



class Profile(models.Model):
    user = models.OneToOneField('CustomUser', on_delete=models.CASCADE, related_name='profile')
    title = models.CharField(max_length=20, blank=True)
    company = models.CharField(max_length=20, blank=True)
    url = models.URLField(blank=True)
    phone_no = models.CharField(max_length=20, blank=True)
    about = models.TextField(blank=True)
    #profile_pic = models.ImageField(upload_to='profile_photo/', blank=True, null=True)

    def __str__(self):
        return f"{self.user.first_name}'s Profile"
