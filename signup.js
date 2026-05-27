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
    if (errEl) {
      errEl.textContent = "";
    }
  };

  const setError = (input, errEl, message) => {
    input.classList.remove("border-surface-variant");
    input.classList.add("border-red-500", "bg-red-50/10");
    if (errEl) {
      errEl.textContent = message;
    }
  };

  // 1. Full Name Validation
  function validateNameField() {
    const val = nameInput.value.trim();
    if (val === "") {
      setError(nameInput, nameError, "Full Name is required.");
      return false;
    }
    if (val.length < 3) {
      setError(nameInput, nameError, "Name must be at least 3 characters.");
      return false;
    }
    if (isFinite(val)) {
      setError(nameInput, nameError, "Name must be a string not a number.");
      return false;
    }
    const namePattern = /^[a-zA-Z\s'\-]+$/;
    if (!val.match(namePattern)) {
      setError(nameInput, nameError, "Name can only contain letters.");
      return false;
    }
    clearError(nameInput, nameError);
    return true;
  }

  // 2. Email Validation
  function validateEmailField() {
    const val = emailInput.value.trim();
    if (val === "") {
      setError(emailInput, emailError, "Email address is required.");
      return false;
    }
    if (val.length < 3) {
      setError(emailInput, emailError, "Email must be at least 3 characters.");
      return false;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!val.match(emailRegex)) {
      setError(emailInput, emailError, "Please enter a valid email address.");
      return false;
    }
    clearError(emailInput, emailError);
    return true;
  }

  // 3. Password Strength Checker & Checklist highlight handler
  function validatePassField() {
    const val = passwordInput.value;
    let hasLower = 0;
    let hasUpper = 0;
    let hasNumber = 0;
    let hasSpecial = 0;
    let hasLength = 0;

    // Check lowercase letters
    if (val.match(/[a-z]/g)) {
      letter.className = "flex items-center gap-2.5 text-xs text-success transition-colors";
      letter.querySelector("span").className = "w-2 h-2 rounded-full bg-success inline-block shrink-0 transition-colors";
      hasLower = 1;
    } else {
      letter.className = "flex items-center gap-2.5 text-xs text-error transition-colors";
      letter.querySelector("span").className = "w-2 h-2 rounded-full bg-error inline-block shrink-0 transition-colors";
    }

    // Check uppercase letters
    if (val.match(/[A-Z]/g)) {
      capital.className = "flex items-center gap-2.5 text-xs text-success transition-colors";
      capital.querySelector("span").className = "w-2 h-2 rounded-full bg-success inline-block shrink-0 transition-colors";
      hasUpper = 1;
    } else {
      capital.className = "flex items-center gap-2.5 text-xs text-error transition-colors";
      capital.querySelector("span").className = "w-2 h-2 rounded-full bg-error inline-block shrink-0 transition-colors";
    }

    // Check numbers
    if (val.match(/[0-9]/g)) {
      number.className = "flex items-center gap-2.5 text-xs text-success transition-colors";
      number.querySelector("span").className = "w-2 h-2 rounded-full bg-success inline-block shrink-0 transition-colors";
      hasNumber = 1;
    } else {
      number.className = "flex items-center gap-2.5 text-xs text-error transition-colors";
      number.querySelector("span").className = "w-2 h-2 rounded-full bg-error inline-block shrink-0 transition-colors";
    }

    // Check special characters
    if (val.match(/[^a-zA-Z0-9]/g)) {
      special.className = "flex items-center gap-2.5 text-xs text-success transition-colors";
      special.querySelector("span").className = "w-2 h-2 rounded-full bg-success inline-block shrink-0 transition-colors";
      hasSpecial = 1;
    } else {
      special.className = "flex items-center gap-2.5 text-xs text-error transition-colors";
      special.querySelector("span").className = "w-2 h-2 rounded-full bg-error inline-block shrink-0 transition-colors";
    }

    // Check minimum length
    if (val.length >= 8) {
      length.className = "flex items-center gap-2.5 text-xs text-success transition-colors";
      length.querySelector("span").className = "w-2 h-2 rounded-full bg-success inline-block shrink-0 transition-colors";
      hasLength = 1;
    } else {
      length.className = "flex items-center gap-2.5 text-xs text-error transition-colors";
      length.querySelector("span").className = "w-2 h-2 rounded-full bg-error inline-block shrink-0 transition-colors";
    }

    // Apply errors to password input container itself
    if (val === "") {
      setError(passwordInput, passwordError, "Password is required.");
      return false;
    }
    if (val.length < 3) {
      setError(passwordInput, passwordError, "Password must be at least 3 characters.");
      return false;
    }

    const meetsRequirements = hasLower && hasUpper && hasNumber && hasSpecial && hasLength;
    if (!meetsRequirements) {
      setError(passwordInput, passwordError, "Password does not meet all requirements.");
      return false;
    }

    clearError(passwordInput, passwordError);
    return true;
  }

  // 4. Confirm Password Match Validator
  function validateConfirmPassField() {
    const val = confirmPasswordInput.value;
    if (val === "") {
      setError(confirmPasswordInput, confirmPasswordError, "Please confirm your password.");
      return false;
    }
    if (val !== passwordInput.value) {
      setError(confirmPasswordInput, confirmPasswordError, "Passwords do not match.");
      return false;
    }
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

  // Show checklist box
  const showMsg = () => {
    if (container) {
      container.classList.remove("hidden");
    }
  };

  // Hide checklist box
  const hideMsg = () => {
    if (container) {
      container.classList.add("hidden");
    }
  };

  // Wire real-time interactive check events ("on change not when submit")
  nameInput.addEventListener("input", validateNameField);
  emailInput.addEventListener("input", validateEmailField);
  
  passwordInput.addEventListener("input", () => {
    validatePassField();
    if (confirmPasswordInput.value !== "") {
      validateConfirmPassField();
    }
  });

  confirmPasswordInput.addEventListener("input", validateConfirmPassField);
  termsCheckbox.addEventListener("change", validateTermsField);

  // Show checklist when focused/typing in password input
  passwordInput.addEventListener("focus", showMsg);
  passwordInput.addEventListener("input", showMsg);

  // Hide checklist box when user clicks outside the password input or checklist container
  document.addEventListener("click", (e) => {
    if (e.target !== passwordInput && !container.contains(e.target)) {
      hideMsg();
    }
  });

  // Wire password visibility togglers
  const togglePassBtn = document.getElementById("togglePassword");
  if (togglePassBtn) {
    togglePassBtn.addEventListener("click", () => {
      const eyeOpen = document.getElementById("eyeOpenPass");
      const eyeClosed = document.getElementById("eyeClosedPass");

      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeOpen.classList.add("hidden");
        eyeClosed.classList.remove("hidden");
      } else {
        passwordInput.type = "password";
        eyeOpen.classList.remove("hidden");
        eyeClosed.classList.add("hidden");
      }
      if (typeof lucide !== "undefined") {
        lucide.createIcons();
      }
    });
  }

  const toggleConfirmPassBtn = document.getElementById("toggleConfirmPassword");
  if (toggleConfirmPassBtn) {
    toggleConfirmPassBtn.addEventListener("click", () => {
      const eyeOpen = document.getElementById("eyeOpenConfirm");
      const eyeClosed = document.getElementById("eyeClosedConfirm");

      if (confirmPasswordInput.type === "password") {
        confirmPasswordInput.type = "text";
        eyeOpen.classList.add("hidden");
        eyeClosed.classList.remove("hidden");
      } else {
        confirmPasswordInput.type = "password";
        eyeOpen.classList.remove("hidden");
        eyeClosed.classList.add("hidden");
      }
      if (typeof lucide !== "undefined") {
        lucide.createIcons();
      }
    });
  }

  // Handle Form Registration Submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Trigger validation across all fields
    const isNameValid = validateNameField();
    const isEmailValid = validateEmailField();
    const isPassValid = validatePassField();
    const isConfirmValid = validateConfirmPassField();
    const isTermsValid = validateTermsField();

    const isValid = isNameValid && isEmailValid && isPassValid && isConfirmValid && isTermsValid;

    if (!isValid) {
      if (errorBanner && errorBannerText) {
        errorBannerText.textContent = "Please fix the errors in the fields below.";
        errorBanner.classList.remove("hidden");
      }
      return;
    }

    const emailValue = emailInput.value.trim();

    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem("examhub_users") || "[]");
    const userExists = existingUsers.some(u => u.email.toLowerCase() === emailValue.toLowerCase());

    if (userExists) {
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
    submitBtn.innerHTML = `
      <i data-lucide="loader-2" class="animate-spin w-5 h-5"></i>
      Creating Account...
    `;
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }

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
      localStorage.setItem("examhub_users", JSON.stringify(existingUsers));

      successName.textContent = newUser.firstName;
      formCard.classList.add("hidden");
      successCard.classList.remove("hidden");

      // Reset submit button state
      submitBtn.disabled = false;
      submitBtn.innerHTML = origHtml;
      if (typeof lucide !== "undefined") {
        lucide.createIcons();
      }
    }, 1000);
  });

  // Handle Form Reset on success card button
  const resetForm = () => {
    nameInput.value = "";
    emailInput.value = "";
    passwordInput.value = "";
    confirmPasswordInput.value = "";
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

    if (container) {
      container.classList.add("hidden");
    }

    const items = [letter, capital, number, special, length];
    for (let i = 0; i < items.length; i++) {
      if (items[i]) {
        items[i].className = "flex items-center gap-2.5 text-xs text-error transition-colors";
        const span = items[i].querySelector("span");
        if (span) {
          span.className = "w-2 h-2 rounded-full bg-error inline-block shrink-0 transition-colors";
        }
      }
    }

    if (errorBanner) {
      errorBanner.classList.add("hidden");
    }

    successCard.classList.add("hidden");
    formCard.classList.remove("hidden");
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  };

  const registerAnotherBtn = document.getElementById("registerAnotherBtn");
  if (registerAnotherBtn) {
    registerAnotherBtn.addEventListener("click", resetForm);
  }

  // Initial Lucide parse
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
})();
