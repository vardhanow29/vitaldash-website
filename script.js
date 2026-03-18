/* ═══════════════════════════════════════
   VitalDash — script.js
═══════════════════════════════════════ */

/* ── NAV: add .stuck class on scroll ── */
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('stuck', scrollY > 40);
});

/* ── GLOBAL CURSOR GLOW ── */
const glow = document.getElementById('cursor-glow');

document.addEventListener('mousemove', e => {
  glow.style.left    = e.clientX + 'px';
  glow.style.top     = e.clientY + 'px';
  glow.style.opacity = '1';
});

document.addEventListener('mouseleave', () => {
  glow.style.opacity = '0';
});

/* ── SPLINE CARD: ibelick spring spotlight ── */
const card  = document.getElementById('spline-card');
const spot  = document.getElementById('card-spot');

let spotX = 0, spotY = 0;
let targetX = 0, targetY = 0;

card.addEventListener('mouseenter', () => {
  spot.style.opacity = '1';
  spot.style.width   = '260px';
  spot.style.height  = '260px';
});

card.addEventListener('mouseleave', () => {
  spot.style.opacity = '0';
});

card.addEventListener('mousemove', e => {
  const r = card.getBoundingClientRect();
  targetX = e.clientX - r.left;
  targetY = e.clientY - r.top;
});

/* Spring follow animation — bounce: 0 matches framer-motion default */
function springSpot() {
  spotX += (targetX - spotX) * 0.12;
  spotY += (targetY - spotY) * 0.12;
  spot.style.left = spotX + 'px';
  spot.style.top  = spotY + 'px';
  requestAnimationFrame(springSpot);
}
springSpot();

/* ── SPLINE: load via @splinetool/runtime CDN ── */
async function loadSpline() {
  const container = document.getElementById('spline-right');
  const loader    = document.getElementById('spline-loader');

  try {
    const { Application } = await import(
      'https://unpkg.com/@splinetool/runtime@1.9.28/build/runtime.module.js'
    );

    const canvas        = document.createElement('canvas');
    canvas.style.cssText = 'width:100%;height:100%;display:block;';
    container.appendChild(canvas);

    const app = new Application(canvas);

    await app.load('https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode');

    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 500);

  } catch (err) {
    console.warn('Spline failed to load:', err);
    loader.innerHTML = `
      <div style="text-align:center;padding:20px">
        <div style="font-size:48px;margin-bottom:12px">❤️</div>
        <div style="font-size:13px;color:#6B7F94">3D scene unavailable</div>
      </div>`;
  }
}
loadSpline();

/* ── SCROLL REVEAL ── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('in');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ── WAITLIST FORM ── */
function joinList() {
  const input = document.getElementById('wl-email');
  const email = input.value.trim();

  if (!email || !email.includes('@')) {
    input.style.borderColor = 'rgba(224,92,42,.6)';
    input.focus();
    return;
  }

  document.getElementById('wl-ok').style.display = 'block';
  input.value               = '';
  input.placeholder         = 'Thanks! See you at launch 🚀';
  input.style.borderColor   = 'rgba(34,197,94,.4)';

  /* ── Connect Formspree here when ready ──
  fetch('https://formspree.io/f/YOUR-FORM-ID', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  */
}

/* Allow Enter key on waitlist input */
document.getElementById('wl-email').addEventListener('keydown', e => {
  if (e.key === 'Enter') joinList();
});

/* Expose joinList globally for onclick attribute */
window.joinList = joinList;
