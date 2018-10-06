class AppSplash extends HTMLElement {
  constructor() {
    super();
    this.remove();
  }
}
customElements.define('app-splash', AppSplash);
