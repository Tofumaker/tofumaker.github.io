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

// Interactive carp anatomy — hover/tap a part to highlight it and open its product modal
const PART_DATA = {
  head: {
    part: 'The Head',
    title: 'Fish Head Soup',
    desc: 'The bighead carp is literally named for it. Across Asia, meaty carp heads are the foundation of rich hot pots and soups — simmered for hours into a milky, collagen-rich broth. What American processing once discarded, our export markets consider the best part of the fish.',
    img: 'assets/web/carp1.jpg',
    alt: 'Bighead carp on ice',
    tag: 'Food Service · Export',
  },
  skin: {
    part: 'The Skin',
    title: 'Fish Leather',
    desc: 'Tanned and finished into supple, distinctively textured fish leather — a sustainable exotic for wallets, accessories, and fashion. Every hide carries the carp’s unmistakable scale pattern.',
    img: 'assets/web/fishleather.jpg',
    alt: 'Glossy black fish leather wallet with carved bone flower',
    tag: 'Fashion · Specialty',
  },
  filet: {
    part: 'The Fillet',
    title: 'Wild-Caught White Fish',
    desc: 'Lean, clean, mild white fish — headed & gutted, steaked, or filleted to spec and flash-frozen at peak freshness. The foundation of our export business, and the raw material for dumplings, fish balls, sausages, and jerky.',
    img: 'assets/web/fishfilet2.jpg',
    alt: 'Dried carp fillet with rosemary and sea salt on dark wood',
    tag: 'Food Service · Export',
  },
  bones: {
    part: 'The Bones',
    title: 'Carved Bone Jewelry',
    desc: 'Carp “lucky bones” are hand-carved and polished into earrings, bracelets, and pendants — the most unexpected chapter of the zero-waste story, turning skeleton into keepsake.',
    img: 'assets/web/fishjewelry.jpg',
    alt: 'Earrings, bracelets, and pendants carved from carp bone',
    tag: 'Artisan · Specialty',
  },
  bladder: {
    part: 'The Swim Bladder',
    title: 'Dried Fish Maw',
    desc: 'The swim bladder becomes dried fish maw — a prized delicacy in Asian cuisine, celebrated for its collagen and served at celebration tables. Ounce for ounce, one of the most valuable parts of the fish.',
    img: 'assets/web/fishbladder1.jpg',
    alt: 'Dried and fresh fish maw presented on plates',
    tag: 'Delicacy · Export',
  },
  guts: {
    part: 'The Guts',
    title: 'Fertilizer & Fish Meal',
    desc: 'Nothing goes to landfill: trimmings and viscera are rendered into nutrient-dense fish meal, oil, and organic fertilizer for agriculture and aquaculture — closing the zero-waste loop.',
    img: 'assets/web/fishmeal2.jpg',
    alt: 'Ground fish meal on parchment',
    tag: 'Agriculture · Industrial',
  },
};

const carpSvg = document.getElementById('carpSvg');
const partModal = document.getElementById('partModal');
const partModalImg = document.getElementById('partModalImg');
const partModalPart = document.getElementById('partModalPart');
const partModalTitle = document.getElementById('partModalTitle');
const partModalDesc = document.getElementById('partModalDesc');
const partModalTag = document.getElementById('partModalTag');
let lastFocusedPart = null;

const openPartModal = (key) => {
  const data = PART_DATA[key];
  if (!data || !partModal.hidden) return;
  partModalImg.src = data.img;
  partModalImg.alt = data.alt;
  partModalPart.textContent = data.part;
  partModalTitle.textContent = data.title;
  partModalDesc.textContent = data.desc;
  partModalTag.textContent = data.tag;
  partModal.hidden = false;
  document.body.classList.add('lightbox-open');
  requestAnimationFrame(() => partModal.classList.add('is-open'));
};

const closePartModal = () => {
  partModal.classList.remove('is-open');
  document.body.classList.remove('lightbox-open');
  setTimeout(() => {
    partModal.hidden = true;
  }, reduceMotion ? 0 : 300);
  if (lastFocusedPart) lastFocusedPart.focus({ preventScroll: true });
};

if (carpSvg) {
  carpSvg.querySelectorAll('.carp-part').forEach((part) => {
    const key = part.dataset.part;
    part.addEventListener('mouseenter', () => {
      part.classList.add('is-active');
      carpSvg.classList.add('has-active');
    });
    part.addEventListener('mouseleave', () => {
      part.classList.remove('is-active');
      carpSvg.classList.remove('has-active');
    });
    part.addEventListener('click', () => {
      lastFocusedPart = part;
      openPartModal(key);
    });
    part.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        lastFocusedPart = part;
        openPartModal(key);
      }
    });
  });

  document.getElementById('partModalClose').addEventListener('click', closePartModal);
  partModal.addEventListener('click', (e) => {
    if (e.target === partModal) closePartModal();
  });
  document.addEventListener('keydown', (e) => {
    if (!partModal.hidden && e.key === 'Escape') closePartModal();
  });
}

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
