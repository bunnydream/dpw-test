/* ══════════════════════════════════════════════════════════════
   SHARED SITE JS — included on every FINAL PAGES page (same pattern
   as shared.css). Sections that depend on elements not present on a
   given page (e.g. the voices carousel) guard on the element existing
   before doing anything, so this one file can be included
   unconditionally everywhere via <script src="../shared.js"></script>.
════════════════════════════════════════════════════════════════ */

/* ── MOBILE NAV ─────────────────────────────── */
(function () {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  if (!hamburger || !mobileMenu || !mobileClose) return;

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('open');
  });
  mobileClose.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });
}());

/* ── SCROLL REVEAL ──────────────────────────── */
(function () {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('vis'); revObs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  revealEls.forEach(el => revObs.observe(el));
}());

/* ── VOICES CAROUSEL — home "Trusted by real people" + impact
   "Real people. Real experiences." (both pages use the same
   #carouselTrack/#carouselDots/#prevBtn/#nextBtn ids) ── */
(function () {
  const track = document.getElementById('carouselTrack');
  if (!track) return;

  const dotsEl = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const cards = Array.from(track.querySelectorAll('.voice-card'));
  const TOTAL = cards.length;
  const GAP = 20;
  let idx = 0;

  /* Build square dot indicators */
  const dots = cards.map((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'c-dot' + (i === 0 ? ' c-dot--active' : '');
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-label', 'Quote ' + (i + 1));
    btn.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(btn);
    return btn;
  });

  function cardWidth() {
    const outerEl = track.parentElement;
    const pl = parseFloat(window.getComputedStyle(outerEl).paddingLeft) || 0;
    const visW = outerEl.offsetWidth - pl;
    if (window.innerWidth <= 768) {
      /* Mobile: exactly 1 card in view (right gutter matches left), no peek —
         next quote only appears once the user taps the arrow. */
      return Math.max(200, Math.floor(visW - pl));
    }
    /* 2 full cards + half of 3rd visible: solve 2.5*cw + gap = visW */
    return Math.max(200, Math.floor((visW - GAP) / 2.5));
  }

  function setWidths() {
    const cw = cardWidth();
    cards.forEach(c => { c.style.flexBasis = cw + 'px'; });
  }

  function goTo(i) {
    idx = Math.max(0, Math.min(i, TOTAL - 1));
    const cw = cardWidth();
    const offset = idx * (cw + GAP);
    track.style.transform = 'translateX(-' + offset + 'px)';
    dots.forEach((d, j) => d.classList.toggle('c-dot--active', j === idx));
    prevBtn.disabled = idx === 0;
    nextBtn.disabled = idx >= TOTAL - 1;
  }

  prevBtn.addEventListener('click', () => goTo(idx - 1));
  nextBtn.addEventListener('click', () => goTo(idx + 1));

  setWidths();
  goTo(0);
  window.addEventListener('resize', () => { setWidths(); goTo(idx); });
}());
