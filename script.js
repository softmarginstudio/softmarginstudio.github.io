
const content = document.getElementById('contentBlock');
const noteWrap = document.getElementById('noteWrap');
const toggle = document.getElementById('noteToggle');
const form = document.getElementById('contactForm');
const sentState = document.getElementById('sentState');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const phoneInput = form?.querySelector('input[name="phone"]');

const fieldMessages = {
  name: {
    valueMissing: 'please enter your name',
    patternMismatch: 'please enter a valid name',
    tooShort: 'name is too short'
  },
  email: {
    valueMissing: 'please enter your email',
    typeMismatch: 'please enter a valid email',
    patternMismatch: 'please enter a valid email'
  },
  phone: {
    patternMismatch: 'use 1-xxx-xxx-xxxx'
  },
  message: {
    valueMissing: 'please add a short note',
    tooShort: 'please add a little more detail'
  }
};

function getFieldError(input) {
  if (!input) return null;
  return input.closest('.field')?.querySelector('.field-error') || null;
}

function customMessage(input) {
  if (!input?.validity) return '';
  const map = fieldMessages[input.name] || {};
  if (input.validity.valueMissing && map.valueMissing) return map.valueMissing;
  if (input.validity.typeMismatch && map.typeMismatch) return map.typeMismatch;
  if (input.validity.patternMismatch && map.patternMismatch) return map.patternMismatch;
  if (input.validity.tooShort && map.tooShort) return map.tooShort;
  if (input.validity.tooLong && map.tooLong) return map.tooLong;
  return input.validationMessage || '';
}

function updateFieldState(input) {
  const field = input.closest('.field');
  const error = getFieldError(input);
  if (!field || !error) return input.checkValidity();

  const emptyOptional = !input.required && !input.value.trim();
  const valid = input.checkValidity() || emptyOptional;

  field.classList.remove('has-error');
  input.classList.remove('is-invalid', 'is-valid');

  if (emptyOptional) {
    error.textContent = '';
    return true;
  }

  if (valid) {
    error.textContent = '';
    input.classList.add('is-valid');
    return true;
  }

  field.classList.add('has-error');
  input.classList.add('is-invalid');
  error.textContent = customMessage(input);
  return false;
}

function validateForm() {
  const controls = Array.from(form.querySelectorAll('input, textarea'));
  let firstInvalid = null;
  let allValid = true;

  controls.forEach((control) => {
    const valid = updateFieldState(control);
    if (!valid && !firstInvalid) firstInvalid = control;
    allValid = allValid && valid;
  });

  if (!allValid) firstInvalid?.focus();
  return allValid;
}

function formatUSPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (!digits) return '';
  let normalized = digits;
  if (!normalized.startsWith('1')) normalized = `1${normalized.slice(0, 10)}`;
  normalized = normalized.slice(0, 11);

  const a = normalized.slice(1, 4);
  const b = normalized.slice(4, 7);
  const c = normalized.slice(7, 11);

  let out = '1';
  if (a) out += `-${a}`;
  if (b) out += `-${b}`;
  if (c) out += `-${c}`;
  return out;
}

toggle?.addEventListener('click', () => {
  if (noteWrap.classList.contains('sent')) return;
  const isOpen = noteWrap.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(isOpen));
  if (isOpen) {
    const firstInput = form.querySelector('input, textarea');
    setTimeout(() => firstInput?.focus(), 560);
  }
});

if (form) {
  form.querySelectorAll('input, textarea').forEach((control) => {
    control.addEventListener('blur', () => updateFieldState(control));
    control.addEventListener('input', () => {
      if (control === phoneInput) {
        const start = control.selectionStart;
        const beforeLength = control.value.length;
        control.value = formatUSPhone(control.value);
        const afterLength = control.value.length;
        const nextPos = Math.max(0, (start || 0) + (afterLength - beforeLength));
        requestAnimationFrame(() => control.setSelectionRange(nextPos, nextPos));
      }
      if (control.closest('.field')?.classList.contains('has-error') || control.classList.contains('is-valid')) {
        updateFieldState(control);
      }
    });
  });
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!validateForm()) return;

  const data = new FormData(form);
  noteWrap.classList.add('is-submitting');

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) throw new Error('Submission failed');

    form.reset();
    form.querySelectorAll('input, textarea').forEach((control) => {
      control.classList.remove('is-valid', 'is-invalid');
      const field = control.closest('.field');
      const error = getFieldError(control);
      field?.classList.remove('has-error');
      if (error) error.textContent = '';
    });

    noteWrap.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');

    setTimeout(() => {
      noteWrap.classList.remove('is-submitting');
      noteWrap.classList.add('sent');
      toggle.setAttribute('aria-hidden', 'true');
      sentState.textContent = 'sent';
    }, 720);
  } catch (error) {
    noteWrap.classList.remove('is-submitting');
    const messageField = form.querySelector('textarea[name="message"]');
    const field = messageField?.closest('.field');
    const errorNode = getFieldError(messageField);
    field?.classList.add('has-error');
    if (errorNode) errorNode.textContent = 'something went wrong — please try again';
  }
});

if (!prefersReducedMotion) {
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  window.addEventListener('mousemove', (event) => {
    const x = (event.clientX / window.innerWidth) - 0.5;
    const y = (event.clientY / window.innerHeight) - 0.5;
    targetX = x;
    targetY = y;
  });

  const ambientA = document.querySelector('.ambient-a');
  const ambientB = document.querySelector('.ambient-b');
  const footer = document.querySelector('.footer');

  const animate = () => {
    currentX += (targetX - currentX) * 0.03;
    currentY += (targetY - currentY) * 0.03;

    const moveX = currentX * 34;
    const moveY = currentY * 30;

    if (content) {
      content.style.transform = `translate3d(calc(-50% + ${moveX * 0.95}px), calc(-50% + ${moveY * 0.92}px), 0)`;
    }

    if (footer) {
      footer.style.transform = `translate3d(calc(-50% + ${moveX * 0.28}px), ${moveY * 0.2}px, 0)`;
    }

    if (ambientA) {
      ambientA.style.transform = `translate3d(${moveX * -0.88}px, ${moveY * -0.92}px, 0)`;
    }

    if (ambientB) {
      ambientB.style.transform = `translate3d(${moveX * 0.72}px, ${moveY * 0.82}px, 0)`;
    }

    requestAnimationFrame(animate);
  };

  animate();
}
