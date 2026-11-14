/* Reloads start at the archive cover; newly opened story links keep their target. */
(() => {
  const navigation = performance.getEntriesByType('navigation')[0];
  if (!navigation || navigation.type !== 'reload') return;

  const previousRestoration = history.scrollRestoration;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  // Remove a previous in-page selection before catalogue.js opens linked stories.
  if (location.hash) {
    history.replaceState(history.state, '', location.pathname + location.search);
  }
  const showCover = () => window.scrollTo(0, 0);
  showCover();
  window.addEventListener('load', showCover, { once: true });
  window.addEventListener('pageshow', () => {
    showCover();
    requestAnimationFrame(() => {
      showCover();
      if ('scrollRestoration' in history) history.scrollRestoration = previousRestoration;
    });
  }, { once: true });
})();
