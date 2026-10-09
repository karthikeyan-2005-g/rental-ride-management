import { useLegacyPage } from "../useLegacyPage.js";
import pageScript from "../legacy/booking.js?raw";

export default function Booking() {
  useLegacyPage(
    {
      title: "Book Car - RentalCars",
      bodyClass: "bg-gray-50 text-gray-900",
      requiresLogin: true,
    },
    pageScript,
  );

  return (
    <>
      <nav className="bg-gray-950 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-20 flex items-center justify-between">
            <a href="../index.html" className="text-2xl font-bold">
              🚗 RentalCars
            </a>

            <div className="flex gap-6">
              <a href="../index.html" className="hover:text-green-400">
                Home
              </a>

              <a href="./cars.html" className="hover:text-green-400">
                Cars
              </a>

              <a href="./my_bookings.html" className="hover:text-green-400">
                My Bookings
              </a>
              <a
                href="./contact_support.html"
                className="hover:text-green-400 transition"
              >
                Contact & Support
              </a>

              <a
                href="./login.html"
                data-auth-control=""
                data-login-url="./login.html"
                className="hover:text-green-400"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8">Book Your Car</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow p-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Selected Car</h2>

              <div className="bg-gray-100 rounded-lg p-5">
                <h3 id="carName" className="text-2xl font-bold">
                  Loading car...
                </h3>

                <p
                  id="carPrice"
                  className="text-green-600 text-xl font-semibold mt-2"
                >
                  ₹0
                </p>
              </div>
            </div>

            <form id="bookingForm">
              <div className="mb-5">
                <label
                  htmlFor="customerName"
                  className="block font-medium mb-2"
                >
                  Customer Name
                </label>

                <input
                  type="text"
                  id="customerName"
                  required
                  autoComplete="name"
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your name"
                />
              </div>

              <div className="mb-5">
                <label htmlFor="email" className="block font-medium mb-2">
                  Email
                </label>

                <input
                  type="email"
                  id="email"
                  required
                  autoComplete="email"
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your email"
                />
              </div>

              <div className="mb-5">
                <label htmlFor="phone" className="block font-medium mb-2">
                  Phone Number
                </label>

                <input
                  type="tel"
                  id="phone"
                  required
                  autoComplete="tel"
                  pattern="[0-9]{10}"
                  maxLength="10"
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter 10-digit phone number"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label
                    htmlFor="pickupDate"
                    className="block font-medium mb-2"
                  >
                    Pickup Date
                  </label>

                  <input
                    type="date"
                    id="pickupDate"
                    required
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="returnDate"
                    className="block font-medium mb-2"
                  >
                    Return Date
                  </label>

                  <input
                    type="date"
                    id="returnDate"
                    required
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="pickupLocation"
                  className="block font-medium mb-2"
                >
                  Pickup Location
                </label>

                <select
                  id="pickupLocation"
                  required
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Location</option>

                  <option value="Chennai">Chennai</option>

                  <option value="Coimbatore">Coimbatore</option>

                  <option value="Madurai">Madurai</option>

                  <option value="Trichy">Trichy</option>

                  <option value="Salem">Salem</option>
                </select>
              </div>

              <button
                type="submit"
                id="confirmButton"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg transition"
              >
                Confirm Booking
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow p-8 h-fit">
            <h2 className="text-xl font-bold mb-6">Booking Summary</h2>

            <div className="flex justify-between border-b pb-4 mb-4">
              <span className="text-gray-600">Car</span>

              <span id="summaryCar" className="font-semibold text-right">
                Loading...
              </span>
            </div>

            <div className="flex justify-between border-b pb-4 mb-4">
              <span className="text-gray-600">Price / Day</span>

              <span id="summaryPrice" className="font-semibold">
                ₹0
              </span>
            </div>

            <div className="flex justify-between border-b pb-4 mb-4">
              <span className="text-gray-600">Rental Days</span>

              <span id="totalDays" className="font-semibold">
                0
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-lg font-bold">Total Amount</span>

              <span
                id="totalAmount"
                className="text-xl font-bold text-green-600"
              >
                ₹0
              </span>
            </div>
          </div>
        </div>
      </main>

      <div
        id="successMessage"
        className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4"
      >
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">✅</div>

          <h2 className="text-2xl font-bold mb-3">Booking Confirmed!</h2>

          <p id="successCar" className="text-gray-600 mb-6"></p>

          <button
            onClick={() => {
              window.goToBookings();
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
          >
            View My Bookings
          </button>

          <button
            onClick={() => {
              window.goToCars();
            }}
            className="w-full mt-3 border border-gray-300 hover:bg-gray-100 py-3 rounded-lg font-semibold"
          >
            Back to Cars
          </button>
        </div>
      </div>

      <div
        id="bookingErrorModal"
        className="hidden fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="bookingErrorTitle"
        aria-describedby="bookingErrorMessage"
      >
        <div className="relative w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl">
          <button
            id="closeBookingError"
            type="button"
            aria-label="Close message"
            className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <span aria-hidden="true" className="text-2xl leading-none">
              ×
            </span>
          </button>

          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <span aria-hidden="true" className="text-3xl font-bold">
              !
            </span>
          </div>

          <h2
            id="bookingErrorTitle"
            className="text-2xl font-bold text-gray-900"
          >
            Unable to complete booking
          </h2>

          <p
            id="bookingErrorMessage"
            className="mt-3 leading-relaxed text-gray-600"
          ></p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              id="changeBookingDates"
              type="button"
              className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Change dates
            </button>
            <button
              type="button"
              onClick={() => {
                window.goToCars();
              }}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Browse other cars
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
