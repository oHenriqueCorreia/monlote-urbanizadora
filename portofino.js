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
    galleryItems.forEach(function (item) {
      item.hidden = filter !== 'todos' && item.dataset.category !== filter;
    });
    visibleItems = galleryItems.filter(function (item) { return !item.hidden; });
  });
});

const dialog = document.querySelector('.gallery-dialog');
if (dialog) {
  const dialogImage = dialog.querySelector('img');
  const dialogCaption = dialog.querySelector('[data-dialog-caption]');
  let galleryIndex = 0;

  function showImage(index) {
    if (!visibleItems.length) return;
    galleryIndex = (index + visibleItems.length) % visibleItems.length;
    const item = visibleItems[galleryIndex];
    const image = item.querySelector('img');
    dialogImage.src = image.src;
    dialogImage.alt = image.alt;
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
  dialog.addEventListener('click', function (event) {
    if (event.target === dialog) dialog.close();
  });
  document.addEventListener('keydown', function (event) {
    if (!dialog.open) return;
    if (event.key === 'ArrowLeft') showImage(galleryIndex - 1);
    if (event.key === 'ArrowRight') showImage(galleryIndex + 1);
  });
}
