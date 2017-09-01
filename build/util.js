const promisify = require("util").promisify;
const fs = require("fs");
const preaddir = promisify(fs.readdir);

/**
 * Accepts a haystack and returns a function which return true if needle is
 * at end of haystack
 *
 * @param  {[type]} haystack [description]
 * @return {[type]}          [description]
 */
const endsWith = function(haystack) {
  return function(needle) {
    return haystack.indexOf(needle, haystack.length - needle.length) !== -1;
  };
};

/**
 * Creates a function which searches multible needles at the end of a string
 *
 * @param  {array} needles Which needles to search
 * @return {function}              filter function
 */
const endsWith2 = function(needles) {
  return function(haystack) {
    const haystackEndsWith = endsWith(haystack);
    const matches = needles.filter(haystackEndsWith);

    return matches.length === 0;
  };
};

const readdir = function(path, ignoredSuffixes) {
  const filesFilter = endsWith2(ignoredSuffixes);

  return preaddir(path)
    .catch(function(err) {
      console.error(err);

      return [];
    })
    .then(function(files) {
      return files.filter(filesFilter);
    });
};

module.exports = {
  endsWith,
  endsWith2,
  readdir
};
