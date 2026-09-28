const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  mobileNav.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
}
menuButton.addEventListener('click', function () { setMenu(menuButton.getAttribute('aria-expanded') !== 'true'); });
mobileNav.querySelectorAll('a').forEach(function (link) { link.addEventListener('click', function () { setMenu(false); }); });
document.addEventListener('keydown', function (event) { if (event.key === 'Escape') setMenu(false); });
window.addEventListener('resize', function () { if (window.innerWidth > 900) setMenu(false); });
window.addEventListener('pageshow', function () { setMenu(false); });
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const reveals = document.querySelectorAll('.reveal');
if (reducedMotion.matches || !('IntersectionObserver' in window)) {
  reveals.forEach(function (element) { element.classList.add('visible'); });
} else {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px 40px 0px' });
  reveals.forEach(function (element) { observer.observe(element); });
}
document.getElementById('year').textContent = new Date().getFullYear();
