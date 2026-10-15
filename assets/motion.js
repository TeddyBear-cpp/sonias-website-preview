/* Real, optional gentle motion. No scroll listeners or animation framework. */
(() => {
  'use strict';
  const toggle = document.querySelector('#motion');
  const status = document.querySelector('#motion-status');
  if (!toggle || !status) return;
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const key = 'sonias-gentle-motion';
  let explicitChoice = null;
  try {
    const saved = sessionStorage.getItem(key);
    if (saved === 'on' || saved === 'off') explicitChoice = saved === 'on';
  } catch (_) { /* The switch still works when browser storage is blocked. */ }
  const candidates = [...document.querySelectorAll(
    '.food-story, .occasion-picture, .occasion-copy, .menu-panel-photo, .team-photos, .review-card, .gallery-item'
  )];
  candidates.forEach(element => element.classList.add('motion-reveal'));
  let observer;
  function applyMotion(enabled) {
    toggle.checked = enabled;
    document.body.classList.toggle('motion-enabled', enabled);
    document.body.classList.toggle('no-motion', !enabled);
    if (observer) observer.disconnect();
    candidates.forEach(element => element.classList.remove('is-pending'));
    status.textContent = enabled
      ? 'On — slow photo movement and gentle scroll reveals.'
      : 'Off — photos and page elements stay still.';
    if (!enabled || !('IntersectionObserver' in window)) return;
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('is-pending');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    candidates.forEach(element => {
      // Keep already visible content fully shown; reveal lower content on entry.
      if (element.getBoundingClientRect().top >= window.innerHeight) {
        element.classList.add('is-pending');
        observer.observe(element);
      }
    });
  }
  applyMotion(explicitChoice === null ? !media.matches : explicitChoice);
  toggle.addEventListener('change', () => {
    explicitChoice = toggle.checked;
    try { sessionStorage.setItem(key, explicitChoice ? 'on' : 'off'); } catch (_) {}
    applyMotion(explicitChoice);
  });
  media.addEventListener?.('change', () => {
    if (explicitChoice === null) applyMotion(!media.matches);
  });
})();
