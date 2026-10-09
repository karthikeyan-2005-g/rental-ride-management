import { useLegacyPage } from "../useLegacyPage.js";

export default function Home() {
  useLegacyPage({
    title: "Rental Car Management System",
    bodyClass: "bg-white text-slate-900",
    requiresLogin: false,
  });

  return (
    <>
      <nav className="bg-slate-950 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20 md:h-[103px]">
            <a
              href="../index.html"
              className="text-2xl md:text-4xl font-extrabold\n                      flex items-center gap-3"
            >
              <span className="text-3xl md:text-4xl">🚘</span>

              <span>
                Rental<span className="text-cyan-400">Cars</span>
              </span>
            </a>

            <div className="hidden md:flex items-center gap-7 lg:gap-9">
              <a
                href="../index.html"
                className="relative\n                          text-cyan-400\n                          font-bold\n                          py-7"
              >
                Home
                <span className="absolute\n                                 bottom-0\n                                 left-0\n                                 right-0\n                                 h-1\n                                 bg-cyan-400"></span>
              </a>

              <a
                href="./frontend/cars.html"
                className="font-semibold\n                          hover:text-cyan-400\n                          transition"
              >
                Cars
              </a>

              <a
                href="./frontend/my_bookings.html"
                className="font-semibold\n                          hover:text-cyan-400\n                          transition"
              >
                My Bookings
              </a>

              <a
                href="./frontend/contact_support.html"
                className="font-semibold\n                          hover:text-cyan-400\n                          transition"
              >
                Contact & Support
              </a>

              <a
                href="./frontend/login.html"
                data-auth-control=""
                data-login-url="./frontend/login.html"
                className="bg-cyan-500\n                          hover:bg-cyan-400\n                          text-white\n                          px-7\n                          py-3.5\n                          rounded-xl\n                          font-bold\n                          transition\n                          shadow-lg"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative\n                min-h-[calc(100vh-103px)]\n                overflow-hidden\n                bg-white">
        <div className="absolute inset-0">
          <img
            src="./frontend/images/toyota-camry.jpg"
            alt="Toyota Camry Rental Car"
            className="w-full\n                   h-full\n                   object-cover\n                   object-center"
          />
        </div>

        <div className="absolute inset-0\n                bg-gradient-to-r\n                from-white\n                via-white/90\n                via-white/45\n                to-transparent"></div>

        <div className="absolute\n                inset-x-0\n                top-0\n                h-[45%]\n                bg-gradient-to-b\n                from-cyan-100/25\n                to-transparent\n                pointer-events-none"></div>

        <div className="absolute\n                top-0\n                right-0\n                w-[28%]\n                h-full\n                pointer-events-none\n                overflow-hidden">
          <div
            className="absolute\n                   top-0\n                   right-[-15%]\n                   w-[100%]\n                   h-full\n                   bg-gradient-to-b\n                   from-cyan-400/55\n                   via-cyan-400/15\n                   to-transparent"
            style={{
              clipPath:
                "polygon(\n                    45% 0%,\n                    100% 0%,\n                    100% 100%,\n                    0% 100%\n                )",
            }}
          ></div>

          <div
            className="absolute\n                   top-0\n                   right-[35%]\n                   w-[12%]\n                   h-[58%]\n                   bg-cyan-400/15"
            style={{ transform: "skewX(-28deg)" }}
          ></div>
        </div>

        <div className="relative\n                z-10\n                max-w-[1400px]\n                mx-auto\n                px-8\n                min-h-[calc(100vh-103px)]\n                flex\n                items-center">
          <div className="w-full\n                    max-w-[760px]\n                    py-20">
            <div className="flex\n                        items-center\n                        gap-5\n                        mb-12">
              <div className="w-12\n                            h-[4px]\n                            bg-cyan-500"></div>

              <p className="text-cyan-600\n                          text-lg\n                          font-extrabold\n                          tracking-[3px]">
                PREMIUM CAR RENTAL
              </p>
            </div>

            <h1 className="text-slate-900\n                       font-extrabold\n                       text-[64px]\n                       md:text-[78px]\n                       lg:text-[88px]\n                       leading-[0.98]\n                       tracking-[-4px]">
              Rent Your <span className="text-cyan-500">Dream</span>
              <br />
              <span className="text-cyan-500">Car</span>
            </h1>

            <p className="mt-9\n                       max-w-[690px]\n                       text-slate-700\n                       text-lg\n                       md:text-xl\n                       leading-[1.7]\n                       font-medium">
              Easy, fast and affordable car rental service. Choose your perfect
              car and start your journey today.
            </p>

            <div className="flex\n                        items-center\n                        gap-5\n                        mt-10">
              <a
                href="./frontend/cars.html"
                className="group\n                           w-[230px]\n                           h-[66px]\n                           flex\n                           items-center\n                           justify-center\n                           gap-3\n                           rounded-xl\n                           bg-gradient-to-r\n                           from-cyan-500\n                           to-cyan-400\n                           text-white\n                           text-lg\n                           font-bold\n                           shadow-lg\n                           hover:shadow-xl\n                           hover:-translate-y-1\n                           transition"
              >
                Browse Cars
                <span className="text-2xl\n                               group-hover:translate-x-1\n                               transition">
                  →
                </span>
              </a>

              <a
                href="./frontend/resiter.html"
                className="w-[210px]\n                           h-[66px]\n                           flex\n                           items-center\n                           justify-center\n                           rounded-xl\n                           border-2\n                           border-slate-400\n                           bg-white/75\n                           text-slate-800\n                           text-lg\n                           font-bold\n                           hover:border-cyan-500\n                           hover:text-cyan-600\n                           hover:bg-white\n                           hover:-translate-y-1\n                           transition"
              >
                Create Account
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto\n                px-6\n                py-20">
        <div className="text-center mb-12">
          <p className="text-cyan-600\n                  font-bold\n                  tracking-[3px]">
            OUR FEATURES
          </p>

          <h2 className="text-4xl\n                   md:text-5xl\n                   font-extrabold\n                   text-slate-950\n                   mt-3">
            Why Choose Us?
          </h2>

          <p className="text-slate-500\n                  mt-4\n                  max-w-2xl\n                  mx-auto">
            Everything you need for a simple and comfortable car rental
            experience.
          </p>
        </div>

        <div className="grid\n                md:grid-cols-3\n                gap-8">
          <div className="bg-white\n                    rounded-2xl\n                    p-8\n                    text-center\n                    border\n                    border-slate-100\n                    shadow-lg\n                    hover:shadow-2xl\n                    hover:-translate-y-2\n                    transition">
            <div className="w-16\n                        h-16\n                        mx-auto\n                        rounded-2xl\n                        bg-cyan-100\n                        flex\n                        items-center\n                        justify-center\n                        text-3xl">
              🚗
            </div>

            <h3 className="text-xl\n                       font-bold\n                       text-slate-900\n                       mt-5">
              Best Cars
            </h3>

            <p className="text-slate-500\n                      mt-3\n                      leading-relaxed">
              Choose from a wide range of quality and comfortable cars.
            </p>
          </div>

          <div className="bg-white\n                    rounded-2xl\n                    p-8\n                    text-center\n                    border\n                    border-slate-100\n                    shadow-lg\n                    hover:shadow-2xl\n                    hover:-translate-y-2\n                    transition">
            <div className="w-16\n                        h-16\n                        mx-auto\n                        rounded-2xl\n                        bg-emerald-100\n                        flex\n                        items-center\n                        justify-center\n                        text-3xl">
              💰
            </div>

            <h3 className="text-xl\n                       font-bold\n                       text-slate-900\n                       mt-5">
              Affordable Price
            </h3>

            <p className="text-slate-500\n                      mt-3\n                      leading-relaxed">
              Get premium cars at affordable rental prices.
            </p>
          </div>

          <div className="bg-white\n                    rounded-2xl\n                    p-8\n                    text-center\n                    border\n                    border-slate-100\n                    shadow-lg\n                    hover:shadow-2xl\n                    hover:-translate-y-2\n                    transition">
            <div className="w-16\n                        h-16\n                        mx-auto\n                        rounded-2xl\n                        bg-indigo-100\n                        flex\n                        items-center\n                        justify-center\n                        text-3xl">
              ⚡
            </div>

            <h3 className="text-xl\n                       font-bold\n                       text-slate-900\n                       mt-5">
              Easy Booking
            </h3>

            <p className="text-slate-500\n                      mt-3\n                      leading-relaxed">
              Book your favorite car quickly and easily.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl\n                mx-auto\n                px-6\n                pb-20">
        <div className="relative\n                overflow-hidden\n                bg-gradient-to-r\n                from-slate-950\n                to-cyan-700\n                rounded-3xl\n                p-10\n                md:p-14\n                text-white\n                text-center\n                shadow-2xl">
          <div className="absolute\n                    -top-20\n                    -right-20\n                    w-60\n                    h-60\n                    bg-cyan-400\n                    opacity-20\n                    rounded-full"></div>

          <h2 className="relative\n                   text-3xl\n                   md:text-4xl\n                   font-extrabold">
            Ready to Start Your Journey?
          </h2>

          <p className="relative\n                  mt-4\n                  text-cyan-100">
            Find your perfect rental car today.
          </p>

          <a
            href="./frontend/cars.html"
            className="relative\n                  inline-flex\n                  items-center\n                  justify-center\n                  mt-7\n                  bg-cyan-400\n                  hover:bg-cyan-300\n                  text-slate-950\n                  px-8\n                  py-3.5\n                  rounded-xl\n                  font-bold\n                  transition\n                  shadow-lg"
          >
            Explore Cars
          </a>
        </div>
      </section>

      <footer className="bg-slate-950\n               text-slate-400\n               py-10">
        <div className="max-w-7xl\n                mx-auto\n                px-6\n                text-center">
          <p>
            © 2026
            <span className="text-white\n                         font-bold">
              Rental Car Management System
            </span>
          </p>

          <p className="text-sm\n                  mt-3\n                  text-slate-500">
            Built with React, Tailwind CSS & JavaScript
          </p>
        </div>
      </footer>
    </>
  );
}
