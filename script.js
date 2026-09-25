const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 36);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const setMenuState = open => {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  mobileNav.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
};

menuButton.addEventListener('click', () => {
  setMenuState(menuButton.getAttribute('aria-expanded') !== 'true');
});

mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenuState(false)));

window.addEventListener('resize', () => {
  if (window.innerWidth > 1000) setMenuState(false);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') setMenuState(false);
});

window.addEventListener('pageshow', () => setMenuState(false));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(element);
});

const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const target = entry.target;
    const end = Number(target.dataset.count);
    const suffix = target.dataset.suffix || '';
    const decimal = !Number.isInteger(end);
    const start = performance.now();
    const duration = 1300;
    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = end * eased;
      target.textContent = `${decimal ? value.toFixed(1).replace('.', ',') : Math.round(value)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObserver.unobserve(target);
  });
}, { threshold: 0.6 });

document.querySelectorAll('[data-count]').forEach(counter => countObserver.observe(counter));
document.getElementById('year').textContent = new Date().getFullYear();
