from django.urls import path , include

from rest_framework_simplejwt import views as jwt_views # type: ignore
from .views import UserViewSet
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)


urlpatterns = [
    path('api/token/' ,jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),

     path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),

     path('users/' , include(router.urls))
]