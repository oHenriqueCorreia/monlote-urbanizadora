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

const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
const galleryItems = Array.from(document.querySelectorAll('[data-gallery-item]'));
let visibleItems = galleryItems;
filterButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    const filter = button.dataset.filter;
    filterButtons.forEach(function (item) {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    galleryItems.forEach(function (item) { item.hidden = filter !== 'todos' && item.dataset.category !== filter; });
    visibleItems = galleryItems.filter(function (item) { return !item.hidden; });
  });
});

const dialog = document.querySelector('.gallery-dialog');
const dialogImage = dialog.querySelector('img');
const dialogCaption = dialog.querySelector('[data-dialog-caption]');
let galleryIndex = 0;
function showImage(index) {
  if (!visibleItems.length) return;
  galleryIndex = (index + visibleItems.length) % visibleItems.length;
  const item = visibleItems[galleryIndex];
  dialogImage.src = item.querySelector('img').src;
  dialogImage.alt = item.querySelector('img').alt;
  dialogCaption.textContent = item.dataset.caption;
}
galleryItems.forEach(function (item) {
  item.addEventListener('click', function () {
    showImage(visibleItems.indexOf(item));
    dialog.showModal();
  });
});
dialog.querySelector('[data-dialog-prev]').addEventListener('click', function () { showImage(galleryIndex - 1); });
dialog.querySelector('[data-dialog-next]').addEventListener('click', function () { showImage(galleryIndex + 1); });
dialog.querySelector('[data-dialog-close]').addEventListener('click', function () { dialog.close(); });
dialog.addEventListener('click', function (event) { if (event.target === dialog) dialog.close(); });
document.addEventListener('keydown', function (event) {
  if (!dialog.open) return;
  if (event.key === 'ArrowLeft') showImage(galleryIndex - 1);
  if (event.key === 'ArrowRight') showImage(galleryIndex + 1);
});
document.getElementById('year').textContent = new Date().getFullYear();
