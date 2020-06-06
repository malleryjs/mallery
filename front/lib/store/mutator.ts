import { Mutator } from "alo/store";

import { createState as createRouterState } from "./router/state";

export const mutator = new Mutator({
  createState: function () {
    return {
      localMode: location.protocol === "file:",
      navActive: false,
      config: {
        colors: {} as any,
        title: null as string | null,
        footer: {} as any,
      },
      router: createRouterState(),
    };
  },
});
