import routerStore from 'router';
const $ = document.querySelectorAll.bind(document);

export const setTocItemId = function(id, resetChapterId, body) {
  return {
    type: 'setTocItemId',
    payload: {
      id,
      resetChapterId,
      body
    }
  };
}

const reduceSetTocItemId = function(state, action) {
  if (action.type === 'setTocItemId') {
    state.itemId = action.payload.id;
    if (action.payload.resetChapterId === true) {
      state.chapterId = null;
    }
  }

  return state;
}

export const setTocItemContent = function(content) {
  return {
    type: 'setTocItemContent',
    payload: {
      content
    }
  }
}

const reduceSetTocItemContent = function(state, action) {
  if (action.type === 'setTocItemContent') {
    state.itemContent = action.payload.content;
  }

  return state;
}

export const setTocChapterId = function(id) {
  return {
    type: 'setTocChapterId',
    payload: {
      id
    }
  };
}

const reduceSetTocChapterId = function(state, action) {
  if (action.type === 'setTocChapterId') {
    state.chapterId = action.payload.id;
  }

  return state;
}

export const initToc = function(items, root) {
  return {
    type: 'initToc',
    payload: {
      items, root
    }
  };
}
const reduceInitToc = function(state, action) {
  if (action.type === 'initToc') {
    state.toc = action.payload;
  }

  return state;
}

export const reduceToc = function(state, action) {
  if (action.type === 'setTocItemId') {
    if (state.toc.itemId == null) {
      let item = state.toc.items[action.payload.id];
      const pathIdx = location.href.indexOf(item.path);
      let rootUrl = location.href.slice(0, pathIdx);
      if (rootUrl[rootUrl.length - 1] != '/') {
        rootUrl += '/';
      }
      state.rootUrl = rootUrl;

      // Make sure that the favicon always targets the root of the website
      var faviconEl = $('.favicon')[0];
      if (faviconEl != null) {
        var faviconUrl = state.rootUrl + 'favicon.ico';
        faviconEl.href = faviconUrl;
      }
    }
  }

  let reducers = [
    reduceSetTocItemId,
    reduceSetTocItemContent,
    reduceSetTocChapterId
  ];

  state = reduceInitToc(state, action);

  state.toc = reducers.reduce((acc, reducer) => {
    return reducer(acc, action);
  }, state.toc);

  return state;
}

export const getTocItemById = function(id, items) {
  if (items == null) {
    var state = routerStore.getState();
    items = state.toc.items;
  }

  return items[id];
}
