document.addEventListener("DOMContentLoaded", () => {
  const form      = document.getElementById('contact-form');
  const statusEl  = document.getElementById('form-status');
  const charCount = document.getElementById('char-count');
  const MAX_MSG   = 1000;

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const NAME_RE  = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,}$/;
  const PHONE_RE = /^[+\d\s\-()\u0660-\u0669]{7,20}$/; // supports Arabic-Indic digits too

  if (!form) return;

  // ── Helpers ──────────────────────────────────────────────

  const field = (name) => form.querySelector(`[name="${name}"]`);

  const errSpan = (input) => input.closest('.flex.flex-col').querySelector('.field-error');

  const setError = (input, msg) => {
    input.classList.add('input-error');
    input.setAttribute('aria-invalid', 'true');
    const sp = errSpan(input);
    if (sp) {
      sp.textContent = msg;
      sp.classList.remove('hidden');
    }
  };

  const clearError = (input) => {
    input.classList.remove('input-error');
    input.removeAttribute('aria-invalid');
    const sp = errSpan(input);
    if (sp) {
      sp.textContent = '';
      sp.classList.add('hidden');
    }
  };

  const showStatus = (msg, type) => {
    statusEl.textContent = msg;
    statusEl.className = 'text-sm font-medium rounded-xl px-4 py-3 ' +
      (type === 'success'
        ? 'bg-green-50 text-green-700'
        : 'bg-red-50 text-red-700');
    statusEl.classList.remove('hidden');
    statusEl.setAttribute('role', 'alert');
  };

  const hideStatus = () => {
    statusEl.classList.add('hidden');
    statusEl.removeAttribute('role');
  };

  // ── Character counter ─────────────────────────────────────

  const msgInput = field('message');
  if (msgInput && charCount) {
    msgInput.addEventListener('input', () => {
      const len = msgInput.value.length;
      charCount.textContent = `${len} / ${MAX_MSG}`;
      charCount.style.color = len > MAX_MSG ? '#ba1a1a' : '';
    });
  }

  // ── Clear errors on input ─────────────────────────────────

  Array.from(form.elements).forEach((el) => {
    el.addEventListener('input', () => {
      clearError(el);
      hideStatus();
    });
  });

  // ── Validate ──────────────────────────────────────────────

  const validate = (name, email, phone, subject, message) => {
    const errors = [];

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
  };

  // ── Submit ────────────────────────────────────────────────

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    hideStatus();

    const name    = (field('name').value    || '').trim();
    const email   = (field('email').value   || '').trim();
    const phone   = (field('phone').value   || '').trim();
    const subject = (field('subject').value || '').trim();
    const message = (field('message').value || '').trim();

    const errors = validate(name, email, phone, subject, message);

    if (errors.length) {
      errors.forEach((err) => setError(field(err.fieldName), err.msg));
      showStatus('Please fix the highlighted fields.', 'error');
      const firstField = field(errors[0].fieldName);
      if (firstField && firstField.focus) firstField.focus();
      return;
    }

    // Disable submit while sending
    const btn  = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.disabled = true;
    btn.setAttribute('aria-busy', 'true');
    btn.innerHTML = '<i data-lucide="loader-2" class="animate-spin w-[18px] h-[18px] inline-block mr-2"></i> Sending…';
    
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }

    // Simulate async submit
    setTimeout(() => {
      showStatus('Thanks — your message has been sent! We\'ll get back to you within 24 hours.', 'success');
      form.reset();
      if (charCount) charCount.textContent = `0 / ${MAX_MSG}`;
      btn.disabled = false;
      btn.removeAttribute('aria-busy');
      btn.innerHTML = orig;
      if (typeof lucide !== "undefined") {
        lucide.createIcons();
      }
    }, 900);
  });

  // Initial call to render Lucide icons in case they haven't been rendered yet
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
});