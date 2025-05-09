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
  initDragScroll();
  splitText
  AOS.init();
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
  // console.log(scrollTo);
  // console.log(window.innerHeight);
  // 브라우저 창의 하단이 footer에 닿았는지 확인
  if (window.innerHeight >= footer.getBoundingClientRect().top) {
    // footer에 닿았을 때 position을 'absolute'로 설정
    scrollTo.style.position = 'absolute';
  } else {
    // 그 외의 경우에는 position을 'fixed'로 설정
    scrollTo.style.position = 'fixed';
  }

  if (scrollPosition >= window.innerHeight * 2.5) {
    scrollTo.classList.add('active');
  } else {
    scrollTo.classList.remove('active');
  }
}

// 스크롤 TOP 버튼 애니메이션
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

// 텍스트 분리 애니메이션
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

// 카운트 애니메이션
const createNumberRolling = (selector = '.number_motion .year') => {
  const tl = gsap.timeline();
  const elements = document.querySelectorAll(selector);
  
  elements.forEach(element => {
    const fromYear = element.innerHTML;
    const toYear = element.getAttribute('data-to');

    // 숫자만 추출하여 개수 확인
    const numericDigits = toYear.replace(/[^0-9]/g, '').length;    
    const isLongNumber = numericDigits >= 4;
    
    element.innerHTML = '';
    
    for (let i = 0; i < fromYear.length; i++) {
      // 숫자가 아닌 경우 (쉼표, 소수점 등) 정적 요소로 추가
      if (isNaN(parseInt(fromYear.charAt(i))) || fromYear.charAt(i) === ' ') {
        const staticChar = document.createElement('span');
        staticChar.textContent = fromYear.charAt(i);
        element.appendChild(staticChar);
        continue;
      }
      
      // 숫자인 경우 처리
      let toNumber = parseInt(fromYear.charAt(i)) || 0;
      let fromNumber = parseInt(toYear.charAt(i)) || 0;
      
      let chars = [];
      
      // 같은 숫자면 한바퀴 돌기
      if (fromNumber === toNumber) {
        for (let n = fromNumber; n >= 0; n--) chars.push(n);
        for (let n = 9; n >= fromNumber; n--) chars.push(n);
      } else {
        // 다른 숫자면 목표까지 감소
        let count = 0;
        const maxIterations = 15; // 안전 장치
        
        while (count < maxIterations) {
          chars.push(fromNumber);
          if (fromNumber === toNumber) break;
          fromNumber = (fromNumber - 1 + 10) % 10;
          count++;
        }
      }
      
      // 요소 생성 및 애니메이션 설정
      const digitEl = document.createElement('span');
      digitEl.innerHTML = chars.join('<br>');
      element.appendChild(digitEl);
      
      const duration = 3 + i * (isLongNumber ? 0 : 0.1);
      const delayFactor = isLongNumber ? 0.2 : 0.7; 
      // GSAP 3 문법으로 수정
      tl.from(digitEl, duration, {
        y: -(chars.length - 1) + 'em', 
        ease: Power3.easeInOut, 
        delay: (fromYear.length - i - 1) * delayFactor
      }, 0);
    }
  });
  
  return tl;
};

// 가로스크롤 생길때 drag 안내(swiper 대응)
function initDragScroll() {
  const dragElements = document.querySelectorAll(`[data-scroll='drag']`);
  if (!dragElements.length) return;

  dragElements.forEach(dragEl => {
    const parent = dragEl.parentElement;

    // 드래그 표시기 제거 함수
    const removeDragIndicator = (indicator) => {
      if (!indicator) return;
      gsap.to(indicator, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => indicator.remove()
      });
    };

    // 이벤트 핸들러
    const handleInteraction = () => {
      const dragIndicator = dragEl.nextElementSibling?.classList.contains('dragwrap')
        ? dragEl.nextElementSibling
        : null;
      removeDragIndicator(dragIndicator);
    };

    // 스크롤 가능 여부 확인 및 표시기 처리
    const updateDragIndicator = () => {
      const isScrollable = parent.scrollWidth > parent.clientWidth;
      const nextElement = dragEl.nextElementSibling;
      const hasIndicator = nextElement?.classList.contains('dragwrap');
      const isSwiper = parent.classList.contains('swiper');

      // 스크롤 가능하고 표시기가 없는 경우 - 추가
      if (isScrollable && !hasIndicator) {
        dragEl.insertAdjacentHTML('afterend', `
          <div class="dragwrap">
            <div class="drag">
              <div class="ico_touch">
                <img src="/images/ico_touch_help.png" alt="슬라이드,드래그 버튼">
              </div>
            </div>
          </div>
        `);

        // 이벤트 리스너 등록
        parent.addEventListener('scroll', handleInteraction, { once: true });
        parent.addEventListener('touchmove', handleInteraction, { once: true });

        // Swiper 이벤트 처리
        if (isSwiper) {
          const swiperInstance = parent.swiper || parent.closest('.swiper')?.swiper;
          if (swiperInstance) {
            ['slideChange', 'touchStart', 'touchMove'].forEach(event => {
              swiperInstance.on(event, handleInteraction);
            });
          }
        }
      }
      // 스크롤 불가능하고 표시기가 있는 경우 - 제거
      else if (!isScrollable && hasIndicator) {
        removeDragIndicator(nextElement);
      }
    };

    updateDragIndicator();
    window.addEventListener('resize', updateDragIndicator);
  });
}