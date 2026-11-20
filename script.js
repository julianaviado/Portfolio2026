/* Portfolio interactions. Every feature degrades gracefully without JS. */
(() => {
  'use strict';

  /* ---------- Primary Nav (mobile toggle) ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.getElementById('primary-nav');

  const setNavOpen = (open) => {
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.querySelector('.nav-toggle__label').textContent = open ? 'Close' : 'Menu';
    primaryNav.classList.toggle('is-open', open);
  };

  navToggle.addEventListener('click', () => {
    setNavOpen(navToggle.getAttribute('aria-expanded') !== 'true');
  });

  primaryNav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setNavOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && primaryNav.classList.contains('is-open')) {
      setNavOpen(false);
      navToggle.focus();
    }
  });

  /* ---------- Current-section highlight in nav ---------- */
  const navLinks = [...document.querySelectorAll('.primary-nav__link[href^="#"]')];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.setAttribute('aria-current', 'location');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* ---------- Case Study Filter ---------- */
  const filterChips = document.querySelectorAll('.filter-chip');
  const caseCards = document.querySelectorAll('.case-card');
  const filterStatus = document.querySelector('.filter-status');
  const filterNames = { ai: 'AI & Agents', monetization: 'Monetization', growth: 'Growth' };

  filterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const filter = chip.dataset.filter;
      let visible = 0;

      filterChips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      caseCards.forEach((card) => {
        const match = filter === 'all' || card.dataset.tags.split(' ').includes(filter);
        card.hidden = !match;
        if (match) visible += 1;
      });

      const noun = visible === 1 ? 'case study' : 'case studies';
      filterStatus.textContent = filter === 'all'
        ? `Showing ${visible} ${noun}`
        : `Showing ${visible} ${noun} in ${filterNames[filter]}`;
    });
  });

  /* ---------- Case Study Dialogs ---------- */
  document.querySelectorAll('.case-card__open').forEach((button) => {
    const dialog = document.getElementById(button.dataset.dialog);
    if (!dialog || typeof dialog.showModal !== 'function') return;

    button.addEventListener('click', () => dialog.showModal());
    dialog.querySelector('.case-dialog__close').addEventListener('click', () => dialog.close());

    // Click on the backdrop closes the dialog
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });

    // Return focus to the trigger
    dialog.addEventListener('close', () => button.focus());
  });

  /* ---------- Copy email ---------- */
  const copyButton = document.querySelector('.copy-email');
  const copyStatus = document.querySelector('.copy-email__status');

  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(copyButton.dataset.email);
      copyStatus.textContent = 'Copied to clipboard. Ctrl+V responsibly.';
    } catch {
      copyStatus.textContent = `Couldn’t copy. The address is ${copyButton.dataset.email}.`;
    }
  });

  /* ---------- A note for anyone who opens DevTools ---------- */
  console.log(
    '%cHey, you opened the console. 👋\n%cThe CSS is hand-written, the layers are named, and there are zero !important hacks outside the reduced-motion block. Let’s build something: #contact',
    'font: 600 16px Georgia, serif; color: #6A2423;',
    'font: 13px system-ui, sans-serif; color: #1E1B1A;'
  );
})();
