from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_user, name='login'),
    path('register/', views.register_user, name='register'),
    path('users/', views.UserList.as_view(), name='user-list'),
    path('user/profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('contacts/', views.ContactListCreate.as_view(), name='contact-list-create'),
    path('contacts/<int:pk>/', views.ContactRetrieveUpdateDestroy.as_view(), name='contact-retrieve-update-destroy'),
    path('tasks/', views.TaskListCreate.as_view(), name='task-list-create'),
    path('tasks/<int:pk>/', views.TaskRetrieveUpdateDestroy.as_view(), name='task-retrieve-update-destroy'),
    path('urgent_tasks/', views.UrgentUpcomingTaskList.as_view(), name='urgent-upcoming-tasks'),
    path('healthcheck/', views.health_check, name='health_check'),
]