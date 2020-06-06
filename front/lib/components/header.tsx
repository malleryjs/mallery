import { h } from "preact";
import { observerHOC } from "./observer";
import { getUrl } from "../models/tocItem";
import { getCurrentTitle } from "../util/pageTitle";
import { computed } from "../store/computed";

const Header_ = function () {
  const tocItem = computed.tocItem;
  const href = tocItem ? getUrl(tocItem, computed) : "#";

  return (
    <header class="row header" role="navigation" id="header">
      <div class="col">
        <div class="header__inner">
          <a class="header__title" href={href}>
            {getCurrentTitle()}
          </a>
        </div>
      </div>
    </header>
  );
};

export const Header = observerHOC(Header_);
