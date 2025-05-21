document.addEventListener('DOMContentLoaded', () => {
  device = new Device();
  viewSwiper();
  viewMotion();
  viewDropdown();
  professionalsSticky();
})
document.addEventListener('scroll', () => {
  viewFloating();
})
function viewSwiper() {
  const viewSwiper = document.querySelector('.view-sw');
  if(!viewSwiper) { return;}
  const swiper = new Swiper(viewSwiper, {
    slidesPerView: 'auto',
    spaceBetween: 30,
  });
}
function viewMotion() {
  if (!document.getElementById('print')) { return;}
  SR.reveal(".view-info .info-top", {...fadeUp});  
  SR.reveal(".view-info .dropdown", {...fadeUp});  
}
function viewFloating() {
  const scrollPosition = window.pageYOffset;
  const scrollTo = document.querySelector('.view-floationg');
  if (!scrollTo) { return;}
  const footer = document.querySelector('footer');
  if (window.innerHeight >= footer.getBoundingClientRect().top) {
    scrollTo.style.position = 'absolute';
    scrollTo.classList.add('ab');
  } else {
    scrollTo.style.position = 'fixed';
    scrollTo.classList.remove('ab');
  }

  if (scrollPosition > 100) {
    scrollTo.classList.add('active');
  } else {
    scrollTo.classList.remove('active');
  }

}
function viewDropdown() {
  const dropdown = document.querySelectorAll('.view-floationg');
  if (!dropdown) { return;}

  const setItemState = (item, isActive) => {
    const content = item.querySelector('.floationg-body');
    const toggleBtn = item.querySelector('.floationg-btn');
    const prevBtn = item.querySelector('.floationg-prev');
    const btnText = toggleBtn.querySelector('span');
    const tl = gsap.timeline();
    
    if (toggleBtn) {
      isActive ? toggleBtn.classList.add('active') : toggleBtn.classList.remove('active');
    }
    
    if (content) {
      if (isActive) {
        tl.to(toggleBtn, { padding: '12px 8px', fontSize: '22px', duration: 0.3, ease: 'power2.inOut'})
          .to(btnText, { padding: '0 58px', duration: 0.3, ease: 'power2.inOut'}, '<')
          .to(prevBtn, { width: '64px', duration: 0.3, ease: 'power2.inOut'}, '<')
          .to(content, { maxHeight: content.scrollHeight + 'px', duration: 0.3, ease: 'power2.inOut'})
      } else {
        tl.to(content, { maxHeight: 0, duration: 0.3, ease: 'power2.inOut' })
          .to(toggleBtn, { padding: '8px', fontSize: '18px', duration: 0.3, ease: 'power2.inOut'})
          .to(btnText, { padding: '0 28px', duration: 0.3, ease: 'power2.inOut'}, '<')
          .to(prevBtn, { width: '54px', duration: 0.3, ease: 'power2.inOut'}, '<')
      }
    }
  };
  
  dropdown.forEach((item, index) => {
    const content = item.querySelector('.floationg-body');
    const toggleBtn = item.querySelector('.floationg-btn');
    
    toggleBtn.addEventListener('click', () => {
      const isCurrentlyActive = toggleBtn.classList.contains('active');
      setItemState(item, !isCurrentlyActive);
    });
  });
  
  const updateActiveHeights = () => {
    container.forEach(item => {
      const toggleBtn = item.querySelector('.floationg-btn');
      if (toggleBtn && toggleBtn.classList.contains('active')) {
        const content = item.querySelector('.floationg-body');
        gsap.set(content, { maxHeight: content.scrollHeight + 'px' });
      }
    });
  };
  
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateActiveHeights, 100);
  });

  // dropdownBtn.addEventListener('click', () => {
  //   gsap.to(dropdownBtn, { width: '226px', padding: '12px 8px', fontSize: '22px', duration: 0.5, ease: 'power2.inOut'});
  // })
}
function professionalsSticky() {
  const section = document.querySelector('.professionals-view');
  if (!section) { return;}
  const btns = section.querySelectorAll('.title-scroll button');
  const items = document.querySelectorAll('.info-area');
  
  btns.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      if(items[idx]) {
        const offset = device.isMobile ? 80 : 230;
        gsap.to(window, {
          duration: 0.5,
          scrollTo: {
            y: items[idx],
            offsetY: offset,
            autoKill: false
          },
          ease: "power2.inOut"
        });
      }
    });
  });
  
  items.forEach((item, index) => {
    ScrollTrigger.create({
      trigger: item,
      start: 'top 40%',
      end: 'bottom 40%',
      // markers: true,
      onEnter: () => {
        btns.forEach(btn => {
          btn.classList.remove('active');
        })
        btns[index].classList.add('active');
      },
      onEnterBack: () => {
        btns.forEach(btn => {
          btn.classList.remove('active');
        })
        btns[index].classList.add('active');
      }
    })
  })
}

