const API_URL = "http://127.0.0.1:8000";

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
// REGISTER FORM
// ==========================================

document
  .getElementById("registerForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get username

    const username = document.getElementById("username").value.trim();

    // Get email

    const email = document.getElementById("email").value.trim();

    // Get password

    const password = document.getElementById("password").value;

    // Get confirm password

    const confirmPassword = document.getElementById("confirmPassword").value;

    // ==========================================
    // CHECK PASSWORD
    // ==========================================

    if (password !== confirmPassword) {
      showAlert("Password Error", "Passwords do not match.", "error");

      return;
    }

    // ==========================================
    // PASSWORD LENGTH
    // ==========================================

    if (password.length < 6) {
      showAlert(
        "Password Error",
        "Password must be at least 6 characters.",
        "error",
      );

      return;
    }

    try {
      // ==========================================
      // DJANGO REGISTER API
      // ==========================================

      const response = await fetch(
        API_URL + "/api/register/",

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username: username,

            email: email,

            password: password,
          }),
        },
      );

      // Get backend response

      const result = await response.json();

      // ==========================================
      // REGISTRATION SUCCESSFUL
      // ==========================================

      if (response.ok) {
        showAlert(
          "Registration Successful!",

          "Your RentalCars account has been created successfully.",

          "success",

          function () {
            // Go to login page

            const nextPage = new URLSearchParams(window.location.search).get(
              "next",
            );

            window.location.href = nextPage
              ? `login.html?next=${encodeURIComponent(nextPage)}`
              : "login.html";
          },
        );
      }

      // ==========================================
      // REGISTRATION FAILED
      // ==========================================
      else {
        console.error("Registration Error:", result);

        if (result.username) {
          showAlert(
            "Username Error",

            "Username: " + result.username[0],

            "error",
          );
        } else if (result.email) {
          showAlert(
            "Email Error",

            "Email: " + result.email[0],

            "error",
          );
        } else if (result.password) {
          showAlert(
            "Password Error",

            "Password: " + result.password[0],

            "error",
          );
        } else {
          showAlert(
            "Registration Failed",

            "Registration failed.",

            "error",
          );
        }
      }
    } catch (error) {
      // ==========================================
      // SERVER / NETWORK ERROR
      // ==========================================

      console.error("Registration Error:", error);

      showAlert(
        "Connection Error",

        "Unable to connect to Django server. " +
          "Please make sure Django server is running.",

        "error",
      );
    }
  });
