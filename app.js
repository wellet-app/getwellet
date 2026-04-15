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
  const interest = 'both';

  // Reset states
  errorEl.classList.remove('visible');
  errorEl.textContent = '';

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
  submitBtn.textContent = 'Submitting...';

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

// --- FAQ ACCORDION ---
document.querySelectorAll('.faq-question').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all items
    document.querySelectorAll('.faq-item.open').forEach((openItem) => {
      openItem.classList.remove('open');
      openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    // Toggle clicked item (if it wasn't already open)
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

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

// --- EARLY ACCESS TIER MESSAGES ---
var EA_TIER_MESSAGES = {
  founding: 'You\'re in as a Founding Member. Wellet Pro is yours for life.',
  early: 'Locked in. You\'ll get Wellet Pro free for your first 12 months.',
  beta: 'You\'re on the Beta 250 list. Wellet Plus, on us for a year.'
};

// --- LOAD TIER COUNTS ---
function loadTierCounts() {
  fetch(SUPABASE_URL + '/rest/v1/tier_counts?select=*', {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
    }
  })
  .then(function(res) { return res.json(); })
  .then(function(data) {
    var row = Array.isArray(data) ? data[0] : data;
    if (!row) return;

    var tiers = [
      {
        key: 'founding',
        claimed: row.founding_claimed || 0,
        total: row.founding_total || 50
      },
      {
        key: 'early',
        claimed: row.early_claimed || 0,
        total: row.early_total || 100
      },
      {
        key: 'beta',
        claimed: row.beta_claimed || 0,
        total: row.beta_total || 250
      }
    ];

    tiers.forEach(function(tier) {
      var fillEl = document.getElementById('ea-fill-' + tier.key);
      var countEl = document.getElementById('ea-count-' + tier.key);
      var cardEl = document.getElementById('ea-' + tier.key);

      if (!fillEl || !countEl || !cardEl) return;

      var pct = Math.min(100, Math.round((tier.claimed / tier.total) * 100));
      var remaining = tier.total - tier.claimed;

      fillEl.style.width = pct + '%';
      countEl.textContent = tier.claimed + ' of ' + tier.total + ' claimed';

      if (tier.claimed >= tier.total) {
        cardEl.classList.add('ea-card--sold-out');
        countEl.textContent = 'All ' + tier.total + ' spots claimed';
        var formEl = document.getElementById('ea-form-' + tier.key);
        if (formEl) { formEl.setAttribute('disabled', 'disabled'); }
      } else {
        cardEl.classList.remove('ea-card--sold-out');
      }
    });
  })
  .catch(function(err) {
    console.warn('Could not load tier counts:', err);
  });
}

// --- HANDLE EARLY ACCESS SIGNUP ---
function handleEarlyAccess(event, tier) {
  event.preventDefault();

  var form = event.target;
  var emailInput = form.querySelector('.ea-input');
  var submitBtn = form.querySelector('.ea-btn');
  var successEl = document.getElementById('ea-success-' + tier);
  var errorEl = document.getElementById('ea-error-' + tier);

  var email = emailInput ? emailInput.value.trim() : '';

  if (errorEl) { errorEl.classList.remove('visible'); errorEl.textContent = ''; }

  if (!email) {
    if (errorEl) { errorEl.textContent = 'Please enter your email address.'; errorEl.classList.add('visible'); }
    return false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    if (errorEl) { errorEl.textContent = 'Please enter a valid email address.'; errorEl.classList.add('visible'); }
    return false;
  }

  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Claiming...'; }

  fetch(SUPABASE_URL + '/rest/v1/waitlist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ email: email, interest: 'both', reward_tier: tier })
  })
  .then(function(res) {
    if (res.ok) {
      form.style.display = 'none';
      if (successEl) {
        successEl.querySelector('p').textContent = EA_TIER_MESSAGES[tier] || 'You\'re on the list!';
        successEl.classList.add('visible');
      }
      loadTierCounts();
    } else {
      return res.text().then(function(body) {
        if (res.status === 409 || body.indexOf('duplicate') !== -1) {
          form.style.display = 'none';
          if (successEl) {
            successEl.querySelector('p').textContent = 'You\'re already on the list.';
            successEl.classList.add('visible');
          }
        } else {
          if (errorEl) { errorEl.textContent = 'Something went wrong. Please try again.'; errorEl.classList.add('visible'); }
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Claim your spot'; }
        }
      });
    }
  })
  .catch(function(err) {
    if (errorEl) { errorEl.textContent = 'Connection error. Please try again.'; errorEl.classList.add('visible'); }
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Claim your spot'; }
  });

  return false;
}

// --- HERO BUTTON: SCROLL TO EARLY ACCESS ---
(function() {
  var heroBtn = document.querySelector('#signup-form .btn-primary');
  if (heroBtn) {
    heroBtn.addEventListener('click', function(e) {
      var target = document.getElementById('early-access');
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
})();

// --- INIT TIER COUNTS ON LOAD ---
document.addEventListener('DOMContentLoaded', function() {
  loadTierCounts();
  setInterval(loadTierCounts, 30000);
});
