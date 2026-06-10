document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll(
    '.hero-section .row > div, .section-block .row > div, .card-soft, .feature-card, .mini-card, .section-shell, .footer-custom .col-lg-4'
  );

  animatedElements.forEach((element) => {
    element.classList.add('reveal-item');
  });

  if (!('IntersectionObserver' in window)) {
    animatedElements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: '0px 0px -8% 0px',
    }
  );

  animatedElements.forEach((element) => observer.observe(element));

  const navbar = document.querySelector('.navbar');

  if (navbar) {
    const updateNavbarState = () => {
      navbar.classList.toggle('navbar-scrolled', window.scrollY > 12);
    };

    updateNavbarState();
    window.addEventListener('scroll', updateNavbarState, { passive: true });
  }

  const pageNav = document.querySelector('.page-nav');
  const pageNavLinks = pageNav ? Array.from(pageNav.querySelectorAll('.nav-link[href^="#"]')) : [];

  if (pageNavLinks.length > 0 && 'IntersectionObserver' in window) {
    const sectionMap = new Map();

    pageNavLinks.forEach((link) => {
      const targetId = link.getAttribute('href')?.slice(1);
      const target = targetId ? document.getElementById(targetId) : null;

      if (target) {
        sectionMap.set(target, link);
      }
    });

    const setActiveLink = (activeLink) => {
      pageNavLinks.forEach((link) => link.classList.remove('active'));
      if (activeLink) {
        activeLink.classList.add('active');
      }
    };

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);

        if (!visibleEntry) return;

        const activeLink = sectionMap.get(visibleEntry.target);
        setActiveLink(activeLink);
      },
      {
        rootMargin: '-35% 0px -55% 0px',
        threshold: 0.01,
      }
    );

    sectionMap.forEach((_, section) => sectionObserver.observe(section));

    if (pageNavLinks[0]) {
      setActiveLink(pageNavLinks[0]);
    }
  }
});