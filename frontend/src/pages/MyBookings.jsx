import { useLegacyPage } from "../useLegacyPage.js";
import pageScript from "../legacy/my_bookings.js?raw";

export default function MyBookings() {
  useLegacyPage(
    {
      title: "My Bookings - RentalCars",
      bodyClass: "bg-gray-100 min-h-screen",
      requiresLogin: false,
    },
    pageScript,
  );

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4\n                    flex justify-between items-center">
          <a href="../index.html" className="text-2xl font-bold text-blue-600">
            🚗 CarRental
          </a>

          <div className="flex gap-6 items-center">
            <a
              href="../index.html"
              className="text-gray-700 hover:text-blue-600"
            >
              Home
            </a>

            <a href="./cars.html" className="text-gray-700 hover:text-blue-600">
              Cars
            </a>

            <a
              href="./my_bookings.html"
              className="text-blue-600 font-semibold"
            >
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
              className="text-gray-700 hover:text-blue-600"
            >
              Login
            </a>
          </div>
        </div>
      </nav>

      <section className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold">My Bookings</h1>

          <p className="mt-2 text-blue-100">View your car rental bookings</p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div
          id="noBookings"
          className="bg-white rounded-xl shadow-md\n                    p-10 text-center"
        >
          <div className="text-6xl mb-4">🚗</div>

          <h2 className="text-2xl font-bold text-gray-800">
            No Bookings Found
          </h2>

          <p className="text-gray-500 mt-2">You haven't booked any cars yet.</p>

          <a
            href="./cars.html"
            className="inline-block mt-6\n                      bg-blue-600 text-white\n                      px-6 py-3 rounded-lg\n                      hover:bg-blue-700"
          >
            Browse Cars
          </a>
        </div>

        <div id="bookingContainer" className="space-y-6 hidden"></div>
      </main>

      <footer className="bg-gray-900 text-white py-6 mt-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>© 2026 RentalCars. All rights reserved.</p>
        </div>
      </footer>

      <div
        id="customModal"
        className="fixed inset-0 bg-black bg-opacity-50\n                hidden items-center justify-center\n                z-50"
      >
        <div className="bg-white rounded-2xl shadow-2xl\n                    w-full max-w-md mx-4 p-6\n                    transform transition-all">
          <div
            id="modalIcon"
            className="w-16 h-16 mx-auto rounded-full\n                        bg-red-100\n                        flex items-center justify-center\n                        text-3xl mb-5"
          >
            ⚠️
          </div>

          <h2
            id="modalTitle"
            className="text-2xl font-bold\n                       text-gray-800 text-center"
          >
            Cancel Booking?
          </h2>

          <p
            id="modalMessage"
            className="text-gray-500 text-center\n                      mt-3 leading-relaxed"
          >
            Are you sure you want to cancel this booking?
          </p>

          <div
            id="modalButtons"
            className="flex justify-center\n                        gap-4 mt-7"
          >
            <button
              id="modalCancelBtn"
              type="button"
              className="px-5 py-3 rounded-lg\n                               bg-gray-200\n                               text-gray-700\n                               font-semibold\n                               hover:bg-gray-300\n                               transition"
            >
              Keep Booking
            </button>

            <button
              id="modalConfirmBtn"
              type="button"
              className="px-5 py-3 rounded-lg\n                               bg-red-600\n                               text-white\n                               font-semibold\n                               hover:bg-red-700\n                               transition"
            >
              Cancel Booking
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
