const path = require("path");
const promisify = require("util").promisify;
const fs = require("fs-extra");
export const readdirP = promisify(fs.readdir);
export const rmdirP = promisify(fs.rmdir);
export const unlinkP = promisify(fs.unlink);
export const mkdirP = promisify(fs.ensureDir);
export const writeFileP = promisify(fs.writeFile);
export const readFileP = promisify(fs.readFile);
export const lstatP = promisify(fs.lstat);
export const copyP = promisify(fs.copy);
export const merge = require("lodash.merge");
export const pathExists = promisify(fs.pathExists);

export const isObject = function(value) {
  const type = typeof value;
  return value != null && (type == "object" || type == "function");
};

export const clearDirP = function(dirPath) {
  return readdirP(dirPath)
    .catch(err => {
      throw err;
    })
    .then(files => {
      var unlinkPromises = files.map(f => {
        const fullPath = path.join(dirPath, f);
        return lstatP(fullPath).then(stat => {
          if (stat.isDirectory()) {
            return clearDirP(fullPath).then(() => {
              return rmdirP(fullPath);
            });
          } else {
            return unlinkP(fullPath);
          }
        });
      });
      return Promise.all(unlinkPromises);
    });
};

/**
 * Creates a new function which returns idx of first entry by prop.
 * -1 if nothing found.
 * @param  {string}    propName Which prop to compare
 * @return {integer}   Idx of found item
 */
export const findBy = function(propName) {
  return function(arr, value) {
    const len = arr.length;
    let idx = 0;
    let id = -1;
    while (idx <= len) {
      if (arr[idx] && arr[idx][propName]) {
        if (arr[idx][propName] === value) {
          id = idx;
          idx = len;
        }
      }
      idx++;
    }

    return id;
  };
};

export const escapeHtml = function(html) {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const escapeRegex = function(regex) {
  return regex.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
};

export const replace = function(searchValue, replaceValue, target) {
  searchValue = escapeRegex(searchValue);
  var regex = new RegExp(searchValue, "g");
  return target.replace(regex, replaceValue);
};
