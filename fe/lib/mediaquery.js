// https://gist.github.com/gokulkrishh/242e68d1ee94ad05f488
// https://mediag.com/news/popular-screen-resolutions-designing-for-all/

const mediaQuery = {
  HOVER: '(hover: hover)',
  get isHover() {
    return window.matchMedia(this.HOVER).matches;
  },

  NONE_HOVER: '(hover: none)',
  get isNoneHover() {
    return window.matchMedia(this.NONE_HOVER).matches;
  },

  PHONE: '(min-width: 320px) and (max-width: 480px)',
  get isPhone() {
    return window.matchMedia(this.PHONE).matches;
  },

  SMALL_PHONE: '(min-width: 320px) and (max-width: 480px) and (max-height: 640px)',
  get isSmallPhone() {
    return window.matchMedia(this.SMALL_PHONE).matches;
  },

  WATCH: '(max-width: 320px), (max-height: 320px)',
  get isWatch() {
    return window.matchMedia(this.PHONE).matches;
  },

  PWA: 'display-mode: standalone',
  get isPWA() {
    return window.matchMedia(this.PWA).matches;
  },
};

window.mediaQuery = mediaQuery;
export default mediaQuery;
