(function () {
  const slides = document.querySelectorAll('section');
  const currentEl = document.querySelector('.controls .current');
  const totalEl = document.querySelector('.controls .total');
  const notesPanel = document.querySelector('.notes-panel');
  const notesContent = document.querySelector('.notes-panel .notes-content');
  let idx = 0;
  let notesVisible = false;

  totalEl.textContent = slides.length;

  function pauseAllMedia() {
    document.querySelectorAll('section:not(.active) video').forEach((v) => v.pause());
    document.querySelectorAll('section:not(.active) iframe').forEach((f) => {
      try {
        f.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        f.contentWindow.postMessage('{"method":"pause"}', '*');
      } catch (e) {}
    });
  }

  function playActiveMedia() {
    document.querySelectorAll('section.active video').forEach((v) => {
      const p = v.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    });
    document.querySelectorAll('section.active iframe').forEach((f) => {
      try {
        f.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        f.contentWindow.postMessage('{"method":"play"}', '*');
      } catch (e) {}
    });
  }

  function updateNotesContent() {
    if (!notesContent) return;
    const raw = slides[idx].dataset.notes || '';
    notesContent.innerHTML = raw || '<p><em>No additional notes for this slide.</em></p>';
  }

  function show(i) {
    slides.forEach((s, j) => s.classList.toggle('active', j === i));
    currentEl.textContent = i + 1;
    pauseAllMedia();
    playActiveMedia();
    if (notesVisible) updateNotesContent();
  }

  function next() { if (idx < slides.length - 1) { idx++; show(idx); } }
  function prev() { if (idx > 0) { idx--; show(idx); } }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft') { prev(); }
    else if (e.key === 'n' || e.key === 'N') {
      notesVisible = !notesVisible;
      if (notesPanel) {
        notesPanel.classList.toggle('visible', notesVisible);
        notesPanel.setAttribute('aria-hidden', notesVisible ? 'false' : 'true');
      }
      updateNotesContent();
    }
  });

  // Click-to-play for video thumbnails (protocol-aware). Runs before nav click.
  document.addEventListener('click', (e) => {
    const vc = e.target.closest('.video-container[data-video-id]');
    if (!vc) return;
    e.stopImmediatePropagation();
    const vid = vc.dataset.videoId;
    if (window.location.protocol === 'file:') {
      window.open('https://www.youtube.com/watch?v=' + vid, '_blank');
    } else {
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + vid + '?autoplay=1';
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      vc.innerHTML = '';
      vc.appendChild(iframe);
    }
  });

  // Navigation click handler — guards media/controls/notes from triggering nav.
  document.addEventListener('click', (e) => {
    if (e.target.closest('.controls')) return;
    if (e.target.closest('.notes-panel')) return;
    if (e.target.closest('.video-container')) return;
    if (e.target.closest('.media-container')) return;
    const x = e.clientX / window.innerWidth;
    x > 0.5 ? next() : prev();
  });

  // Touch swipe support
  let touchStartX = 0;
  document.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
  document.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 50) { diff < 0 ? next() : prev(); }
  });

  // Honor ?slide=N or #N in the URL for deep-linking and screenshot verification.
  const urlMatch = (location.hash.match(/^#(\d+)$/) || (location.search.match(/[?&]slide=(\d+)/) || [])).slice(-1)[0];
  const initial = urlMatch ? Math.max(0, Math.min(slides.length - 1, parseInt(urlMatch, 10) - 1)) : 0;
  idx = initial;
  show(idx);
})();
