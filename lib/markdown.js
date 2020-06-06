const promisify = require("util").promisify;
const fs = require("fs");
const readFileP = promisify(fs.readFile);
const writeFileP = promisify(fs.writeFile);

const remark = require("remark");
const remarkHtml = require("remark-html");
const remarkToc = require("remark-toc");
const remarkHighlight = require("remark-highlight.js");
const remarkHeadings = require("remark-autolink-headings");
const remarkGithub = require("remark-github");
const remarkGemoji = require("remark-gemoji-to-emoji");
const remarkSlug = require("remark-slug");

// Found from https://github.com/wooorm/remark-slug/blob/master/index.js#L32
function patch(context, key, value) {
  if (!context[key]) {
    context[key] = value;
  }

  return context[key];
}

const remarkWithPlugins = remark()
  .use(remarkToc)
  .use(remarkHtml)
  .use(remarkHighlight)
  .use(function (opts) {
    return function (root, file) {
      var mutateItem = function (item) {
        if (item != null) {
          if (item.type == "blockquote") {
            var data = patch(item, "data", {});
            var props = patch(data, "hProperties", {});
            props.class = "blockquote";
            if (item.children != null) {
              item.children.forEach((child) => {
                if (child.type == "paragraph") {
                  var data = patch(child, "data", {});
                  var props = patch(data, "hProperties", {});
                  props.class = "mb-0";
                }
              });
            }
          }
          // Images should be responsive
          if (item.type == "image") {
            var data = patch(item, "data", {});
            var props = patch(data, "hProperties", {});
            props.class = "img-fluid";
          }
          // Links will be opened in new tabs
          if (item.type == "link") {
            if (item.url != null && item.url[0] != "#") {
              var data = patch(item, "data", {});
              var props = patch(data, "hProperties", {});
              props.target = "_blank";
            }
          }
          // Tables are formated for bootstrap
          if (item.type == "table") {
            var data = patch(item, "data", {});
            var props = patch(data, "hProperties", {});
            props.class = "table table-hover table-bordered";
          }
          if (item.children != null) {
            mutateChildren(item.children);
          }
        }
      };
      var mutateChildren = function (children) {
        children.forEach((item) => mutateItem(item));
      };
      mutateChildren(root.children);
    };
  })
  .use(remarkSlug)
  // TODO: These links doesnt work when the heading begins with a number
  .use(remarkHeadings, {
    content: {
      type: "element",
      tagName: "span",
      properties: {
        className: ["toc-link"],
      },
      children: [
        {
          type: "element",
          tagName: "span",
          properties: {
            className: ["icono-chain"],
          },
        },
      ],
    },
  })
  .use(remarkGemoji);

const remarkWithPluginsP = promisify(
  remarkWithPlugins.process.bind(remarkWithPlugins)
);

export const compileFileP = function (srcPath, destPath) {
  return readFileP(srcPath)
    .then(remarkWithPluginsP)
    .then((res) => {
      if (destPath != null) {
        return writeFileP(destPath, res.contents).then(() => res.contents);
      } else {
        return res.contents;
      }
    });
};
