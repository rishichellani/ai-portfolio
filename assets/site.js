// Shared behavior: mobile menu, scroll reveal, Loom embeds, contact form.

// Mobile menu
(function () {
  const toggle = document.querySelector('.menu-toggle');
  const links = document.getElementById('nav-links');
  if (!toggle || !links) return;
  const set = (open) => {
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => set(!links.classList.contains('open')));
  links.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
})();

// Scroll reveal (skipped entirely under reduced motion)
(function () {
  const items = document.querySelectorAll('.reveal');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) { items.forEach((el) => el.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  items.forEach((el) => io.observe(el));
})();

// Loom embeds: <div class="video" data-loom-id="32-char-id"> — empty id keeps the "coming soon" placeholder.
(function () {
  document.querySelectorAll('.video[data-loom-id]').forEach((box) => {
    const id = (box.dataset.loomId || '').trim();
    if (!/^[a-f0-9]{32}$/i.test(id)) return;
    const frame = document.createElement('iframe');
    frame.src = 'https://www.loom.com/embed/' + id;
    frame.title = box.dataset.title || 'Video walkthrough';
    frame.loading = 'lazy';
    frame.allowFullscreen = true;
    frame.setAttribute('allow', 'fullscreen');
    box.replaceChildren(frame);
  });
})();

// Contact form (Netlify Forms)
(function () {
  const track = (name) => { if (window.umami) window.umami.track(name); };
  const form = document.getElementById('contact-form');
  if (!form) return;
  const msg = document.getElementById('form-msg');
  const done = document.getElementById('form-success');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    msg.textContent = '';
    msg.className = 'form-msg';
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString(),
      });
      if (!res.ok) throw new Error('bad status ' + res.status);
      form.hidden = true;
      done.hidden = false;
      done.focus();
      track('Contact form submitted');
    } catch (err) {
      btn.disabled = false;
      track('Contact form failed');
      msg.className = 'form-msg error';
      msg.textContent = 'That did not send. Please try again, or email me directly at rishi.chellani@gmail.com.';
    }
  });
})();
