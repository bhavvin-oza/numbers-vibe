/* ===================================================
   NUMBERS VIBE — SHARED JAVASCRIPT
   ================================================== */

// Progress bar
const progress = document.getElementById('progress');
function updateProgress() {
  if (!progress) return;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = total > 0 ? (window.scrollY / total * 100) + '%' : '0%';
}

// Nav scroll
const nav = document.getElementById('nav');
function updateNav() {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
}

window.addEventListener('scroll', () => { updateProgress(); updateNav(); }, { passive: true });
updateProgress(); updateNav();

// Mobile menu
const hamburger = document.getElementById('hamburger');
const mobOverlay = document.getElementById('mob-overlay');
const mobClose   = document.getElementById('mob-close');
function closeMob() { if (mobOverlay) mobOverlay.classList.remove('open'); document.body.style.overflow = ''; }
if (hamburger) hamburger.addEventListener('click', () => { mobOverlay.classList.add('open'); document.body.style.overflow = 'hidden'; });
if (mobClose)  mobClose.addEventListener('click', closeMob);
if (mobOverlay) mobOverlay.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMob));

// Reveal on scroll
const revEls = document.querySelectorAll('.rv');
if (revEls.length) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revEls.forEach(el => obs.observe(el));
}

// Counter animation
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 1800, step = 16;
  let current = 0;
  const inc = target / (duration / step);
  const timer = setInterval(() => {
    current += inc;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current) + suffix;
  }, step);
}
const counters = document.querySelectorAll('[data-target]');
if (counters.length) {
  const cObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.animated) {
        e.target.dataset.animated = '1'; animateCounter(e.target); cObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => cObs.observe(c));
}

// FAQ accordion
document.querySelectorAll('.fitem').forEach(item => {
  const btn = item.querySelector('.fq');
  if (btn) btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.fitem.open').forEach(o => o.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// Certificate lightbox
const lightbox = document.getElementById('cert-lightbox');
const lbImg    = document.getElementById('lb-img');
const lbTitle  = document.getElementById('lb-title');
const lbMeta   = document.getElementById('lb-meta');
const lbClose  = document.getElementById('lb-close');
function closeLightbox() { if (lightbox) { lightbox.classList.remove('open'); document.body.style.overflow = ''; } }
document.querySelectorAll('.cert-img-wrap[data-cert]').forEach(wrap => {
  wrap.addEventListener('click', () => {
    const img = wrap.querySelector('img');
    if (lightbox) {
      if (img) lbImg.src = img.src; else lbImg.src = '';
      lbTitle.textContent = wrap.dataset.title || '';
      lbMeta.textContent  = wrap.dataset.meta  || '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });
});
if (lbClose)  lbClose.addEventListener('click', closeLightbox);
if (lightbox) lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeLightbox(); closeMob(); } });

// Toast
const toast = document.getElementById('toast');
function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

// Forms
document.querySelectorAll('form.nv-form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    showToast('✓ Sent! Bhavvin will be in touch shortly.');
    form.reset();
    document.querySelectorAll('.svc-sel-card').forEach(c => c.classList.remove('active-blue','active-green','active-red'));
  });
});

// Service selector (contact page)
document.querySelectorAll('.svc-sel-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.svc-sel-card').forEach(c => c.classList.remove('active-blue','active-green','active-red'));
    card.classList.add(card.dataset.active || 'active-green');
    const sel = document.getElementById('service-select');
    if (sel) sel.value = card.dataset.service || '';
  });
});

// Testimonial filter
document.querySelectorAll('.t-filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.t-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.tcard').forEach(card => {
      card.style.display = (filter === 'all' || card.dataset.svc === filter) ? '' : 'none';
    });
  });
});

// Active nav link
(function() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
  });
})();

// URL param pre-fill service selector on contact page
(function() {
  const params = new URLSearchParams(window.location.search);
  const svc = params.get('service');
  if (!svc) return;
  const map = { numerology: 'active-blue', vastu: 'active-green', healing: 'active-red' };
  const card = document.querySelector(`.svc-sel-card[data-service="${svc}"]`);
  if (card) { card.classList.add(map[svc] || 'active-green'); }
  const sel = document.getElementById('service-select');
  if (sel) sel.value = svc;
})();
