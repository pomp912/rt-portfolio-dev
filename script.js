document.documentElement.classList.replace('no-js', 'js');

const year = document.getElementById('year');
if (year) {
  year.textContent = new Date().getFullYear();
}

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.getElementById('main-nav');

if (menuToggle && mainNav) {
  const closeMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    mainNav.classList.remove('is-open');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    mainNav.classList.toggle('is-open', !isOpen);
  });

  mainNav.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a')) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuToggle.focus();
    }
  });
}

const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle?.querySelector('.theme-icon');
const themeColor = document.querySelector('meta[name="theme-color"]');
const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)');

const updateThemeButton = () => {
  const isDark = root.dataset.theme
    ? root.dataset.theme === 'dark'
    : systemDarkMode.matches;

  themeToggle?.setAttribute('aria-pressed', String(isDark));
  themeIcon?.replaceChildren(document.createTextNode(isDark ? '☀' : '◐'));
  themeColor?.setAttribute('content', isDark ? '#353535' : '#f7f7f4');
};

updateThemeButton();
systemDarkMode.addEventListener('change', () => {
  if (!root.dataset.theme) {
    updateThemeButton();
  }
});

themeToggle?.addEventListener('click', () => {
  const currentTheme = root.dataset.theme || (systemDarkMode.matches ? 'dark' : 'light');
  root.dataset.theme = currentTheme === 'dark' ? 'light' : 'dark';
  updateThemeButton();
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const welcomeOverlay = document.getElementById('welcome-overlay');
const welcomeToast = document.getElementById('welcome-toast');

if (welcomeOverlay && welcomeToast) {
  welcomeOverlay.hidden = false;
  window.setTimeout(() => {
    welcomeOverlay.classList.add('is-leaving');
    window.setTimeout(() => {
      welcomeOverlay.hidden = true;
    }, reduceMotion.matches ? 0 : 520);
  }, 2800);
}

const revealElements = [...document.querySelectorAll('[data-reveal]')];

if (reduceMotion.matches || !('IntersectionObserver' in window)) {
  revealElements.forEach((element) => element.classList.add('in'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  );

  revealElements.forEach((element, index) => {
    element.style.setProperty('--stagger', `${(index % 4) * 80}ms`);
    revealObserver.observe(element);
  });
}

const sections = [...document.querySelectorAll('#work, #experience, #skills, #about')];
const navLinks = [...document.querySelectorAll('.main-nav a')];

if ('IntersectionObserver' in window) {
  const activeSectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        navLinks.forEach((link) => {
          if (link.hash === `#${entry.target.id}`) {
            link.setAttribute('aria-current', 'location');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    },
    { rootMargin: '-25% 0px -65% 0px' }
  );

  sections.forEach((section) => activeSectionObserver.observe(section));
}

const progress = document.querySelector('.progress');
const header = document.querySelector('.site-header');
const timeline = document.querySelector('.timeline');
let scrollFrame = 0;

const updateScrollEffects = () => {
  scrollFrame = 0;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const scrollProgress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
  progress?.style.setProperty('transform', `scaleX(${scrollProgress})`);
  header?.classList.toggle('is-scrolled', window.scrollY > 40);

  if (timeline) {
    const bounds = timeline.getBoundingClientRect();
    const range = bounds.height + window.innerHeight * 0.25;
    const fill = range > 0
      ? Math.min(1, Math.max(0, (window.innerHeight * 0.75 - bounds.top) / range))
      : 0;
    timeline.style.setProperty('--timeline-progress', fill.toFixed(3));
  }

};

const requestScrollUpdate = () => {
  if (!scrollFrame) {
    scrollFrame = window.requestAnimationFrame(updateScrollEffects);
  }
};

window.addEventListener('scroll', requestScrollUpdate, { passive: true });
window.addEventListener('resize', requestScrollUpdate);
reduceMotion.addEventListener('change', requestScrollUpdate);
requestScrollUpdate();
