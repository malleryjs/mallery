import { observable } from "alo";
const $ = document.querySelectorAll.bind(document);
import * as Item from "../../models/tocItem";
import store from "..";
import { typeThunk } from "alo/store";

export const setTocItemId = (id, computed, resetChapterId = false, body?) =>
  typeThunk(async function (ds) {
    const state = ds.getState().router;

    // Push history only, if there already was a previous item id set
    if (state.toc.itemId != null && state.toc.itemId !== id) {
      const item = getTocItemById(id);

      if (item.hasContent === true) {
        if (body == null) {
          var contentUrl = Item.getUrl(item, computed, true);
          let response;
          try {
            response = await fetch(contentUrl);
          } catch (err) {
            location.href = Item.getUrl(item, computed, false);
            return;
          }

          const body = await response.text();
          ds.dispatch(setTocItemContent(body));
        }
      }
    }

    if (body) {
      ds.dispatch(setTocItemContent(body));
    }

    return ds.dispatch({
      type: "setTocItemId",
      payload: {
        id,
        resetChapterId,
      },
    });
  });

const reduceSetTocItemId = function (state, action) {
  if (action.type === "setTocItemId") {
    state.itemId = action.payload.id;
    if (action.payload.resetChapterId === true) {
      state.chapterId = 0;
    }
  }

  return state;
};

export const setTocItemContent = function (content) {
  return {
    type: "setTocItemContent",
    payload: {
      content,
    },
  };
};

const reduceSetTocItemContent = function (state, action) {
  if (action.type === "setTocItemContent") {
    state.itemContent = action.payload.content;
  }

  return state;
};

export const setTocChapterId = function (id) {
  return {
    type: "setTocChapterId",
    payload: {
      id,
    },
  };
};

const reduceSetTocChapterId = function (state, action) {
  if (action.type === "setTocChapterId") {
    state.chapterId = action.payload.id;
  }

  return state;
};

export const initToc = async function (items, root) {
  return {
    type: "initToc",
    payload: {
      items,
      root,
      itemId: null,
      chapterId: 0,
      itemContent: null,
    },
  };
};
const reduceInitToc = function (state, action) {
  if (action.type === "initToc") {
    state.toc = observable(action.payload);
  }

  return state;
};

export const reduceToc = function (state, action) {
  if (action.type === "setTocItemId") {
    if (state.toc.itemId == null) {
      let item = state.toc.items[action.payload.id];
      let pathName = location.pathname;
      // Certain static file servers remove the .html (looking at you zeit/serve)
      if (pathName.length > 1 && !pathName.toLowerCase().endsWith(".html")) {
        pathName += ".html";
      }
      const pathIdx = pathName.indexOf(item.path.replace(".html", ""));
      pathName = pathName.slice(0, pathIdx);
      if (pathName[pathName.length - 1] != "/") {
        pathName += "/";
      }
      state.rootUrl =
        (location.protocol === "file:" ? "file://" : location.origin) +
        pathName;

      // Make sure that the favicon always targets the root of the website
      var faviconEl = $(".favicon")[0];
      if (faviconEl != null) {
        var faviconUrl = state.rootUrl + "favicon.ico";
        faviconEl.href = faviconUrl;
      }
    }
  }

  let reducers = [
    reduceSetTocItemId,
    reduceSetTocItemContent,
    reduceSetTocChapterId,
  ];

  state = reduceInitToc(state, action);

  state.toc = reducers.reduce((acc, reducer) => {
    return reducer(acc, action);
  }, state.toc);

  return state;
};

export const getTocItemById = function (id, items?) {
  if (items == null) {
    var state = store.getState().router;
    items = state.toc.items;
  }

  return items[id];
};

export const getTocItemsById = function (itemIds) {
  const routerState = store.getState().router;

  return itemIds.map((itemId) => {
    return routerState.toc.items[itemId];
  });
};
