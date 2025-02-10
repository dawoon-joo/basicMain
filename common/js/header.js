// header.js
class Header {
  constructor() {
    this.GNB = document.querySelector('.gnb');
    this.HEADER = document.querySelector('.header');
    this.depth1Items = this.GNB.querySelectorAll('.depth1 > li');
    this.originalTheme = this.HEADER.dataset.headerTheme || '';
    this.hamburger = this.HEADER.querySelector('.hamburger');
    this.device = new Device();
    this.headerMinHeight = this.GNB.offsetHeight;
    this.headerMaxHeight = this.GNB.querySelector('.depth1').offsetHeight;
    this.scrollY = 0;
    this.stickyState = false;
    this.option = {
      maxDeviceWidth: 1024,
      ticking: false
    };
    this.init();
  }

  init() {
    this.bindEvents();
    this.deviceEvent();
    if (this.hamburger) {
      this.setupHamburger();
    }
  }

  deviceEvent() {
    window.addEventListener('deviceChange', (e) => {
      const { from, to } = e.detail;
      this.resetHeaderDimensions();
      if (from.isDesktop !== to.isDesktop) {
        this.resetMenu();
      }
    });
  }

  bindEvents() {
    this.depth1Items.forEach(item => { item.addEventListener('mouseenter', this.handleGnbMouseEnter.bind(this)); });
    this.HEADER.addEventListener('mouseleave', this.handleGnbMouseLeave.bind(this));
    window.addEventListener('resize', () => this.updateHeaderDimensions());
    window.addEventListener('scroll', () => {
      if (!this.option.ticking) {
        window.requestAnimationFrame(() => {
          this.toggleHeader();
          this.stickyHeader();
          this.option.ticking = false;
        });
        this.option.ticking = true;
      }
    });
  }

  // GNB 관련 메서드
  handleGnbMouseEnter() {
    if (this.device.isTablet || window.innerWidth <= this.option.maxDeviceWidth) return;

    this.setHeaderTheme('light', 'opened');
    this.animateGnb(this.headerMaxHeight, 0.5);
  }

  handleGnbMouseLeave() {
    if (this.device.isTablet || window.innerWidth <= this.option.maxDeviceWidth) return;

    this.setHeaderTheme(this.originalTheme);
    this.animateGnb(this.headerMinHeight, 0.3);
  }

  animateGnb(height, duration) {
    gsap.killTweensOf(this.GNB);
    gsap.to(this.GNB, { duration, height });
  }

  setHeaderTheme(theme, gnbState = '') {
    this.HEADER.dataset.headerTheme = theme;
    this.HEADER.dataset.headerGnb = gnbState;
  }

  updateHeaderDimensions() {
    this.headerMaxHeight = this.GNB.querySelector('.depth1').offsetHeight;
  }

  resetHeaderDimensions() {
    this.headerMinHeight = '';
    this.headerMaxHeight = 'none';
    this.GNB.style.height = this.headerMinHeight;
  }

  toggleHeader() {
    const isMainPage = document.querySelector('.wrap.main') !== null;
    if (isMainPage && !window.headerControlEnabled) return;
    if (window.scrollY > this.option.scrollY) {
      if (window.scrollY < 10) {
        gsap.to('.header', { y: 0 });
      } else {
        gsap.to('.header', { y: -170, duration: 0.2 });
      }
    }

    if (window.scrollY < this.option.scrollY) {
      gsap.to('.header', { y: 0 });
    }

    this.option.scrollY = window.scrollY;
  }

  stickyHeader() {
    if (!this.HEADER) {
      console.warn('Header element not found in stickyHeader');
      return;
    }

    const isSticky = window.scrollY > 230;
    this.stickyState = isSticky;

    try {
      this.HEADER.setAttribute('data-header-sticky', isSticky.toString());
    } catch (error) {
      console.error('Error setting header sticky state:', error);
    }
  }

  // 햄버거 관련 메서드
  setupHamburger() {
    const openButton = this.hamburger?.querySelector('a');
    if (!openButton) {
      console.error('햄버거 버튼을 찾을 수 없습니다.');
      return;
    }

    openButton.addEventListener('click', () => this.toggleMenu());
    this.depth1Items.forEach(item => {
      item.addEventListener('click', (e) => this.handleAccordion(e));
    });
  }

  handleAccordion(event) {
    const depth2 = event.target.nextElementSibling;
    if (!depth2) return;

    const isExpanded = event.target.getAttribute('aria-expanded') === 'true';
    event.target.setAttribute('aria-expanded', !isExpanded);

    this.animateAccordion(depth2, isExpanded);
    event.preventDefault();
  }

  animateAccordion(element, isExpanded) {
    if (isExpanded) {
      gsap.to(element, {
        duration: 0.3,
        maxHeight: 0,
        onComplete: () => element.removeAttribute('style')
      });
    } else {
      gsap.to(element, {
        duration: 0.3,
        maxHeight: element.scrollHeight,
        opacity: 1,
        visibility: 'visible'
      });
    }
  }

  toggleMenu() {
    const body = document.body;
    const html = document.documentElement;
    const isOpen = this.hamburger.classList.contains('open');
  
    this.HEADER.dataset.hamburger = !isOpen ? 'opened' : 'closed';
    this.hamburger.classList.toggle('open');
  
    if (!isOpen) {
      body.setAttribute('data-lenis-prevent', '');
      body.style.overflow = 'hidden';
      html.style.overflow = 'hidden';
    } else {
      body.removeAttribute('data-lenis-prevent');
      body.style.removeProperty('overflow');
      html.style.removeProperty('overflow');
    }
  
    this.resetHeaderDimensions();
  }
  
  resetMenu() {
    const body = document.body;
    const html = document.documentElement;
  
    this.HEADER.dataset.hamburger = 'closed';
    this.hamburger.classList.remove('open');
  
    body.removeAttribute('data-lenis-prevent');
    body.style.removeProperty('overflow');
    html.style.removeProperty('overflow');
  
    this.depth1Items.forEach(item => {
      const depth1Link = item.querySelector('a');
      if (depth1Link) {
        depth1Link.setAttribute('aria-expanded', 'false');
      }
    });
  
    const depth2Items = this.HEADER.querySelectorAll('.depth2');
    depth2Items.forEach(item => {
      gsap.killTweensOf(item);
      item.removeAttribute('style');
    });
  }
}


