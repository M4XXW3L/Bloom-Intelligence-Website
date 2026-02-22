/* ══════════════════════════════════════════════
   BLOOM INTELLIGENCE — main.js
   ══════════════════════════════════════════════ */

/* ─── Footer Year ─── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ─── Navbar Scroll Effect ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ─── Mobile Menu Toggle ─── */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});


/* ─── Scroll Reveal (Intersection Observer) ─── */
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .fade-up').forEach(el => observer.observe(el));
})();

/* ─── Animated Stat Counters ─── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = +el.dataset.target;
      const dur    = 1800;
      const step   = 16;
      const steps  = dur / step;
      let  current = 0;

      const timer = setInterval(() => {
        current += target / steps;
        if (current >= target) {
          el.textContent = target;
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current);
        }
      }, step);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* ─── Smooth Scroll for Anchor Links ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 16;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

/* ─── Hero Particles ─── */
(function initParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const COLORS = [
    'rgba(106,172,69,',   // --green
    'rgba(150,204,110,',  // --green-light
    'rgba(196,162,74,',   // --gold
    'rgba(58,108,38,',    // --green-dark
  ];

  let particles = [];
  let raf;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function makeParticle() {
    return {
      x:          Math.random() * canvas.width,
      y:          Math.random() * canvas.height,
      r:          Math.random() * 1.4 + 0.4,
      color:      COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha:      Math.random() * 0.35 + 0.08,
      vx:         (Math.random() - 0.5) * 0.25,
      vy:         -(Math.random() * 0.35 + 0.08),
      aDir:       Math.random() > 0.5 ? 1 : -1,
      aSpeed:     Math.random() * 0.0025 + 0.001,
    };
  }

  function init() {
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 11000), 110);
    for (let i = 0; i < count; i++) particles.push(makeParticle());
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha += p.aDir * p.aSpeed;
      if (p.alpha > 0.45) p.aDir = -1;
      if (p.alpha < 0.05) p.aDir =  1;

      // wrap
      if (p.y < -6)                  p.y = canvas.height + 6;
      if (p.x < -6)                  p.x = canvas.width  + 6;
      if (p.x > canvas.width  + 6)   p.x = -6;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha.toFixed(3) + ')';
      ctx.fill();
    }

    raf = requestAnimationFrame(tick);
  }

  resize();
  init();
  tick();

  window.addEventListener('resize', () => { resize(); init(); }, { passive: true });
})();

/* ─── Hero Fade-up on Load ─── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelector('.hero-content')?.classList.add('visible');
  }, 100);
});

/* ─── Booking Modal ─── */
(function initBookingModal() {
  const overlay    = document.getElementById('bookingModal');
  const modalBox   = document.getElementById('bookingModalBox');
  const closeBtn   = document.getElementById('modalClose');
  const backBtn    = document.getElementById('modalBack');
  const form       = document.getElementById('bookingForm');
  const step1      = document.getElementById('modalStep1');
  const step2      = document.getElementById('modalStep2');
  const step2Sub   = document.getElementById('step2Sub');
  const calendlyEl = document.getElementById('calendlyContainer');

  function openModal() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    // Reset fully after fade-out
    setTimeout(() => {
      showStep1(false);
      form.reset();
      calendlyEl.innerHTML = '';
    }, 380);
  }

  function showStep1(animate = true) {
    step2.classList.add('modal-step--hidden');
    step1.classList.remove('modal-step--hidden');
    modalBox.classList.remove('step2-active');
    if (!animate) return;
    // Scroll modal back to top
    modalBox.scrollTop = 0;
  }

  function showStep2(firstName, lastName, email) {
    // Build a friendly greeting for the subtitle
    step2Sub.textContent =
      `Your details are pre-filled, ${firstName} — just pick a date and time below.`;

    step1.classList.add('modal-step--hidden');
    step2.classList.remove('modal-step--hidden');
    modalBox.classList.add('step2-active');
    modalBox.scrollTop = 0;

    // Small delay so the DOM is fully painted before Calendly measures the container
    calendlyEl.innerHTML = '';
    setTimeout(() => {
      Calendly.initInlineWidget({
        url: 'https://calendly.com/maxx-bloom-intelligence/30min?hide_gdpr_banner=1&primary_color=6aac45',
        parentElement: calendlyEl,
        prefill: {
          name:  `${firstName} ${lastName}`,
          email: email
        }
      });
    }, 80);
  }

  // Open modal on all [data-book] buttons
  document.querySelectorAll('[data-book]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      openModal();
    });
  });

  closeBtn.addEventListener('click', closeModal);
  backBtn.addEventListener('click', () => showStep1());

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal();
  });

  // Step 1 form submit → go to Calendly with everything pre-filled
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const firstName = document.getElementById('bi-firstName').value.trim();
    const lastName  = document.getElementById('bi-lastName').value.trim();
    const email     = document.getElementById('bi-email').value.trim();
    showStep2(firstName, lastName, email);
  });
})();
