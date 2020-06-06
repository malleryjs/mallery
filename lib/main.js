#!/usr/bin/env node

import * as util from "./util";
import path from "path";
import { compileFileP as markdownP } from "./markdown";
import ejs from "ejs";
import * as Toc from "./toc";
import * as config from "./config";
const pkg = require("../package.json");

config.get().then((config) => {
  const pkgPath = path.resolve(__dirname, "..");
  const jsSrcPath = path.resolve(pkgPath, "front", "dist");
  const jsDestPath = path.join(config.paths.output);
  const cssSrcPath = path.join(__dirname, "dist", "mallery.css");
  const cssDestPath = path.join(config.paths.output, "app.min.css");
  const assetsPath = path.resolve(pkgPath, "front", "lib", "assets");
  const layoutSrcPath = path.join(assetsPath, "templates", "layout.ejs.html");
  const faviconSrcPath = path.join(assetsPath, "images", "favicon.ico");
  const faviconDestPath = path.join(config.paths.output, "favicon.ico");
  const indexDestPath = path.join(config.paths.output, "index.html");
  const pathCache = {};
  const prepareOutput = function (config) {
    return util
      .clearDirP(config.paths.output)
      .catch((err) => {
        // console.error(err);
      })
      .then(() => {
        var prom = Promise.resolve();
        if (config.paths.public != null) {
          prom = prom
            .then(() => {
              return util.pathExists(config.paths.public);
            })
            .then((publicExists) => {
              if (publicExists) {
                return util.copyP(config.paths.public, config.paths.output);
              }
            });
        }

        return prom.then(() => {
          return util.mkdirP(config.paths.output);
        });
      })
      .then(() => {
        if (config.brandIcon === true) {
          return util.pathExists(faviconDestPath).then((faviconExists) => {
            if (!faviconExists) {
              return util.copyP(faviconSrcPath, faviconDestPath);
            }
          });
        }
      })
      .then(() => {
        return util.copyP(jsSrcPath, jsDestPath, { recursive: true });
      })
      .then(() => {
        // return util.copyP(cssSrcPath, cssDestPath);
      });
  };

  if (config.serve) {
  } else {
    prepareOutput(config)
      .then(() => {
        // Load the basic toc from the filesystem
        return Toc.createTocFromFolderP(config.paths.src);
      })
      .then((toc) => {
        if (config.toc != null) {
          // Overwrite the filesystem toc with the config toc
          return Toc.mergeTocConfigWithToc(toc, config.toc);
        } else {
          return toc;
        }
      })
      .then((toc) => {
        toc = Toc.calculateItemLevels(toc);
        var indexItemId;
        toc.items.forEach((item, idx) => {
          item.id = idx;
          if (item.path != null) {
            // The item title gets generated from this copy
            var itemOrigPath = item.path;

            // Several things happen here because we need to make sure, that
            // the first entry file gets renamed to index
            /*
             * TODO: when the first possible entry is in a sub folder
             * we need to create a copy index in the root! This is missing
             */
            if (indexItemId == null) indexItemId = idx;
            if (indexItemId === idx) {
              // TODO: Is this really fine? :)
              item.path = item.path.replace(item.name, "index.html");
            } else {
              // TODO: Better toLowercase item name here! (Should match case insensitive)
              if (item.name.indexOf("index") >= 0) {
                var newPath = item.path.replace(item.name, "");
                var newPath =
                  newPath + item.name.replace("index", "index" + idx);
                item.path = newPath;
              }
            }

            if (item.ext != null && item.ext != "") {
              item.path = item.path.replace(item.ext, ".html");
            }
            item.path = util.replace(" ", "-", item.path);
            item.htmlPath = path.join("raw", item.path);
            const itemPathCache = (pathCache[item.htmlPath] = {});
            itemPathCache.absoluteHtmlOutputPath = path.join(
              config.paths.output,
              "raw",
              item.path
            );
            itemPathCache.absolutePath = item.absolutePath;
            delete item.absolutePath;
            itemPathCache.absoluteOutputPath = path.join(
              config.paths.output,
              item.path
            );
            let baseUrl = "";
            let levelIdx = 0;
            while (levelIdx < item.level) {
              baseUrl += "../";
              levelIdx++;
            }
            if (baseUrl === "") baseUrl = "./";
            item.baseUrl = baseUrl;
          }
          if (item.title == null && itemOrigPath != null) {
            item.title = path.basename(itemOrigPath).replace(item.ext, "");
            item.title = util.replace("-", " ", item.title);
            item.title = util.replace("_", " ", item.title);
            item.title = util.replace("   ", " - ", item.title);
            item.title = item.title
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
          }
          // Remember: Link items doesnt have paths
          if (!item.isDir && item.path != null) {
          }
        });
        // TODO: Find better place for this
        return util.readFileP(layoutSrcPath, "utf-8").then((layoutStr) => {
          return {
            layoutStr,
            toc,
          };
        });
      })
      .then((res) => {
        let toc = res.toc;
        // Add this to the appropriate section
        config.layoutStr = res.layoutStr;
        let prom = Promise.resolve();
        toc.items.forEach((item) => {
          if (item.path != null) {
            prom = prom
              // Creating directories in the ouput path
              .then(() => {
                if (!item.isDir) {
                  // For files we need to create the file's parent dir
                  return util
                    .mkdirP(
                      path.dirname(pathCache[item.htmlPath].absoluteOutputPath)
                    )
                    .then(() => {
                      return util.mkdirP(
                        path.dirname(
                          pathCache[item.htmlPath].absoluteHtmlOutputPath
                        )
                      );
                    });
                }
              });
          }
        });

        prom = prom.then(() => {
          var promises = [];
          toc.items.forEach((item) => {
            let prom2 = Promise.resolve();
            if (!item.isDir) {
              Object.keys(config.includes).forEach(function (type) {
                const extensions = config.includes[type];
                extensions.forEach((extension) => {
                  if (extension === item.ext) {
                    prom2 = prom2.then(() => {
                      switch (type) {
                        case "markdown":
                          return markdownP(
                            pathCache[item.htmlPath].absolutePath
                          );
                          break;
                        case "html":
                          return util.readFileP(
                            pathCache[item.htmlPath].absolutePath,
                            "utf-8"
                          );
                          break;
                        case "plaintext":
                          return util
                            .readFileP(
                              pathCache[item.htmlPath].absolutePath,
                              "utf-8"
                            )
                            .then((content) => {
                              return util.escapeHtml(content);
                            });
                          break;
                        default:
                          return false;
                          break;
                      }
                    });
                  }
                });
              });

              // Read chapters of html
              prom2 = prom2.then((content) => {
                if (content !== false && content != null) {
                  item.chapters = Toc.getHtmlChapters(content);
                }

                return content;
              });

              prom2 = prom2.then((content) => {
                if (content !== false && content != null) {
                  item.hasContent = true;
                  return util
                    .writeFileP(
                      pathCache[item.htmlPath].absoluteHtmlOutputPath,
                      content
                    )
                    .then(() => {
                      return util.writeFileP(
                        pathCache[item.htmlPath].absoluteOutputPath,
                        content
                      );
                    });
                } else {
                  item.hasContent = false;
                }
              });

              promises.push(prom2);
            }
          });

          return Promise.all(promises);
        });

        prom = prom.then(() => {
          config.toc = toc;
          return config;
        });

        return prom;
      })
      .then((config) => {
        let fileCopyProm = Promise.resolve();
        const tpl = ejs.compile(config.layoutStr);
        config.toc.items.forEach((item, itemId) => {
          if (item.hasContent) {
            fileCopyProm = fileCopyProm
              .then(() => {
                return util.readFileP(
                  pathCache[item.htmlPath].absoluteOutputPath,
                  "utf-8"
                );
              })
              .then((content) => {
                config.toc.activeItemId = itemId;
                var itemTitle = item.title != null ? item.title : "";
                const itemTitleLower = itemTitle.toLowerCase();
                const pageTitle = config.title != null ? config.title : "";
                const pageTitleLower = pageTitle.toLowerCase();
                if (itemTitleLower !== pageTitleLower) {
                  if (itemTitle.length > 0 && pageTitle.length > 0) {
                    itemTitle += " - ";
                  }
                  itemTitle += pageTitle;
                }

                const result = tpl({
                  version: pkg.version,
                  baseUrl: item.baseUrl,
                  content,
                  title: itemTitle,
                  options: JSON.stringify(
                    {
                      config: {
                        colors: config.colors,
                        title: config.title,
                        footer: config.footer,
                      },
                      toc: config.toc,
                    },
                    null,
                    " "
                  ),
                });

                return util.writeFileP(
                  pathCache[item.htmlPath].absoluteOutputPath,
                  result
                );
              });
          }
        });

        return fileCopyProm;
      });

    return;
  }
});
