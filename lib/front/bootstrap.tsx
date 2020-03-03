import "./vendor";
import "./assets/css/app.scss";
import { render, h, createRef, Ref } from "preact";
import { observe, dispatchPromise, dispatchThunk } from "alo";

import store from "@lib/front/store";
import { setConfig, toggleNavActive } from "@lib/front/store";
import { gotoItemById } from "@lib/front/store/router";
import {
  getTocItemById,
  setTocItemId,
  initToc,
  setTocChapterId
} from "./store/router/toc";
import { App as AppComponent } from "./components/app";
import { addNewHistoryEntry } from "./util/history";
import { computed } from "./store/computed";

const idWithLeadingDigitRegex = new RegExp("^#\\d");
const $ = function(query: string) {
  if (query.match(idWithLeadingDigitRegex)) {
    // Escape id queries with leading digit
    // https://stackoverflow.com/a/20306237
    query = `#\\3${query[1]} ${query.slice(2)}`;
  }

  return document.querySelectorAll(query);
};

export class App {
  mainWrapperRef = createRef();

  constructor(appEl, config) {
    render(
      <AppComponent
        mainWrapperRef={this.mainWrapperRef}
        onClickNavPrev={this.onClickNavPrev}
        onClickNavNext={this.onClickNavNext}
        onClickMobileNavPrev={this.onClickMobileNavPrev}
        onClickMobileNavNext={this.onClickMobileNavNext}
      />,
      appEl
    );

    window.onpopstate = async evt => {
      if (evt.state != null && evt.state.itemId != null) {
        if (evt.state.title != null) {
          document.title = evt.state.title;
        }

        await dispatchThunk(store, setTocItemId(evt.state.itemId, computed));

        var chapterId = null;

        if (evt.state.hash != null && evt.state.hash != "") {
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
          this.mainWrapperRef.current.scrollTop = 0;
        }

        return store.dispatch(setTocChapterId(chapterId));
      } else {
        /*
         * This case should only ever happen when an anchor link
         * in the body was clicked
         */
        var prom = this.setActiveChapterByLocationHash();
        addNewHistoryEntry(true);
      }
    };

    this.initStores(appEl, config);

    // Changes to current focus based on specific router changes
    observe(() => {
      computed.tocItem;
      if (computed.tocChapter != null) {
        this.gotoChapter(computed.tocChapter);
      } else {
        this.focusElementByHash("#header");
      }
    });
  }

  async initStores(appEl, config) {
    history.replaceState(
      { itemId: config.toc.activeItemId, hash: window.location.hash },
      "",
      window.location.href
    );
    await dispatchPromise(store, initToc(config.toc.items, config.toc.root));

    const mainEl = appEl.querySelector("main:not(.main)") as HTMLElement | null;
    if (mainEl) {
      await dispatchThunk(
        store,
        setTocItemId(config.toc.activeItemId, computed, false, mainEl.innerHTML)
      );
      mainEl.parentNode!.removeChild(mainEl);
    }

    store.dispatch(setConfig(config.config));
    this.setActiveChapterByLocationHash();
    addNewHistoryEntry(true);
  }

  setActiveChapterByLocationHash() {
    if (window.location.hash != "") {
      let hashEl = $(window.location.hash)[0];
      if (hashEl != null) {
        window.scrollTo(0, hashEl.offsetTop);
        this.mainWrapperRef.current.scrollTop = hashEl.offsetTop;
        hashEl.focus();
      }
      var item = computed.tocItem;
      if (item != null) {
        if (item.chapters != null && item.chapters.items.length > 0) {
          var idx = 0;
          var length = item.chapters.items.length;
          let hash = window.location.hash.slice(1);
          while (idx < length) {
            let chapter = item.chapters.items[idx];
            if (chapter.hash === hash) {
              return store.dispatch(setTocChapterId(chapter.id));
            }
            idx++;
          }
        }
      }
    }

    store.dispatch(setTocChapterId(0));
  }

  focusElementByHash(hash) {
    var hashEl = $(hash)[0];
    if (hashEl != null) {
      window.scrollTo(0, hashEl.offsetTop);
      this.mainWrapperRef.current.scrollTop = hashEl.offsetTop;
      hashEl.focus();
    }
  }

  async gotoPrevTocItem() {
    let item = computed.tocItem;
    const newItemId = this.getPreviousItemId();
    if (newItemId != null && (!item || item.id !== newItemId)) {
      await dispatchThunk(store, gotoItemById(newItemId, computed));
      let newItem = computed.tocItem;
      if (!newItem) return;
      var newChapterId = null as any;
      if (newItem.chapters != null && newItem.chapters.items.length > 0) {
        let chapters = newItem.chapters.items;
        newChapterId = chapters.length - 1;
      }

      store.dispatch(setTocChapterId(newChapterId));
    }
  }

  onClickMobileNavPrev = async evt => {
    evt.preventDefault();
    await this.gotoPrevTocItem();
  };

  onClickNavPrev = async evt => {
    evt.preventDefault();

    if (store.getState().localMode) {
      await this.gotoPrevTocItem();
      return;
    }

    const chapterId = this.getPreviousChapterId(computed.tocItem);

    if (chapterId !== false) {
      store.dispatch(setTocChapterId(chapterId));
    } else {
      await this.gotoPrevTocItem();
    }

    addNewHistoryEntry();
  };

  async gotoNextTocItem() {
    const item = computed.tocItem;
    const nextItemId = this.getNextItemId();
    if (nextItemId != null && (!item || nextItemId !== item.id)) {
      await dispatchThunk(store, gotoItemById(nextItemId, true));
    }
  }

  onClickMobileNavNext = async evt => {
    evt.preventDefault();
    await this.gotoNextTocItem();
  };

  onClickNavNext = async evt => {
    evt.preventDefault();

    if (store.getState().localMode) {
      await this.gotoNextTocItem();
      return;
    }

    const chapterId = this.getNextChapterId(computed.tocItem);
    if (chapterId !== false) {
      store.dispatch(setTocChapterId(chapterId));
    } else {
      await this.gotoNextTocItem();
    }

    addNewHistoryEntry();
  };

  gotoChapter(chapter) {
    var newHash;
    if (chapter.id === 0) {
      newHash = "#header";
    } else if (chapter.hash != null) {
      newHash = `#${chapter.hash}`;
    }

    if (newHash != null) {
      this.focusElementByHash(newHash);
    }
  }

  getPreviousItemId(idxMove = -1) {
    let routerState = store.getState().router;
    let items = routerState.toc.items;
    let itemsCount = items.length;
    let activeId = routerState.toc.itemId;
    let newId = activeId;

    if (newId == null) return null;

    while (true) {
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

  getPreviousChapterId(item, idxMove = -1) {
    let newIdx = -1;

    let currentChapter = computed.tocChapter;
    if (currentChapter) {
      newIdx = currentChapter.id + idxMove;
    }

    if (newIdx >= 0 && item.chapters.items[newIdx] != null) {
      return newIdx;
    }

    return false;
  }

  getNextChapterId(item) {
    return this.getPreviousChapterId(item, 1);
  }
}
