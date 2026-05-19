// Enhanced form handler: validation, char count, accessible feedback, simulated async submit
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');
const messageCount = document.getElementById('message-count');

const MAX_MESSAGE_LENGTH = 1000;

function setStatus(text, type = '') {
	if (!status) return;
	status.textContent = text;
	status.classList.remove('success', 'error');
	if (type) status.classList.add(type);
}

function markInvalid(el) {
	if (!el) return;
	el.classList.add('input-error');
	el.setAttribute('aria-invalid', 'true');
}

function clearInvalid(el) {
	if (!el) return;
	el.classList.remove('input-error');
	el.removeAttribute('aria-invalid');
}

function updateMessageCount() {
	if (!messageCount || !form) return;
	const value = form.message.value || '';
	const len = value.length;
	messageCount.textContent = `${len} / ${MAX_MESSAGE_LENGTH}`;
	if (len > MAX_MESSAGE_LENGTH) messageCount.classList.add('text-red-600');
	else messageCount.classList.remove('text-red-600');
}

async function simulateSubmit(data) {
	// This simulates an async submit; replace with real fetch to your API if available.
	await new Promise((r) => setTimeout(r, 900));
	return { ok: true };
}

if (form && status) {
	// live message counter
	if (form.message) {
		form.message.setAttribute('maxlength', MAX_MESSAGE_LENGTH);
		form.message.addEventListener('input', updateMessageCount);
		updateMessageCount();
	}

	// clear invalid state on input
	Array.from(form.elements).forEach((el) => {
		el.addEventListener && el.addEventListener('input', () => clearInvalid(el));
	});

	form.addEventListener('submit', async (event) => {
		event.preventDefault();

		setStatus('', '');

		const name = (form.name && form.name.value || '').trim();
		const email = (form.email && form.email.value || '').trim();
		const subject = (form.subject && form.subject.value || '').trim();
		const message = (form.message && form.message.value || '').trim();

		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		// basic validation
		let firstInvalid = null;
		if (!name) { markInvalid(form.name); firstInvalid = firstInvalid || form.name; }
		if (!email) { markInvalid(form.email); firstInvalid = firstInvalid || form.email; }
		if (email && !emailPattern.test(email)) { markInvalid(form.email); firstInvalid = firstInvalid || form.email; }
		if (!message) { markInvalid(form.message); firstInvalid = firstInvalid || form.message; }

		if (firstInvalid) {
			setStatus('Please fix the highlighted fields.', 'error');
			firstInvalid.focus();
			return;
		}

		// disable submit
		const submitBtn = form.querySelector('button[type="submit"]');
		if (submitBtn) {
			submitBtn.disabled = true;
			submitBtn.setAttribute('aria-busy', 'true');
			submitBtn.dataset.original = submitBtn.textContent;
			submitBtn.textContent = 'Sending...';
		}

		try {
			// replace simulateSubmit with a real fetch to your backend endpoint if available
			const payload = { name, email, subject, message };
			const res = await simulateSubmit(payload);

			if (res && res.ok) {
				setStatus('Thanks — your message has been sent.', 'success');
				form.reset();
				updateMessageCount();
			} else {
				setStatus('Unable to send message. Please try again later.', 'error');
			}
		} catch (err) {
			setStatus('An error occurred. Please try again.', 'error');
		} finally {
			if (submitBtn) {
				submitBtn.disabled = false;
				submitBtn.removeAttribute('aria-busy');
				submitBtn.textContent = submitBtn.dataset.original || 'Send message';
			}
		}
	});
}

