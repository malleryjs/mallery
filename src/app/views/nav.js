import { el, setChildren, text, list, mount } from "redom";
import { v, vm } from 'vendor/aristo';
import * as Item from "tocItem.js";
import appStore from 'stores/app';
import * as AppStore from 'stores/app';
import routerStore from './stores/router/router.js';
import { gotoItemById, addNewHistoryEntry } from 'stores/router/router';
import { setTocItemId, setTocChapterId } from 'stores/router/toc';


const getTocItemsById = function(state, itemIds) {
  let router = state.router.state;
  return itemIds.map((itemId) => {
    return router.toc.items[itemId];
  });
}

const onNavChapterItemClick = function(itemId, chapterId, evt) {
  evt.preventDefault();

  routerStore.dispatch(setTocItemId(itemId))
    .then(() => {
      return routerStore.dispatch(setTocChapterId(chapterId));
    })
    .then(() => {
      addNewHistoryEntry();
    })
    .then(() => {
      return appStore.dispatch(AppStore.setNavActive(false));
    });
}

const navChapterItem = function(state, navItem, level) {
  var navItemUrl = Item.getUrl(navItem);
  if (level == null) level = 1;

  return function(item) {
    if (item.hash != null) {
      let href = `${navItemUrl}#${item.hash}`
      let classes = createClassesObj(['left_nav__menu_item']);

      var title = item.heading;
      var link = v('a.left_nav__menu_item_link', {
        href,
        onclick: onNavChapterItemClick.bind(null, navItem.id, item.id)
      }).text(title);
      var itemContent = [
        link
      ];

      let toc = state.router.state.toc;

      if (item.children != null && level <= 2 && item.children.length > 0) {
        let chapterIds = item.children;
        let chapters = chapterIds.map(function(chapterId) {
          return navItem.chapters.items[chapterId];
        });
        let subList = v('ul.list-unstyled.left_nav__menu--sub', { key: 'list' })
          .list(chapters, navChapterItem(state, navItem, level + 1));
        itemContent.push(subList);
      }

      classes['left_nav__menu_item--active'] = (toc.chapterId == item.id);

      return v('li', { key: 'li', className: applyClassesObj(classes) }, itemContent);
    }
  }
}

const createClassesObj = function(classes) {
  if (classes != null) {
    return classes.reduce((acc, _class) => {
      acc[_class] = true;
      return acc;
    }, {});
  } else {
    return {};
  }
}

const applyClassesObj = function(classes, separator) {
  if (separator == null) separator = ' ';

  return Object.keys(classes).filter((k) => classes[k] == true).join(separator);
}

const onNavTocItemClick = function(itemId, evt) {
  evt.preventDefault();
  gotoItemById(itemId, true)
    .then(() => {
      addNewHistoryEntry();
    })
    .then(() => {
      return appStore.dispatch(AppStore.setNavActive(false));
    });
}

const navTocItem = function(state, classes) {
  var classes = createClassesObj(classes);
  var toc = state.router.state.toc;
  var tocItem = state.router.computed.tocItem || {};
  var parentItemIds = state.router.computed.parentTocItemIds || [];

  return function(item) {
    classes['left_nav__menu_item'] = true;
    var title = Item.getTitle(item);

    let href = (item.href != null)? item.href: Item.getUrl(item)
    let linkAttrs = { key: 'link', href, target: '_blank' }
    if (item.href == null) {
      linkAttrs.onclick = onNavTocItemClick.bind(null, item.id);
    }
    var link = v('a.left_nav__menu_item_link', linkAttrs).text(title);
    var itemContent = [
      link
    ];

    var subList = v('ul.list-unstyled.left_nav__menu--sub', { key: 'list' });
    var childrenVisible = item.id === tocItem.id || state.app.state.navActive === true;
    if (item.children != null && (childrenVisible || parentItemIds.indexOf(item.id) >= 0)) {
      let items = getTocItemsById(state, item.children);
      subList.list(items, navTocItem(state), 'id');
      itemContent.push(subList)
    } else if (item.chapters != null && item.id === tocItem.id) {
      let chapterIds = item.chapters.root;
      if (chapterIds.length === 1) {
        chapterIds = item.chapters.items[chapterIds[0]].children;
      }
      let chapters = chapterIds.map(function(chapterId) {
        return item.chapters.items[chapterId];
      });
      subList.list(chapters, navChapterItem(state, item), 'id');
      itemContent.push(subList)
    }

    classes['left_nav__menu_item--active'] = toc.itemId === item.id &&
      ((item.chapters == null && item.children == null) ||
        ((item.chapters != null && item.chapters.root.length === 1 && toc.chapterId == 0) || toc.chapterId == null)
      );

    return v('li', {
      key: 'navTocItem',
      className: applyClassesObj(classes)
     }, itemContent);
  }
};

export class Nav {
  constructor() {
    var self = this;

    this.classes = createClassesObj([
      'nav', 'col-12', 'col-xl-3', 'left_nav'
    ]);
    self.el = el('nav', { role: 'navigation' });
    self.vm = vm();
    self.state = {};
    self.update();
  }

  update(state) {
    var navMenu;

    if (state != null) {
      let tocItems = getTocItemsById(state, state.router.state.toc.root);
      navMenu = v('ul.list-group.left_nav__menu.left_nav__menu--root', { key: 'menu' })
        .list(tocItems, navTocItem(state, ['list-group-item']), 'id');
      this.classes['left_nav--active'] = state.app.state.navActive;
    }

    this.el.className = applyClassesObj(this.classes);

    let vdom = v('div.card.card-secondary.left_nav__content_wrapper', { key: 'contentWrapper' })
      .children([
        v('div.card-block.left_nav__content', { key: 'content' })
          .children([
            // v('input.form-control.left_nav__search', { key: 'search', placeholder: 'Type to search' }),
            navMenu
          ])
      ]);

    this.vm(this.el, vdom);
  }
}

export default Nav;
