import 'assets/css/app.css';
import './vendor/vendor.js';
import { el, setChildren, text, mount } from "redom";
import 'whatwg-fetch'

import alo from 'vendor/alo';
import appStore from 'stores/app';
import { setConfig, toggleNavActive } from 'stores/app';
import routerStore from './stores/router/router.js';
import { gotoItemById, addNewHistoryEntry, getCurrentTitle } from 'stores/router/router';
import { getTocItemById, setTocItemId, initToc, setTocChapterId } from './stores/router/toc.js';
import createUpdatePlan from './vendor/updatePlan.js';
import * as Item from './tocItem.js';
import Nav from 'views/nav.js';
import cxs from 'cxs';

const $ = document.querySelectorAll.bind(document);

window.router = routerStore;

export default class App {
  constructor(appEl, config) {
    let self = this;

    this.appEl = appEl;
    this.mainEl = appEl.querySelectorAll('main')[0];
    this.appEl.className = 'app';
    const plan = createUpdatePlan();
    this.plan = plan;

    history.replaceState({ itemId: config.toc.activeItemId, hash: window.location.hash }, "", window.location.href);
    routerStore.dispatch(initToc(config.toc.items, config.toc.root))
      .then(() => {
        return routerStore.dispatch(
          setTocItemId(config.toc.activeItemId, false, this.mainEl.innerHTML));
      })
      .then(() => {
        return appStore.dispatch(setConfig(config.config))
      })
      .then(() => {
        return self.setActiveChapterByLocationHash();
      }).then(() => {
        addNewHistoryEntry(true);
      });

    this.nav = new Nav();

    var linkStyle = { color: config.config.colors.accent };
    var appClassName = cxs({
      '.app': {
        ' main a': linkStyle,
        ' .fixed_menu_button__icon': linkStyle,
        ' .left_nav__menu_item_link': {
          ':focus': linkStyle,
          ':hover': linkStyle,
          ':active': linkStyle,
        },
        ' .left_nav__menu_item--active > .left_nav__menu_item_link': linkStyle
      }
    });
    this.appEl.className += ' ' + appClassName;

    setChildren(this.appEl, el('div.container-fluid.fullscreen', this.mainWrapperEl = el('div.row.fullscreen')));
    setChildren(this.mainWrapperEl, [
      el('div.fixed_menu_button.hidden-xl-up',
        el('button.btn.btn-sm.btn-secondary', { onclick: self.toggleLeftNavActive.bind(null, self) },
          el('span.fixed_menu_button__icon_wrapper',
            el('span.icono-hamburger.fixed_menu_button__icon')
          )
        )
      ),
      this.nav,
      el('div.main_col.col-12.col-xl-9', [
        el('div.main-wrapper-wrapper', [
          el('a.navigation.navigation-prev.hidden-md-down', { href: '#', onclick: self.onClickNavPrev.bind({self}) },
            el('span', el('span.icono-caretLeft'))
          ),
          this.mainWrapperEl = el('div.main-wrapper', [
            el('header.row.header', { role: 'navigation', id: 'header' }, [
              el('div.col', [
                el('div.header__inner', [
                  this.titleEl = el('a.header__title', { href: '#' }),
                ])
              ])
            ]),
            this.mobileNavTop = el('button.btn.btn-sm.btn-secondary.btn-block.hidden-md-up', { href: '#', onclick: self.onClickNavPrev.bind({self, ignoreChapters: true}) },
              el('span', el('span.icono-caretUp'))
            ),
            plan(this.mainEl, function(state){
              if (state.router.state.toc.itemContent != null) {
                this.innerHTML = state.router.state.toc.itemContent
              }
            }),
            this.mobileNavBottom = el('button.btn.btn-sm.btn-secondary.btn-block.hidden-md-up', { href: '#', onclick: self.onClickNavNext.bind({self, ignoreChapters: true}) },
              el('span', el('span.icono-caretDown'))
            ),
            el('footer.row.footer', [
              el('div.col',
                el('div.footer__content', { innerHTML: config.config.footer.html })
              )
            ])
          ]),
          el('a.navigation.navigation-next.hidden-md-down', { href: '#', onclick: self.onClickNavNext.bind({self}) },
            el('span', el('span.icono-caretRight'))
          )
        ])
      ])
    ]);

    var renderState;
    var renderSub = alo.createSubscription(function(stores) {
      renderState = {
        router: stores.router,
        app: stores.app
      };
      self.update(renderState);
    });
    renderSub.addStore([routerStore, appStore]);

    const chapterSub = routerStore.createSubscription(function(stores, comp) {
      if (comp.chapter != null) {
        self.gotoChapter(comp.chapter);
      } else {
        self.focusElementByHash('#header');
      }
    });
    chapterSub.createDependency({
      'chapter': function(stores) {
        return stores.router.computed.tocChapter;
      }
    });

    window.onpopstate = function(evt) {
      if (evt.state != null && evt.state.itemId != null) {
        if (evt.state.title != null) {
          document.title = evt.state.title;
        }
        routerStore.dispatch(setTocItemId(evt.state.itemId))
          .then(() => {
            var chapterId = null;

            if (evt.state.hash != null && evt.state.hash != '') {
              var item = getTocItemById(evt.state.itemId);
              if (item.chapters != null && item.chapters.items.length > 0) {
                var idx = 0;
                var length = item.chapters.items.length;
                let hash = evt.state.hash.slice(1);

                while (idx < length) {
                  let chapter = item.chapters.items[idx];
                  if (chapter.hash === hash) {
                    chapterId = chapter.id;
                    break;
                  }
                  idx++;
                }
              }
            } else {
              self.mainWrapperEl.scrollTop = 0;
            }

            return routerStore.dispatch(setTocChapterId(chapterId));
          });
      } else {
        /*
         * This case should only ever happen when an anchor link
         * in the body was clicked
         */
        var prom = self.setActiveChapterByLocationHash();
        if (prom != null && prom.then != null) {
          prom.then(() => {
            addNewHistoryEntry(true);
          });
        }
      }
    }
  }

  update(state) {
    this.plan.run(state);
    this.nav.update(state);
    this.titleEl.textContent = getCurrentTitle();
    if (state.router.computed != null) {
      if (state.router.computed.tocItem != null) {
        var topUrl = Item.getUrl(state.router.computed.tocItem);
        this.titleEl.href = topUrl;
      }

      if (state.router.computed.readingProgress != null) {
        var { readingProgress } = state.router.computed;
        this.mobileNavTop.style.display = (readingProgress.firstEntry !== true)? 'block': 'none';
        this.mobileNavBottom.style.display = (readingProgress.lastEntry !== true)? 'block': 'none';
      }
    }
  }

  setActiveChapterByLocationHash() {
    var self = this;

    if (window.location.hash != '') {
      let hashEl = $(window.location.hash)[0];
      if (hashEl != null) {
        window.scrollTo(0, hashEl.offsetTop);
        self.mainWrapperEl.scrollTop = hashEl.offsetTop;
        hashEl.focus();
      }
      var item = Item.getActiveItem();
      if (item != null) {
        if (item.chapters != null && item.chapters.items.length > 0) {
          var idx = 0;
          var length = item.chapters.items.length;
          let hash = window.location.hash.slice(1);
          while (idx < length) {
            let chapter = item.chapters.items[idx];
            if (chapter.hash === hash) {
              return routerStore.dispatch(setTocChapterId(chapter.id));
            }
            idx++;
          }
        }
      }
    }
  }

  toggleLeftNavActive(self, evt) {
    appStore.dispatch(toggleNavActive());
  }

  focusElementByHash(hash) {
    var self = this;

    var hashEl = $(hash)[0];
    if (hashEl != null) {
      window.scrollTo(0, hashEl.offsetTop);
      self.mainWrapperEl.scrollTop = hashEl.offsetTop;
      hashEl.focus();
    }
  }

  onClickNavPrev(evt) {
    evt.preventDefault();

    let { self, ignoreChapters } = this;

    let item = Item.getActiveItem();
    let chapterId = self.getPreviousChapterId(item);

    var prom;
    if (chapterId !== false && ignoreChapters !== true) {
      prom = router.dispatch(setTocChapterId(chapterId));
    } else {
      let routerState = routerStore.getState();
      let newItemId = self.getPreviousItemId();
      if (item.id !== newItemId) {
        prom = gotoItemById(newItemId)
          .then(() => {
            let newItem = Item.getActiveItem();
            var newChapterId = null;
            if (newItem.chapters != null && newItem.chapters.items.length > 0) {
              let chapters = newItem.chapters.items
              newChapterId = chapters.length - 1;
            }

            return router.dispatch(setTocChapterId(newChapterId));
          });
      }
    }

    if (prom != null) {
      return prom.then(() => {
        addNewHistoryEntry();
      });
    }
  }

  gotoChapter(chapter) {
    var newHash;
    if (chapter.id === 0) {
      newHash = '#header';
    }
    else if (chapter.hash != null) {
      newHash = `#${chapter.hash}`;
    }

    if (newHash != null) {
      this.focusElementByHash(newHash);
    }
  }

  getPreviousItemId(idxMove) {
    if (idxMove == null) idxMove = -1;
    let routerState = routerStore.getState();
    let items = routerState.toc.items;
    let itemsCount = items.length;
    let activeId = routerState.toc.itemId;
    let newId = activeId;

    while(true) {
      newId = newId + idxMove;
      if (newId < 0) {
        newId = 0;
        break;
      } else if (newId > itemsCount) {
        newId = activeId;
        break;
      }

      let newItem = items[newId];
      if (newItem != null) {
        if (newItem.path != null && newItem.hasContent === true) {
          break;
        }
      }
    }

    return newId;
  }

  getNextItemId() {
    return this.getPreviousItemId(1);
  }

  onClickNavNext(evt) {
    evt.preventDefault();

    let { self, ignoreChapters } = this;

    let item = Item.getActiveItem();
    let chapterId = self.getNextChapterId(item);

    var prom;

    if (chapterId !== false && ignoreChapters !== true) {
      prom = router.dispatch(setTocChapterId(chapterId));
    } else {
      let routerState = routerStore.getState();
      let nextItemId = self.getNextItemId();
      if (nextItemId !== item.id) {
        prom = gotoItemById(nextItemId, true);
      }
    }

    if (prom != null && prom.then != null) {
      return prom.then(() => {
        addNewHistoryEntry();
      });
    }
  }

  getPreviousChapterId(item, idxMove) {
    var self = this;

    if (idxMove == null) idxMove = -1;

    let currentHeading = window.location.hash
    var newIdx = false;
    if (item.chapters != null && item.chapters.items.length > 0) {
      for (var idx = 0; idx < item.chapters.items.length; idx++) {
        let chapter = item.chapters.items[idx];
        if ('#' + chapter.hash === currentHeading || currentHeading == '') {
          newIdx = idx + idxMove;
          idx = item.chapters.items.length;
          break;
        }
      }
    }

    if (newIdx !== false && newIdx >= 0) {
      return (item.chapters.items[newIdx] != null)? newIdx: false;
    } else {
      return false;
    }
  }

  getNextChapterId(item) {
    return this.getPreviousChapterId(item, 1)
  }
}
