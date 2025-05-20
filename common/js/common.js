const SR = ScrollReveal();
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
  dropdown();
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
      duration: 1.2,
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
    scrollTo.classList.add('ab');
  } else {
    // 그 외의 경우에는 position을 'fixed'로 설정
    scrollTo.style.position = 'fixed';
    scrollTo.classList.remove('ab');
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

const dropdown = () => {
  const container = document.querySelectorAll('.dropdown');
  if (!container) return;
  
  const setItemState = (item, isActive) => {
    const content = item.querySelector('.dropdown-body');
    const toggleBtn = item.querySelector('.dropdown-btn');
    
    if (toggleBtn) {
      isActive ? toggleBtn.classList.add('active') : toggleBtn.classList.remove('active');
    }
    
    if (content) {
      if (isActive) {
        gsap.to(content, { 
          maxHeight: content.scrollHeight + 'px', 
          duration: 0.5, ease: 'power2.inOut', 
          onComplete: () => { 
            ScrollTrigger.refresh();
          }
        });
      } else {
        gsap.to(content, { 
          maxHeight: 0, 
          duration: 0.5, ease: 'power2.inOut', 
          onComplete: () => { 
            ScrollTrigger.refresh();
          }
        });
      }

      if (document.getElementById('print')) {
        document.querySelectorAll('.view-info .dropdown').forEach(el => {
          el.style.visibility = '';
          el.style.opacity = '';
          el.style.transform = '';
          el.removeAttribute('data-sr-id');
        });
      }
    }
  };
  
  // 초기 설정
  container.forEach((item, index) => {
    const content = item.querySelector('.dropdown-body');
    const toggleBtn = item.querySelector('.dropdown-btn');
    
    // 첫번째 요소만 열리도록 설정
    // if (index === 0) {
    //   toggleBtn.classList.add('active');
    //   gsap.set(content, { maxHeight: content.scrollHeight + 'px' });
    // } else {
    //   gsap.set(content, { maxHeight: 0 });
    // }
    toggleBtn.classList.add('active');
    gsap.set(content, { maxHeight: content.scrollHeight + 'px' });
    
    toggleBtn.addEventListener('click', () => {
      const isCurrentlyActive = toggleBtn.classList.contains('active');
      setItemState(item, !isCurrentlyActive);
    });
  });
  
  const updateActiveHeights = () => {
    container.forEach(item => {
      const toggleBtn = item.querySelector('.dropdown-btn');
      if (toggleBtn && toggleBtn.classList.contains('active')) {
        const content = item.querySelector('.dropdown-body');
        gsap.set(content, { maxHeight: content.scrollHeight + 'px' });
      }
    });
  };
  
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateActiveHeights, 100);
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
  function formatNumberWithComma(numStr, useComma = true) {
    numStr = numStr.toString().replace(/,/g, ''); // 기존 콤마 제거
    
    if (!useComma) return numStr; // 콤마 사용 안 할 경우 바로 반환
    
    let [intPart, decPart] = numStr.split('.');
    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // 콤마 추가
    return decPart ? `${intPart}.${decPart}` : intPart;
  }

  const tl = gsap.timeline();
  const elements = document.querySelectorAll(selector);
  
  elements.forEach(element => {
    // data-to 값 가져오기
    let toYearRaw = element.getAttribute('data-to');
    if (!toYearRaw) return;
    
    // 콤마 사용 여부 확인 (기본값: true)
    const useComma = element.getAttribute('data-use-comma') !== 'false';
    
    // 콤마 자동 추가 (useComma에 따라)
    let toYear = formatNumberWithComma(toYearRaw, useComma);
    
    // HTML이 비어있으면 0으로 채움
    if (!element.innerHTML.trim()) {
      element.innerHTML = toYear.replace(/[0-9]/g, '0');
    }
    
    const fromYear = element.innerHTML;
    
    // 이하 기존 코드와 동일
    const numericDigits = toYear.replace(/[^0-9]/g, '').length;    
    const isLongNumber = numericDigits >= 4;
    
    element.innerHTML = '';
    
    for (let i = 0; i < fromYear.length; i++) {
      if (isNaN(parseInt(fromYear.charAt(i))) || fromYear.charAt(i) === ' ') {
        const staticChar = document.createElement('span');
        staticChar.textContent = fromYear.charAt(i);
        element.appendChild(staticChar);
        continue;
      }
      
      let toNumber = parseInt(fromYear.charAt(i)) || 0;
      let fromNumber = parseInt(toYear.charAt(i)) || 0;
      
      let chars = [];
      
      if (fromNumber === toNumber) {
        for (let n = fromNumber; n >= 0; n--) chars.push(n);
        for (let n = 9; n >= fromNumber; n--) chars.push(n);
      } else {
        let count = 0;
        const maxIterations = 15;
        
        while (count < maxIterations) {
          chars.push(fromNumber);
          if (fromNumber === toNumber) break;
          fromNumber = (fromNumber - 1 + 10) % 10;
          count++;
        }
      }
      
      const digitEl = document.createElement('span');
      digitEl.innerHTML = chars.join('<br>');
      element.appendChild(digitEl);
      
      const duration = 3 + i * (isLongNumber ? 0 : 0.1);
      const delayFactor = isLongNumber ? 0.2 : 0.5; 
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

// 페이지네이션
class Pagination {
  /**
   * @param {HTMLElement|string} listContainer - 아이템 컨테이너 요소 또는 선택자
   * @param {string} itemSelector - 아이템 선택자
   * @param {HTMLElement|string} paginationContainer - 페이지네이션 컨테이너 요소 또는 선택자
   * @param {object} options - 추가 옵션
   */
  constructor(listContainer, itemSelector, paginationContainer, options = {}) {
    // 기본 옵션 설정
    this.options = {
      itemsPerPage: 12,
      scrollToList: true,
      ...options
    };
    
    // 컨테이너 및 요소 설정
    this.listContainer = typeof listContainer === 'string' 
      ? document.querySelector(listContainer) 
      : listContainer;
      
    this.paginationContainer = typeof paginationContainer === 'string'
      ? document.querySelector(paginationContainer)
      : paginationContainer;
      
    this.items = this.listContainer 
      ? Array.from(this.listContainer.querySelectorAll(itemSelector))
      : [];
      
    // 상태 초기화
    this.totalPages = Math.ceil(this.items.length / this.options.itemsPerPage);
    this.currentPage = 1;
    
    // 페이지네이션 초기화
    this.init();
  }
  
  init() {
    if (this.items.length > this.options.itemsPerPage) {
      this.paginationContainer.style.display = '';
      this.renderPagination();
      this.renderPage(1);
    } else {
      this.paginationContainer.style.display = 'none';
      this.items.forEach(el => el.style.display = '');
    }
  }
  
  renderPage(page) {
    this.items.forEach((el, idx) => {
      el.style.display = (idx >= (page-1) * this.options.itemsPerPage && 
                         idx < page * this.options.itemsPerPage) ? '' : 'none';
    });
  }
  
  goToPage(page) {
    this.currentPage = page;
    this.renderPage(page);
    this.updateButtonStates();
    this.renderPagination();
    
    if (this.options.scrollToList && this.listContainer) {
      const offsetTop = this.listContainer.offsetTop;
      lenis.stop();
      
      const scrollPromise = new Promise(resolve => {
        window.scrollTo({
          top: offsetTop - 200,
          behavior: 'smooth'
        });
        resolve();
      });
      
      scrollPromise.then(() => {
        lenis.start();
      });
    }
  }
  
  updateButtonStates() {
    this.paginationContainer.querySelectorAll('.page').forEach((btn, idx) => {
      btn.classList.toggle('active', idx + 1 === this.currentPage);
    });
    
    this.paginationContainer.querySelector('.prev-end').disabled = this.currentPage === 1;
    this.paginationContainer.querySelector('.prev').disabled = this.currentPage === 1;
    this.paginationContainer.querySelector('.next').disabled = this.currentPage === this.totalPages;
    this.paginationContainer.querySelector('.next-end').disabled = this.currentPage === this.totalPages;
  }
  
  renderPagination() {
    this.paginationContainer.innerHTML = '';
    
    // 처음으로 버튼
    const prevEndBtn = document.createElement('button');
    prevEndBtn.className = 'prev-end';
    prevEndBtn.disabled = this.currentPage === 1;
    prevEndBtn.addEventListener('click', () => this.goToPage(1));
    this.paginationContainer.appendChild(prevEndBtn);
    
    // 이전 버튼
    const prevBtn = document.createElement('button');
    prevBtn.className = 'prev';
    prevBtn.disabled = this.currentPage === 1;
    prevBtn.addEventListener('click', () => {
      if (this.currentPage > 1) {
        this.goToPage(this.currentPage - 1);
      }
    });
    this.paginationContainer.appendChild(prevBtn);
    
    // 페이지 그룹 계산 (5개씩 그룹화)
    const maxButtons = 5;
    const currentGroup = Math.ceil(this.currentPage / maxButtons);
    const startPage = (currentGroup - 1) * maxButtons + 1;
    const endPage = Math.min(this.totalPages, startPage + maxButtons - 1);
    
    // 페이지 버튼 생성
    for (let i = startPage; i <= endPage; i++) {
      const btn = document.createElement('button');
      btn.className = 'page' + (i === this.currentPage ? ' active' : '');
      btn.textContent = i;
      if (i === this.currentPage) {
        btn.disabled = true;
      } else {
        btn.addEventListener('click', () => this.goToPage(i));
      }
      this.paginationContainer.appendChild(btn);
    }
    
    // 다음 버튼
    const nextBtn = document.createElement('button');
    nextBtn.className = 'next';
    nextBtn.disabled = this.currentPage === this.totalPages;
    nextBtn.addEventListener('click', () => {
      if (this.currentPage < this.totalPages) {
        this.goToPage(this.currentPage + 1);
      }
    });
    this.paginationContainer.appendChild(nextBtn);
    
    // 마지막으로 버튼
    const nextEndBtn = document.createElement('button');
    nextEndBtn.className = 'next-end';
    nextEndBtn.disabled = this.currentPage === this.totalPages;
    nextEndBtn.addEventListener('click', () => this.goToPage(this.totalPages));
    this.paginationContainer.appendChild(nextEndBtn);
  }
}