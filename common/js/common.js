const revealOption = { duration: 1200, distance: '60px', opacity: 0, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', reset: false, beforeReveal: (el) => { el.classList.add('sr-animate') }, beforeReset: (el) => { el.classList.remove('sr-animate') } }
const fadeIn = { ...revealOption, distance: 0 }
const fadeUp = { ...revealOption, origin: 'bottom' }
const fadeRight = { ...revealOption, origin: 'left' }
const fadeLeft = { ...revealOption, origin: 'right' }
const zoomOutUp = { ...revealOption, origin: 'bottom', scale: 0.5 }
// (ex) ScrollReveal().reveal(".sub-visual .heading", {...fadeUp});
// (ex) ScrollReveal().reveal(".sub-visual .heading", {...fadeUp, interval: 100});
// (ex) ScrollReveal().reveal(".sub-visual .heading", {...fadeUp, interval: 100, delay: 100});
let lenis, rafId;

document.addEventListener('DOMContentLoaded', () => {
  const device = new Device();
  const header = new Header();
  gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);
  handleLenis(!device.isTablet && !device.isMobile);
  language();
  footerDropDown();
  scrollBtn();
  sublinkWrap();
});

window.addEventListener('scroll', ()=> {
  floating();
})

window.addEventListener('deviceChange', (e) => {
  const { from, to } = e.detail;
  if (from.isDesktop !== to.isDesktop) {
    handleLenis(to.isDesktop);
  }
});

function handleLenis(isDesktop) {
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }

  if (isDesktop) {
    lenis = new Lenis({
      duration: 0.6,
      infinite: false,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      gestureOrientation: "vertical",
      normalizeWheel: false,
      smoothTouch: true,
    });

    function animate(time) {
      lenis?.raf(time);
      rafId = requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    document.body.style.removeProperty('overflow');
  } else {
    document.body.style.overflow = 'visible';
    document.documentElement.style.overflow = 'visible';
  }
}

function language() {
  const toggle = document.querySelector('.header-language .current');

  if (toggle === null) {
    return;
  }

  toggle.addEventListener('click', (el) => {
    if (toggle.getAttribute('aria-pressed') === 'true') {
      toggle.setAttribute('aria-pressed', 'false');
    } else {
      toggle.setAttribute('aria-pressed', 'true');
    }
  });

  window.addEventListener('click', (e) => {
    if (e.target.parentNode === toggle) {
      return;
    }
    if (e.target !== toggle) {
      toggle.setAttribute('aria-pressed', 'false');
    }
  });
}

function sublinkWrap() {
  const linkWrap = document.querySelector('.subvisual-sw');
  if (!linkWrap) return;
  const linkSlides = linkWrap.querySelectorAll('.swiper-slide');
  const sublinkWrap = new Swiper(linkWrap, {
    speed: 300,
    freeMode: true,
    slidesPerView: 'auto',
    slidesPerGroup: 1,
  });

  linkSlides.forEach((tab, i) => {
    if (tab.classList.contains('on')) {
      if (i < 2) {
        return;
      }
      sublinkWrap.slideTo(i, 0);
    }
  });
}

function footerDropDown() {
  const content = document.querySelector('.site-wrap');
  if(!content) return;
  content.addEventListener('click', () => {
    content.classList.toggle('active');
  })
}

function floating(){
  const scrollPosition = window.pageYOffset;
  const scrollTo = document.querySelector('.floating-container');
  if(!scrollTo) return;
  const footer = document.querySelector('footer');
  console.log(scrollTo);
  console.log(window.innerHeight);
  // 브라우저 창의 하단이 footer에 닿았는지 확인
  if (window.innerHeight >= footer.getBoundingClientRect().top) {
    // footer에 닿았을 때 position을 'absolute'로 설정
    scrollTo.style.position = 'absolute';
  } else {
    // 그 외의 경우에는 position을 'fixed'로 설정
    scrollTo.style.position = 'fixed';
  }

  if (scrollPosition >= window.innerHeight / 2) {
    scrollTo.classList.add('active');
  } else {
    scrollTo.classList.remove('active');
  }
}

function scrollBtn() {
	const scroll_btn = document.querySelector('.scroll-top');
  if (!scroll_btn) return;
	scroll_btn.addEventListener('click', () => {
		const target = 0;
		const duration = 200;
		const start = window.pageYOffset;
		const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

		const scrollAnimation = (currentTime) => {
			const timeElapsed = currentTime - startTime;
			const progress = Math.min(timeElapsed / duration, 1);

			window.scrollTo(0, start + progress * (target - start));

			if (progress < 1) {
				window.requestAnimationFrame(scrollAnimation);
			}
		};

		window.requestAnimationFrame(scrollAnimation);
	});
}

const splitText = () => {
  const textElements = document.querySelectorAll('.split');
  textElements.forEach(textElement => {
    const nodes = Array.from(textElement.childNodes);
    let newHtml = '';

    nodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const chars = node.textContent.split('');
        newHtml += chars.map(char =>
          char === ' ' ?
            '<span class="word">&nbsp;</span>' :
            `<span class="word">${char}</span>`
        ).join('');
      } else if (node.nodeName === 'BR') {
        // 기존 br의 클래스 유지
        const className = node.className;
        newHtml += `<br${className ? ` class="${className}"` : ''}>`;
      }
    });

    textElement.innerHTML = newHtml;
  });
};
