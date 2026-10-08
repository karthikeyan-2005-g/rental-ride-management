from datetime import date

from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

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
