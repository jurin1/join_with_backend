from django.db import models
from django.contrib.auth.models import User
import json  # Importiere das json-Modul

class Contact(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='contacts')
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    initials = models.CharField(max_length=2, blank=True)
    bg_color = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return self.name

class Task(models.Model):
    STATUS_CHOICES = [
        ('todo', 'To Do'),
        ('progress', 'In Progress'),
        ('feedback', 'Await Feedback'),
        ('done', 'Done'),
    ]
    PRIORITY_CHOICES = [
        ('urgent', 'Urgent'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    headline = models.CharField(max_length=200)
    text = models.TextField()
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='todo')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    category = models.CharField(max_length=100, blank=True)
    contact = models.ForeignKey(Contact, on_delete=models.SET_NULL, blank=True, null=True, related_name='tasks') # ForeignKey verwenden
    subtasks_json = models.TextField(default='[]')  

    def __str__(self):
        return self.headline

    @property
    def subtasks(self):
        return json.loads(self.subtasks_json)

    @subtasks.setter
    def subtasks(self, value):
        self.subtasks_json = json.dumps(value)