import store from "../store";

export const getEnclosedChildren = function (itemId, items?) {
  if (items == null) {
    let routerState = store.getState().router;
    items = routerState.toc.items;
  }

  let item = items[itemId];

  let children = [] as any[];
  if (item.children != null) {
    item.children.forEach(function (childId) {
      children.push(childId);
      children = [...children, ...getEnclosedChildren(childId)];
    });
  }

  return children;
};

export const isViewableItem = function (item) {
  let result = item.path != null && item.hasContent === true;
  return result;
};

export const getTitle = function (item) {
  return item.title || item.path;
};

export const getUrl = function (item, computed, html?) {
  let self = this;

  item = item || computed.tocItem();
  if (html == null) html = false;

  let state = store.getState().router;
  var rootUrl = state.rootUrl;

  if (html) {
    return rootUrl + item.htmlPath;
  } else {
    return rootUrl + item.path;
  }
};
