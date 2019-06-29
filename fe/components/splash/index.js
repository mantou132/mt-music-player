const LIFE_TIME = 1000;

class AppSplash extends HTMLElement {
  constructor() {
    super();
    const now = performance.now();
    if (now > LIFE_TIME) {
      this.end();
    } else {
      setTimeout(this.end, LIFE_TIME - now);
    }
  }

  end = () => {
    this.remove();
  };
}
customElements.define('app-splash', AppSplash);
