import store from "../store";
import { computed } from "../store/computed";

export const getCurrentTitle = function() {
  var appState = store.getState();
  var item = computed.tocItem;

  var title = "";
  if (appState != null && item != null) {
    if (item.title != null) title = item.title;
    const titleLower = title.toLowerCase();
    const pageTitle =
      appState.config.title != null ? appState.config.title : "";
    const pageTitleLower = pageTitle.toLowerCase();
    if (titleLower !== pageTitleLower) {
      if (title.length > 0 && pageTitle.length > 0) {
        title += " - ";
      }
      title += pageTitle;
    }
  }

  return title;
};
