import { h, Fragment } from "preact";
import { observerHOC } from "./observer";
import { css, cx } from "emotion";
import { Devtools } from "alo/dist/alo/dev";

import store from "../store";
import { Nav } from "./nav";
import { Header } from "./header";
import { computed } from "../store/computed";
import { MobileMenuButton } from "./mobileMenuButton";

let devtoolsMounted = false;
const attachDevTools = function() {
  if (process.env.NODE_ENV === "development") {
    if (!devtoolsMounted) new Devtools({ targetElSelector: "#dev" });
    devtoolsMounted = true;
  }
};

const App_ = function({
  mainWrapperRef,
  onClickNavPrev,
  onClickNavNext,
  onClickMobileNavPrev,
  onClickMobileNavNext
}) {
  const state = store.getState();
  const routerState = state.router;
  if (!state) return null;

  const linkColor = state.config.colors && state.config.colors.accent;

  /*
  el('a.', { href: '#', onclick:  },
  el('span', el('span.icono-caretLeft'))
),
*/

  return (
    <Fragment>
      <div
        class={
          "app " +
          css`
            main a {
              color: ${linkColor};
            }
            .btn:not(:hover) .fixed_menu_button__icon {
              color: ${linkColor};
            }
            .left_nav__menu_item_link {
              &:hover,
              &:active {
                color: ${linkColor};
              }
            }
            .left_nav__menu_item--active > .left_nav__menu_item_link {
              color: ${linkColor};
            }
          `
        }
      >
        <div class="container-fluid fullscreen">
          <div class="row fullscreen">
            <Nav />
            <div class="main_col col-12 col-xl-9">
              <div class="main-wrapper-wrapper">
                <a
                  href="#"
                  class="navigation navigation-prev d-none d-lg-flex"
                  onClick={onClickNavPrev}
                >
                  <span>
                    <span class="icono-caretLeft" />
                  </span>
                </a>
                <div class="main-wrapper" ref={mainWrapperRef}>
                  <div class="inner-spacer">
                    <MobileMenuButton />
                    <div class="clearfix" />
                    <Header />
                    {!computed.readingProgress.firstEntry ? (
                      <button
                        class="btn btn-sm btn-outline-secondary btn-block d-lg-none"
                        href="#"
                        onClick={onClickMobileNavPrev}
                      >
                        <span>
                          <span class="icono-caretUp" />
                        </span>
                      </button>
                    ) : null}
                    <main
                      class="main"
                      dangerouslySetInnerHTML={{
                        __html: routerState.toc.itemContent
                      }}
                    />
                    {!computed.readingProgress.lastEntry ? (
                      <button
                        class="btn btn-sm btn-outline-secondary btn-block d-lg-none"
                        href="#"
                        onClick={onClickMobileNavNext}
                      >
                        <span>
                          <span class="icono-caretDown" />
                        </span>
                      </button>
                    ) : null}
                    <footer class="row footer">
                      <div class="col">
                        <div
                          class="footer__content"
                          dangerouslySetInnerHTML={{
                            __html: state.config.footer.html
                          }}
                        />
                      </div>
                    </footer>
                  </div>
                </div>
                <a
                  href="#"
                  class="navigation navigation-next d-none d-lg-flex"
                  onClick={onClickNavNext}
                >
                  <span>
                    <span class="icono-caretRight" />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        id="dev"
        ref={function() {
          attachDevTools();
        }}
      />
    </Fragment>
  );
};
export const App = observerHOC(App_);
