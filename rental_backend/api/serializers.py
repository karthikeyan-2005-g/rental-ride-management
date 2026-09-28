from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Car,Booking


class CarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        fields = '__all__'


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
class BookingSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Booking
        fields = [
            'id',
            'user_id',
            'car',
            'customer_name',
            'email',
            'phone',
            'pickup_location',
            'pickup_date',
            'return_date',
            'total_price',
            'status'
        ]
        read_only_fields = ['id']
    def create(self, validated_data):
        validated_data.pop('user_id', None)
        return super().create(validated_data)