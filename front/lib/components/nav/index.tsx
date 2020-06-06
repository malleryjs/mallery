import { h } from "preact";
import clsx from "clsx";

import store from "../../store";
import { observerHOC } from "../observer";
import { getTocItemsById } from "../../store/router/toc";
import { TocItem } from "./toc";
import { MobileMenuButton } from "../mobileMenuButton";

export const Nav = observerHOC(function () {
  const state = store.getState();
  const routerState = state.router;
  const tocItems = getTocItemsById(routerState.toc.root);
  const navClasses = clsx({
    "left_nav--active": state.navActive,
  });

  return (
    <nav role="navigation" class={"nav col-12 col-xl-3 left_nav " + navClasses}>
      <div class="inner-spacer">
        <MobileMenuButton />
      </div>
      <div class="card card-secondary left_nav__content_wrapper">
        <div class="card-block left_nav__content">
          {false ? (
            <input
              class="form-control left_nav__search"
              placeholder="Type to search"
            />
          ) : null}
          <ul class="list-group left_nav__menu left_nav__menu--root">
            {tocItems.map((item, index) => (
              <TocItem item={item} key={index} listGroupItem={true} />
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
});
