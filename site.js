/* YUNISA portfolio interactions: accessible navigation, filtering and video viewer. */
(() => {
  const row = document.querySelector('.navrow');
  const nav = row?.querySelector('nav');
  if (row && nav) {
    nav.id = nav.id || 'portfolio-navigation';
    nav.setAttribute('aria-label', nav.getAttribute('aria-label') || 'Main navigation');
    const toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-controls', nav.id);
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    toggle.innerHTML = '<span>Menu</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    row.insertBefore(toggle, nav);
    const closeMenu = () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
    };
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    });
    nav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
    document.addEventListener('click', e => { if (!row.contains(e.target)) closeMenu(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 850) closeMenu(); });
    document.documentElement.classList.add('js-ready');
  }

  const filters = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('[data-category]')];
  filters.forEach(button => {
    button.setAttribute('aria-pressed', String(button.classList.contains('on')));
    button.addEventListener('click', () => {
      filters.forEach(item => {
        const selected = item === button;
        item.classList.toggle('on', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      const category = button.dataset.filter;
      cards.forEach(card => { card.hidden = !(category === 'All' || card.dataset.category === category); });
    });
  });
})();
let lastVideoTrigger = null;
function previewVideo(id) {
  const box = document.getElementById('viewer');
  if (!box || !id) return;
  const frame = box.querySelector('iframe');
  if (!frame) return;
  lastVideoTrigger = document.activeElement;
  frame.src = 'https://drive.google.com/file/d/' + encodeURIComponent(id) + '/preview';
  box.classList.add('active');
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Video preview');
  const close = box.querySelector('.close');
  if (close) close.focus();
}
function closeVideo() {
  const box = document.getElementById('viewer');
  if (!box || !box.classList.contains('active')) return;
  box.classList.remove('active');
  const frame = box.querySelector('iframe');
  if (frame) frame.src = '';
  if (lastVideoTrigger?.focus) lastVideoTrigger.focus();
}
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeVideo();
    const nav = document.querySelector('.navrow > nav');
    const toggle = document.querySelector('.nav-toggle');
    if (nav?.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      toggle?.setAttribute('aria-expanded', 'false');
      toggle?.focus();
    }
  }
});
