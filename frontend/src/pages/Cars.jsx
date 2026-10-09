import { useLegacyPage } from "../useLegacyPage.js";
import pageScript from "../legacy/cars.js?raw";

export default function Cars() {
  useLegacyPage(
    {
      title: "Available Cars - RentalCars",
      bodyClass: "bg-gray-50 text-gray-900",
      requiresLogin: false,
    },
    pageScript,
  );

  return (
    <>
      <nav className="bg-gray-950 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <a href="../index.html" className="text-2xl font-bold">
              🚗 RentalCars
            </a>

            <div className="hidden md:flex items-center gap-8">
              <a href="../index.html" className="hover:text-green-400">
                Home
              </a>

              <a href="./cars.html" className="text-green-400 font-semibold">
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
                className="bg-green-500 hover:bg-green-600 px-5 py-2.5 rounded-lg font-semibold"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <h1 className="text-4xl md:text-5xl font-bold">Available Cars</h1>

          <p className="mt-3 text-blue-100">
            Choose the perfect car for your journey.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-2">Search Car</label>

              <input
                type="text"
                id="searchInput"
                placeholder="Search by brand or name..."
                className="w-full border border-gray-300\n                           rounded-lg px-4 py-3\n                           focus:outline-none\n                           focus:ring-2\n                           focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Car Type</label>

              <select
                id="typeFilter"
                className="w-full border border-gray-300\n                           rounded-lg px-4 py-3"
              >
                <option value="all">All Types</option>

                <option value="sedan">Sedan</option>

                <option value="suv">SUV</option>

                <option value="hatchback">Hatchback</option>

                <option value="luxury">Luxury</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Maximum Price / Day
              </label>

              <select
                id="priceFilter"
                className="w-full border border-gray-300\n                           rounded-lg px-4 py-3"
              >
                <option value="all">Any Price</option>

                <option value="2000">Under ₹2,000</option>

                <option value="3000">Under ₹3,000</option>

                <option value="5000">Under ₹5,000</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Our Cars</h2>

          <span id="carCount" className="text-gray-500">
            Loading cars...
          </span>
        </div>

        <div
          id="carContainer"
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
        ></div>

        <div id="noResults" className="hidden text-center py-16">
          <div className="text-6xl">🚗</div>

          <h3 className="text-2xl font-bold mt-4">No Cars Found</h3>

          <p className="text-gray-500 mt-2">
            Try changing your search or filter.
          </p>
        </div>
      </section>

      <footer className="bg-gray-950 text-gray-400 py-8">
        <div className="text-center">
          <p>© 2026 Rental Car Management System</p>
        </div>
      </footer>
    </>
  );
}
