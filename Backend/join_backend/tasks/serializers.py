from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Task, Contact
import json

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id', 'name', 'email', 'phone', 'initials', 'bg_color']

class TaskSerializer(serializers.ModelSerializer):
    contact = serializers.PrimaryKeyRelatedField(
        queryset=Contact.objects.all(), write_only=False, required=False, allow_null=True
    )  # Nur die ID
    #contact = ContactSerializer(read_only=True)
    subtasks = serializers.JSONField()

    class Meta:
        model = Task
        fields = ['id', 'headline', 'text', 'due_date', 'status', 'priority', 'category', 'contact', 'subtasks']

    def create(self, validated_data):
        task = Task.objects.create(**validated_data)
        return task

    def update(self, instance, validated_data):
        contact = validated_data.pop('contact', instance.contact)

        instance.headline = validated_data.get('headline', instance.headline)
        instance.text = validated_data.get('text', instance.text)
        instance.due_date = validated_data.get('due_date', instance.due_date)
        instance.status = validated_data.get('status', instance.status)
        instance.priority = validated_data.get('priority', instance.priority)
        instance.category = validated_data.get('category', instance.category)
        instance.subtasks = validated_data.get('subtasks', instance.subtasks) 
        instance.contact = contact

        instance.save()
        return instance

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', ] 
        extra_kwargs = {
            'password': {'write_only': True},
            'first_name': {'required': True}  
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name']
        )
        return user