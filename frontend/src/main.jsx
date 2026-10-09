import { createRoot } from "react-dom/client";
import Booking from "./pages/Booking.jsx";
import Cars from "./pages/Cars.jsx";
import ContactSupport from "./pages/ContactSupport.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import Register from "./pages/Register.jsx";

const pages = {
  "/": Home,
  "/index.html": Home,
  "/frontend/cars.html": Cars,
  "/frontend/booking.html": Booking,
  "/frontend/login.html": Login,
  "/frontend/resiter.html": Register,
  "/frontend/my_bookings.html": MyBookings,
  "/frontend/contact_support.html": ContactSupport,
};

const Page = pages[window.location.pathname] || Home;

createRoot(document.getElementById("root")).render(<Page />);
