import { useLegacyPage } from "../useLegacyPage.js";
import pageScript from "../legacy/login.js?raw";

export default function Login() {
  useLegacyPage(
    {
      title: "Login - RentalCars",
      bodyClass:
        "min-h-screen\n             bg-gradient-to-br\n             from-blue-600\n             to-blue-900\n             flex items-center\n             justify-center\n             px-6",
      requiresLogin: false,
    },
    pageScript,
  );

  return (
    <>
      <div className="w-full max-w-md\n                bg-white\n                rounded-2xl\n                shadow-2xl\n                p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🚗</div>

          <h1 className="text-3xl font-bold">Welcome Back</h1>

          <p className="text-gray-500 mt-2">Login to your RentalCars account</p>
        </div>

        <form id="loginForm">
          <div className="mb-5">
            <label className="block\n                              font-semibold\n                              mb-2">
              Username
            </label>

            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              required
              className="w-full\n                           border\n                           border-gray-300\n                           rounded-lg\n                           px-4 py-3\n                           focus:outline-none\n                           focus:ring-2\n                           focus:ring-blue-500"
            />
          </div>

          <div className="mb-5">
            <label className="block\n                              font-semibold\n                              mb-2">
              Password
            </label>

            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              required
              className="w-full\n                           border\n                           border-gray-300\n                           rounded-lg\n                           px-4 py-3\n                           focus:outline-none\n                           focus:ring-2\n                           focus:ring-blue-500"
            />
          </div>

          <div className="flex\n                        items-center\n                        mb-6">
            <input type="checkbox" className="w-4 h-4" />

            <label className="ml-2\n                              text-gray-600">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className="w-full\n                       bg-blue-600\n                       hover:bg-blue-700\n                       text-white\n                       py-3\n                       rounded-lg\n                       font-bold\n                       transition"
          >
            Login
          </button>
        </form>

        <p className="text-center\n                  text-gray-600\n                  mt-6">
          Don't have an account?
          <a
            href="./resiter.html"
            id="registerLink"
            className="text-blue-600\n                      font-semibold\n                      hover:underline"
          >
            Create Account
          </a>
        </p>

        <div className="text-center mt-5">
          <a
            href="../index.html"
            className="text-gray-500\n                      hover:text-blue-600"
          >
            ← Back to Home
          </a>
        </div>
      </div>

      <div
        id="alertModal"
        className="fixed inset-0\n                bg-black bg-opacity-50\n                hidden\n                items-center\n                justify-center\n                z-50\n                px-4"
      >
        <div className="bg-white\n                    w-full\n                    max-w-md\n                    rounded-2xl\n                    shadow-2xl\n                    p-7\n                    text-center\n                    transform\n                    transition-all">
          <div
            id="alertIcon"
            className="w-16 h-16\n                        mx-auto\n                        rounded-full\n                        bg-red-100\n                        flex\n                        items-center\n                        justify-center\n                        text-3xl\n                        mb-5"
          >
            ⚠️
          </div>

          <h2
            id="alertTitle"
            className="text-2xl\n                       font-bold\n                       text-gray-800"
          >
            Login Failed
          </h2>

          <p
            id="alertMessage"
            className="text-gray-500\n                      mt-3\n                      leading-relaxed"
          >
            Invalid username or password.
          </p>

          <button
            id="alertOkButton"
            type="button"
            className="mt-6\n                       px-8\n                       py-3\n                       bg-blue-600\n                       hover:bg-blue-700\n                       text-white\n                       rounded-lg\n                       font-semibold\n                       transition"
          >
            OK
          </button>
        </div>
      </div>
    </>
  );
}
