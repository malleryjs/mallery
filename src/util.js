const path = require("path");
const promisify = require("util").promisify;
const fs = require("fs-extra");
const readdirP = promisify(fs.readdir);
const rmdirP = promisify(fs.rmdir);
const unlinkP = promisify(fs.unlink);
const mkdirP = promisify(fs.ensureDir);
const writeFileP = promisify(fs.writeFile);
const readFileP = promisify(fs.readFile);
const lstatP = promisify(fs.lstat);
const copyP = promisify(fs.copy);
const merge = require('lodash.merge');
const pathExists = promisify(fs.pathExists);

const isObject = function(value) {
  const type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

const clearDirP = function(dirPath) {
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
const findBy = function(propName) {
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
  }
}

const escapeHtml = function(html) {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const escapeRegex = function(regex) {
  return regex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

const replace = function(searchValue, replaceValue, target) {
  searchValue = escapeRegex(searchValue);
  var regex = new RegExp(searchValue,'g')
  return target.replace(regex, replaceValue)
}

module.exports = {
  isObject,
  clearDirP,
  pathExists,
  escapeHtml,
  findBy,
  lstatP,
  merge,
  mkdirP,
  copyP,
  readFileP,
  readdirP,
  replace,
  unlinkP,
  writeFileP
};
