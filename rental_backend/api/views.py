from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
import logging
import requests

from .models import Car, Booking
from .serializers import (
    CarSerializer,
    RegisterSerializer,
    LoginSerializer,
    BookingSerializer,
    BookingUpdateSerializer,
)

logger = logging.getLogger(__name__)


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

    if not isinstance(user_message, str) or not user_message.strip():
        return Response(
            {'error': 'Please enter a message.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        response = requests.post(
            'http://localhost:11434/api/generate',
            json={
                'model': settings.OLLAMA_MODEL,
                'prompt': user_message.strip(),
                'stream': False
            },
            timeout=(3.05, 90)
        )
        response.raise_for_status()
        result = response.json()
    except requests.HTTPError as exc:
        logger.error(
            'Ollama returned HTTP %s while generating a reply: %s',
            exc.response.status_code if exc.response else 'unknown',
            exc.response.text[:1000] if exc.response else str(exc)
        )
        return Response(
            {
                'error': (
                    f'Ollama could not generate a reply using '
                    f'{settings.OLLAMA_MODEL}. Check Ollama for model '
                    'loading errors; the model may need more available '
                    'memory. Try a smaller model if needed.'
                )
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    except requests.Timeout:
        logger.warning('Ollama chatbot request timed out')
        return Response(
            {
                'error': (
                    'AI support timed out. Check that Ollama is running '
                    f'and the {settings.OLLAMA_MODEL} model can load with '
                    'available memory.'
                )
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    except requests.RequestException:
        logger.exception('Ollama chatbot request failed')
        return Response(
            {
                'error': (
                    'AI support is unavailable. Check that Ollama is running '
                    'at localhost:11434 and that '
                    f'{settings.OLLAMA_MODEL} is installed.'
                )
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    except ValueError:
        logger.exception('Ollama returned invalid JSON')
        return Response(
            {'error': 'AI support returned an invalid response.'},
            status=status.HTTP_502_BAD_GATEWAY
        )

    reply = result.get('response') if isinstance(result, dict) else None
    if not isinstance(reply, str) or not reply.strip():
        logger.error('Ollama response did not include generated text: %r', result)
        return Response(
            {
                'error': (
                    'Ollama could not generate a reply. Check the model '
                    'output and available memory.'
                )
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )

    return Response({
        'reply': reply
    })

    