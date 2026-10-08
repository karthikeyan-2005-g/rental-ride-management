# Rental Car Project

A small rental-car booking application with a static HTML/JavaScript frontend and a Django REST Framework API.

## Project structure

```text
.
├── index.html                 # Landing page
├── frontend/                  # Static pages and browser-side JavaScript
│   ├── cars.html
│   ├── booking.html
│   ├── login.html
│   ├── resiter.html           # Registration page (filename as currently named)
│   ├── my_bookings.html
│   ├── contact_support.html   # Chatbot interface
│   ├── auth-nav.js
│   └── images/
├── manage.py
└── rental_backend/
    ├── settings.py
    ├── urls.py
    └── api/
        ├── models.py
        ├── serializers.py
        ├── views.py
        ├── urls.py
        └── migrations/
```

The Django API is mounted at `/api/`; the Django project also exposes the Django admin at `/admin/`. The HTML pages are separate static files and are not served by Django templates.

## Requirements

- Python and the dependencies used by the backend:
  - Django
  - Django REST Framework
  - django-cors-headers
  - mysqlclient
  - requests
- A running MySQL server and a database named `rental_car_db`.
- Node.js is optional; it can be used to check the frontend JavaScript syntax.
- The chatbot page additionally expects an Ollama server at `http://localhost:11434` with the `llama3.2:3b` model available.

There is currently no dependency lockfile or `requirements.txt` in the project. Install the packages into your chosen virtual environment, for example:

```powershell
python -m pip install Django djangorestframework django-cors-headers mysqlclient requests
```

## Local setup

1. Create and activate a Python virtual environment if you do not already have one:

   ```powershell
   py -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

2. Install the backend dependencies listed above.

3. Create a MySQL database:

   ```sql
   CREATE DATABASE rental_car_db;
   ```

4. Configure the database connection in `rental_backend/settings.py`. The current configuration uses MySQL on `localhost:3306` and the `root` account. Replace those development values with credentials valid for your local database.

5. Apply migrations and start Django:

   ```powershell
   python manage.py migrate
   python manage.py runserver
   ```

   The API is then available at `http://127.0.0.1:8000/api/`.

6. Open `index.html` in a browser, or serve the project directory with a local static-file server and open the page from that server. Frontend scripts currently call the API at `http://127.0.0.1:8000`, so the backend must be running at that address unless those URLs are changed.

For admin access, create an administrator account and visit `http://127.0.0.1:8000/admin/`:

```powershell
python manage.py createsuperuser
```

## Data model

### Car

Cars have a name, brand, model, type, seat count, transmission, daily price, optional image path/URL, and an `available` flag. The API serializer exposes all model fields.

### Booking

A booking belongs to a Django user and a car. It stores customer name, email, phone, pickup location, pickup and return dates, total price, and status. Status is `Confirmed` by default and can also be `Cancelled`.

The current booking endpoint checks whether another confirmed booking exists for the same car and pickup location over overlapping dates. It rejects a pickup date later than the return date.

## API reference

All endpoints below are relative to `http://127.0.0.1:8000/api/`. Requests and responses use JSON unless otherwise noted.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/cars/` | List cars |
| `POST` | `/cars/` | Create a car |
| `POST` | `/register/` | Create a user |
| `POST` | `/login/` | Authenticate a username and password |
| `POST` | `/bookings/` | Create a booking |
| `GET` | `/bookings/user/{user_id}/` | List bookings for a user |
| `PATCH` | `/bookings/{id}/edit/` | Edit a confirmed booking's contact details, pickup location, and dates |
| `DELETE` | `/bookings/{id}/` | Mark a booking as cancelled |
| `POST` | `/chatbot/` | Ask the local Ollama chatbot |

The booking edit request must include the booking owner's `user_id` and may include any of `customer_name`, `email`, `phone`, `pickup_location`, `pickup_date`, and `return_date`. The server validates the date range and booking overlap, then recalculates the total using the car's daily price. It returns `403 Forbidden` for a different user, `400 Bad Request` for invalid dates or cancelled bookings, and `409 Conflict` for an overlapping reservation.

### Example: create a car

```json
{
  "name": "City Sedan",
  "brand": "Example",
  "model": "2025",
  "type": "Sedan",
  "seats": 5,
  "transmission": "Automatic",
  "price_per_day": "2500.00",
  "image": "",
  "available": true
}
```

### Example: register

```json
{
  "username": "renter1",
  "email": "renter1@example.com",
  "password": "choose-a-password"
}
```

### Example: login

```json
{
  "username": "renter1",
  "password": "choose-a-password"
}
```

Successful login returns a message and the user's `user_id`, `username`, and `email`. The current implementation does not issue an authentication token or use a server-side login session.

### Example: create a booking

Dates should be sent as ISO dates (`YYYY-MM-DD`).

```json
{
  "user_id": 1,
  "car": 1,
  "customer_name": "Renter One",
  "email": "renter1@example.com",
  "phone": "555-0100",
  "pickup_location": "Downtown",
  "pickup_date": "2026-11-01",
  "return_date": "2026-11-03",
  "total_price": "5000.00"
}
```

The booking endpoint responds with `201 Created` on success, `400 Bad Request` for invalid input or date order, `404 Not Found` if the supplied user does not exist, and `409 Conflict` when its overlap check finds a conflicting confirmed booking.

### Example: chatbot

```json
{
  "message": "What cars are available?"
}
```

The endpoint forwards the message to the local Ollama generation API and returns its reply. It requires Ollama and the configured model to be running locally.

## Frontend behavior

- `index.html` links into the car-listing and login pages.
- `cars.html` loads the car list from the API and links to booking.
- `booking.html` submits booking details to the API.
- `login.html` and `resiter.html` use the login and registration endpoints.
- `my_bookings.html` loads a user's bookings and supports editing confirmed bookings and cancelling them.
- `contact_support.html` sends messages to the chatbot endpoint.
- `auth-nav.js` uses browser `localStorage` keys `user_id`, `user_name`, and `user_email` to update the login/logout navigation and gate pages marked as requiring login. This is client-side navigation state, not API authorization.

## Checks and tests

Run Django's built-in test discovery:

```powershell
python manage.py test
```

Run Django configuration checks and verify that migrations match the models:

```powershell
python manage.py check
python manage.py makemigrations --check --dry-run
```

The API includes automated tests for booking edits, ownership checks, invalid date ranges, overlap conflicts, and price recalculation.

## Development configuration notes

- `rental_backend/settings.py` currently has development settings, including `DEBUG = True`, a configured secret key, MySQL credentials, and `CORS_ALLOW_ALL_ORIGINS = True`. Review and replace these before deployment; keep secrets outside source control.
- Frontend API addresses are hard-coded to `127.0.0.1:8000`.
- Browser-side login state is stored in `localStorage`; it should not be treated as secure authentication or access control.
- The chatbot endpoint expects an external local Ollama service, which is not started by Django.
