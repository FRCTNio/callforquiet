document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------
     Footer year
  ------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -------------------------------------------------
     Mobile nav toggle
  ------------------------------------------------- */
  const header = document.getElementById('site-header');
  const navToggle = document.getElementById('nav-toggle');
  if (navToggle && header) {
    navToggle.addEventListener('click', () => {
      const isOpen = header.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    document.querySelectorAll('.site-nav a').forEach(link => {
      link.addEventListener('click', () => {
        header.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* -------------------------------------------------
     Concerns: fade/slide in on scroll
  ------------------------------------------------- */
  const concernEls = document.querySelectorAll('.concern');
  if ('IntersectionObserver' in window && concernEls.length) {
    concernEls.forEach(el => {
      el.style.setProperty('--i', el.dataset.d || 0);
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });
    concernEls.forEach(el => io.observe(el));
  } else {
    concernEls.forEach(el => el.classList.add('is-visible'));
  }

  /* -------------------------------------------------
     Services: build cards, wire priority radios,
     keep the live summary + hidden form field in sync
  ------------------------------------------------- */
  const SERVICES = [
    { id: 'growth-strategy', name: 'Growth & Strategy', desc: 'Where to grow next, and how to know it\u2019s working.' },
    { id: 'systems-ops',     name: 'Systems & Operations', desc: 'The day-to-day processes that keep things from slipping.' },
    { id: 'finance-books',   name: 'Finance & Books Oversight', desc: 'A second set of eyes on the numbers, without hiring a CFO.' },
    { id: 'team-hiring',     name: 'Team & Hiring', desc: 'Finding, onboarding, and keeping the right people.' },
    { id: 'risk-compliance', name: 'Risk & Compliance', desc: 'Insurance, contracts, and the stuff that bites you later.' },
    { id: 'tech-tools',      name: 'Technology & Tools', desc: 'The software stack, sorted and actually used.' },
  ];

  const PRIORITIES = [
    { value: 'now',  label: 'Right now' },
    { value: 'soon', label: 'Down the road' },
    { value: 'later',label: 'Not for now' },
  ];

  const grid = document.getElementById('services-grid');

  if (grid) {
    grid.innerHTML = SERVICES.map(svc => `
      <div class="service-card">
        <p class="service-name">${svc.name}</p>
        <p class="service-desc">${svc.desc}</p>
        <div class="priority-options" role="radiogroup" aria-label="Priority for ${svc.name}">
          ${PRIORITIES.map((p, i) => `
            <label>
              <input type="radio" name="priority-${svc.id}" value="${p.value}">
              ${p.label}
            </label>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  const summaryEl = document.getElementById('priority-summary');
  const priorityField = document.getElementById('priorities-field');

  function updateSummary() {
    if (!summaryEl) return;

    const grouped = { now: [], soon: [], later: [] };

    SERVICES.forEach(svc => {
      const checked = document.querySelector(`input[name="priority-${svc.id}"]:checked`);
      if (checked && grouped[checked.value]) {
        grouped[checked.value].push(svc.name);
      }
    });

    Object.keys(grouped).forEach(tier => {
      const group = summaryEl.querySelector(`.summary-group[data-tier="${tier}"]`);
      if (!group) return;
      const ul = group.querySelector('ul');
      ul.innerHTML = grouped[tier].map(name => `<li>${name}</li>`).join('');
      group.classList.toggle('has-items', grouped[tier].length > 0);
    });

    if (priorityField) {
      const lines = Object.keys(grouped)
        .filter(tier => grouped[tier].length)
        .map(tier => {
          const label = PRIORITIES.find(p => p.value === tier).label;
          return `${label}: ${grouped[tier].join(', ')}`;
        });
      priorityField.value = lines.join(' | ');
    }
  }

  if (grid) {
    grid.addEventListener('change', (e) => {
      if (e.target.matches('input[type="radio"]')) updateSummary();
    });
  }

  const gsForm = document.getElementById('gs-form');
  if (gsForm) {
    gsForm.addEventListener('submit', () => updateSummary());
  }

});
