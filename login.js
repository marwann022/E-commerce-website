(() => {
  'use strict';

  if (localStorage.getItem("isLoggedIn") === "true") {
    window.location.replace("home.html");
  }

  const myForm = document.getElementById("login");
  const myEmail = document.getElementById("Email");
  const myPassword = document.getElementById("Password");
  const submitBtn = document.getElementById('btn-submit');
  const errorBanner = document.getElementById('form-error-banner');
  const errorBannerText = document.getElementById('error-banner-text');

  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");

  if (!myForm) return;

  // Visual error styling helpers matching AURA theme
  const clearError = (input, errEl) => {
    input.classList.remove('border-red-500', 'bg-red-50/10');
    input.classList.add('border-surface-variant');
    if (errEl) errEl.textContent = "";
    if (errorBanner) errorBanner.classList.add('hidden');
  };

  const setError = (input, errEl, message) => {
    input.classList.remove('border-surface-variant');
    input.classList.add('border-red-500', 'bg-red-50/10');
    if (errEl) errEl.textContent = message;
  };

  // Password Visibility Toggle Utility
  const initToggle = (btnId, input, openId, closedId) => {
    const btn = document.getElementById(btnId);
    if (btn && input) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const open = document.getElementById(openId);
        const closed = document.getElementById(closedId);
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        open.classList.toggle("hidden", show);
        closed.classList.toggle("hidden", !show);
        if (typeof lucide !== 'undefined') lucide.createIcons();
      });
    }
  };

  initToggle("togglePassword", myPassword, "eyeIcon", "eyeOffIcon");

  // Real-time Input Val Hooks ("on change not when submit")
  function validateEmailField() {
    const val = myEmail.value.trim();
    if (val === "") return !setError(myEmail, emailError, "Email Address is required.");
    if (!val.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      return !setError(myEmail, emailError, "Invalid email format");
    }
    clearError(myEmail, emailError);
    return true;
  }

  function validatePassField() {
    if (myPassword.value === "") return !setError(myPassword, passwordError, "Password is required");
    clearError(myPassword, passwordError);
    return true;
  }

  myEmail.addEventListener("input", validateEmailField);
  myPassword.addEventListener("input", validatePassField);

  // Submit Handler
  myForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const isValid = validateEmailField() && validatePassField();
    if (!isValid) {
      if (errorBanner && errorBannerText) {
        errorBannerText.textContent = 'Please fix the errors in the fields below.';
        errorBanner.classList.remove('hidden');
      }
      return;
    }

    const emailValue = myEmail.value.trim();
    const passwordValue = myPassword.value;
    const usersJSON = localStorage.getItem("aura_users");

    if (!usersJSON) {
      setError(myEmail, emailError, "No account found. Please sign up first.");
      if (errorBanner && errorBannerText) {
        errorBannerText.textContent = "No account found. Please sign up first.";
        errorBanner.classList.remove('hidden');
      }
      return;
    }

    const users = JSON.parse(usersJSON);
    const foundUser = users.find(u => u.email.toLowerCase() === emailValue.toLowerCase());

    if (!foundUser) {
      setError(myEmail, emailError, "Email not found. Please sign up first.");
      if (errorBanner && errorBannerText) {
        errorBannerText.textContent = "Email not found. Please sign up first.";
        errorBanner.classList.remove('hidden');
      }
      return;
    }

    if (foundUser.password !== passwordValue) {
      setError(myPassword, passwordError, "Incorrect password");
      if (errorBanner && errorBannerText) {
        errorBannerText.textContent = "Incorrect password. Please try again.";
        errorBanner.classList.remove('hidden');
      }
      return;
    }

    // Dynamic Loader state transition
    const origHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i data-lucide="loader-2" class="animate-spin w-5 h-5"></i> Authenticating...`;
    if (typeof lucide !== 'undefined') lucide.createIcons();

    setTimeout(() => {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      window.location.replace("home.html");
    }, 800);
  });

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
})();
