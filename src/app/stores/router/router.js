import { alo } from 'vendor/alo.js';
import * as Item from 'tocItem';
import appStore from 'stores/app';
import { reduceToc, initToc, setTocItemContent, getTocItemById, setTocItemId } from './toc.js';
const $ = document.querySelectorAll.bind(document);

const initState = {
  toc: {
    items: [],
    root: []
  }
};
const router = alo.createStore(initState, 'router');
export default router;

router.createComputedProperty({
  itemId: function(state) {
    return state.toc.itemId;
  },
  chapterId: function(state) {
    return state.toc.chapterId;
  },
  tocItems: function(state) {
    return state.toc.items;
  },
  tocItem: [['itemId', 'tocItems'], function(state, comp) {
    return comp.tocItems[comp.itemId];
  }],
  parentTocItemIds: [['tocItem', 'tocItems'], function(state, comp) {
    var parentIds = [];
    if (comp.tocItem) {
      var id = comp.tocItem.id;

      comp.tocItems.forEach(function(item) {
        // TODO: This could probably be done faster!
        var childIds = Item.getEnclosedChildren(item.id);
        if (childIds.indexOf(id) >= 0) {
          parentIds.push(item.id);
        }
      });
    }

    return parentIds;
  }],
  parentTocItems: [['parentTocItemIds', 'tocItems'], function(state, comp) {
    return comp.parentTocItemIds.map((id) => comp.tocItems[id]);
  }],
  tocChapter: [['tocItem', 'chapterId'], function(state, comp) {
    if (comp.tocItem != null && comp.tocItem.chapters && comp.chapterId != null) {
      var items = comp.tocItem.chapters.items;
      if (items != null) {
        return items[comp.chapterId];
      }
    }
  }],
  viewableTocItems: [['tocItems'], function(state, comp) {
    if (comp.tocItems != null) {
      return comp.tocItems.filter((item) => {
        return Item.isViewableItem(item);
      });
    }
  }],
  readingProgress: [['viewableTocItems', 'itemId', 'tocItem', 'chapterId'], function(state, comp) {
    var result = {};
    if (comp.viewableTocItems != null && comp.itemId != null && comp.tocItem != null) {
      if (comp.viewableTocItems[0] != null) {
        result.firstEntry = comp.viewableTocItems[0].id === comp.itemId;
      }
      if (comp.viewableTocItems[0] != null) {
        result.lastEntry = comp.viewableTocItems[comp.viewableTocItems.length - 1].id === comp.itemId;
      }
    }

    return result;
  }]
});

window.router = router;

const routeMiddleware = alo.createMiddleware(function(store, action) {
  if (action.type === 'setTocItemId') {
    const state = router.getState();
    // Push history only, if there already was a previous item id set
    if (state.toc.itemId != null) {
      const itemId = action.payload.id;
      const item = getTocItemById(itemId);

      if (item.hasContent === true) {
        if (action.payload.content == null) {
          var content_url = Item.getUrl(item, true);
          return fetch(content_url)
            .then(res => {
              return res.text();
            })
            .then(body => {
              return store.dispatch(setTocItemContent(body));
            })
            .then(() => {
              return action
            });
        } else {
          return store.dispatch(setTocItemContent(action.payload.content));
        }
      }
    }
  }

  return action;
});
router.addMiddleware(routeMiddleware);

export const getCurrentTitle = function() {
  var appState = appStore.getState();
  var state = router.getData();
  var item = state.computed.tocItem;

  var title = '';
  if (appState != null && state != null && item != null) {
    if (item.title != null) title = item.title;
    const titleLower = title.toLowerCase();
    const pageTitle = (appState.config.title != null)? appState.config.title: '';
    const pageTitleLower = pageTitle.toLowerCase();
    if (titleLower !== pageTitleLower) {
      if (title.length > 0 && pageTitle.length > 0) {
        title += ' - ';
      }
      title += pageTitle;
    }
  }


  return title;
}

export const addNewHistoryEntry = function(replaceHistory) {
  replaceHistory = replaceHistory === true;

  var state = router.getData();
  var hash = '';
  if (state.computed.tocChapter != null && state.computed.tocChapter.hash != null) {
    hash = '#' + state.computed.tocChapter.hash
  }
  var item = state.computed.tocItem;

  var title = getCurrentTitle();
  document.title = title;

  var historyState = {
    itemId: item.id,
    hash,
    title
  }
  var url = Item.getUrl(item) + hash;
  //console.log(historyState, url, replaceHistory);

  if (replaceHistory) {
    history.replaceState(historyState, title, url);
  } else {
    history.pushState(historyState, title, url);
  }

}

router.createReducer((state, action) => {
  let reducers = [
    reduceToc
  ];

  return reducers.reduce((acc, reducer) => {
    return reducer(acc, action);
  }, state);
});

export const gotoItemById = function(itemId, resetChapterId) {
  var self = this;
  var items = router.getState().toc.items;
  var item = getTocItemById(itemId, items);
  resetChapterId = resetChapterId === true;

  if (item != null) {
    if (!Item.isViewableItem(item)) {
      let enclosedChildrenIds = Item.getEnclosedChildren(itemId);
      let enclosedChildren = enclosedChildrenIds.map((childId) => getTocItemById(childId, items));
      let viewableChildren = enclosedChildren.filter((child) => Item.isViewableItem(child));

      if (viewableChildren.length > 0) {
        return gotoItemById(viewableChildren[0].id, resetChapterId);
      } else {
        let newItemId = itemId + 1;
        return gotoItemById(newItemId, resetChapterId);
      }
    } else {
      return router.dispatch(setTocItemId(itemId, resetChapterId));
    }
  }
}
