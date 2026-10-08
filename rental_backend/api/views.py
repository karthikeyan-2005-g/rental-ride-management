from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework.decorators import api_view
import requests

from .models import Car, Booking
from .serializers import (
    CarSerializer,
    RegisterSerializer,
    LoginSerializer,
    BookingSerializer,
    BookingUpdateSerializer,
)


class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.all()
    serializer_class = CarSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        user = authenticate(username=username, password=password)

        if user is None:
            return Response(
                {'detail': 'Invalid username or password'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        return Response(
            {
                'message': 'Login successful',
                'user_id': user.id,
                'username': user.username,
                'email': user.email
            },
            status=status.HTTP_200_OK
        )

class BookingView(generics.CreateAPIView):
    serializer_class = BookingSerializer

    def create(self, request, *args, **kwargs):

        user_id = request.data.get('user_id')
        car_id = request.data.get('car')
        pickup_date = request.data.get('pickup_date')
        return_date = request.data.get('return_date')

        # Check user
        if not user_id:
            return Response(
                {'error': 'user_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check date order
        if pickup_date and return_date:

            if pickup_date > return_date:
                return Response(
                    {
                        'error': 'Return date must be after pickup date.'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Check whether the car is already booked
        overlapping_booking = Booking.objects.filter(
            car_id=car_id,
            status='Confirmed',
            pickup_date__lte=return_date,
            return_date__gte=pickup_date
        ).exists()

        if overlapping_booking:
            return Response(
                {
                    'error': 'This car is already booked for the selected dates.'
                },
                status=status.HTTP_409_CONFLICT
            )

        # Validate booking data
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Save booking
        serializer.save(user=user)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

class CancelBookingView(generics.DestroyAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def delete(self, request, *args, **kwargs):
        booking = self.get_object()

        booking.status = 'Cancelled'
        booking.save()

        return Response(
            {
                'message': 'Booking cancelled successfully',
                'booking_id': booking.id,
                'status': booking.status
            },
            status=status.HTTP_200_OK
        )


class UpdateBookingView(generics.UpdateAPIView):
    queryset = Booking.objects.select_related('car')
    serializer_class = BookingUpdateSerializer

    def update(self, request, *args, **kwargs):
        booking = self.get_object()

        try:
            user_id = int(request.data.get('user_id'))
        except (TypeError, ValueError):
            return Response(
                {'error': 'user_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if booking.user_id != user_id:
            return Response(
                {'error': 'You can only edit your own bookings.'},
                status=status.HTTP_403_FORBIDDEN
            )

        if booking.status != 'Confirmed':
            return Response(
                {'error': 'Only confirmed bookings can be edited.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        data = request.data.copy()
        data.pop('user_id', None)
        serializer = self.get_serializer(
            booking,
            data=data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)

        pickup_date = serializer.validated_data.get(
            'pickup_date',
            booking.pickup_date
        )
        return_date = serializer.validated_data.get(
            'return_date',
            booking.return_date
        )
        overlapping_booking = Booking.objects.filter(
            car_id=booking.car_id,
            status='Confirmed',
            pickup_date__lte=return_date,
            return_date__gte=pickup_date
        ).exclude(pk=booking.pk).exists()

        if overlapping_booking:
            return Response(
                {
                    'error': (
                        'This car is already booked for the selected dates.'
                    )
                },
                status=status.HTTP_409_CONFLICT
            )

        total_days = (return_date - pickup_date).days
        serializer.save(
            total_price=booking.car.price_per_day * total_days
        )

        return Response(serializer.data)


class UserBookingsView(generics.ListAPIView):
    serializer_class = BookingSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']

        return Booking.objects.filter(
            user_id=user_id
        ).select_related('car')


@api_view(['POST'])
def chatbot(request):
    user_message = request.data.get('message')

    response = requests.post(
        'http://localhost:11434/api/generate',
        json={
            'model': 'llama3.2:3b',
            'prompt': user_message,
            'stream': False
        }
    )

    result = response.json()

    return Response({
        'reply': result['response']
    })

    