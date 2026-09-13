/* ============================================================
   script.js — HCM202 Presentation Website
   ============================================================ */

/* ----------------------------------------------------------
   1. PROGRESS BAR
   ---------------------------------------------------------- */
(function () {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;

  function updateProgress() {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width  = pct + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

})();

/* ----------------------------------------------------------
   3. SCROLL REVEAL — Intersection Observer
   ---------------------------------------------------------- */
(function () {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => observer.observe(el));
})();



/* ----------------------------------------------------------
   5. IMAGE PLACEHOLDERS — Click to open file picker
   ---------------------------------------------------------- */
(function () {
  const placeholders = document.querySelectorAll('.img-placeholder');

  placeholders.forEach(ph => {
    ph.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type   = 'file';
      input.accept = 'image/*';
      input.style.display = 'none';

      input.addEventListener('change', () => {
        const file = input.files[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        const img = document.createElement('img');
        img.src   = url;
        img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:inherit;position:absolute;inset:0;';

        // Keep border-radius but show image
        ph.style.border   = 'none';
        ph.style.padding  = '0';
        ph.style.animation = 'none';
        ph.innerHTML      = '';
        ph.appendChild(img);
        ph.title = file.name;
      });

      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);
    });

    // Tooltip
    ph.title = 'Nhấn để chèn ảnh';
  });
})();

/* ----------------------------------------------------------
   6. SMOOTH SCROLL for anchor links
   ---------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ----------------------------------------------------------
   7. TIMELINE DOTS — Hover glow pulse
   ---------------------------------------------------------- */
(function () {
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const dot = item.querySelector('.timeline-dot');
      if (dot) dot.style.transform = 'scale(1.4)';
    });
    item.addEventListener('mouseleave', () => {
      const dot = item.querySelector('.timeline-dot');
      if (dot) dot.style.transform = '';
    });
  });
})();

/* ----------------------------------------------------------
   8. SECTION ENTRANCE COUNTER ANIMATION (stat-number)
   ---------------------------------------------------------- */
(function () {
  const statNums = document.querySelectorAll('.stat-number');

  const animateNum = (el, target, duration = 1200) => {
    if (isNaN(target)) return; // skip '∞'
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el  = entry.target;
        const val = parseFloat(el.textContent);
        if (!isNaN(val)) animateNum(el, val);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => {
    if (!isNaN(parseFloat(el.textContent))) obs.observe(el);
  });
})();
