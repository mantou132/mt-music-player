import { html, render } from './js_modules/lit-html.js';
import mediaQuery from './lib/mediaquery.js';

customElements.define(
  'app-theme',
  class extends HTMLElement {
    constructor() {
      super();
      render(
        html`
          <style>
            :root {
              --safe-width: calc(
                100% - env(safe-area-inset-left) - env(safe-area-inset-right)
              );
              --safe-height: calc(
                100% - env(safe-area-inset-top) - env(safe-area-inset-bottom)
              );

              --scrollbar-track-color: rgba(0, 0, 0, 0.2);
              --scrollbar-color: rgba(255, 255, 255, 0.2);

              --theme-background-color: #202b27;
              --theme-color: #18d150;
              --theme-error-color: red;
              --theme-backdrop-color: rgba(0, 0, 0, 0.6);

              --drawer-width: 22rem;
              --drawer-user-background-color: transparent;
              --drawer-user-text-color: #fff;
              --drawer-background-color: rgba(0, 0, 0, 0.25);
              --drawer-text-primary-color: #fff;
              --drawer-text-secondary-color: #707070;

              --action-background-color: transparent;
              --action-text-color: inherit;

              --list-padding: 5.6rem;
              --list-background-color: #263238;
              --list-background-light-color: #34434a;
              --list-hover-background-color: #0002;
              --list-text-primary-color: #fff;
              --list-text-secondary-color: #707070;

              --notfound-text-primary-color: #fff;
              --notfound-text-secondary-color: #707070;

              --player-height: calc(9rem + env(safe-area-inset-bottom));
              --player-background-color: #202b27;
              --player-separator-color: black;
              --player-text-primary-color: #fff;
              --player-text-secondary-color: #707070;
              --player-cover-box-shadow: 0px 1px 3px #0007;

              --toast-background-color: #202b27;
              --toast-text-color: #fff;
              --toast-border-color: #000;

              --menu-background-color: #20272b;
              --menu-hover-background-color: #263238;
              --menu-text-color: #c3c3c3;
              --menu-hover-text-color: #fff;
              --menu-box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);

              --modal-margin: 2.4rem;
              --modal-background-color: #fff;
              --modal-text-primary-color: #000;
              --modal-text-secondary-color: #707070;
              --modal-box-shadow: 0px 9px 13px #0007;

              --form-background-color: #fff;
              --form-hover-background-color: #0001;
              --form-text-primary-color: #000;
              --form-text-secondary-color: #707070;
              --form-text-disabled-color: #c3c3c3;
            }
            @media ${mediaQuery.PHONE_LANDSCAPE},
              ${mediaQuery.PHONE},
              ${mediaQuery.TABLET} {
              :root {
                --drawer-background-color: rgba(0, 0, 0, 0.75);

                --list-padding: 1.6rem;
              }
            }
            @media ${mediaQuery.PHONE} {
              :root {
                --drawer-width: 30.4rem;
                --drawer-user-background-color: #202b27;
                --drawer-user-text-color: #fff;
                --drawer-background-color: #fff;
                --drawer-text-primary-color: #fff;
                --drawer-text-secondary-color: #000;

                --action-background-color: #202b27;
                --action-text-color: #fff;
                --action-border-color: #eee;
                --action-box-shadow: 0 -4px 4px 4px rgba(0, 0, 0, 0.4);

                --list-padding: 0;
                --list-background-color: #fff;
                --list-background-light-color: #fff;
                --list-hover-background-color: #fff;
                --list-text-primary-color: #000;

                --notfound-text-primary-color: #000;
                --notfound-text-secondary-color: #c3c3c3;

                --menu-background-color: #fff;
                --menu-hover-background-color: #eee;
                --menu-text-color: #000;
                --menu-hover-text-color: #000;

                --player-height: calc(5.6rem + env(safe-area-inset-bottom));
              }
            }
            @media ${mediaQuery.WATCH}, ${mediaQuery.SHORT} {
              :root {
                --player-height: 100%;
              }
            }
          </style>
        `,
        this,
      );
    }
  },
);
