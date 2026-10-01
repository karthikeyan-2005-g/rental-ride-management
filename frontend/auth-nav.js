document.querySelectorAll("[data-auth-control]").forEach((link) => {
    const loginUrl = link.dataset.loginUrl;
    const isLoggedIn = Boolean(localStorage.getItem("user_id"));

    link.textContent = isLoggedIn ? "Logout" : "Login";
    link.href = loginUrl;

    if (isLoggedIn) {
        link.addEventListener("click", () => {
            localStorage.removeItem("user_id");
            localStorage.removeItem("user_name");
            localStorage.removeItem("user_email");
        });
    }
});
