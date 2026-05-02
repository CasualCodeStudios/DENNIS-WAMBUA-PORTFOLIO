
/* ─── CANVAS PARTICLE FIELD — INDUSTRIAL DARK ─── */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [], stars = [], sparks = [];

function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

for (let i = 0; i < 80; i++) {
  stars.push({ x: Math.random(), y: Math.random(), r: Math.random()*.7+.1, a: Math.random()*.4+.1 });
}

function spawnParticle() {
  return {
    x: Math.random() * W,
    y: H + 60,
    vx: (Math.random() - 0.5) * 1.2,
    vy: -(Math.random() * 2.5 + 0.4),
    life: 1.8,
    decay: Math.random() * 0.006 + 0.004,
    size: Math.random() * 28 + 6,
    type: Math.random() > 0.55 ? 'rust' : Math.random() > 0.5 ? 'amber' : 'smoke'
  };
}
for (let i = 0; i < 40; i++) {
  let p = spawnParticle();
  p.y = Math.random() * H;
  particles.push(p);
}

let frame = 0;
function drawBg() {
  ctx.clearRect(0, 0, W, H);

  // Deep iron gradient
  let grad = ctx.createRadialGradient(W * .3, H * .3, 0, W * .5, H * .5, H);
  grad.addColorStop(0, '#201c15');
  grad.addColorStop(0.5, '#131108');
  grad.addColorStop(1, '#0a0906');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Rust glow bottom left
  let rustGlow = ctx.createRadialGradient(0, H, 0, 0, H, H * .5);
  rustGlow.addColorStop(0, 'rgba(196,80,26,0.12)');
  rustGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = rustGlow;
  ctx.fillRect(0, 0, W, H);

  // Amber glow top right
  let amberGlow = ctx.createRadialGradient(W, 0, 0, W, 0, W * .45);
  amberGlow.addColorStop(0, 'rgba(212,130,26,0.06)');
  amberGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = amberGlow;
  ctx.fillRect(0, 0, W, H);

  // Stars
  stars.forEach(s => {
    let flicker = s.a + Math.sin(frame * 0.01 + s.x * 12) * 0.15;
    ctx.beginPath();
    ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(220,210,190,${Math.max(0, Math.min(.5, flicker))})`;
    ctx.fill();
  });

  // Floating particles
  if (frame % 6 === 0 && particles.length < 50) particles.push(spawnParticle());
  particles.forEach((p, i) => {
    p.x += p.vx; p.y += p.vy; p.life -= p.decay;
    if (p.life <= 0 || p.y < -20) { particles[i] = spawnParticle(); return; }
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    if (p.type === 'rust') {
      ctx.fillStyle = `rgba(196,80,26,${p.life * 0.25})`;
    } else if (p.type === 'amber') {
      ctx.fillStyle = `rgba(212,130,26,${p.life * 0.2})`;
    } else {
      ctx.fillStyle = `rgba(107,99,88,${p.life * 0.15})`;
    }
    ctx.fill();
  });

  // Horizontal scan line
  let scanY = (frame * 0.35) % H;
  let scanGrad = ctx.createLinearGradient(0, scanY - 60, 0, scanY + 60);
  scanGrad.addColorStop(0, 'transparent');
  scanGrad.addColorStop(.5, 'rgba(196,80,26,0.025)');
  scanGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = scanGrad;
  ctx.fillRect(0, scanY - 60, W, 120);

  frame++;
  requestAnimationFrame(drawBg);
}
drawBg();

/* ─── 3D CARD TILT ─── */
const cardWrapper = document.getElementById('card-wrapper');
const profileCard = document.getElementById('profile-card');
let targetRX = 0, targetRY = 0, currentRX = 0, currentRY = 0;

document.addEventListener('mousemove', e => {
  if (!cardWrapper) return;
  const rect = cardWrapper.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = (e.clientX - cx) / (window.innerWidth / 2);
  const dy = (e.clientY - cy) / (window.innerHeight / 2);
  targetRY = dx * 18;
  targetRX = -dy * 14;
});
document.addEventListener('mouseleave', () => { targetRX = 0; targetRY = 0; });
function animateCard() {
  currentRX += (targetRX - currentRX) * 0.07;
  currentRY += (targetRY - currentRY) * 0.07;
  if (profileCard) profileCard.style.transform = `rotateX(${currentRX}deg) rotateY(${currentRY}deg)`;
  requestAnimationFrame(animateCard);
}
animateCard();

/* ─── CUSTOM CURSOR ─── */
const isFine = window.matchMedia('(pointer:fine)').matches;
if (isFine) {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });
  function animateCursor() {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
  document.querySelectorAll('a, button, .cert-card, .trait-item, .wl-card, .ops-item, .gallery-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = '44px'; ring.style.height = '44px';
      ring.style.borderColor = 'rgba(196,80,26,0.7)';
      dot.style.transform = 'translate(-50%,-50%) scale(1.6)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width = '28px'; ring.style.height = '28px';
      ring.style.borderColor = 'rgba(196,80,26,0.5)';
      dot.style.transform = 'translate(-50%,-50%) scale(1)';
    });
  });
}

/* ─── NAV SCROLL ─── */
const mainNav = document.getElementById('mainNav');
window.addEventListener('scroll', () => mainNav.classList.toggle('scrolled', window.scrollY > 80), { passive: true });

/* ─── HAMBURGER ─── */
const toggle = document.getElementById('navToggle');
const drawer = document.getElementById('navDrawer');
toggle.addEventListener('click', () => {
  const open = toggle.classList.toggle('open');
  drawer.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
function closeDrawer() {
  toggle.classList.remove('open');
  drawer.classList.remove('open');
  document.body.style.overflow = '';
}

/* ─── SCROLL TOP ─── */
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > window.innerHeight * 0.8);
}, { passive: true });
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ─── INTERSECTION OBSERVER ─── */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.06 });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 6 * 80) + 'ms';
  io.observe(el);
});

/* ─── CCS POPUP ─── */
setTimeout(() => {
  const popup = document.getElementById('ccsPopup');
  if (popup) popup.classList.add('show');
}, 10000);

/* ─── FORM ─── */
function handleForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const orig = btn.textContent;
  btn.textContent = 'Message Sent ✓';
  btn.style.background = 'linear-gradient(135deg,#1a5a30,#2d9e52)';
  setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 3500);
}