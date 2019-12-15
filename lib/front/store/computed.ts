import { computation } from "alo";

import store from ".";
import * as Item from "@lib/front/models/tocItem";

export const computed = computation({
  tocItem: function() {
    const state = store.getState().router;
    const itemId = state.toc.itemId;

    if (itemId == null) return;

    return state.toc.items[itemId];
  },
  parentTocItemIds: function(obj) {
    const state = store.getState().router;

    var parentIds: number[] = [];
    if (obj.tocItem) {
      var id = obj.tocItem.id;

      state.toc.items.forEach(function(item) {
        // TODO: This could probably be done faster!
        var childIds = Item.getEnclosedChildren(item.id);
        if (childIds.indexOf(id) >= 0) {
          parentIds.push(item.id);
        }
      });
    }

    return parentIds;
  },
  parentTocItems: function(obj) {
    const state = store.getState().router;

    return obj.parentTocItemIds.map(id => state.toc.items[id]);
  },
  tocChapter: function(obj) {
    const state = store.getState().router;

    if (
      obj.tocItem != null &&
      obj.tocItem.chapters &&
      state.toc.chapterId != null
    ) {
      var items = obj.tocItem.chapters.items;
      if (items != null) {
        return items[state.toc.chapterId];
      }
    }
  },
  viewableTocItems: function(obj) {
    const tocItems = store.getState().router.toc.items;
    if (tocItems != null) {
      return tocItems.filter(item => {
        return Item.isViewableItem(item);
      });
    }
  },
  readingProgress: function(obj) {
    var result: {
      firstEntry?;
      lastEntry?;
    } = {};
    if (obj.viewableTocItems != null && obj.tocItem != null) {
      if (obj.viewableTocItems[0] != null) {
        result.firstEntry = obj.viewableTocItems[0].id === obj.tocItem.id;
      }
      if (obj.viewableTocItems[0] != null) {
        result.lastEntry =
          obj.viewableTocItems[obj.viewableTocItems.length - 1].id ===
          obj.tocItem.id;
      }
    }

    return result;
  }
})[0];
