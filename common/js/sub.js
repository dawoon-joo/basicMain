document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);
  floating();
  initBackgroundAnimation();
  initGlobalListAnimation();
})
function floating() {
  const scrollTo = document.querySelector('.sec-selector .content-top');
  if (!scrollTo) return;

  gsap.to(scrollTo, {
    scrollTrigger: {
      trigger: '.sec-selector',
      start: 'top top',
      onEnter: () => {
        scrollTo.style.position = 'fixed';
        scrollTo.classList.add('active');
      },
      onLeaveBack: () => {
        scrollTo.style.position = 'relative';
        scrollTo.classList.remove('active');
      }
    }
  });
}
function initBackgroundAnimation() {
  const sections = document.querySelectorAll('.business-full');
  if(!sections.length) {
    return;
  } else {
    console.log('성공')
    sections.forEach((section) => {
      const bg = section.querySelector('.bg');
      gsap.to(bg, {
        inset: 0,
        borderRadius: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
          // markers: true,
          toggleActions: "play none none reverse"
        }
      });
    });
    ScrollReveal().reveal(".heading", {...fadeUp});
    ScrollReveal().reveal(".title", {...fadeUp});
    ScrollReveal().reveal(".desc", {...fadeUp});
    ScrollReveal().reveal(".row .text-boxs", {...fadeUp});
    ScrollReveal().reveal(".business-solution:nth-child(odd) img", {...fadeUp, distance: '300px'});
    ScrollReveal().reveal(".business-solution:nth-child(even) img", {...fadeUp, distance: '300px'});
  }
}
function initGlobalListAnimation() {
  const sections = document.querySelectorAll('.global-list');
  if(!sections) { return;}
  let mm = gsap.matchMedia();
  const breakpoints = {
    mobile: 767,
    tablet: 1024
  };
  mm.add({
    isMobile: `(max-width: ${breakpoints.mobile}px)`,
    isTablet: `(min-width: ${breakpoints.mobile + 1}px) and (max-width: ${breakpoints.tablet}px)`,
    isDesktop: `(min-width: ${breakpoints.tablet + 1}px)`
  }, (context) => {
    let { isMobile, isTablet, isDesktop } = context.conditions;
    if(!isMobile) {
      sections.forEach((section) => {
        const bg = section.querySelector('.bg');

        gsap.set(bg, {
          width: '100%'
        });

        gsap.to(bg, {
          width: '50%',
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 50%",
            end: "top 30%",
            scrub: 1,
            // markers: true,
            toggleActions: "play none none reverse"
          }
        });
      });
    }
  });
}
