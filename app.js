/* ============================================================
   WELLET LANDING PAGE — JavaScript
   ============================================================ */

// --- SUPABASE CONFIG ---
const SUPABASE_URL = 'https://nrpdhxygzyfmyljzfexv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ycGRoeHlnenlmbXlsanpmZXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NTQ3MjUsImV4cCI6MjA5MTMzMDcyNX0.6gdj1hlW2UAc3gJOyjPJBeBJWth_Fcc5C5LH9zWyDXU';

// --- DARK MODE TOGGLE ---
(function () {
  const t = document.querySelector('[data-theme-toggle]');
  const r = document.documentElement;
  let d = matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  r.setAttribute('data-theme', d);
  if (t) {
    updateToggleIcon(t, d);
    t.addEventListener('click', () => {
      d = d === 'dark' ? 'light' : 'dark';
      r.setAttribute('data-theme', d);
      t.setAttribute('aria-label', 'Switch to ' + (d === 'dark' ? 'light' : 'dark') + ' mode');
      updateToggleIcon(t, d);
    });
  }
})();

function updateToggleIcon(btn, theme) {
  btn.innerHTML = theme === 'dark'
    ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
    : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
}

// --- SCROLL REVEAL ---
(function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
})();

// --- WAITLIST FORM ---
async function handleSignup(e) {
  e.preventDefault();

  const form = document.getElementById('signup-form');
  const errorEl = document.getElementById('form-error');
  const successEl = document.getElementById('form-success');
  const submitBtn = document.getElementById('submit-btn');
  const emailInput = document.getElementById('email-input');

  const email = emailInput.value.trim();
  const checked = Array.from(document.querySelectorAll('input[name="interest"]:checked')).map(cb => cb.value);
  const interest = checked.length === 2 ? 'both' : checked.length === 1 ? checked[0] : null;

  // Reset states
  errorEl.classList.remove('visible');
  errorEl.textContent = '';

  if (!interest) {
    errorEl.textContent = 'Please select at least one option.';
    errorEl.classList.add('visible');
    return false;
  }

  if (!email) {
    errorEl.textContent = 'Please enter your email address.';
    errorEl.classList.add('visible');
    return false;
  }

  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errorEl.textContent = 'Please enter a valid email address.';
    errorEl.classList.add('visible');
    return false;
  }

  // Disable button
  submitBtn.disabled = true;
  submitBtn.textContent = 'Joining...';

  try {
    const res = await fetch(SUPABASE_URL + '/rest/v1/waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ email, interest })
    });

    if (res.ok) {
      // Success
      form.style.display = 'none';
      successEl.classList.add('visible');
    } else if (res.status === 409 || (await res.text()).includes('duplicate')) {
      // Already signed up
      form.style.display = 'none';
      successEl.querySelector('p').textContent = "You're already on the list. We'll be in touch.";
      successEl.classList.add('visible');
    } else {
      errorEl.textContent = 'Something went wrong. Please try again.';
      errorEl.classList.add('visible');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Join waitlist';
    }
  } catch (err) {
    errorEl.textContent = 'Connection error. Please try again.';
    errorEl.classList.add('visible');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Join waitlist';
  }

  return false;
}

// --- SMOOTH SCROLL FOR NAV ---
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      // Close mobile nav if open
      document.querySelector('.nav-links').classList.remove('open');
    }
  });
});

// --- CLOSE MOBILE NAV ON LINK CLICK ---
document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.remove('open');
  });
});
