(() => {
  'use strict';

  // DOM elements from signup.html
  const nameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("psw");
  const confirmPasswordInput = document.getElementById("confirmPsw");
  const termsCheckbox = document.getElementById("agreeTerms");

  const nameError = document.getElementById("fullNameValidateError");
  const emailError = document.getElementById("emailValidateError");
  const passwordError = document.getElementById("passValidateError");
  const confirmPasswordError = document.getElementById("confirmPassValidateError");
  const termsError = document.getElementById("termsValidateError");

  const letter = document.getElementById("letter");
  const capital = document.getElementById("capital");
  const number = document.getElementById("number");
  const special = document.getElementById("special");
  const length = document.getElementById("length");
  const container = document.getElementById("message");

  const form = document.getElementById("regForm");
  const formCard = document.getElementById("formCard");
  const successCard = document.getElementById("successCard");
  const successName = document.getElementById("successName");

  const errorBanner = document.getElementById("form-error-banner");
  const errorBannerText = document.getElementById("error-banner-text");

  if (!form) return;

  // Visual error styling helpers matching AURA glassmorphic theme
  const clearError = (input, errEl) => {
    input.classList.remove("border-red-500", "bg-red-50/10");
    input.classList.add("border-surface-variant");
    if (errEl) errEl.textContent = "";
  };

  const setError = (input, errEl, message) => {
    input.classList.remove("border-surface-variant");
    input.classList.add("border-red-500", "bg-red-50/10");
    if (errEl) errEl.textContent = message;
  };

  // Password Checklist Styling Helper
  const updateChecklist = (el, isValid) => {
    if (el) {
      el.className = `flex items-center gap-2.5 text-xs transition-colors ${isValid ? "text-success" : "text-error"}`;
      const span = el.querySelector("span");
      if (span) span.className = `w-2 h-2 rounded-full inline-block shrink-0 transition-colors ${isValid ? "bg-success" : "bg-error"}`;
    }
    return isValid ? 1 : 0;
  };

  // Visibility Toggle Binder Helper
  const initToggle = (btnId, input, openId, closedId) => {
    const btn = document.getElementById(btnId);
    if (btn && input) {
      btn.addEventListener("click", () => {
        const open = document.getElementById(openId);
        const closed = document.getElementById(closedId);
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        open.classList.toggle("hidden", show);
        closed.classList.toggle("hidden", !show);
        if (typeof lucide !== "undefined") lucide.createIcons();
      });
    }
  };

  // 1. Full Name Validation
  function validateNameField() {
    const val = nameInput.value.trim();
    if (val === "") return !setError(nameInput, nameError, "Full Name is required.");
    if (!val.match(/^[a-zA-Z\s'\-]+$/)) return !setError(nameInput, nameError, "Name can only contain letters.");
    if (val.length < 3) return !setError(nameInput, nameError, "Name must be at least 3 characters.");
    clearError(nameInput, nameError);
    return true;
  }

  // 2. Email Validation
  function validateEmailField() {
    const val = emailInput.value.trim();
    if (val === "") return !setError(emailInput, emailError, "Email address is required.");
    if (!val.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) return !setError(emailInput, emailError, "Please enter a valid email address.");
    clearError(emailInput, emailError);
    return true;
  }

  // 3. Password Strength Checker
  function validatePassField() {
    const val = passwordInput.value;
    const lower = updateChecklist(letter, val.match(/[a-z]/g));
    const upper = updateChecklist(capital, val.match(/[A-Z]/g));
    const num = updateChecklist(number, val.match(/[0-9]/g));
    const spec = updateChecklist(special, val.match(/[^a-zA-Z0-9]/g));
    const len = updateChecklist(length, val.length >= 8);

    if (val === "") return !setError(passwordInput, passwordError, "Password is required.");
    if (val.length < 3) return !setError(passwordInput, passwordError, "Password must be at least 3 characters.");
    if (!(lower && upper && num && spec && len)) return !setError(passwordInput, passwordError, "Password does not meet all requirements.");

    clearError(passwordInput, passwordError);
    return true;
  }

  // 4. Confirm Password Match Validator
  function validateConfirmPassField() {
    const val = confirmPasswordInput.value;
    if (val === "") return !setError(confirmPasswordInput, confirmPasswordError, "Please confirm your password.");
    if (val !== passwordInput.value) return !setError(confirmPasswordInput, confirmPasswordError, "Passwords do not match.");
    clearError(confirmPasswordInput, confirmPasswordError);
    return true;
  }

  // 5. Terms Checkbox Validator
  function validateTermsField() {
    if (!termsCheckbox.checked) {
      termsError.textContent = "You must agree to AURA's terms and privacy policies.";
      return false;
    }
    termsError.textContent = "";
    return true;
  }

  const showMsg = () => container && container.classList.remove("hidden");
  const hideMsg = () => container && container.classList.add("hidden");

  // Wire real-time interactive check events ("on change not when submit")
  nameInput.addEventListener("input", validateNameField);
  emailInput.addEventListener("input", validateEmailField);
  passwordInput.addEventListener("input", () => {
    validatePassField();
    if (confirmPasswordInput.value) validateConfirmPassField();
  });
  confirmPasswordInput.addEventListener("input", validateConfirmPassField);
  termsCheckbox.addEventListener("change", validateTermsField);

  // Show/Hide password checklist dynamically
  passwordInput.addEventListener("focus", showMsg);
  passwordInput.addEventListener("input", showMsg);
  document.addEventListener("click", (e) => {
    if (e.target !== passwordInput && !container.contains(e.target)) hideMsg();
  });

  // Bind visibility togglers
  initToggle("togglePassword", passwordInput, "eyeOpenPass", "eyeClosedPass");
  initToggle("toggleConfirmPassword", confirmPasswordInput, "eyeOpenConfirm", "eyeClosedConfirm");

  // Handle Form Registration Submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const isValid = validateNameField() && validateEmailField() && validatePassField() && validateConfirmPassField() && validateTermsField();
    if (!isValid) {
      if (errorBanner && errorBannerText) {
        errorBannerText.textContent = "Please fix the errors in the fields below.";
        errorBanner.classList.remove("hidden");
      }
      return;
    }

    const emailValue = emailInput.value.trim();
    const existingUsers = JSON.parse(localStorage.getItem("aura_users") || "[]");
    if (existingUsers.some(u => u.email.toLowerCase() === emailValue.toLowerCase())) {
      setError(emailInput, emailError, "Email address already registered.");
      if (errorBanner && errorBannerText) {
        errorBannerText.textContent = "An account with this email address already exists.";
        errorBanner.classList.remove("hidden");
      }
      return;
    }

    // Button loader state
    const submitBtn = document.getElementById("btn-submit");
    const origHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i data-lucide="loader-2" class="animate-spin w-5 h-5"></i> Creating Account...`;
    if (typeof lucide !== "undefined") lucide.createIcons();

    setTimeout(() => {
      const fullNameValue = nameInput.value.trim();
      const newUser = {
        name: fullNameValue,
        firstName: fullNameValue.split(" ")[0],
        lastName: fullNameValue.split(" ").slice(1).join(" ") || "",
        email: emailValue,
        password: passwordInput.value,
        registeredAt: new Date().toISOString()
      };

      existingUsers.push(newUser);
      localStorage.setItem("aura_users", JSON.stringify(existingUsers));

      successName.textContent = newUser.firstName;
      formCard.classList.add("hidden");
      successCard.classList.remove("hidden");

      submitBtn.disabled = false;
      submitBtn.innerHTML = origHtml;
      if (typeof lucide !== "undefined") lucide.createIcons();
    }, 1000);
  });

  // Handle Form Reset
  const resetForm = () => {
    [nameInput, emailInput, passwordInput, confirmPasswordInput].forEach(inp => inp.value = "");
    termsCheckbox.checked = false;

    clearError(nameInput, nameError);
    clearError(emailInput, emailError);
    clearError(passwordInput, passwordError);
    clearError(confirmPasswordInput, confirmPasswordError);
    termsError.textContent = "";

    passwordInput.type = "password";
    confirmPasswordInput.type = "password";
    document.getElementById("eyeOpenPass").classList.remove("hidden");
    document.getElementById("eyeClosedPass").classList.add("hidden");
    document.getElementById("eyeOpenConfirm").classList.remove("hidden");
    document.getElementById("eyeClosedConfirm").classList.add("hidden");

    hideMsg();
    [letter, capital, number, special, length].forEach(el => updateChecklist(el, false));

    if (errorBanner) errorBanner.classList.add("hidden");
    successCard.classList.add("hidden");
    formCard.classList.remove("hidden");
    if (typeof lucide !== "undefined") lucide.createIcons();
  };

  const registerAnotherBtn = document.getElementById("registerAnotherBtn");
  if (registerAnotherBtn) registerAnotherBtn.addEventListener("click", resetForm);

  if (typeof lucide !== "undefined") lucide.createIcons();
})();
