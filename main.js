// ========================
//  MAIN.JS — C V Gopinath Portfolio
// ========================

document.addEventListener('DOMContentLoaded', () => {

  // ===== INTRO SPLASH — PHASE 0 (Video) + PHASE 1 (Photos) + PHASE 2 (Videos) =====
  (function initIntroSplash() {
    const splash       = document.getElementById('intro-splash');
    const phasePromo   = document.getElementById('intro-phase-promo');
    const promoPlayer  = document.getElementById('intro-promo-player');
    const promoSkipBtn = document.getElementById('intro-promo-skip');
    const phasePhotos  = document.getElementById('intro-phase-photos');
    const phaseVideos  = document.getElementById('intro-phase-videos');
    const skipBtn      = document.getElementById('intro-skip');
    const progress     = document.getElementById('intro-progress');
    const slides       = document.querySelectorAll('.intro-slide');
    const dots         = document.querySelectorAll('.intro-dot');
    const enterBtn     = document.getElementById('ivp-enter-btn');
    const ivpTabs      = document.querySelectorAll('.ivp-tab');
    const ivpPlayer    = document.getElementById('ivp-player');
    const ivpSource    = document.getElementById('ivp-source');
    const ivpNowLabel  = document.getElementById('ivp-now-label');

    if (!splash || slides.length === 0) return;

    const totalSlides   = slides.length;
    const slideInterval = 1800;
    const totalDuration = slideInterval * totalSlides;
    let currentSlide = 0;
    let timer = null;
    let progTimer = null;

    // Language video map — local MP4 language byte files
    const videoMap = {
      english: { src: 'CV GOPINATH_English Byte for Website_FINAL.mp4',      label: 'Now Playing: English Byte'  },
      hindi:   { src: 'CV GOPINATH_New Hindi Byte for Website.mp4',           label: 'Now Playing: Hindi Byte'    },
      kannada: { src: 'CV GOPINATH_Kannada Byte for Website_FINAL.mp4',      label: 'Now Playing: Kannada Byte'  }
    };

    function goToSlide(index) {
      slides[currentSlide].classList.remove('active');
      if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
      currentSlide = index % totalSlides;
      slides[currentSlide].classList.add('active');
      if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    function showVideoPhase() {
      clearInterval(timer);
      clearInterval(progTimer);
      phasePhotos.style.transition = 'opacity 0.7s ease';
      phasePhotos.style.opacity = '0';
      setTimeout(() => {
        phasePhotos.style.display = 'none';
        phaseVideos.classList.remove('intro-phase-hidden');
        phaseVideos.classList.add('intro-phase-visible');
        // Auto-play the language byte video when phase appears
        const vid = document.getElementById('ivp-player');
        if (vid) {
          vid.muted = false;
          vid.play().catch(() => {
            vid.muted = true;
            vid.play().catch(() => {});
          });
        }
      }, 700);
    }

    function exitSplash() {
      // Pause the local video player
      if (ivpPlayer && typeof ivpPlayer.pause === 'function') {
        ivpPlayer.pause();
      }
      splash.classList.add('exiting');
      splash.addEventListener('animationend', () => {
        splash.classList.add('hidden');
        document.body.style.overflow = '';
      }, { once: true });
    }

    document.body.style.overflow = 'hidden';

    // Transition from Promo Video to Photos Slideshow
    function transitionToSlideshow() {
      if (promoPlayer) {
        promoPlayer.pause();
      }
      if (phasePromo) {
        phasePromo.style.transition = 'opacity 0.7s ease';
        phasePromo.style.opacity = '0';
        setTimeout(() => {
          phasePromo.style.display = 'none';
          if (phasePhotos) {
            phasePhotos.classList.remove('intro-phase-hidden');
            startSlideshow();
          }
        }, 700);
      } else {
        startSlideshow();
      }
    }

    // Start Photos Slideshow Phase
    function startSlideshow() {
      if (timer || progTimer) return; // Already running

      let slideCount = 1;
      timer = setInterval(() => {
        if (slideCount >= totalSlides) {
          showVideoPhase();
          return;
        }
        goToSlide(slideCount);
        slideCount++;
      }, slideInterval);

      const step = 100 / (totalDuration / 100);
      let prog = 0;
      progTimer = setInterval(() => {
        prog = Math.min(prog + step, 100);
        if (progress) progress.style.width = prog + '%';
      }, 100);
    }

    // Initialize Promo Video Phase
    const promoUnmuteBtn = document.getElementById('intro-promo-unmute');

    function updateMuteButtonState() {
      if (promoPlayer && promoUnmuteBtn) {
        if (promoPlayer.muted) {
          promoUnmuteBtn.textContent = 'Unmute';
        } else {
          promoUnmuteBtn.textContent = 'Mute';
        }
      }
    }

    // Try to unmute on first user interaction anywhere on the document
    const unmuteOnInteraction = (e) => {
      // Exclude clicks specifically on control buttons to let their own handlers run
      if (e.target.closest('#intro-promo-unmute') || e.target.closest('#intro-promo-skip')) {
        cleanupInteractionListeners();
        return;
      }
      if (promoPlayer && promoPlayer.muted) {
        promoPlayer.muted = false;
        updateMuteButtonState();
      }
      cleanupInteractionListeners();
    };

    function cleanupInteractionListeners() {
      document.removeEventListener('click', unmuteOnInteraction);
      document.removeEventListener('touchstart', unmuteOnInteraction);
      document.removeEventListener('keydown', unmuteOnInteraction);
    }

    if (promoPlayer) {
      // First, try playing unmuted
      promoPlayer.muted = false;
      promoPlayer.play().then(() => {
        // Successfully started unmuted autoplay
        updateMuteButtonState();
      }).catch(() => {
        // Blocked because it was unmuted, so mute and play
        promoPlayer.muted = true;
        updateMuteButtonState();
        promoPlayer.play().catch(err => {
          console.log("Muted autoplay also failed:", err);
        });

        // Add listeners to unmute on user's first interaction
        document.addEventListener('click', unmuteOnInteraction);
        document.addEventListener('touchstart', unmuteOnInteraction);
        document.addEventListener('keydown', unmuteOnInteraction);
      });

      promoPlayer.addEventListener('ended', () => {
        cleanupInteractionListeners();
        transitionToSlideshow();
      });
      promoPlayer.addEventListener('volumechange', updateMuteButtonState);
    }

    if (promoUnmuteBtn && promoPlayer) {
      promoUnmuteBtn.addEventListener('click', () => {
        cleanupInteractionListeners();
        if (promoPlayer.muted) {
          promoPlayer.muted = false;
        } else {
          promoPlayer.muted = true;
        }
        updateMuteButtonState();
      });
    }

    if (promoSkipBtn) {
      promoSkipBtn.addEventListener('click', () => {
        cleanupInteractionListeners();
        transitionToSlideshow();
      });
    }

    // If no promo video player is found, immediately start the slideshow
    if (!promoPlayer) {
      startSlideshow();
    }

    if (skipBtn) skipBtn.addEventListener('click', showVideoPhase);

    ivpTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const lang = tab.dataset.lang;
        const info = videoMap[lang];
        if (!info) return;
        ivpTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        // Swap local MP4 source and reload, then always play
        const vid = document.getElementById('ivp-player');
        const src = document.getElementById('ivp-source');
        if (vid && src) {
          src.src = info.src;
          vid.load();
          vid.muted = false;
          vid.play().catch(() => {
            vid.muted = true;
            vid.play().catch(() => {});
          });
        }
        if (ivpNowLabel) ivpNowLabel.textContent = info.label;
      });
    });

    if (enterBtn) enterBtn.addEventListener('click', exitSplash);
  })();

  // ===== LANGUAGE VIDEO BYTE SWITCHER =====
  (function initVideoByteSwitcher() {
    const langBtns = document.querySelectorAll('.vb-lang-btn');
    const player   = document.getElementById('vb-player');
    const source   = document.getElementById('vb-source');
    const nowLabel = document.getElementById('vb-now-label');

    if (!player || langBtns.length === 0) return;

    // Language video map — local MP4 language byte files
    const videoMap = {
      english: {
        src: 'CV GOPINATH_English Byte for Website_FINAL.mp4',
        label: 'Now Playing: English Byte'
      },
      hindi: {
        src: 'CV GOPINATH_New Hindi Byte for Website.mp4',
        label: 'Now Playing: Hindi Byte'
      },
      kannada: {
        src: 'CV GOPINATH_Kannada Byte for Website_FINAL.mp4',
        label: 'Now Playing: Kannada Byte'
      }
    };

    langBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        const info = videoMap[lang];
        if (!info) return;

        // Update active state
        langBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Swap video
        const wasPlaying = !player.paused;
        const currentTime = player.currentTime;

        if (source) {
          source.src = info.src;
        }
        player.load();

        if (wasPlaying) {
          player.play().catch(() => {});
        }

        // Update label
        if (nowLabel) nowLabel.textContent = info.label;
      });
    });
  })();


  // ---- NAV: Scroll effect (RAF-debounced for butter smoothness) ----
  const nav = document.getElementById('main-nav');
  let lastScrollY = 0;
  let ticking = false;

  function onScroll() {
    lastScrollY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(() => {
        if (nav) nav.classList.toggle('scrolled', lastScrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  }

  if (nav) {
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---- NAV: Mobile toggle ----
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');
  if (navToggle && navLinks) {

    function openMobileNav() {
      navLinks.classList.add('open');
      navToggle.classList.add('open');
      navToggle.setAttribute('aria-expanded', 'true');
    }

    function closeMobileNav() {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navLinks.classList.contains('open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    // Close menu when a nav link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (nav && !nav.contains(e.target)) {
        closeMobileNav();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileNav();
    });
  }

  // ---- Active nav link (auto-detect from URL) ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // ---- CERT ITEMS: promote to gallery-item before lightbox init ----
  // Must run BEFORE lightbox event binding so click handlers attach
  document.querySelectorAll('.cert-item').forEach(item => {
    item.classList.add('gallery-item');
    const nameEl = item.querySelector('.cert-item-name');
    if (nameEl) item.dataset.caption = nameEl.textContent.trim();
  });

  // ---- Lightbox ----
  const lightbox       = document.getElementById('lightbox');
  const lightboxImg    = document.getElementById('lightbox-img');
  const lightboxCap    = document.getElementById('lightbox-caption');
  const lightboxClose  = document.getElementById('lightbox-close');

  const openLightbox = (src, caption) => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    if (lightboxCap) lightboxCap.textContent = caption || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    // Clear src after fade to avoid flash
    setTimeout(() => { if (lightboxImg) lightboxImg.src = ''; }, 300);
  };

  if (lightbox) {
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) openLightbox(img.src, item.dataset.caption || '');
      });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
  }

  // ---- Page Transition Overlay (butter smooth page navigation) ----
  (function initPageTransitions() {
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);

    // Intercept internal navigation links
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      // Only intercept local page links (not external, anchors, or JS)
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || link.target === '_blank') return;
      if (href.endsWith('.pdf') || href.endsWith('.docx') || href.endsWith('.doc')) return;

      link.addEventListener('click', (e) => {
        e.preventDefault();
        overlay.classList.add('active');
        setTimeout(() => {
          window.location.href = href;
        }, 300);
      });
    });
  })();

  // ---- Articles Tabs ----
  const tabs   = document.querySelectorAll('.articles-tab');
  const panels = document.querySelectorAll('.article-panel');
  if (tabs.length > 0) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t   => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const panel = document.getElementById(tab.dataset.panel);
        if (panel) panel.classList.add('active');
      });
    });
  }

  // ---- Gallery Filters ----
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        galleryItems.forEach(item => {
          const match = filter === 'all' || item.dataset.category === filter;
          if (match) {
            item.style.display = '';
            requestAnimationFrame(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            });
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => { item.style.display = 'none'; }, 400);
          }
        });
      });
    });
  }

  // ---- Video thumbnail & Watch Now buttons ----
  // Handled by the inline modal script in videos.html.
  // (The new modal uses youtube-nocookie.com embed inside a lightbox.)



  // ---- Show notice for unset video IDs ----
  function showVideoNotice(placeholder) {
    // Only show once per card
    if (placeholder.dataset.noticeShown) return;
    placeholder.dataset.noticeShown = '1';
    const notice = document.createElement('div');
    notice.style.cssText = `
      position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
      background:rgba(10,10,10,0.85); padding:20px; text-align:center;
      font-family:var(--font-sans); font-size:0.75rem; color:var(--text-muted);
      letter-spacing:0.05em; line-height:1.6;
    `;
    notice.textContent = 'YouTube link coming soon. Please provide the video URL to activate this player.';
    placeholder.style.position = 'relative';
    placeholder.appendChild(notice);
    setTimeout(() => notice.remove(), 3000);
  }

  // ---- Scroll Reveal (auto-applied to common elements) ----
  const autoRevealSelectors = [
    '.about-headline', '.about-subtext', '.about-stats',
    '.section-title-marquee', '.talk-row',
    '.journey-headline', '.testimonial-card',
    '.association-card', '.award-item', '.video-card',
    '.article-row', '.impression-full-card', '.profile-text-col',
    '.journey-card', '.stat-item'
  ];

  autoRevealSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('reveal');
    });
  });

  // Add stagger delays to journey cards
  document.querySelectorAll('.journey-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });

  // Add stagger to association cards
  document.querySelectorAll('.association-card').forEach((card, i) => {
    card.style.transitionDelay = `${(i % 3) * 0.08}s`;
  });

  // Single IntersectionObserver for all .reveal elements (earlier trigger for smoothness)
  const allReveals = document.querySelectorAll('.reveal');
  if (allReveals.length > 0) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
    allReveals.forEach(el => revealObs.observe(el));
  }

  // ---- Parallax hero photo (RAF-based, GPU-accelerated) ----
  const heroPhoto = document.getElementById('hero-photo');
  if (heroPhoto) {
    heroPhoto.style.willChange = 'transform';
    let parallaxTicking = false;

    window.addEventListener('scroll', () => {
      if (!parallaxTicking) {
        requestAnimationFrame(() => {
          const offset = window.scrollY * 0.06;
          heroPhoto.style.transform = `translate3d(0, ${offset}px, 0)`;
          parallaxTicking = false;
        });
        parallaxTicking = true;
      }
    }, { passive: true });
  }

  // ---- Subtle gold cursor dot ----
  const dot = document.createElement('div');
  dot.setAttribute('aria-hidden', 'true');
  dot.style.cssText = `
    position:fixed; pointer-events:none; z-index:9999;
    width:6px; height:6px; border-radius:50%;
    background:rgba(212,160,23,0.7);
    box-shadow:0 0 12px rgba(212,160,23,0.5);
    transform:translate(-50%,-50%);
    transition:left 0.12s ease, top 0.12s ease, opacity 0.3s ease;
    opacity:0;
  `;
  document.body.appendChild(dot);
  document.addEventListener('mousemove', (e) => {
    dot.style.left = e.clientX + 'px';
    dot.style.top  = e.clientY + 'px';
    dot.style.opacity = '1';
  });
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; });

  // ---- Disable dead links gracefully ----
  document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', (e) => e.preventDefault());
    link.setAttribute('aria-disabled', 'true');
  });

  // ---- Smooth image loading: fade in after load ----
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.4s ease';
    const onLoad = () => {
      img.style.opacity = '1';
      img.classList.add('loaded');
    };
    if (img.complete && img.naturalWidth > 0) {
      img.style.opacity = '1';
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', onLoad, { once: true });
      img.addEventListener('error', () => { img.style.opacity = '0.3'; img.classList.add('loaded'); }, { once: true });
    }
  });

  // ---- Video: ensure poster shows before play ----
  document.querySelectorAll('video').forEach(v => {
    v.addEventListener('canplay', () => { v.style.opacity = '1'; });
  });

});
