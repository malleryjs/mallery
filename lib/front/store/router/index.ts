import { typeMutator, dispatchThunk, typeThunk } from "alo";

import * as Item from "@lib/front/models/tocItem";
import { reduceToc, getTocItemById, setTocItemId } from "./toc";

type Item = {
  id: number;
  title: string;
  path: string;
  hasContent: boolean;
  chapters: any;
};

export const createState = function() {
  return {
    rootUrl: "",
    toc: {
      items: [] as Item[],
      root: [],
      itemId: null as number | null,
      chapterId: null as number | null,
      itemContent: ""
    }
  };
};

export const mutator = typeMutator((state, action) => {
  state = reduceToc(state, action);

  return state;
});

export const gotoItemById = (
  itemId: number,
  computed,
  resetChapterId = false
) => {
  return typeThunk(
    async (ds): Promise<any> => {
      var items = ds.getState().router.toc.items;
      var item = getTocItemById(itemId, items);

      if (item != null) {
        if (!Item.isViewableItem(item)) {
          let enclosedChildrenIds = Item.getEnclosedChildren(itemId);
          let enclosedChildren = enclosedChildrenIds.map(childId =>
            getTocItemById(childId, items)
          );
          let viewableChildren = enclosedChildren.filter(child =>
            Item.isViewableItem(child)
          );

          if (viewableChildren.length > 0) {
            return dispatchThunk(
              ds,
              gotoItemById(viewableChildren[0].id, resetChapterId)
            );
          } else {
            let newItemId = itemId + 1;
            return dispatchThunk(ds, gotoItemById(newItemId, resetChapterId));
          }
        } else {
          return dispatchThunk(
            ds,
            setTocItemId(itemId, computed, resetChapterId)
          );
        }
      }
    }
  );
};
