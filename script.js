/* =========================================================
   script.js — Particles · Typewriter · Scroll · Tilt · Nav
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* ──────────── Canvas Particle System ──────────── */
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 130 };
    const COUNT = 80;
    const LINK_DIST = 150;

    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.r = Math.random() * 1.8 + 0.6;
            this.vx = (Math.random() - 0.5) * 0.45;
            this.vy = (Math.random() - 0.5) * 0.45;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            if (mouse.x !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const d = Math.hypot(dx, dy);
                if (d < mouse.radius) {
                    const a = Math.atan2(dy, dx);
                    this.x += Math.cos(a) * 1.2;
                    this.y += Math.sin(a) * 1.2;
                }
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(139, 92, 246, 0.6)';
            ctx.fill();
        }
    }

    function init() {
        particles = Array.from({ length: COUNT }, () => new Particle());
    }

    function links() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const d = Math.hypot(
                    particles[i].x - particles[j].x,
                    particles[i].y - particles[j].y
                );
                if (d < LINK_DIST) {
                    ctx.strokeStyle = `rgba(139, 92, 246, ${(1 - d / LINK_DIST) * 0.18})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        links();
        requestAnimationFrame(loop);
    }

    window.addEventListener('resize', () => { resize(); init(); });
    canvas.addEventListener('mousemove', e => {
        const r = canvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
    });
    canvas.addEventListener('mouseleave', () => { mouse.x = mouse.y = null; });
    resize();
    init();
    loop();

    /* ──────────── Typewriter ──────────── */
    const roles = [
        'AI Engineer',
        'Full-Cycle AI Builder',
        'AI Product Owner',
        'Full-Stack Developer',
        'Problem Hunter'
    ];
    const typedEl = document.querySelector('.typed');
    let ri = 0, ci = 0, del = false;

    function type() {
        const word = roles[ri];
        if (!del) {
            typedEl.textContent = word.substring(0, ci + 1);
            ci++;
            if (ci === word.length) { del = true; return setTimeout(type, 1800); }
        } else {
            typedEl.textContent = word.substring(0, ci - 1);
            ci--;
            if (ci === 0) { del = false; ri = (ri + 1) % roles.length; }
        }
        setTimeout(type, del ? 35 : 70);
    }
    type();

    /* ──────────── Navbar scroll ──────────── */
    const nav = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    /* ──────────── Active nav highlight ──────────── */
    const secs = document.querySelectorAll('.section[id]');
    const allLinks = document.querySelectorAll('.nav-links a');
    function highlightNav() {
        const y = window.scrollY + 200;
        secs.forEach(s => {
            if (y >= s.offsetTop && y < s.offsetTop + s.offsetHeight) {
                allLinks.forEach(l => l.classList.remove('active'));
                document.querySelector(`.nav-links a[href="#${s.id}"]`)?.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', highlightNav);

    /* ──────────── Mobile menu ──────────── */
    const burger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.nav-links');
    burger.addEventListener('click', () => {
        burger.classList.toggle('open');
        mobileNav.classList.toggle('open');
    });
    mobileNav.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            burger.classList.remove('open');
            mobileNav.classList.remove('open');
        });
    });

    /* ──────────── IntersectionObserver reveal ──────────── */
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

    /* ──────────── Project card tilt ──────────── */
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            card.style.transform =
                `perspective(700px) rotateX(${y * -6}deg) rotateY(${x * 6}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });

    /* ──────────── Contact form ──────────── */
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', () => {
        const btn = form.querySelector('.form-submit');
        btn.textContent = 'Sending...';
        btn.style.background = 'linear-gradient(135deg, #22d3ee, #8b5cf6)';
    });

});
