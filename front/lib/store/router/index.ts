import { dispatchThunk, typeThunk, typeMutation } from "alo/store";

import * as Item from "../../models/tocItem";
import { reduceToc, getTocItemById, setTocItemId } from "./toc";
import { mutator } from "../mutator";

const routerMutator = typeMutation((state, action) => {
  state = reduceToc(state, action);

  return state;
});

mutator.set(
  "router",
  (state, action) => {
    state.router = routerMutator(state.router, action);

    return state;
  },
  true
);

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
          let enclosedChildren = enclosedChildrenIds.map((childId) =>
            getTocItemById(childId, items)
          );
          let viewableChildren = enclosedChildren.filter((child) =>
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
