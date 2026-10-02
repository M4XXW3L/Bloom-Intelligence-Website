/* ══════════════════════════════════════════════
   MUTAVO — main.js
   ══════════════════════════════════════════════ */

/* ─── Nav scroll effect ─── */
const nav = document.getElementById('nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ─── Mobile nav toggle ─── */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });
  navLinks.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ─── Smooth scroll for anchor links ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const navH = nav ? nav.offsetHeight : 0;
    window.scrollTo({ top: target.offsetTop - navH, behavior: 'smooth' });
  });
});

/* ─── Section reveal ─── */
(function initReveal() {
  const sections = document.querySelectorAll('.section');
  if (!sections.length) return;

  function revealSection(sec) {
    sec.querySelectorAll('.reveal-block, .stagger').forEach(el => {
      el.classList.add('revealed');
    });
  }

  // Hero reveals immediately on load
  setTimeout(() => {
    const hero = document.getElementById('sec-0');
    if (hero) revealSection(hero);
  }, 150);

  // All other sections reveal when they enter the viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      revealSection(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  sections.forEach((sec, i) => {
    if (i > 0) observer.observe(sec);
  });
})();

/* ─── Section dots ─── */
(function initDots() {
  const dots = document.querySelectorAll('.sec-dot');
  const sections = document.querySelectorAll('.section');
  if (!dots.length || !sections.length) return;

  function update() {
    const h = window.innerHeight;
    let active = 0;
    sections.forEach((sec, i) => {
      if (sec.getBoundingClientRect().top <= h * 0.45) active = i;
    });
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
      active = sections.length - 1;
    }
    dots.forEach((dot, i) => dot.classList.toggle('active', i === active));
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ─── Booking modal ─── */
(function initBooking() {
  const overlay    = document.getElementById('bookingModal');
  const modalBox   = document.getElementById('bookingModalBox');
  const closeBtn   = document.getElementById('modalClose');
  const backBtn    = document.getElementById('modalBack');
  const form       = document.getElementById('bookingForm');
  const step1      = document.getElementById('modalStep1');
  const step2      = document.getElementById('modalStep2');
  const step2Sub   = document.getElementById('step2Sub');
  const calendlyEl = document.getElementById('calendlyContainer');

  if (!overlay) return;

  function openModal() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      showStep1(false);
      form?.reset();
      if (calendlyEl) calendlyEl.innerHTML = '';
    }, 380);
  }

  function showStep1(animate = true) {
    step2?.classList.add('modal-step--hidden');
    step1?.classList.remove('modal-step--hidden');
    modalBox?.classList.remove('step2-active');
    if (animate && modalBox) modalBox.scrollTop = 0;
  }

  function showStep2(firstName, lastName, email) {
    if (step2Sub) {
      step2Sub.textContent = `Your details are pre-filled, ${firstName} — just pick a date and time below.`;
    }
    step1?.classList.add('modal-step--hidden');
    step2?.classList.remove('modal-step--hidden');
    modalBox?.classList.add('step2-active');
    if (modalBox) modalBox.scrollTop = 0;

    if (calendlyEl && typeof Calendly !== 'undefined') {
      calendlyEl.innerHTML = '';
      setTimeout(() => {
        Calendly.initInlineWidget({
          url: 'https://calendly.com/maxx-mutavo/30min?hide_gdpr_banner=1&primary_color=c9a45c',
          parentElement: calendlyEl,
          prefill: { name: `${firstName} ${lastName}`, email }
        });
      }, 80);
    }
  }

  // All [data-book] buttons open the modal
  document.querySelectorAll('[data-book]').forEach(btn => {
    btn.addEventListener('click', e => { e.preventDefault(); openModal(); });
  });

  closeBtn?.addEventListener('click', closeModal);
  backBtn?.addEventListener('click', () => showStep1());

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal();
  });

  form?.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const firstName = document.getElementById('mtv-firstName')?.value.trim() ?? '';
    const lastName  = document.getElementById('mtv-lastName')?.value.trim() ?? '';
    const email     = document.getElementById('mtv-email')?.value.trim() ?? '';
    showStep2(firstName, lastName, email);
  });
})();
