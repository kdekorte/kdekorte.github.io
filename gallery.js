// Opens screenshots in a .gallery as a full-size lightbox with prev/next.
(function () {
    const gallery = document.querySelector('.gallery');
    if (!gallery || !window.HTMLDialogElement) return;

    const figures = Array.from(gallery.querySelectorAll('.screenshot'));
    const dialog = document.createElement('dialog');
    dialog.className = 'lightbox';
    dialog.setAttribute('aria-label', 'Screenshot viewer');
    dialog.innerHTML =
        '<figure class="lightbox-figure">' +
            '<img alt="">' +
            '<figcaption></figcaption>' +
            '<span class="lightbox-count"></span>' +
        '</figure>' +
        '<button class="lightbox-close" type="button" aria-label="Close">×</button>' +
        '<button class="lightbox-prev" type="button" aria-label="Previous screenshot">‹</button>' +
        '<button class="lightbox-next" type="button" aria-label="Next screenshot">›</button>';
    document.body.appendChild(dialog);

    const image = dialog.querySelector('img');
    const caption = dialog.querySelector('figcaption');
    const count = dialog.querySelector('.lightbox-count');
    let current = 0;

    function show(index) {
        current = (index + figures.length) % figures.length;
        const source = figures[current].querySelector('img');
        image.src = source.src;
        image.alt = source.alt;
        caption.innerHTML = figures[current].querySelector('figcaption').innerHTML;
        count.textContent = (current + 1) + ' / ' + figures.length;
    }

    figures.forEach(function (figure, index) {
        const thumb = figure.querySelector('img');
        thumb.tabIndex = 0;
        thumb.setAttribute('role', 'button');
        thumb.addEventListener('click', function () {
            show(index);
            dialog.showModal();
        });
        thumb.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                thumb.click();
            }
        });
    });

    dialog.querySelector('.lightbox-close').addEventListener('click', function () { dialog.close(); });
    dialog.querySelector('.lightbox-prev').addEventListener('click', function () { show(current - 1); });
    dialog.querySelector('.lightbox-next').addEventListener('click', function () { show(current + 1); });

    dialog.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft') show(current - 1);
        if (event.key === 'ArrowRight') show(current + 1);
    });

    // Clicking the dark area around the image closes the viewer.
    dialog.addEventListener('click', function (event) {
        if (event.target === dialog || event.target.classList.contains('lightbox-figure')) {
            dialog.close();
        }
    });

    dialog.addEventListener('close', function () {
        figures[current].querySelector('img').focus();
    });
})();
