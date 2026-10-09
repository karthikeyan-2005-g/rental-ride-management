// =====================================================
// DJANGO API URL
// =====================================================

const API_URL = "http://127.0.0.1:8000";

const CARS_API = API_URL + "/api/cars/";

const BOOKINGS_API = API_URL + "/api/bookings/";

// =====================================================
// GET CAR ID FROM URL
// =====================================================

const urlParams = new URLSearchParams(window.location.search);

const carId = urlParams.get("car_id");

// =====================================================
// GET HTML ELEMENTS
// =====================================================

const carNameElement = document.getElementById("carName");

const carPriceElement = document.getElementById("carPrice");

const summaryCar = document.getElementById("summaryCar");

const summaryPrice = document.getElementById("summaryPrice");

const pickupDate = document.getElementById("pickupDate");

const returnDate = document.getElementById("returnDate");

const totalDays = document.getElementById("totalDays");

const totalAmount = document.getElementById("totalAmount");

const confirmButton = document.getElementById("confirmButton");

const bookingErrorModal = document.getElementById("bookingErrorModal");

const bookingErrorTitle = document.getElementById("bookingErrorTitle");

const bookingErrorMessage = document.getElementById("bookingErrorMessage");

function closeBookingError() {
  bookingErrorModal.classList.add("hidden");
}

function showBookingError(title, message) {
  bookingErrorTitle.textContent = title;
  bookingErrorMessage.textContent = message;
  bookingErrorModal.classList.remove("hidden");
  document.getElementById("closeBookingError").focus();
}

document
  .getElementById("closeBookingError")
  .addEventListener("click", closeBookingError);

document
  .getElementById("changeBookingDates")
  .addEventListener("click", function () {
    closeBookingError();
    pickupDate.focus();
  });

document.addEventListener("keydown", function (event) {
  if (
    event.key === "Escape" &&
    !bookingErrorModal.classList.contains("hidden")
  ) {
    closeBookingError();
  }
});

// =====================================================
// CAR VARIABLES
// =====================================================

let selectedCar = null;

let carName = "";

let carPrice = 0;

// =====================================================
// LOAD CAR DETAILS
// =====================================================

async function loadCarDetails() {
  if (!carId) {
    carNameElement.innerText = "Car not selected";

    summaryCar.innerText = "No car selected";

    alert("Car ID missing. Please select a car again.");

    return;
  }

  try {
    // Get all cars from Django

    const response = await fetch(CARS_API);

    if (!response.ok) {
      throw new Error("Failed to load cars");
    }

    const cars = await response.json();

    // Find selected car

    selectedCar = cars.find(function (car) {
      return String(car.id) === String(carId);
    });

    // Car not found

    if (!selectedCar) {
      carNameElement.innerText = "Car not found";

      summaryCar.innerText = "Car not found";

      alert("Selected car was not found.");

      return;
    }

    // Get car details

    carName = selectedCar.name;

    carPrice = Number(selectedCar.price_per_day);

    // Display car name

    carNameElement.innerText = carName;

    summaryCar.innerText = carName;

    // Display price

    carPriceElement.innerText = "₹" + carPrice.toLocaleString("en-IN");

    summaryPrice.innerText = "₹" + carPrice.toLocaleString("en-IN");
  } catch (error) {
    console.error("Car Loading Error:", error);

    carNameElement.innerText = "Unable to load car";

    summaryCar.innerText = "Error";

    alert("Cannot connect to Django backend. Please start Django server.");
  }
}

// Load selected car

loadCarDetails();

// =====================================================
// MINIMUM DATE
// =====================================================

const today = new Date().toISOString().split("T")[0];

pickupDate.min = today;

returnDate.min = today;

// =====================================================
// PICKUP DATE CHANGE
// =====================================================

pickupDate.addEventListener("change", function () {
  returnDate.min = pickupDate.value;

  calculateTotal();
});

// =====================================================
// RETURN DATE CHANGE
// =====================================================

returnDate.addEventListener("change", function () {
  calculateTotal();
});

// =====================================================
// CALCULATE TOTAL
// =====================================================

function calculateTotal() {
  if (!pickupDate.value || !returnDate.value) {
    totalDays.innerText = "0";

    totalAmount.innerText = "₹0";

    return;
  }

  const pickup = new Date(pickupDate.value);

  const returnDay = new Date(returnDate.value);

  const difference = returnDay - pickup;

  const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

  if (days > 0) {
    totalDays.innerText = days;

    const total = days * carPrice;

    totalAmount.innerText = "₹" + total.toLocaleString("en-IN");
  } else {
    totalDays.innerText = "0";

    totalAmount.innerText = "₹0";
  }
}

// =====================================================
// BOOKING FORM SUBMIT
// =====================================================

document
  .getElementById("bookingForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    // =================================================
    // CHECK CAR
    // =================================================

    if (!selectedCar) {
      alert("Car details are not loaded yet.");

      return;
    }

    // =================================================
    // GET USER ID
    // =================================================

    const userId = localStorage.getItem("user_id");

    // User not logged in

    if (!userId) {
      alert("Please login before booking.");

      window.location.href = "./login.html";

      return;
    }

    // =================================================
    // GET FORM VALUES
    // =================================================

    const customerName = document.getElementById("customerName").value.trim();

    const email = document.getElementById("email").value.trim();

    const phone = document.getElementById("phone").value.trim();

    const pickupLocation = document.getElementById("pickupLocation").value;

    // =================================================
    // VALIDATE PHONE
    // =================================================

    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit phone number.");

      return;
    }

    // =================================================
    // VALIDATE DATES
    // =================================================

    if (!pickupDate.value || !returnDate.value) {
      alert("Please select pickup and return dates.");

      return;
    }

    const pickup = new Date(pickupDate.value);

    const returnDay = new Date(returnDate.value);

    if (returnDay <= pickup) {
      alert("Return date must be after pickup date.");

      return;
    }

    // =================================================
    // CALCULATE RENTAL DAYS
    // =================================================

    const difference = returnDay - pickup;

    const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

    // =================================================
    // CALCULATE TOTAL
    // =================================================

    const totalPrice = days * carPrice;

    // =================================================
    // DJANGO BOOKING DATA
    // =================================================

    const bookingData = {
      user_id: Number(userId),

      car: Number(carId),

      customer_name: customerName,

      email: email,

      phone: phone,

      pickup_location: pickupLocation,

      pickup_date: pickupDate.value,

      return_date: returnDate.value,

      total_price: totalPrice.toFixed(2),

      status: "Confirmed",
    };

    // Console check

    console.log("Django Booking Data:", bookingData);

    // =================================================
    // DISABLE BUTTON
    // =================================================

    confirmButton.disabled = true;

    confirmButton.innerText = "Processing...";

    // =================================================
    // SEND TO DJANGO
    // =================================================

    try {
      const response = await fetch(BOOKINGS_API, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      console.log("Django Booking Response:", result);

      // =================================================
      // SUCCESS
      // =================================================

      if (response.ok) {
        document.getElementById("successCar").innerText =
          carName + " - Booking Confirmed";

        document.getElementById("successMessage").classList.remove("hidden");
      }

      // =================================================
      // ERROR
      // =================================================
      else {
        console.error("Booking failed:", result);

        if (response.status === 409) {
          showBookingError(
            "Car unavailable for these dates",
            "This car is already booked for your selected dates and pickup location. Please choose different dates or browse other available cars.",
          );
        } else {
          const errorMessage =
            result.error ||
            result.detail ||
            "Please review your booking details and try again.";

          showBookingError(
            "Unable to complete booking",
            typeof errorMessage === "string"
              ? errorMessage
              : JSON.stringify(errorMessage),
          );
        }

        confirmButton.disabled = false;

        confirmButton.innerText = "Confirm Booking";
      }
    } catch (error) {
      console.error("Booking Error:", error);

      showBookingError(
        "Booking service unavailable",
        "We couldn't reach the booking service. Please check your connection and try again.",
      );

      confirmButton.disabled = false;

      confirmButton.innerText = "Confirm Booking";
    }
  });

// =====================================================
// GO TO CARS
// =====================================================

function goToCars() {
  window.location.href = "cars.html";
}

// =====================================================
// GO TO MY BOOKINGS
// =====================================================

function goToBookings() {
  window.location.href = "my_bookings.html";
}
