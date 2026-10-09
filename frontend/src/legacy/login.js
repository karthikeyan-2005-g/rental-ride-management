const API_URL = "http://127.0.0.1:8000";

const nextPage = new URLSearchParams(window.location.search).get("next");

const isBookingPage =
  nextPage === "booking.html" ||
  (nextPage && nextPage.startsWith("booking.html?"));

if (isBookingPage) {
  document.getElementById("registerLink").href =
    `./resiter.html?next=${encodeURIComponent(nextPage)}`;
}

// ==========================================
// CUSTOM ALERT FUNCTION
// ==========================================

function showAlert(title, message, type = "error", callback = null) {
  const modal = document.getElementById("alertModal");

  const icon = document.getElementById("alertIcon");

  const alertTitle = document.getElementById("alertTitle");

  const alertMessage = document.getElementById("alertMessage");

  const okButton = document.getElementById("alertOkButton");

  // ==========================================
  // ERROR STYLE
  // ==========================================

  if (type === "error") {
    icon.innerHTML = "⚠️";

    icon.className =
      "w-16 h-16 mx-auto rounded-full " +
      "bg-red-100 text-red-600 " +
      "flex items-center justify-center " +
      "text-3xl mb-5";

    okButton.className =
      "mt-6 px-8 py-3 " +
      "bg-red-600 hover:bg-red-700 " +
      "text-white rounded-lg " +
      "font-semibold transition";
  }

  // ==========================================
  // SUCCESS STYLE
  // ==========================================
  else if (type === "success") {
    icon.innerHTML = "✓";

    icon.className =
      "w-16 h-16 mx-auto rounded-full " +
      "bg-green-100 text-green-600 " +
      "flex items-center justify-center " +
      "text-3xl font-bold mb-5";

    okButton.className =
      "mt-6 px-8 py-3 " +
      "bg-green-600 hover:bg-green-700 " +
      "text-white rounded-lg " +
      "font-semibold transition";
  }

  // Set text

  alertTitle.innerText = title;

  alertMessage.innerText = message;

  // Show modal

  modal.classList.remove("hidden");

  modal.classList.add("flex");

  // OK button

  okButton.onclick = function () {
    modal.classList.add("hidden");

    modal.classList.remove("flex");

    if (callback) {
      callback();
    }
  };
}

// ==========================================
// LOGIN FORM
// ==========================================

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get username

    const username = document.getElementById("username").value.trim();

    // Get password

    const password = document.getElementById("password").value;

    // ==========================================
    // BASIC VALIDATION
    // ==========================================

    if (!username || !password) {
      showAlert(
        "Missing Information",
        "Please enter username and password.",
        "error",
      );

      return;
    }

    try {
      // ==========================================
      // DJANGO LOGIN API
      // ==========================================

      const response = await fetch(
        API_URL + "/api/login/",

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username: username,

            password: password,
          }),
        },
      );

      // Get response

      const result = await response.json();

      // ==========================================
      // LOGIN SUCCESSFUL
      // ==========================================

      if (response.ok) {
        // Save user ID

        localStorage.setItem("user_id", result.user_id);

        // Save username

        localStorage.setItem("user_name", result.username);

        // Save email

        localStorage.setItem("user_email", result.email);

        // Custom success popup

        showAlert(
          "Login Successful!",
          "Welcome back, " +
            result.username +
            "! You have successfully logged in.",
          "success",

          function () {
            window.location.href = isBookingPage
              ? `./${nextPage}`
              : "../index.html";
          },
        );
      }

      // ==========================================
      // LOGIN FAILED
      // ==========================================
      else {
        showAlert(
          "Login Failed",

          result.detail || "Invalid username or password.",

          "error",
        );
      }
    } catch (error) {
      // ==========================================
      // SERVER ERROR
      // ==========================================

      console.error("Login Error:", error);

      showAlert(
        "Connection Error",

        "Unable to connect to Django server. " +
          "Please make sure Django server is running.",

        "error",
      );
    }
  });
