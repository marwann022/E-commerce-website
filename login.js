(() => {
  'use strict';

  if (localStorage.getItem("isLoggedIn") === "true") {
    window.location.replace("home.html");
  }

  const myForm = document.getElementById("login");
  const myEmail = document.getElementById("Email");
  const myPassword = document.getElementById("Password");
  const togglePasswordBtn = document.getElementById("togglePassword");
  const eyeIcon = document.getElementById("eyeIcon");
  const eyeOffIcon = document.getElementById("eyeOffIcon");
  const submitBtn = document.getElementById('btn-submit');
  const errorBanner = document.getElementById('form-error-banner');
  const errorBannerText = document.getElementById('error-banner-text');

  if (!myForm) return;

  // Toggle password visibility
  if (togglePasswordBtn && myPassword) {
    togglePasswordBtn.addEventListener("click", function (e) {
      e.preventDefault();

      const type = myPassword.getAttribute("type");
      if (type === "password") {
        myPassword.setAttribute("type", "text");
        eyeOffIcon.classList.remove("hidden");
        eyeIcon.classList.add("hidden");
      } else {
        myPassword.setAttribute("type", "password");
        eyeOffIcon.classList.add("hidden");
        eyeIcon.classList.remove("hidden");
      }
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    });
  }

  // Helper error clear rules
  const clearError = (input, errEl) => {
    input.classList.remove('border-red-500', 'bg-red-50/10');
    input.classList.add('border-surface-variant');
    if (errEl) {
      errEl.textContent = "";
      errEl.classList.add('hidden');
    }
    if (errorBanner) {
      errorBanner.classList.add('hidden');
    }
  };

  const setError = (input, errEl, message) => {
    input.classList.remove('border-surface-variant');
    input.classList.add('border-red-500', 'bg-red-50/10');
    if (errEl) {
      errEl.textContent = message;
      errEl.classList.remove('hidden');
    }
  };

  // Wire input hooks to reset states dynamically
  myEmail.addEventListener("input", function () {
    clearError(myEmail, document.getElementById("emailError"));
  });

  myPassword.addEventListener("input", function () {
    clearError(myPassword, document.getElementById("passwordError"));
  });

  myForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const emailValue = myEmail.value.trim();
    const passwordValue = myPassword.value;
    let hasError = false;

    clearError(myEmail, document.getElementById("emailError"));
    clearError(myPassword, document.getElementById("passwordError"));

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailValue.match(emailRegex)) {
      setError(myEmail, document.getElementById("emailError"), "Invalid email format");
      hasError = true;
    }

    if (passwordValue === "") {
      setError(myPassword, document.getElementById("passwordError"), "Password is required");
      hasError = true;
    }

    if (hasError) {
      if (errorBanner && errorBannerText) {
        errorBannerText.textContent = 'Please fix the errors in the fields below.';
        errorBanner.classList.remove('hidden');
      }
      return;
    }

    const usersJSON = localStorage.getItem("examhub_users");

    if (!usersJSON) {
      setError(myEmail, document.getElementById("emailError"), "No account found. Please sign up first.");
      if (errorBanner && errorBannerText) {
        errorBannerText.textContent = "No account found. Please sign up first.";
        errorBanner.classList.remove("hidden");
      }
      return;
    }

    const users = JSON.parse(usersJSON);
    let foundUser = null;

    for (let i = 0; i < users.length; i++) {
      if (users[i].email === emailValue) {
        foundUser = users[i];
        break;
      }
    }

    if (!foundUser) {
      setError(myEmail, document.getElementById("emailError"), "Email not found. Please sign up first.");
      if (errorBanner && errorBannerText) {
        errorBannerText.textContent = "Email not found. Please sign up first.";
        errorBanner.classList.remove("hidden");
      }
      return;
    }

    if (foundUser.password !== passwordValue) {
      setError(myPassword, document.getElementById("passwordError"), "Incorrect password");
      if (errorBanner && errorBannerText) {
        errorBannerText.textContent = "Incorrect password. Please try again.";
        errorBanner.classList.remove("hidden");
      }
      return;
    }

    // Success loader state
    const origHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <i data-lucide="loader-2" class="animate-spin w-5 h-5"></i>
      Authenticating...
    `;
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    setTimeout(() => {
      localStorage.setItem("isLoggedIn", "true");
      // Store complete authenticated user object in currentUser key
      localStorage.setItem("currentUser", JSON.stringify(foundUser));

      window.location.replace("home.html");
    }, 800);
  });

  // Initial Lucide icons render
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
})();
