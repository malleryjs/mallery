import * as util from "./util";
const path = require("path");

/**
 * Creates a toc object
 * @param  {Array} items       All items of the toc
 * @param  {Array} root   Only the root items
 * @return {Object}              Toc object
 */
const createToc = function (items, root) {
  if (items == null) items = [];
  if (root == null) root = [];

  return {
    items,
    root,
  };
};

const findByPath = util.findBy("path");

export const createTocFromFolderP = function (pathParam, toc, rootPath) {
  if (toc == null) toc = createToc();
  if (rootPath == null) rootPath = pathParam;

  return util.readdirP(pathParam).then((files) => {
    var localItemIds = [];
    var prom = Promise.resolve();
    files.forEach((f) => {
      var fullPath = path.join(pathParam, f);

      prom = prom
        .then(() => {
          return util.lstatP(fullPath);
        })
        .then((stats) => {
          var id =
            toc.items.push({
              ext: path.extname(f),
              isDir: stats.isDirectory(),
              absolutePath: fullPath,
              path: fullPath.replace(rootPath + path.sep, ""),
              name: f,
            }) - 1;
          localItemIds.push(id);

          if (toc.items[id].isDir) {
            return createTocFromFolderP(fullPath, toc, rootPath).then(
              (newToc) => {
                toc = newToc;
                toc.items[id].children = toc.root;
                toc.root = [];
              }
            );
          }
        });
    });

    prom = prom.then(() => {
      toc.root = localItemIds;
      return toc;
    });

    return prom;
  });
};

export const mergeTocConfigWithToc = function (toc, tocConfig) {
  var newToc = createToc();

  var addChildren = function (children) {
    var ids = [];
    children.forEach(function (childId) {
      var childItem = toc.items[childId];
      var id = newToc.items.push(childItem) - 1;
      ids.push(id);

      if (childItem.children != null) {
        childItem.children = addChildren(childItem.children);
      }
    });

    return ids;
  };
  var mergeItems = function (items, basePath) {
    if (basePath == null) basePath = "";

    var localItemIds = [];

    items.forEach((tocItem) => {
      var item = {};

      if (tocItem.path != null) {
        tocItem.path = path.join(basePath, tocItem.path);
        var origId = findByPath(toc.items, tocItem.path);
        if (origId !== false) {
          item = toc.items[origId];
        }
      }

      item.href = tocItem.href;
      if (tocItem.title != null) {
        item.title = tocItem.title;
      }

      var id = newToc.items.push(item) - 1;

      if (tocItem.children != null) {
        newToc.items[id].children = mergeItems(tocItem.children, tocItem.path);
        newToc.items[id].isDir = true;
      } else if (item.children != null) {
        newToc.items[id].children = addChildren(item.children);
      }

      localItemIds.push(id);
    });

    return localItemIds;
  };

  newToc.root = mergeItems(tocConfig);
  return newToc;
};

export const calculateItemLevels = function (toc, items, level) {
  if (level == null) level = 0;
  if (items == null) items = toc.root;
  items.forEach(function (itemId) {
    let item = toc.items[itemId];
    item.level = level;
    if (item.children != null) {
      calculateItemLevels(toc, item.children, level + 1);
    }
  });

  return toc;
};

export const getHtmlChapters = function (html) {
  const chapters = {
    root: [],
    items: [],
  };

  const headingRegexStr =
    '<h(\\d*)(?: id="(.*?)")?.*?>([\\s\\S]*?)<\\/h\\1(?: .*?)?>';
  const headingGlobalRegex = new RegExp(headingRegexStr, "g");
  const headingRegex = new RegExp(headingRegexStr);
  const htmlTagsRegex = /<(?:.|\n)*?>/gm;

  let matches = html.match(headingGlobalRegex);

  if (matches != null && matches.length > 0) {
    matches = matches.map(function (match) {
      const subMatches = match.match(headingRegex);
      const hash = subMatches[2];
      const heading = subMatches[3].replace(htmlTagsRegex, "");
      return { level: subMatches[1], heading: heading, hash };
    });

    const pushHeadingsRecursive = function (matches) {
      var head = matches[0];
      var tail = matches.slice(1);
      var rest = [];
      var broken = false;
      var children = [];
      tail.forEach(function (item) {
        if (item.level === head.level) {
          rest.push(item);
          broken = true;
        } else if (broken === false && head.level < item.level) {
          children.push(item);
        } else {
          rest.push(item);
        }
      });

      if (children.length > 0) {
        children = pushHeadingsRecursive(children);
      }

      head.children = children;

      if (rest.length > 0) {
        rest = pushHeadingsRecursive(rest);
      }

      return [head, ...rest];
    };

    const recursiveHeadings = pushHeadingsRecursive(matches);

    const normalizeRecursive = function (items) {
      return items.map(function (chapter) {
        const idx = chapters.items.push(chapter) - 1;
        chapter.id = idx;
        chapter.children = normalizeRecursive(chapter.children);
        return idx;
      });
    };

    chapters.root = normalizeRecursive(recursiveHeadings);
  }

  return chapters;
};
