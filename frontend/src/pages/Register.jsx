import { useLegacyPage } from "../useLegacyPage.js";
import pageScript from "../legacy/register.js?raw";

export default function Register() {
  useLegacyPage(
    {
      title: "Register - RentalCars",
      bodyClass: "bg-gray-100 min-h-screen",
      requiresLogin: false,
    },
    pageScript,
  );

  return (
    <>
      <nav className="bg-gray-950 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-20\n                    flex items-center justify-between">
          <a href="../index.html" className="text-2xl font-bold">
            🚗RentalCars
          </a>

          <div className="flex gap-6">
            <a href="../index.html" className="hover:text-green-400">
              Home
            </a>

            <a href="./cars.html" className="hover:text-green-400">
              Cars
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
      </nav>

      <div className="min-h-[calc(100vh-80px)]\n                flex items-center\n                justify-center\n                px-4">
        <div className="bg-white\n                    w-full max-w-md\n                    rounded-2xl\n                    shadow-xl\n                    p-8">
          <h1 className="text-3xl\n                       font-bold\n                       text-center\n                       text-gray-900\n                       mb-2">
            Create Account
          </h1>

          <p className="text-center\n                      text-gray-500\n                      mb-8">
            Register for your RentalCars account
          </p>

          <form id="registerForm">
            <div className="mb-5">
              <label className="block\n                                  text-gray-700\n                                  font-semibold\n                                  mb-2">
                Username
              </label>

              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                required
                className="w-full\n                               px-4 py-3\n                               border\n                               border-gray-300\n                               rounded-lg\n                               focus:outline-none\n                               focus:ring-2\n                               focus:ring-green-500"
              />
            </div>

            <div className="mb-5">
              <label className="block\n                                  text-gray-700\n                                  font-semibold\n                                  mb-2">
                Email Address
              </label>

              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                required
                className="w-full\n                               px-4 py-3\n                               border\n                               border-gray-300\n                               rounded-lg\n                               focus:outline-none\n                               focus:ring-2\n                               focus:ring-green-500"
              />
            </div>

            <div className="mb-5">
              <label className="block\n                                  text-gray-700\n                                  font-semibold\n                                  mb-2">
                Password
              </label>

              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                required
                className="w-full\n                               px-4 py-3\n                               border\n                               border-gray-300\n                               rounded-lg\n                               focus:outline-none\n                               focus:ring-2\n                               focus:ring-green-500"
              />
            </div>

            <div className="mb-6">
              <label className="block\n                                  text-gray-700\n                                  font-semibold\n                                  mb-2">
                Confirm Password
              </label>

              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                required
                className="w-full\n                               px-4 py-3\n                               border\n                               border-gray-300\n                               rounded-lg\n                               focus:outline-none\n                               focus:ring-2\n                               focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              className="w-full\n                           bg-green-600\n                           hover:bg-green-700\n                           text-white\n                           font-bold\n                           py-3\n                           rounded-lg\n                           transition\n                           duration-200"
            >
              Create Account
            </button>
          </form>

          <p className="text-center\n                      text-gray-600\n                      mt-6">
            Already have an account?
            <a
              href="./login.html"
              className="text-green-600\n                          font-semibold\n                          hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>

      <div
        id="alertModal"
        className="fixed inset-0\n                bg-black bg-opacity-50\n                hidden\n                items-center\n                justify-center\n                z-50\n                px-4"
      >
        <div className="bg-white\n                    w-full\n                    max-w-md\n                    rounded-2xl\n                    shadow-2xl\n                    p-7\n                    text-center">
          <div
            id="alertIcon"
            className="w-16 h-16\n                        mx-auto\n                        rounded-full\n                        bg-red-100\n                        text-red-600\n                        flex\n                        items-center\n                        justify-center\n                        text-3xl\n                        mb-5"
          >
            ⚠️
          </div>

          <h2
            id="alertTitle"
            className="text-2xl\n                       font-bold\n                       text-gray-800"
          >
            Registration Failed
          </h2>

          <p
            id="alertMessage"
            className="text-gray-500\n                      mt-3\n                      leading-relaxed"
          >
            Registration failed.
          </p>

          <button
            id="alertOkButton"
            type="button"
            className="mt-6\n                       px-8\n                       py-3\n                       bg-red-600\n                       hover:bg-red-700\n                       text-white\n                       rounded-lg\n                       font-semibold\n                       transition"
          >
            OK
          </button>
        </div>
      </div>
    </>
  );
}
