from django.urls import path
from .import views
from .views import CarViewSet, RegisterView

urlpatterns = [
    path('cars/', CarViewSet.as_view({
        'get': 'list',
        'post': 'create',
    })),

    path('register/', RegisterView.as_view()),

    path('login/', views.LoginView.as_view(), name='login'),

    path('chatbot/', views.chatbot, name='chatbot'),
    
    path('bookings/', views.BookingView.as_view(), name='bookings'),

    path(
        'bookings/user/<int:user_id>/',
        views.UserBookingsView.as_view(),
        name='user-bookings'
    ),
    path(
    'bookings/<int:pk>/',
    views.CancelBookingView.as_view(),
    name='cancel-booking'
),
]