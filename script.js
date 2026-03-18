/* ═══════════════════════════════════════
   VitalDash — script.js
   Implements: ibelick spotlight (page + card)
               aceternity spotlight (card SVG)
               Spline runtime loader
               scroll reveal
               waitlist form
═══════════════════════════════════════ */

/* ── NAV sticky ── */
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('stuck', scrollY > 40);
});

/* ── GLOBAL CURSOR GLOW (ibelick — page level) ── */
const glow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', e => {
  glow.style.left    = e.clientX + 'px';
  glow.style.top     = e.clientY + 'px';
  glow.style.opacity = '1';
});
document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });

/* ── SPLINE CARD: ibelick spring spotlight ── */
const card = document.getElementById('spline-card');
const spot = document.getElementById('card-spot');
let spotX = 0, spotY = 0, targetX = 0, targetY = 0;

card.addEventListener('mouseenter', () => {
  spot.style.opacity = '1';
  spot.style.width   = '260px';
  spot.style.height  = '260px';
});
card.addEventListener('mouseleave', () => { spot.style.opacity = '0'; });
card.addEventListener('mousemove', e => {
  const r = card.getBoundingClientRect();
  targetX = e.clientX - r.left;
  targetY = e.clientY - r.top;
});

/* Spring animation — bounce:0 matches framer-motion default */
(function springLoop() {
  spotX += (targetX - spotX) * 0.12;
  spotY += (targetY - spotY) * 0.12;
  spot.style.left = spotX + 'px';
  spot.style.top  = spotY + 'px';
  requestAnimationFrame(springLoop);
})();

/* ── SPLINE 3D SCENE (@splinetool/runtime via unpkg CDN) ── */
async function loadSpline() {
  const container = document.getElementById('spline-right');
  const loader    = document.getElementById('spline-loader');
  try {
    const { Application } = await import(
      'https://unpkg.com/@splinetool/runtime@1.9.28/build/runtime.module.js'
    );
    const canvas         = document.createElement('canvas');
    canvas.style.cssText = 'width:100%;height:100%;display:block;';
    container.appendChild(canvas);

    const app = new Application(canvas);
    await app.load('https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode');

    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 500);
  } catch (err) {
    console.warn('Spline load error:', err);
    loader.innerHTML = `
      <div style="text-align:center;padding:20px">
        <div style="font-size:48px;margin-bottom:12px">❤️</div>
        <div style="font-size:13px;color:#94a3b8">3D preview not available</div>
      </div>`;
  }
}
loadSpline();

/* ── SCROLL REVEAL ── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
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
  input.value             = '';
  input.placeholder       = 'Thanks! See you at launch 🚀';
  input.style.borderColor = 'rgba(22,163,74,.4)';
  input.style.boxShadow   = '0 0 0 3px rgba(22,163,74,.1)';

  /* Uncomment + add your Formspree ID when ready:
  fetch('https://formspree.io/f/YOUR_ID', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  */
}

document.getElementById('wl-email').addEventListener('keydown', e => {
  if (e.key === 'Enter') joinList();
});

window.joinList = joinList;
