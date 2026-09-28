const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  mobileNav.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
}
menuButton.addEventListener('click', function () {
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});
mobileNav.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () { setMenu(false); });
});
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') setMenu(false);
});
window.addEventListener('resize', function () {
  if (window.innerWidth > 900) setMenu(false);
});
window.addEventListener('pageshow', function () { setMenu(false); });

const heroWord = document.querySelector('[data-hero-word]');
const heroWords = ['transforma.', 'conecta.', 'valoriza.'];
let heroWordIndex = 0;
if (!reducedMotion.matches) {
  window.setInterval(function () {
    heroWord.classList.add('is-changing');
    window.setTimeout(function () {
      heroWordIndex = (heroWordIndex + 1) % heroWords.length;
      heroWord.textContent = heroWords[heroWordIndex];
      heroWord.classList.remove('is-changing');
    }, 360);
  }, 3800);
}

function setupSlider(slideSelector, dotSelector) {
  const slides = Array.from(document.querySelectorAll(slideSelector));
  const dots = Array.from(document.querySelectorAll(dotSelector));
  let current = 0;
  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.hidden = i !== current;
      slide.classList.toggle('is-active', i === current);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === current);
      if (i === current) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { show(i); });
  });
  show(0);
  return { show: show, next: function () { show(current + 1); }, prev: function () { show(current - 1); } };
}
const storySlider = setupSlider('[data-story-slide]', '[data-story-to]');

let storyTimer;
function startStoryTimer() {
  if (!reducedMotion.matches && !storyTimer) {
    storyTimer = window.setInterval(storySlider.next, 7000);
  }
}
function stopStoryTimer() {
  window.clearInterval(storyTimer);
  storyTimer = null;
}
const storySection = document.querySelector('.story');
storySection.addEventListener('mouseenter', stopStoryTimer);
storySection.addEventListener('mouseleave', startStoryTimer);
storySection.addEventListener('focusin', stopStoryTimer);
storySection.addEventListener('focusout', function (event) {
  if (!storySection.contains(event.relatedTarget)) startStoryTimer();
});
document.addEventListener('visibilitychange', function () {
  if (document.hidden) stopStoryTimer();
  else startStoryTimer();
});
startStoryTimer();

const expertiseButtons = Array.from(document.querySelectorAll('[data-expertise]'));
const expertiseDetails = Array.from(document.querySelectorAll('[data-expertise-detail]'));
expertiseButtons.forEach(function (button, index) {
  button.addEventListener('click', function () {
    expertiseButtons.forEach(function (item, i) {
      item.classList.toggle('is-active', i === index);
      item.setAttribute('aria-expanded', String(i === index));
    });
    expertiseDetails.forEach(function (detail, i) {
      detail.hidden = i !== index;
      detail.classList.toggle('is-active', i === index);
    });
  });
});

const reveals = document.querySelectorAll('.reveal');
if (reducedMotion.matches || !('IntersectionObserver' in window)) {
  reveals.forEach(function (element) { element.classList.add('visible'); });
} else {
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px 40px 0px' });
  reveals.forEach(function (element) { revealObserver.observe(element); });
}

document.getElementById('year').textContent = new Date().getFullYear();

const heroVideo = document.querySelector('.hero-video');
const heroVideoToggle = document.querySelector('.hero-video-toggle');
if (heroVideo && heroVideoToggle) {
  function setVideoState() {
    const paused = heroVideo.paused;
    heroVideoToggle.textContent = paused ? '▶' : 'Ⅱ';
    heroVideoToggle.setAttribute('aria-label', paused ? 'Reproduzir vídeo de fundo' : 'Pausar vídeo de fundo');
  }
  if (reducedMotion.matches) heroVideo.pause();
  heroVideoToggle.addEventListener('click', function () {
    if (heroVideo.paused) heroVideo.play().catch(setVideoState);
    else heroVideo.pause();
    setVideoState();
  });
  heroVideo.addEventListener('play', setVideoState);
  heroVideo.addEventListener('pause', setVideoState);
  setVideoState();
}
