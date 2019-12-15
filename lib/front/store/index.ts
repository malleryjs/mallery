import { Store, typeMutator } from "alo";
import { attachStoreToDevtools } from "alo/dist/alo/dev";
import {
  mutator as routerMutator,
  createState as createRouterState
} from "./router";

const initState = {
  localMode: location.protocol === "file:",
  navActive: false,
  config: {
    colors: {} as any,
    title: null as string | null,
    footer: {} as any
  },
  router: createRouterState()
};

const mutator = typeMutator((state: typeof initState, action) => {
  switch (action.type) {
    case "setConfig":
      state.config = action.payload;
      break;
    case "toggleNavActive":
      state.navActive = !state.navActive;
      break;
    case "setNavActive":
      state.navActive = action.payload;
      break;
  }

  state.router = routerMutator(state.router, action);

  return state;
});

const store = new Store({
  mutator,
  state: initState as any
});
export default store;

if (process.env.NODE_ENV === "development") {
  attachStoreToDevtools({ store: store, name: "app" });
}

export const toggleNavActive = function() {
  return {
    type: "toggleNavActive"
  };
};

export const setNavActive = function(active) {
  return {
    type: "setNavActive",
    payload: active != null ? active : true
  };
};

export const setConfig = function(config) {
  return {
    type: "setConfig",
    payload: config
  };
};
