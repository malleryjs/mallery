import { h } from "preact";
import clsx from "clsx";

import { ChapterList } from "./chapter";
import { observerHOC } from "../observer";
import * as Item from "../../models/tocItem";
import store, { setNavActive } from "../../store";
import { getTocItemsById } from "../../store/router/toc";
import { addNewHistoryEntry } from "../../util/history";
import { dispatchThunk } from "alo/store";
import { gotoItemById } from "../../store/router";
import { computed } from "../../store/computed";

const TocItemList_ = function ({ item }) {
  if (item.children == null) return null;

  const tocItem = computed.tocItem;
  const parentItemIds = computed.parentTocItemIds;
  const appState = store.getState();

  const childrenVisible =
    (tocItem && item.id === tocItem.id) || appState.navActive === true;
  if (!childrenVisible && parentItemIds.indexOf(item.id) == -1) return null;

  const items = getTocItemsById(item.children);

  return (
    <ul class="list-unstyled left_nav__menu--sub">
      {items.map((item, index) => (
        <TocItem item={item} key={index} />
      ))}
    </ul>
  );
};
const TocItemList = observerHOC(TocItemList_);

const isTocItemActive = function (item) {
  const toc = store.getState().router.toc;
  const isCurrentItem = toc.itemId === item.id;
  const hasNoChildren = item.chapters == null && item.children == null;
  const hasOnlyOneChapter =
    item.chapters != null &&
    item.chapters.root.length === 1 &&
    toc.chapterId == 0;
  const noChapterIsActive = computed.tocChapter == null;
  const isActive =
    isCurrentItem && (hasNoChildren || hasOnlyOneChapter || noChapterIsActive);

  return isActive;
};

const onNavTocItemClick = function (itemId, evt) {
  evt.preventDefault();
  dispatchThunk(store, gotoItemById(itemId, computed, true))
    .then(() => {
      addNewHistoryEntry();
    })
    .then(() => {
      return store.dispatch(setNavActive(false));
    });
};
const TocItem_ = function ({ item, listGroupItem = false }) {
  const title = Item.getTitle(item);
  const href = item.href != null ? item.href : Item.getUrl(item, computed);
  const onLinkClick =
    item.href == null ? onNavTocItemClick.bind(null, item.id) : null;
  const itemClasses = clsx({
    "left_nav__menu_item--active": isTocItemActive(item),
    "list-group-item": listGroupItem,
  });

  return (
    <li class={"left_nav__menu_item " + itemClasses}>
      <a
        class="left_nav__menu_item_link"
        target="_blank"
        rel="noopener"
        href={href}
        onClick={onLinkClick}
      >
        {title}
      </a>
      <TocItemList item={item} />
      <ChapterList tocItem={item} />
    </li>
  );
};

export const TocItem = observerHOC(TocItem_);
