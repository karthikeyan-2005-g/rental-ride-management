from datetime import date
from unittest.mock import Mock, patch

from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
import requests

from .models import Booking, Car


class UpdateBookingTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='renter',
            password='test-password'
        )
        self.other_user = User.objects.create_user(
            username='another-renter',
            password='test-password'
        )
        self.car = Car.objects.create(
            name='Test Car',
            brand='Test',
            model='Model',
            type='Sedan',
            seats=5,
            transmission='Automatic',
            price_per_day='125.50'
        )
        self.booking = Booking.objects.create(
            user=self.user,
            car=self.car,
            customer_name='Original Name',
            email='original@example.com',
            phone='1234567890',
            pickup_location='Original Location',
            pickup_date=date(2026, 11, 1),
            return_date=date(2026, 11, 3),
            total_price='251.00'
        )
        self.url = reverse(
            'update-booking',
            kwargs={'pk': self.booking.pk}
        )

    def test_owner_can_edit_booking_and_total_is_recalculated(self):
        response = self.client.patch(
            self.url,
            {
                'user_id': self.user.pk,
                'customer_name': 'Updated Name',
                'email': 'updated@example.com',
                'phone': '0987654321',
                'pickup_location': 'New Location',
                'pickup_date': '2026-11-10',
                'return_date': '2026-11-13',
            },
            format='json'
        )

        self.booking.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.booking.customer_name, 'Updated Name')
        self.assertEqual(self.booking.email, 'updated@example.com')
        self.assertEqual(self.booking.phone, '0987654321')
        self.assertEqual(self.booking.pickup_location, 'New Location')
        self.assertEqual(self.booking.pickup_date, date(2026, 11, 10))
        self.assertEqual(self.booking.return_date, date(2026, 11, 13))
        self.assertEqual(str(self.booking.total_price), '376.50')

    def test_non_owner_cannot_edit_booking(self):
        response = self.client.patch(
            self.url,
            {
                'user_id': self.other_user.pk,
                'customer_name': 'Not Allowed',
            },
            format='json'
        )

        self.booking.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(self.booking.customer_name, 'Original Name')

    def test_return_date_must_be_after_pickup_date(self):
        response = self.client.patch(
            self.url,
            {
                'user_id': self.user.pk,
                'pickup_date': '2026-11-12',
                'return_date': '2026-11-12',
            },
            format='json'
        )

        self.booking.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(self.booking.pickup_date, date(2026, 11, 1))

    def test_edit_is_rejected_when_it_overlaps_another_booking(self):
        Booking.objects.create(
            user=self.other_user,
            car=self.car,
            customer_name='Other Renter',
            email='other@example.com',
            phone='1111111111',
            pickup_location='Different Location',
            pickup_date=date(2026, 11, 12),
            return_date=date(2026, 11, 14),
            total_price='251.00'
        )

        response = self.client.patch(
            self.url,
            {
                'user_id': self.user.pk,
                'pickup_location': 'New Location',
                'pickup_date': '2026-11-10',
                'return_date': '2026-11-13',
            },
            format='json'
        )

        self.booking.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(self.booking.pickup_location, 'Original Location')


class ChatbotTests(APITestCase):
    url = '/api/chatbot/'

    @patch('rental_backend.api.views.requests.post')
    def test_chatbot_returns_ollama_reply(self, post):
        ollama_response = Mock()
        ollama_response.json.return_value = {'response': 'Hello there'}
        post.return_value = ollama_response

        response = self.client.post(
            self.url,
            {'message': '  Hello  '},
            format='json'
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'reply': 'Hello there'})
        self.assertEqual(
            post.call_args.kwargs['json']['prompt'],
            'Hello'
        )
        self.assertEqual(post.call_args.kwargs['timeout'], (3.05, 90))

    @patch('rental_backend.api.views.requests.post')
    def test_chatbot_reports_ollama_memory_error(self, post):
        ollama_response = Mock()
        ollama_response.status_code = 500
        ollama_response.text = '{"error":"not enough memory"}'
        ollama_response.raise_for_status.side_effect = requests.HTTPError(
            'Ollama could not allocate memory',
            response=ollama_response
        )
        post.return_value = ollama_response

        response = self.client.post(
            self.url,
            {'message': 'Hello'},
            format='json'
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_503_SERVICE_UNAVAILABLE
        )
        self.assertIn('llama3.2:3b', response.data['error'])
        self.assertIn('available memory', response.data['error'])

    @patch('rental_backend.api.views.requests.post')
    def test_chatbot_reports_model_error_response(self, post):
        ollama_response = Mock()
        ollama_response.json.return_value = {
            'error': 'model failed to allocate memory'
        }
        post.return_value = ollama_response

        response = self.client.post(
            self.url,
            {'message': 'Hello'},
            format='json'
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_503_SERVICE_UNAVAILABLE
        )
        self.assertIn('available memory', response.data['error'])

    @patch('rental_backend.api.views.requests.post')
    def test_chatbot_reports_connection_error(self, post):
        post.side_effect = requests.ConnectionError('Ollama is offline')

        with self.assertLogs(
            'rental_backend.api.views',
            level='ERROR'
        ) as logs:
            response = self.client.post(
                self.url,
                {'message': 'Hello'},
                format='json'
            )

        self.assertEqual(
            response.status_code,
            status.HTTP_503_SERVICE_UNAVAILABLE
        )
        self.assertIn('Ollama is running', response.data['error'])
        self.assertIn('Ollama is offline', logs.output[0])

    def test_chatbot_rejects_empty_message(self):
        response = self.client.post(
            self.url,
            {'message': '   '},
            format='json'
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
