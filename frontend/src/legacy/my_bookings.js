// ==========================================
// DJANGO BACKEND
// ==========================================

const API_URL = "http://127.0.0.1:8000";

// ==========================================
// GET LOGGED-IN USER
// ==========================================

const userId = localStorage.getItem("user_id");

console.log("Logged in User ID:", userId);

const bookingContainer = document.getElementById("bookingContainer");

const noBookings = document.getElementById("noBookings");

// ==========================================
// LOAD CAR DETAILS
// ==========================================

async function getCars() {
  try {
    const response = await fetch(API_URL + "/api/cars/");

    if (!response.ok) {
      throw new Error("Failed to load cars");
    }

    return await response.json();
  } catch (error) {
    console.error("Car Error:", error);

    return [];
  }
}

// ==========================================
// LOAD BOOKINGS
// ==========================================

async function loadBookings() {
  // User not logged in

  if (!userId) {
    noBookings.classList.remove("hidden");

    bookingContainer.classList.add("hidden");

    return;
  }

  try {
    // Get user bookings

    const response = await fetch(
      API_URL + "/api/bookings/user/" + userId + "/",
    );

    if (!response.ok) {
      throw new Error("Failed to load bookings");
    }

    const bookings = await response.json();

    // ==========================================
    // REMOVE CANCELLED BOOKINGS
    // ==========================================

    const activeBookings = bookings.filter(function (booking) {
      return booking.status !== "Cancelled";
    });

    // ==========================================
    // NO ACTIVE BOOKINGS
    // ==========================================

    if (activeBookings.length === 0) {
      noBookings.classList.remove("hidden");

      bookingContainer.classList.add("hidden");

      bookingContainer.innerHTML = "";

      return;
    }

    // ==========================================
    // SHOW BOOKINGS
    // ==========================================

    noBookings.classList.add("hidden");

    bookingContainer.classList.remove("hidden");

    bookingContainer.innerHTML = "";

    // ==========================================
    // GET CAR DATA
    // ==========================================

    const cars = await getCars();

    // ==========================================
    // DISPLAY EACH BOOKING
    // ==========================================

    activeBookings.forEach(function (booking) {
      // Find car using booking.car ID

      const car = cars.find(function (carItem) {
        return carItem.id === booking.car;
      });

      const carName = car ? car.name : "Car ID: " + booking.car;

      const bookingCard = document.createElement("div");

      bookingCard.className = "bg-white rounded-xl shadow-md p-6";

      bookingCard.innerHTML = `

                            <div class="flex flex-col
                                        md:flex-row
                                        justify-between
                                        gap-6">


                                <div>

                                    <h2 class="text-2xl
                                               font-bold
                                               text-gray-800">

                                        ${carName}

                                    </h2>


                                    <p class="text-gray-500 mt-1">

                                        Booking ID:
                                        #${booking.id}

                                    </p>

                                </div>



                                <div>

                                    <span class="bg-green-100
                                                 text-green-700
                                                 px-4 py-2
                                                 rounded-full
                                                 text-sm
                                                 font-semibold">

                                        ${booking.status}

                                    </span>

                                </div>

                            </div>



                            <!-- Booking Details -->

                            <div class="grid
                                        grid-cols-1
                                        md:grid-cols-2
                                        lg:grid-cols-4
                                        gap-6 mt-6">


                                <!-- Pickup Date -->

                                <div>

                                    <p class="text-gray-500 text-sm">

                                        Pickup Date

                                    </p>


                                    <p class="font-semibold
                                              text-gray-800">

                                        ${booking.pickup_date}

                                    </p>

                                </div>



                                <!-- Return Date -->

                                <div>

                                    <p class="text-gray-500 text-sm">

                                        Return Date

                                    </p>


                                    <p class="font-semibold
                                              text-gray-800">

                                        ${booking.return_date}

                                    </p>

                                </div>



                                <!-- Pickup Location -->

                                <div>

                                    <p class="text-gray-500 text-sm">

                                        Pickup Location

                                    </p>


                                    <p class="font-semibold
                                              text-gray-800">

                                        ${
                                          booking.pickup_location ||
                                          "Not available"
                                        }

                                    </p>

                                </div>



                                <!-- Total Amount -->

                                <div>

                                    <p class="text-gray-500 text-sm">

                                        Total Amount

                                    </p>


                                    <p class="font-bold
                                              text-blue-600
                                              text-lg">

                                        ₹${Number(
                                          booking.total_price || 0,
                                        ).toLocaleString("en-IN")}

                                    </p>

                                </div>

                            </div>



                            <!-- Customer Details -->

                            <div class="border-t
                                        mt-6
                                        pt-4">


                                <p class="text-gray-500 text-sm">

                                    Customer

                                </p>


                                <p class="font-semibold">

                                    ${booking.customer_name || "Customer"}

                                </p>


                                <p class="text-gray-500
                                          text-sm mt-1">

                                    ${booking.email || ""}

                                </p>


                                <p class="text-gray-500
                                          text-sm mt-1">

                                    ${booking.phone || ""}

                                </p>

                            </div>



                            <!-- Booking Actions -->

                            <div class="mt-5 flex flex-wrap gap-3">

                                <button
                                    onclick="toggleEditBooking(${booking.id})"
                                    class="bg-blue-600
                                           text-white
                                           px-6 py-3
                                           rounded-lg
                                           hover:bg-blue-700
                                           font-semibold
                                           transition">

                                    Edit Booking

                                </button>

                                <button
                                    onclick="cancelBooking(${booking.id})"
                                    class="bg-red-600
                                           text-white
                                           px-6 py-3
                                           rounded-lg
                                           hover:bg-red-700
                                           font-semibold
                                           transition">

                                    Cancel Booking

                                </button>

                            </div>

                        `;
      const editForm = document.createElement("form");

      editForm.id = "edit-booking-" + booking.id;
      editForm.className =
        "hidden mt-6 border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-4";
      editForm.innerHTML = `
                            <label class="text-sm font-medium text-gray-700">
                                Name
                                <input name="customer_name" type="text" required maxlength="100"
                                       class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2">
                            </label>
                            <label class="text-sm font-medium text-gray-700">
                                Email
                                <input name="email" type="email" required maxlength="254"
                                       class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2">
                            </label>
                            <label class="text-sm font-medium text-gray-700">
                                Phone number
                                <input name="phone" type="tel" required pattern="[0-9]{10}" maxlength="10"
                                       title="Enter a 10-digit phone number"
                                       class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2">
                            </label>
                            <label class="text-sm font-medium text-gray-700">
                                Pickup location
                                <input name="pickup_location" type="text" required maxlength="200"
                                       class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2">
                            </label>
                            <label class="text-sm font-medium text-gray-700">
                                Pickup date
                                <input name="pickup_date" type="date" required
                                       class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2">
                            </label>
                            <label class="text-sm font-medium text-gray-700">
                                Return date
                                <input name="return_date" type="date" required
                                       class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2">
                            </label>
                            <div class="md:col-span-2 flex flex-wrap gap-3">
                                <button type="submit"
                                        class="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700">
                                    Save Changes
                                </button>
                                <button type="button"
                                        onclick="toggleEditBooking(${booking.id})"
                                        class="rounded-lg bg-gray-200 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-300">
                                    Keep Current Details
                                </button>
                            </div>
                        `;

      editForm.elements.customer_name.value = booking.customer_name || "";
      editForm.elements.email.value = booking.email || "";
      editForm.elements.phone.value = booking.phone || "";
      editForm.elements.pickup_location.value = booking.pickup_location || "";
      editForm.elements.pickup_date.value = booking.pickup_date || "";
      editForm.elements.return_date.value = booking.return_date || "";
      editForm.addEventListener("submit", function (event) {
        updateBooking(event, booking.id, editForm);
      });
      bookingCard.appendChild(editForm);

      bookingContainer.appendChild(bookingCard);
    });
  } catch (error) {
    console.error("Booking Error:", error);

    noBookings.classList.remove("hidden");

    bookingContainer.classList.add("hidden");
  }
}

// ==========================================
// CUSTOM CONFIRMATION MODAL
// ==========================================

function toggleEditBooking(bookingId) {
  const editForm = document.getElementById("edit-booking-" + bookingId);

  editForm.classList.toggle("hidden");
}

async function updateBooking(event, bookingId, editForm) {
  event.preventDefault();

  const saveButton = editForm.querySelector('button[type="submit"]');
  saveButton.disabled = true;
  saveButton.innerText = "Saving...";

  const formData = new FormData(editForm);
  const bookingData = Object.fromEntries(formData.entries());
  bookingData.user_id = Number(userId);

  try {
    const response = await fetch(
      API_URL + "/api/bookings/" + bookingId + "/edit/",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      },
    );
    const result = await response.json();

    if (!response.ok) {
      const message =
        result.error ||
        result.detail ||
        Object.values(result).flat().join(" ") ||
        "Failed to update booking.";
      showErrorModal(message);
      return;
    }

    showSuccessModal(
      "Booking Updated",
      "Your booking details have been updated successfully.",
    );
  } catch (error) {
    console.error("Update Booking Error:", error);
    showErrorModal("Unable to connect to Django backend.");
  } finally {
    saveButton.disabled = false;
    saveButton.innerText = "Save Changes";
  }
}

function showConfirmModal() {
  return new Promise(function (resolve) {
    const modal = document.getElementById("customModal");

    const title = document.getElementById("modalTitle");

    const message = document.getElementById("modalMessage");

    const icon = document.getElementById("modalIcon");

    const confirmBtn = document.getElementById("modalConfirmBtn");

    const cancelBtn = document.getElementById("modalCancelBtn");

    // Reset modal

    icon.innerHTML = "⚠️";

    icon.className =
      "w-16 h-16 mx-auto rounded-full " +
      "bg-red-100 " +
      "flex items-center justify-center " +
      "text-3xl mb-5";

    title.innerText = "Cancel Booking?";

    message.innerText = "Are you sure you want to cancel this booking?";

    cancelBtn.classList.remove("hidden");

    confirmBtn.className =
      "px-5 py-3 rounded-lg " +
      "bg-red-600 text-white " +
      "font-semibold " +
      "hover:bg-red-700 transition";

    confirmBtn.innerText = "Cancel Booking";

    // Show modal

    modal.classList.remove("hidden");

    modal.classList.add("flex");

    // Keep booking

    cancelBtn.onclick = function () {
      modal.classList.add("hidden");

      modal.classList.remove("flex");

      resolve(false);
    };

    // Cancel booking

    confirmBtn.onclick = function () {
      modal.classList.add("hidden");

      modal.classList.remove("flex");

      resolve(true);
    };
  });
}

// ==========================================
// CANCEL BOOKING
// ==========================================

async function cancelBooking(bookingId) {
  const confirmCancel = await showConfirmModal();

  if (!confirmCancel) {
    return;
  }

  try {
    const response = await fetch(
      API_URL + "/api/bookings/" + bookingId + "/",

      {
        method: "DELETE",
      },
    );

    const result = await response.json();

    if (response.ok) {
      showSuccessModal(
        "Booking Cancelled",
        "Your booking has been cancelled successfully.",
      );
    } else {
      showErrorModal(
        result.detail || result.error || "Failed to cancel booking.",
      );
    }
  } catch (error) {
    console.error("Cancel Error:", error);

    showErrorModal("Unable to connect to Django backend.");
  }
}

// ==========================================
// SUCCESS MODAL
// ==========================================

function showSuccessModal(titleText, messageText) {
  const modal = document.getElementById("customModal");

  const title = document.getElementById("modalTitle");

  const message = document.getElementById("modalMessage");

  const icon = document.getElementById("modalIcon");

  const confirmBtn = document.getElementById("modalConfirmBtn");

  const cancelBtn = document.getElementById("modalCancelBtn");

  // Success icon

  icon.innerHTML = "✓";

  icon.className =
    "w-16 h-16 mx-auto rounded-full " +
    "bg-green-100 text-green-600 " +
    "flex items-center justify-center " +
    "text-3xl font-bold mb-5";

  title.innerText = titleText;

  message.innerText = messageText;

  // Hide cancel button

  cancelBtn.classList.add("hidden");

  // OK button

  confirmBtn.innerText = "OK";

  confirmBtn.className =
    "px-6 py-3 rounded-lg " +
    "bg-green-600 text-white " +
    "font-semibold " +
    "hover:bg-green-700 transition";

  // Show modal

  modal.classList.remove("hidden");

  modal.classList.add("flex");

  confirmBtn.onclick = function () {
    modal.classList.add("hidden");

    modal.classList.remove("flex");

    // Reload bookings

    loadBookings();
  };
}

// ==========================================
// ERROR MODAL
// ==========================================

function showErrorModal(messageText) {
  const modal = document.getElementById("customModal");

  const title = document.getElementById("modalTitle");

  const message = document.getElementById("modalMessage");

  const icon = document.getElementById("modalIcon");

  const confirmBtn = document.getElementById("modalConfirmBtn");

  const cancelBtn = document.getElementById("modalCancelBtn");

  // Error icon

  icon.innerHTML = "✕";

  icon.className =
    "w-16 h-16 mx-auto rounded-full " +
    "bg-red-100 text-red-600 " +
    "flex items-center justify-center " +
    "text-3xl font-bold mb-5";

  title.innerText = "Something Went Wrong";

  message.innerText = messageText;

  // Hide cancel button

  cancelBtn.classList.add("hidden");

  // OK button

  confirmBtn.innerText = "OK";

  confirmBtn.className =
    "px-6 py-3 rounded-lg " +
    "bg-red-600 text-white " +
    "font-semibold " +
    "hover:bg-red-700 transition";

  // Show modal

  modal.classList.remove("hidden");

  modal.classList.add("flex");

  confirmBtn.onclick = function () {
    modal.classList.add("hidden");

    modal.classList.remove("flex");
  };
}

// ==========================================
// LOAD BOOKINGS WHEN PAGE OPENS
// ==========================================

loadBookings();
