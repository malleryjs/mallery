import routerStore from './stores/router/router.js';

export const getEnclosedChildren = function(itemId, items) {
  if (items == null) {
    let routerState = routerStore.getState();
    items = routerState.toc.items;
  }

  let item = items[itemId];

  let children = [];
  if (item.children != null) {
    item.children.forEach(function(childId) {
      children.push(childId);
      children = [...children, ...getEnclosedChildren(childId)];
    });
  }

  return children;
}

export const isViewableItem = function(item) {
  let result = item.path != null && item.hasContent === true;
  return result
}

export const getTitle = function(item) {
  return item.title || item.path;
}

export const getActiveItem = function() {
  var state = routerStore.getData();
  return state.computed.tocItem;
}

export const getUrl = function(item, html) {
  let self = this;

  item = item || getActiveItem();
  if (html == null) html = false;

  let data = routerStore.getData();
  var rootUrl = data.state.rootUrl;

  if (html) {
    return rootUrl + item.htmlPath;
  } else {
    return rootUrl + item.path;
  }
}
