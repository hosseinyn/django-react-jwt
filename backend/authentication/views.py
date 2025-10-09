from django.contrib.auth import get_user_model
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .serializers import UserSerializer

User = get_user_model()

class IsOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        return obj == request.user

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]

        if self.action in ['retrieve', 'update', 'partial_update', 'destroy', 'list']:
            return [permissions.IsAuthenticated(), IsOwner()]

        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return User.objects.filter(pk=user.pk)
        
    
        return User.objects.none()

    def get_object(self):
        obj = super().get_object()
        if obj != self.request.user:
            raise PermissionDenied("You can only access your own user data.")
        return obj

    def list(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response([], status=status.HTTP_200_OK)
        return super().list(request, *args, **kwargs)
