import { html, render } from 'https://dev.jspm.io/lit-html';
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
              --header-height: 5.6rem;

              /* 如启动画面的背景颜色，组件为渲染时的背景颜色 */
              --background-color: white;
              --theme-color: #18d150;
              --error-color: red;
              --backdrop-color: rgba(0, 0, 0, 0.6);

              --list-padding: 5.6rem;
              --list-background-color: #263238;
              --list-background-light-color: #34434a;
              --list-hover-background-color: #0002;
              --list-text-primary-color: #fff;
              --list-text-secondary-color: #707070;

              --notfound-background-color: #263238;
              --notfound-text-primary-color: #fff;
              --notfound-text-secondary-color: #707070;

              --player-height: 9rem;
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
              --menu-box-shadow: 0 10px 24px rgba(0, 0, 0, .2);

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

            @media ${mediaQuery.PHONE} {
              :root {
                --list-padding: 0;
                --list-background-color: #fff;
                --list-background-light-color: #fff;
                --list-hover-background-color: #fff;
                --list-text-primary-color: #000;

                --menu-background-color: #fff;
                --menu-hover-background-color: #eee;
                --menu-text-color: #000;
                --menu-hover-text-color: #000;

                --player-height: 5.6rem;
              }
            }
            @media ${mediaQuery.WATCH} {
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
