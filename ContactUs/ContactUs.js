(function () {
  'use strict';

  var form      = document.getElementById('contact-form');
  var statusEl  = document.getElementById('form-status');
  var charCount = document.getElementById('char-count');
  var MAX_MSG   = 1000;

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var NAME_RE  = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,}$/;
  var PHONE_RE = /^[+\d\s\-()\u0660-\u0669]{7,20}$/; // supports Arabic-Indic digits too

  if (!form) return;

  // ── Helpers ──────────────────────────────────────────────

  function field(name) {
    return form.querySelector('[name="' + name + '"]');
  }

  function errSpan(input) {
    return input.closest('.flex.flex-col').querySelector('.field-error');
  }

  function setError(input, msg) {
    input.classList.add('input-error');
    input.setAttribute('aria-invalid', 'true');
    var sp = errSpan(input);
    if (sp) { sp.textContent = msg; sp.classList.remove('hidden'); }
  }

  function clearError(input) {
    input.classList.remove('input-error');
    input.removeAttribute('aria-invalid');
    var sp = errSpan(input);
    if (sp) { sp.textContent = ''; sp.classList.add('hidden'); }
  }

  function showStatus(msg, type) {
    statusEl.textContent = msg;
    statusEl.className = 'text-sm font-medium rounded-xl px-4 py-3 ' +
      (type === 'success'
        ? 'bg-green-50 text-green-700'
        : 'bg-red-50 text-red-700');
    statusEl.classList.remove('hidden');
    statusEl.setAttribute('role', 'alert');
  }

  function hideStatus() {
    statusEl.classList.add('hidden');
    statusEl.removeAttribute('role');
  }

  // ── Character counter ─────────────────────────────────────

  var msgInput = field('message');
  if (msgInput && charCount) {
    msgInput.addEventListener('input', function () {
      var len = msgInput.value.length;
      charCount.textContent = len + ' / ' + MAX_MSG;
      charCount.style.color = len > MAX_MSG ? '#ba1a1a' : '';
    });
  }

  // ── Clear errors on input ─────────────────────────────────

  Array.prototype.forEach.call(form.elements, function (el) {
    el.addEventListener('input', function () {
      clearError(el);
      hideStatus();
    });
  });

  // ── Validate ──────────────────────────────────────────────

  function validate(name, email, phone, subject, message) {
    var errors = [];

    if (!name) {
      errors.push({ fieldName: 'name', msg: 'Name is required.' });
    } else if (!NAME_RE.test(name)) {
      errors.push({ fieldName: 'name', msg: 'Please enter a valid name (letters only, min 2 characters).' });
    }

    if (!email) {
      errors.push({ fieldName: 'email', msg: 'Email is required.' });
    } else if (!EMAIL_RE.test(email)) {
      errors.push({ fieldName: 'email', msg: 'Please enter a valid email address.' });
    }

    if (phone && !PHONE_RE.test(phone)) {
      errors.push({ fieldName: 'phone', msg: 'Please enter a valid phone number.' });
    }

    if (!subject) {
      errors.push({ fieldName: 'subject', msg: 'Subject is required.' });
    }

    if (!message) {
      errors.push({ fieldName: 'message', msg: 'Message is required.' });
    } else if (message.length > MAX_MSG) {
      errors.push({ fieldName: 'message', msg: 'Message must be under 1,000 characters.' });
    }

    return errors;
  }

  // ── Submit ────────────────────────────────────────────────

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    hideStatus();

    var name    = (field('name').value    || '').trim();
    var email   = (field('email').value   || '').trim();
    var phone   = (field('phone').value   || '').trim();
    var subject = (field('subject').value || '').trim();
    var message = (field('message').value || '').trim();

    var errors = validate(name, email, phone, subject, message);

    if (errors.length) {
      errors.forEach(function (err) { setError(field(err.fieldName), err.msg); });
      showStatus('Please fix the highlighted fields.', 'error');
      var firstField = field(errors[0].fieldName);
      if (firstField && firstField.focus) firstField.focus();
      return;
    }

    // Disable submit while sending
    var btn  = form.querySelector('button[type="submit"]');
    var orig = btn.innerHTML;
    btn.disabled = true;
    btn.setAttribute('aria-busy', 'true');
    btn.innerHTML = '<span class="material-symbols-outlined text-[18px]">hourglass_top</span> Sending…';

    // Simulate async submit — replace setTimeout with a real fetch() to your backend
    setTimeout(function () {
      showStatus('Thanks — your message has been sent! We\'ll get back to you within 24 hours.', 'success');
      form.reset();
      if (charCount) charCount.textContent = '0 / ' + MAX_MSG;
      btn.disabled = false;
      btn.removeAttribute('aria-busy');
      btn.innerHTML = orig;
    }, 900);
  });

})();