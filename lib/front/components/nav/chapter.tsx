import clsx from "clsx";
import { h } from "preact";

import * as Item from "@lib/front/models/tocItem";
import { observerHOC } from "../observer";
import { dispatchThunk } from "alo";
import { setTocItemId, setTocChapterId } from "../../store/router/toc";
import store, { setNavActive } from "@lib/front/store";
import { addNewHistoryEntry } from "@lib/front/util/history";
import { computed } from "@lib/front/store/computed";

const onNavChapterItemClick = async function(itemId, chapterId, evt) {
  evt.preventDefault();

  await dispatchThunk(store, setTocItemId(itemId, computed));
  store.dispatch(setTocChapterId(chapterId));
  addNewHistoryEntry();
  store.dispatch(setNavActive(false));
};

const ChapterItem_ = function({ item, level, tocItem }) {
  const toc = store.getState().router.toc;
  const classes = clsx({
    "left_nav__menu_item--active": toc.chapterId == item.id
  });

  const baseUrl = Item.getUrl(tocItem, computed);
  const href = `${baseUrl}#${item.hash}`;

  return (
    <li class={"left_nav__menu_item " + classes}>
      <a
        class="left_nav__menu_item_link"
        href={href}
        onClick={function(evt) {
          onNavChapterItemClick(tocItem.id, item.id, evt);
        }}
        dangerouslySetInnerHTML={{ __html: item.heading }}
      />
      <ChapterList tocItem={tocItem} item={item} level={level + 1} />
    </li>
  );
};
const ChapterItem = observerHOC(ChapterItem_);

const ChapterList_ = function({
  tocItem,
  item,
  level = 1
}: {
  tocItem;
  item?;
  level?: number;
}) {
  const activeTocItem = computed.tocItem;
  if (!activeTocItem) return null;

  let chapterIds;
  if (item) {
    if (!item.children) return null;
    chapterIds = item.children;
  } else {
    if (tocItem.id !== activeTocItem.id) return null;
    if (tocItem.chapters == null) return null;
    chapterIds = tocItem.chapters.root;
    if (chapterIds.length === 1) {
      chapterIds = tocItem.chapters.items[chapterIds[0]].children;
    }
  }

  if (!chapterIds) return null;

  const chapters = chapterIds.map(function(chapterId) {
    return tocItem.chapters.items[chapterId];
  });

  return (
    <ul class="list-unstyled left_nav__menu--sub">
      {chapters.map((item, index) => (
        <ChapterItem item={item} tocItem={tocItem} key={index} level={level} />
      ))}
    </ul>
  );
};

export const ChapterList = observerHOC(ChapterList_);
