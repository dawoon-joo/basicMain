class Device {
  constructor() {
    this.currentWidth = window.innerWidth;
    this.isMobile = false;
    this.isTablet = false;
    this.isDesktop = false;
    this.init();
  }

  init() {
    this.updateDevice();
    window.addEventListener('resize', () => this.updateDevice());
  }

  checkMobile() {
    return this.currentWidth <= 767;
  }

  checkTablet() {
    return this.currentWidth <= 1024;
  }

  updateDevice() {
    this.previousState = {
      isMobile: this.isMobile,
      isTablet: this.isTablet,
      isDesktop: this.isDesktop
    };

    // 현재 상태 업데이트
    this.currentWidth = window.innerWidth;
    this.isMobile = this.checkMobile();
    this.isTablet = this.checkTablet();
    this.isDesktop = !this.isMobile && !this.isTablet;

    // 실제 디바이스 타입이 변경되었는지 확인
    const hasDeviceTypeChanged =
      this.previousState.isMobile !== this.isMobile ||
      this.previousState.isTablet !== this.isTablet ||
      this.previousState.isDesktop !== this.isDesktop;

    if (hasDeviceTypeChanged) {
      console.log('Device type changed:', this.isMobile, this.isTablet, this.isDesktop);
      this.onDeviceChange();
    }
  }

  onDeviceChange() {
    const event = new CustomEvent('deviceChange', {
      detail: {
        from: this.previousState,
        to: {
          isMobile: this.isMobile,
          isTablet: this.isTablet,
          isDesktop: this.isDesktop
        }
      }
    });
    window.dispatchEvent(event);
  }
}
