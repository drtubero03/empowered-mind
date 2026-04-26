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
  const RELAY_URL = 'https://empowered-mind-mailer-472495368361.us-east1.run.app/apply';

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

    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const submitBtn = form.querySelector('.form-submit');
      const errorBox = form.querySelector('.form-error');
      if (errorBox) { errorBox.classList.remove('show'); errorBox.textContent = ''; }
      const originalLabel = submitBtn ? submitBtn.innerHTML : null;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending…';
      }

      const fd = new FormData(form);
      const payload = {
        name: (fd.get('name') || '').trim(),
        email: (fd.get('email') || '').trim(),
        phone: (fd.get('phone') || '').trim(),
        inquiry: fd.get('inquiry') || '',
        source: fd.get('source') || '',
        message: (fd.get('message') || '').trim(),
        therapy_history: fd.get('therapy_history') || '',
        availability: fd.getAll('availability'),
        website: fd.get('website') || '', // honeypot
      };

      // Basic client-side guard — server validates as well
      if (!payload.name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(payload.email)) {
        showError(errorBox, 'Please add a name and a valid email.');
        restoreButton(submitBtn, originalLabel);
        return;
      }

      let success = false;
      let serverErr = null;
      try {
        const r = await fetch(RELAY_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (r.ok) {
          success = true;
        } else {
          let body = null;
          try { body = await r.json(); } catch (_) {}
          serverErr = (body && body.error) || `HTTP ${r.status}`;
        }
      } catch (e) {
        serverErr = 'network';
      }

      if (success) {
        showThanks(form);
        return;
      }

      // Fallback — give the user a one-click mailto path so the message isn't lost
      const subject = encodeURIComponent('New application — Empowered Mind site');
      const lines = [];
      lines.push(`Name: ${payload.name}`);
      lines.push(`Email: ${payload.email}`);
      if (payload.phone) lines.push(`Phone: ${payload.phone}`);
      if (payload.inquiry) lines.push(`Reaching out about: ${payload.inquiry}`);
      if (payload.source) lines.push(`Heard via: ${payload.source}`);
      if (payload.therapy_history) lines.push(`Therapy history: ${payload.therapy_history}`);
      if (payload.availability && payload.availability.length) {
        lines.push(`Availability: ${payload.availability.join(', ')}`);
      }
      if (payload.message) {
        lines.push('');
        lines.push('What brings you here:');
        lines.push(payload.message);
      }
      const mailto = `mailto:Drtubero03@gmail.com?subject=${subject}&body=${encodeURIComponent(lines.join('\n'))}`;

      showError(
        errorBox,
        `We couldn't reach the server (${serverErr || 'unknown'}). `,
        { mailto, label: 'Send via your email app instead →' }
      );
      restoreButton(submitBtn, originalLabel);
    });

    function restoreButton(btn, html) {
      if (!btn) return;
      btn.disabled = false;
      if (html != null) btn.innerHTML = html;
    }
    function showError(box, text, link) {
      if (!box) { alert(text); return; }
      box.classList.add('show');
      box.innerHTML = '';
      box.appendChild(document.createTextNode(text));
      if (link && link.mailto) {
        const a = document.createElement('a');
        a.href = link.mailto;
        a.textContent = link.label || 'Send via email instead';
        box.appendChild(a);
      }
    }
    function showThanks(formEl) {
      const wrap = formEl.closest('.form-wrap');
      if (!wrap) return;
      wrap.classList.add('submitted');
      const thanks = wrap.querySelector('.form-thanks');
      if (thanks) {
        thanks.classList.add('show');
        thanks.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
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
