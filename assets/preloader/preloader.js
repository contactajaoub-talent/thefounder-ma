/* TheFounder preloader: 2000 ms maximum, pas de dépendance. */
(() => {
  'use strict';
  const element = document.getElementById('thefounder-preloader');
  if (!element) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration = reducedMotion ? 120 : 2000;
  const finish = () => {
    window.clearTimeout(timeout);
    if (!element.isConnected) return;
    element.remove();
    document.dispatchEvent(new Event('thefounder:preloader-ready'));
  };
  // Keep the supplied 2 s sequence; also remove the DOM node at its CSS end.
  const timeout = window.setTimeout(finish, duration);
  element.addEventListener('animationend', event => {
    if (event.target === element && event.animationName === 'tfp-screen-out') finish();
  });
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', event => {
    if (event.matches) finish();
  }, {once:true});
})();
