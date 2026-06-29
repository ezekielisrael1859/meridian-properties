/* ============================================
   MERIDIAN PROPERTIES — MAIN JAVASCRIPT
   assets/js/main.js
   ============================================ */

'use strict';

/* ── Utility ── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


/* ══════════════════════════════════════════
   1. NAVIGATION
══════════════════════════════════════════ */
const initNav = () => {
  const header    = $('#nav-header');
  const toggle    = $('#nav-toggle');
  const mobileNav = $('#nav-mobile');
  const mobileLinks = $$('.nav-mobile-link');

  if (!header || !toggle || !mobileNav) return;

  /* Scroll — add .scrolled class */
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Toggle mobile menu */
  const openMenu = () => {
    toggle.classList.add('open');
    mobileNav.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    toggle.classList.remove('open');
    mobileNav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () => {
    toggle.classList.contains('open') ? closeMenu() : openMenu();
  });

  /* Close on link click */
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* Close on Escape key */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
};


/* ══════════════════════════════════════════
   2. SCROLL REVEAL
══════════════════════════════════════════ */
const initReveal = () => {
  const elements = $$('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
};


/* ══════════════════════════════════════════
   3. ACTIVE BOTTOM NAV
══════════════════════════════════════════ */
const initBottomNav = () => {
  const navItems = $$('.bottom-nav-item');
  const sections = $$('section[id], div[id]');

  if (!navItems.length || !sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navItems.forEach(item => {
          const active = item.dataset.section === id;
          item.classList.toggle('active', active);
        });
      }
    });
  }, {
    threshold: 0.35
  });

  sections.forEach(sec => {
    if (['properties','about','services','contact'].includes(sec.id)) {
      observer.observe(sec);
    }
  });
};


/* ══════════════════════════════════════════
   4. FAQ ACCORDION
══════════════════════════════════════════ */
const initFAQ = () => {
  const items = $$('.faq-item');

  items.forEach(item => {
    const btn    = $('.faq-q', item);
    const answer = $('.faq-a', item);

    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      /* Close all */
      items.forEach(i => {
        const b = $('.faq-q', i);
        const a = $('.faq-a', i);
        if (b && a) {
          b.setAttribute('aria-expanded', 'false');
          a.hidden = true;
        }
      });

      /* Open clicked if it was closed */
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.hidden = false;
      }
    });
  });
};


/* ══════════════════════════════════════════
   5. WHATSAPP FORM SUBMISSION
══════════════════════════════════════════ */
const initForm = () => {
  const form = $('#contact-form');
  if (!form) return;

  /* Replace with real WhatsApp number — digits only, no + or spaces */
  const WA_NUMBER = '2348000000000';

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name     = $('#f-name', form).value.trim();
    const phone    = $('#f-phone', form).value.trim();
    const email    = $('#f-email', form).value.trim();
    const interest = $('#f-interest', form).value;
    const budget   = $('#f-budget', form).value;
    const message  = $('#f-message', form).value.trim();

    /* Basic validation */
    if (!name) {
      showFormError('Please enter your full name.');
      $('#f-name', form).focus();
      return;
    }
    if (!phone) {
      showFormError('Please enter your phone number.');
      $('#f-phone', form).focus();
      return;
    }
    if (!interest) {
      showFormError('Please select your property interest.');
      $('#f-interest', form).focus();
      return;
    }

    /* Build WhatsApp message */
    const lines = [
      `*New Enquiry — Meridian Properties*`,
      ``,
      `*Name:* ${name}`,
      `*Phone:* ${phone}`,
      email    ? `*Email:* ${email}`        : null,
      interest ? `*Property Interest:* ${interest}` : null,
      budget   ? `*Budget Range:* ${budget}` : null,
      message  ? `*Message:* ${message}`    : null,
      ``,
      `_Sent via meridianproperties.com_`
    ].filter(l => l !== null).join('\n');

    const encoded = encodeURIComponent(lines);
    const waURL   = `https://wa.me/${WA_NUMBER}?text=${encoded}`;

    /* Open WhatsApp */
    window.open(waURL, '_blank', 'noopener,noreferrer');

    /* Show success state */
    showFormSuccess();
  });
};

const showFormError = (msg) => {
  removeFormMessage();
  const el = document.createElement('p');
  el.className = 'form-message form-message--error';
  el.textContent = msg;
  el.style.cssText = `
    color: #e57373;
    font-size: 0.8rem;
    margin-bottom: 1rem;
    padding: 0.75rem 1rem;
    background: rgba(229,115,115,0.08);
    border: 1px solid rgba(229,115,115,0.25);
    border-radius: 4px;
  `;
  const submit = $('.form-submit');
  if (submit) submit.insertAdjacentElement('beforebegin', el);
  setTimeout(removeFormMessage, 5000);
};

const showFormSuccess = () => {
  removeFormMessage();
  const el = document.createElement('p');
  el.className = 'form-message form-message--success';
  el.textContent = '✓ Opening WhatsApp with your enquiry. We will respond within 24 hours.';
  el.style.cssText = `
    color: #81c784;
    font-size: 0.8rem;
    margin-bottom: 1rem;
    padding: 0.75rem 1rem;
    background: rgba(129,199,132,0.08);
    border: 1px solid rgba(129,199,132,0.25);
    border-radius: 4px;
  `;
  const submit = $('.form-submit');
  if (submit) submit.insertAdjacentElement('beforebegin', el);
};

const removeFormMessage = () => {
  $$('.form-message').forEach(el => el.remove());
};


/* ══════════════════════════════════════════
   6. SMOOTH SCROLL (fallback for older Safari)
══════════════════════════════════════════ */
const initSmoothScroll = () => {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id  = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      const offset = 80; /* nav height */
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
};


/* ══════════════════════════════════════════
   7. PROPERTY CARD — TILT ON HOVER (desktop)
══════════════════════════════════════════ */
const initCardTilt = () => {
  if (window.matchMedia('(hover: none)').matches) return;

  $$('.prop-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -4;
      const rotateY = ((x - cx) / cx) *  4;

      card.style.transform =
        `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
};


/* ══════════════════════════════════════════
   8. HERO PARALLAX (desktop only, subtle)
══════════════════════════════════════════ */
const initParallax = () => {
  const heroImg = $('.hero-img');
  if (!heroImg) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroImg.style.transform = `translateY(${scrollY * 0.25}px)`;
      }
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
};


/* ══════════════════════════════════════════
   INIT ALL
══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
  initBottomNav();
  initFAQ();
  initForm();
  initSmoothScroll();
  initCardTilt();
  initParallax();
});