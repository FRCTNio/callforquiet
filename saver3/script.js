const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
  );

  reveals.forEach(el => observer.observe(el));

  const heroImage = document.querySelector('.hero-image');
  const glowA = document.querySelector('.page-glow-a');
  const glowB = document.querySelector('.page-glow-b');
  const driftWords = document.querySelectorAll('.drift-word');
  let ticking = false;

  const updateMotion = () => {
    const y = window.scrollY;

    if (heroImage && y < window.innerHeight * 1.2) {
      heroImage.style.transform = `scale(1.035) translate3d(0, ${y * 0.055}px, 0)`;
    }

    if (glowA) glowA.style.transform = `translate3d(0, ${y * 0.035}px, 0)`;
    if (glowB) glowB.style.transform = `translate3d(0, ${y * -0.018}px, 0)`;

    driftWords.forEach((word, i) => {
      const rect = word.parentElement.getBoundingClientRect();
      const offset = (window.innerHeight - rect.top) * (i ? 0.035 : -0.028);
      word.style.transform = `translate3d(${offset}px, 0, 0)`;
    });

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateMotion);
      ticking = true;
    }
  }, { passive: true });

  updateMotion();
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
}
