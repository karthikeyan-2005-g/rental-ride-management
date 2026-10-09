import { useLegacyPage } from "../useLegacyPage.js";
import pageScript from "../legacy/contact_support.js?raw";

export default function ContactSupport() {
  useLegacyPage(
    {
      title: "Contact & Support - RentalCars",
      bodyClass: "bg-gray-100 min-h-screen",
      requiresLogin: false,
    },
    pageScript,
  );

  return (
    <>
      <nav className="bg-black text-white px-8 py-5 flex justify-between items-center">
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
            className="bg-green-500\n                          hover:bg-green-600\n                          px-4 py-2.5\n                          rounded-lg\n                          font-semibold\n                          transition"
          >
            Login
          </a>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold text-center mb-3">
          Contact & Support
        </h1>

        <p className="text-center text-gray-600 mb-10">
          Need help? Contact us or chat with our AI support assistant.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow p-8">
            <h2 className="text-2xl font-bold mb-6">Contact Us</h2>

            <form id="contactForm">
              <label className="block mb-2 font-semibold">Name</label>

              <input
                id="contactName"
                type="text"
                required
                className="w-full border rounded-lg px-4 py-3 mb-5"
                placeholder="Enter your name"
              />

              <label className="block mb-2 font-semibold">Email</label>

              <input
                id="contactEmail"
                type="email"
                required
                className="w-full border rounded-lg px-4 py-3 mb-5"
                placeholder="Enter your email"
              />

              <label className="block mb-2 font-semibold">Message</label>

              <textarea
                id="contactMessage"
                rows="5"
                required
                className="w-full border rounded-lg px-4 py-3 mb-5"
                placeholder="Enter your message"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
              >
                Send Message
              </button>
            </form>

            <p id="contactResult" className="mt-4 text-center"></p>
          </div>

          <div className="bg-white rounded-xl shadow p-8">
            <h2 className="text-2xl font-bold mb-2">🤖 AI Support Assistant</h2>

            <p className="text-gray-600 mb-5">
              Ask anything about our car rental service.
            </p>

            <div
              id="chatBox"
              className="h-80 overflow-y-auto border rounded-lg p-4 bg-gray-50 mb-4"
            >
              <div className="bg-gray-200 rounded-lg p-3 mb-3">
                Hello! 👋 I'm your RentalCars AI assistant. How can I help you?
              </div>
            </div>

            <div className="flex gap-2">
              <input
                id="chatInput"
                type="text"
                className="flex-1 border rounded-lg px-4 py-3"
                placeholder="Ask your question..."
              />

              <button
                id="sendChat"
                className="bg-green-600 text-white px-6 rounded-lg hover:bg-green-700"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
