// https://gist.github.com/gokulkrishh/242e68d1ee94ad05f488
// https://mediag.com/news/popular-screen-resolutions-designing-for-all/

const mediaQuery = {
  HOVER: '(hover: hover)',
  get isHover() {
    return window.matchMedia(this.HOVER).matches;
  },

  PHONE: '(min-width: 320px) and (max-width: 480px)',
  get isPhone() {
    return window.matchMedia(this.PHONE).matches;
  },

  LAPTOP:
    '(min-width: 1025px) and (max-width: 1280px) and (orientation: landscape)',
  get isLaptop() {
    return window.matchMedia(this.LAPTOP).matches;
  },

  DESKTOP: '(min-width: 1281px) and (orientation: landscape)',
  get isDesktop() {
    return window.matchMedia(this.DESKTOP).matches;
  },

  PHONE_LANDSCAPE:
    '(min-width: 481px) and (max-width: 767px) and (orientation: landscape)',
  // PHONE_LANDSCAPE: '(min-width: 481px) and (max-width: 767px)',
  get isPhoneLandscape() {
    return window.matchMedia(this.PHONE_LANDSCAPE).matches;
  },

  TABLET: '(min-width: 768px) and (max-width: 1024px)',
  get isTablet() {
    return window.matchMedia(this.Tablet).matches;
  },

  SMALL_PHONE:
    '(min-width: 320px) and (max-width: 480px) and (max-height: 640px)',
  get isSmallPhone() {
    return window.matchMedia(this.SMALL_PHONE).matches;
  },

  WATCH: '(max-width: 319px)',
  get isWatch() {
    return window.matchMedia(this.WATCH).matches;
  },

  SHORT: '(min-width: 480px) and (max-height: 320px)',
  get isShort() {
    return window.matchMedia(this.SHORT).matches;
  },

  PWA: navigator.standalone ? '(min-width: 1px)' : '(display-mode: standalone)',
  // PWA: '(display-mode: browser)', // debugging
  get isPWA() {
    return navigator.standalone || window.matchMedia(this.PWA).matches;
  },

  MOTION_REDUCE: '(prefers-reduced-motion: reduce)',
  get isMotionReduce() {
    return window.matchMedia(this.MOTION_REDUCE).matches;
  },
};

window.mediaQuery = mediaQuery;
export default mediaQuery;
