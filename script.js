/* Empowered Mind — shared interactions */

(function () {
  'use strict';

  const onReady = (fn) =>
    document.readyState !== 'loading'
      ? fn()
      : document.addEventListener('DOMContentLoaded', fn);

  onReady(function () {
    initNav();
    initMobileMenu();
    initSmoothAnchors();
    initScrollFadeIn();
    initFaq();
    initApplyForm();
    initActiveNav();
    initHeroVideo();
    initFoamParticles();
  });

  /* ---- Nav scroll state ---- */
  function initNav() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Mobile menu toggle ---- */
  function initMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const menu = document.querySelector('.nav-links');
    if (!btn || !menu) return;
    btn.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open);
    });
    menu.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        menu.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', false);
      })
    );
  }

  /* ---- Smooth scroll for in-page anchors ---- */
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.pageYOffset - 70;
        window.scrollTo({ top: y, behavior: 'smooth' });
      });
    });
  }

  /* ---- Scroll fade-in ---- */
  function initScrollFadeIn() {
    const els = document.querySelectorAll('.fade-up');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('visible'));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => obs.observe(el));
  }

  /* ---- FAQ accordion ---- */
  function initFaq() {
    document.querySelectorAll('.faq-item').forEach((item) => {
      const q = item.querySelector('.faq-q');
      const a = item.querySelector('.faq-a');
      if (!q || !a) return;
      q.setAttribute('aria-expanded', 'false');
      q.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close any open siblings in the same list (single-open behavior)
        const list = item.closest('.faq-list');
        if (list) {
          list.querySelectorAll('.faq-item.open').forEach((other) => {
            if (other !== item) {
              other.classList.remove('open');
              const oa = other.querySelector('.faq-a');
              const oq = other.querySelector('.faq-q');
              if (oa) oa.style.maxHeight = '0px';
              if (oq) oq.setAttribute('aria-expanded', 'false');
            }
          });
        }
        item.classList.toggle('open', !isOpen);
        if (!isOpen) {
          a.style.maxHeight = a.scrollHeight + 'px';
          q.setAttribute('aria-expanded', 'true');
        } else {
          a.style.maxHeight = '0px';
          q.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  /* ---- Apply form ---- */
  function initApplyForm() {
    const form = document.querySelector('#apply-form');
    if (!form) return;

    // Pre-select inquiry type from `?inquiry=group|waitlist|csrt|...`
    const params = new URLSearchParams(location.search);
    const preset = params.get('inquiry');
    if (preset) {
      const sel = form.querySelector('#inquiry');
      if (sel && Array.from(sel.options).some((o) => o.value === preset)) {
        sel.value = preset;
      }
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      // Build a mailto fallback so the user always has a delivery path
      const fields = [];
      data.forEach((value, key) => {
        if (value && String(value).trim() !== '') fields.push(`${prettyKey(key)}: ${value}`);
      });
      // Group multi-value (availability) into one line
      const avail = data.getAll('availability').filter(Boolean);
      const body = [
        'New application from Empowered Mind site:',
        '',
        ...fields.filter((line) => !line.startsWith('Availability:')),
        avail.length ? `Availability: ${avail.join(', ')}` : null,
      ]
        .filter(Boolean)
        .join('\n');

      const subject = encodeURIComponent('New CSRT application — Empowered Mind site');
      const mailto = `mailto:Drtubero03@gmail.com?subject=${subject}&body=${encodeURIComponent(body)}`;

      // Open mail client in a new tab so the success state still shows
      try { window.open(mailto, '_blank'); } catch (_) { window.location.href = mailto; }

      const wrap = form.closest('.form-wrap');
      if (wrap) {
        wrap.classList.add('submitted');
        const thanks = wrap.querySelector('.form-thanks');
        if (thanks) {
          thanks.classList.add('show');
          thanks.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });

    function prettyKey(k) {
      const map = {
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        inquiry: 'Reaching out about',
        source: 'How did you hear about Dr. Tubero',
        message: 'What brings you here',
        therapy_history: 'Therapy history',
        availability: 'Availability',
      };
      return map[k] || k;
    }
  }

  /* ---- Ocean: hero video fade-in ---- */
  function initHeroVideo() {
    const v = document.querySelector('.hero-video');
    if (!v) return;
    const reveal = () => v.classList.add('loaded');
    if (v.readyState >= 2) reveal();
    else v.addEventListener('loadeddata', reveal, { once: true });
    // Some browsers block autoplay until any user gesture; restart on first interaction
    const tryPlay = () => v.play().catch(() => {});
    document.addEventListener('click', tryPlay, { once: true, passive: true });
    document.addEventListener('touchstart', tryPlay, { once: true, passive: true });
  }

  /* ---- Ocean: drifting foam particles ---- */
  function initFoamParticles() {
    const host = document.getElementById('foamHost');
    if (!host) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const COUNT = 18;
    for (let i = 0; i < COUNT; i++) {
      const f = document.createElement('span');
      f.className = 'foam';
      const size = 4 + Math.random() * 8;
      f.style.width = size + 'px';
      f.style.height = size + 'px';
      f.style.left = Math.random() * 100 + '%';
      f.style.animationDuration = 14 + Math.random() * 18 + 's';
      f.style.animationDelay = -Math.random() * 25 + 's';
      f.style.opacity = 0.3 + Math.random() * 0.5;
      host.appendChild(f);
    }
  }

  /* ---- Active nav link ---- */
  function initActiveNav() {
    const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.nav-links a').forEach((a) => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      if (
        href === here ||
        (here === '' && href === 'index.html') ||
        (here === 'index.html' && href === 'index.html')
      ) {
        a.classList.add('active');
      }
    });
  }
})();
