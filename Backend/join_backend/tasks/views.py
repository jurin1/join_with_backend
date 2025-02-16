from rest_framework.authtoken import models as authtoken_models
from rest_framework import generics, permissions
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Task,  Contact
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from .serializers import UserSerializer
from .serializers import TaskSerializer, ContactSerializer, UserSerializer
from django.utils import timezone
from rest_framework import status



@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    email = request.data.get('username')  # Verwende 'username' im Request, aber behandle es als Email
    password = request.data.get('password')

    user = authenticate(request, username=email, password=password) # authenticate braucht request
    if user is not None:
        token, _ = authtoken_models.Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'name': user.first_name, 'userID': user.id})
    else:
        return Response({'error': 'UngÃ¼ltige Anmeldeinformationen'}, status=400)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Benutzer erfolgreich registriert'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ContactListCreate(generics.ListCreateAPIView):
    serializer_class = ContactSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Contact.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ContactRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ContactSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Contact.objects.filter(user=self.request.user)

class TaskListCreate(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TaskRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

class UrgentUpcomingTaskList(generics.ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # Filtere Tasks, die nicht "done" sind und die PrioritÃ¤t "urgent" haben
        queryset = Task.objects.filter(
            user=user,
            priority='urgent',
        ).exclude(status='done').order_by('due_date') # Sortiere nach FÃ¤lligkeitsdatum

        return queryset
    


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """
    Endpoint for health checks.
    Returns a 200 OK status if the server is running.
    """
    return Response({'status': 'ok'}, status=status.HTTP_200_OK)

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        password = request.data.get('password')
        if password:
            instance.set_password(password) 
            instance.save() 
            return Response({'message': 'Benutzerprofil und Passwort erfolgreich aktualisiert.'})

        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)