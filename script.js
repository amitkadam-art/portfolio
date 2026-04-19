/* ============================
   script.js — Amit Kadam Portfolio
   ============================ */

/* ---- Preloader ---- */
window.addEventListener('load', () => {
  document.body.classList.add('preloading');
  setTimeout(() => {
    const pre = document.getElementById('preloader');
    pre.classList.add('hidden');
    document.body.classList.remove('preloading');
    initCounters();
    initAOS();
  }, 1900);
});

/* ---- Custom Cursor ---- */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.transform = `translate(${mouseX - 5}px, ${mouseY - 5}px)`;
});

function animateCursor() {
  fx += (mouseX - fx) * 0.12;
  fy += (mouseY - fy) * 0.12;
  follower.style.transform = `translate(${fx - 16}px, ${fy - 16}px)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .skill-card, .project-card, .tool-pill').forEach(el => {
  el.addEventListener('mouseenter', () => follower.style.transform += ' scale(1.8)');
  el.addEventListener('mouseleave', () => {});
});

/* ---- Theme Toggle ---- */

/* ---- Navbar ---- */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveLink();
  toggleScrollTop();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksContainer.classList.toggle('open');
});

navLinksContainer.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksContainer.classList.remove('open');
  });
});

function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.getAttribute('id');
  });
  navLinks.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
  });
}

/* ---- Smooth Scrolling ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ---- Scroll to Top ---- */
const scrollTopBtn = document.getElementById('scrollTop');
function toggleScrollTop() { scrollTopBtn.classList.toggle('visible', window.scrollY > 400); }
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---- Typing Animation ---- */
const phrases = ['Web Developer', 'Frontend Engineer', 'UI/UX Enthusiast', 'React Developer', 'Full-Stack Builder'];
let pIdx = 0, cIdx = 0, deleting = false;
const typedEl = document.getElementById('typedText');

function type() {
  const phrase = phrases[pIdx];
  if (!deleting) {
    typedEl.textContent = phrase.slice(0, ++cIdx);
    if (cIdx === phrase.length) { deleting = true; setTimeout(type, 1800); return; }
  } else {
    typedEl.textContent = phrase.slice(0, --cIdx);
    if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; }
  }
  setTimeout(type, deleting ? 60 : 100);
}
setTimeout(type, 1200);

/* ---- Hero Canvas Particles ---- */
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
const N = 80;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.8 + 0.4,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    o: Math.random() * 0.5 + 0.1
  };
}

for (let i = 0; i < N; i++) particles.push(createParticle());

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const isDark = html.getAttribute('data-theme') !== 'light';
  const col = isDark ? '124,108,250' : '100,80,200';

  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${col}, ${p.o})`;
    ctx.fill();

    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
  });

  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${col}, ${0.08 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ---- Counters ---- */
function initCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.count);
    let current = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 40);
  });
}

/* ---- Scroll-based AOS ---- */
function initAOS() {
  const els = document.querySelectorAll('[data-aos]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.aosDelay || 0);
        setTimeout(() => entry.target.classList.add('aos-animate'), delay);
        // Trigger skill bar fills
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));

  // Also observe skill cards individually for bar animation
  document.querySelectorAll('.skill-card').forEach(card => {
    const bar = card.querySelector('.skill-fill');
    if (!bar) return;
    const cardObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 300);
        cardObs.disconnect();
      }
    }, { threshold: 0.3 });
    cardObs.observe(card);
  });
}

/* ---- Contact Form ---- */
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type=submit]');
  const success = document.getElementById('formSuccess');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
    btn.disabled = false;
    success.classList.add('show');
    e.target.reset();
    setTimeout(() => success.classList.remove('show'), 4000);
  }, 1800);
});

/* ---- Section reveal on scroll (for hero stats) ---- */
const heroStatObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    initCounters();
    heroStatObserver.disconnect();
  }
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroStatObserver.observe(heroStats);
