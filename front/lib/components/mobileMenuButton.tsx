import { h } from "preact";

import store, { toggleNavActive } from "../store";

export const MobileMenuButton = function () {
  return (
    <div class="fixed_menu_button d-xl-none">
      <button
        class="btn btn-sm btn-outline-secondary"
        onClick={() => store.dispatch(toggleNavActive())}
      >
        <span class="fixed_menu_button__icon_wrapper">
          <span class="icono-hamburger fixed_menu_button__icon"></span>
        </span>
      </button>
    </div>
  );
};
