/* =============================================
   ECLIPSE DINING — Central JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll effect ──────────────────
  const navbar = document.querySelector('.navbar');
  const backTop = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 60;
    if (navbar) navbar.classList.toggle('scrolled', scrolled);
    if (backTop) backTop.classList.toggle('visible', window.scrollY > 400);
  });

  if (backTop) {
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ── Active nav link ───────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── Mobile hamburger menu ─────────────────
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ── Menu Tabs ─────────────────────────────
  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuGrids = document.querySelectorAll('.menu-grid');

  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      menuTabs.forEach(t => t.classList.remove('active'));
      menuGrids.forEach(g => g.classList.remove('active'));
      tab.classList.add('active');
      const targetGrid = document.querySelector(`.menu-grid[data-menu="${target}"]`);
      if (targetGrid) targetGrid.classList.add('active');
    });
  });

  // ── Reservation Form ─────────────────────
  const reservationForm = document.getElementById('reservationForm');
  if (reservationForm) {
    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name    = document.getElementById('res-name')?.value.trim();
      const date    = document.getElementById('res-date')?.value;
      const time    = document.getElementById('res-time')?.value;
      const guests  = document.getElementById('res-guests')?.value;
      const email   = document.getElementById('res-email')?.value.trim();

      if (!name || !date || !time || !guests || !email) {
        showToast('⚠️ Please fill in all required fields.', '#e05252');
        return;
      }
      if (!isValidEmail(email)) {
        showToast('⚠️ Please enter a valid email address.', '#e05252');
        return;
      }
      // Simulate success
      showToast(`✅ Reservation confirmed for ${name} on ${formatDate(date)} at ${formatTime(time)}!`);
      reservationForm.reset();
    });
  }

  // ── Contact Form ──────────────────────────
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('✅ Message sent! We\'ll get back to you soon.');
      contactForm.reset();
    });
  }

  // ── Newsletter ────────────────────────────
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('✅ You\'re subscribed! Welcome to Eclipse Dining.');
      form.reset();
    });
  });

  // ── Lightbox for gallery ──────────────────
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length) {
    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.style.cssText = `
      display:none; position:fixed; inset:0; background:rgba(0,0,0,0.92);
      z-index:9998; align-items:center; justify-content:center; cursor:pointer;
    `;
    lightbox.innerHTML = `
      <div style="max-width:80vw;max-height:80vh;text-align:center;position:relative;">
        <div style="font-size:5rem;">🍽️</div>
        <p style="color:#888;margin-top:16px;font-size:0.85rem;letter-spacing:2px;text-transform:uppercase;">
          Replace with your food image
        </p>
        <button onclick="document.getElementById('lightbox').style.display='none'"
          style="position:absolute;top:-40px;right:0;background:none;border:none;color:white;font-size:2rem;cursor:pointer;">✕</button>
      </div>`;
    document.body.appendChild(lightbox);

    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        lightbox.style.display = 'flex';
      });
    });
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.style.display = 'none';
    });
  }

  // ── Counter animation ─────────────────────
  const statNums = document.querySelectorAll('.stat-num[data-count]');
  if (statNums.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statNums.forEach(el => observer.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();
    const update = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  // ── Scroll fade-in ────────────────────────
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = (entry.target.dataset.delay || 0) + 'ms';
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    fadeEls.forEach(el => fadeObserver.observe(el));
  }

  // ── Set min date for reservation ──────────
  const dateInput = document.getElementById('res-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // ── Toast helper ─────────────────────────
  function showToast(msg, color = '') {
    let toast = document.getElementById('globalToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'globalToast';
      toast.className = 'toast';
      toast.innerHTML = `<span class="toast-msg"></span><span class="toast-close" onclick="this.parentElement.classList.remove('show')">✕</span>`;
      document.body.appendChild(toast);
    }
    toast.querySelector('.toast-msg').textContent = msg;
    toast.style.borderColor = color || 'var(--accent)';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 5000);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  function formatTime(timeStr) {
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  }

  // ── Add fade-in CSS ───────────────────────
  const style = document.createElement('style');
  style.textContent = `
    .fade-in { opacity:0; transform:translateY(24px); transition:opacity 0.6s ease, transform 0.6s ease; }
    .fade-in.visible { opacity:1; transform:translateY(0); }
  `;
  document.head.appendChild(style);

});