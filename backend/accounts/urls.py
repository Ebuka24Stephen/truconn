from django.urls import path
from .views import SignUpView, LoginView, ProfileView, CsrfTokenView, LogoutView

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', ProfileView.as_view(), name='login'),
    path('csrf/', CsrfTokenView.as_view(), name='csrf'),
]
