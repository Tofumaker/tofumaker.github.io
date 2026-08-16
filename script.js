// Two Rivers Fisheries — interactions

// Sticky nav background on scroll
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile menu
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('is-open');
  toggle.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', open);
});
links.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    links.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  })
);

// Scroll-reveal
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 70}ms`;
  if (reduceMotion) el.classList.add('is-visible');
  else revealObserver.observe(el);
});

// Animated stat counters
const animateCount = (el) => {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1600;
  const start = performance.now();
  const step = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

// Lightbox — click any gallery image to view it large
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const zoomables = Array.from(
  document.querySelectorAll('.story__photo img, .gov__photo img, .product__img img, .species__card img')
);
let lightboxIndex = 0;

const showImage = (i) => {
  lightboxIndex = (i + zoomables.length) % zoomables.length;
  const img = zoomables[lightboxIndex];
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxCaption.textContent = img.alt;
};

const openLightbox = (i) => {
  showImage(i);
  lightbox.hidden = false;
  document.body.classList.add('lightbox-open');
  requestAnimationFrame(() => lightbox.classList.add('is-open'));
};

const closeLightbox = () => {
  lightbox.classList.remove('is-open');
  document.body.classList.remove('lightbox-open');
  setTimeout(() => {
    lightbox.hidden = true;
    lightboxImg.src = '';
  }, 300);
};

zoomables.forEach((img, i) => {
  img.classList.add('is-zoomable');
  img.addEventListener('click', () => openLightbox(i));
});

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightboxPrev').addEventListener('click', (e) => {
  e.stopPropagation();
  showImage(lightboxIndex - 1);
});
document.getElementById('lightboxNext').addEventListener('click', (e) => {
  e.stopPropagation();
  showImage(lightboxIndex + 1);
});
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target === lightboxImg) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape') closeLightbox();
  else if (e.key === 'ArrowLeft') showImage(lightboxIndex - 1);
  else if (e.key === 'ArrowRight') showImage(lightboxIndex + 1);
});

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);
document.querySelectorAll('.stat__num').forEach((el) => {
  if (reduceMotion) el.textContent = el.dataset.count + (el.dataset.suffix || '');
  else statObserver.observe(el);
});
