import { Store } from "alo/store";
// import { attachStoreToDevtools } from "alo/dist/alo/dev";
import { mutator } from "./mutator";

export const setConfig = mutator.setWithPayload(
  "setConfig",
  (state, action) => {
    state.config = action.payload;

    return state;
  }
);

export const toggleNavActive = mutator.set(
  "toggleNavActive",
  (state, action) => {
    state.navActive = !state.navActive;

    return state;
  }
);

export const setNavActive = mutator.setWithPayload(
  "setNavActive",
  (state, action) => {
    state.navActive = action.payload != null ? action.payload : true;

    return state;
  }
);

const store = new Store({
  mutator,
});
export default store;

/*
if (process.env.NODE_ENV === "development") {
  attachStoreToDevtools({ store: store, name: "app" });
}
*/
