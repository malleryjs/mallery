import { computed } from "../store/computed";
import { getCurrentTitle } from "./pageTitle";
import * as Item from "../models/tocItem";

export const addNewHistoryEntry = function (replaceHistory = false) {
  var hash = "";
  if (computed.tocChapter != null && computed.tocChapter.hash != null) {
    hash = "#" + computed.tocChapter.hash;
  }
  var item = computed.tocItem;
  if (!item) return;

  var title = getCurrentTitle();
  document.title = title;

  var historyState = {
    itemId: item.id,
    hash,
    title,
  };

  var url = Item.getUrl(item, computed) + hash;

  if (replaceHistory) {
    history.replaceState(historyState, title, url);
  } else {
    history.pushState(historyState, title, url);
  }
};
