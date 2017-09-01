const path = require("path");
const util = require("./util.js");
const promisify = require("util").promisify;
const pkg = require(path.join("..", "package.json"));
const exec = require("child_process").exec;

const pexec = promisify(exec);

const rootPath = path.join(__dirname, "..");
const uglifyCmdPath = path.join(rootPath, "node_modules", ".bin", "uglifyjs");

/**
 * Uglifies a file by filename
 * @param  {string} fileName Filename of the target file
 * @return {promise}         Promise of the runned command
 */
const uglify = function(fileName) {
  const matches = fileName.match(/(.*)\/(.*)\.(.*?)$/);
  const destPath = matches[1];
  const prefix = matches[2];
  const suffix = matches[3];

  const srcFilePath = path.join(destPath, `${prefix}.${suffix}`);
  const destFilePath = path.join(destPath, `${prefix}.min.${suffix}`);

  const cmd = `${uglifyCmdPath} --comments /@license/ --compress --mangle --output ${destFilePath} -- ${srcFilePath}`;

  return pexec(cmd).catch(function(res) {
    console.error(res.stderr);
  });
};

const uglifyPath = function(pathParam, ignoredFileEndings) {
  return util.readdir(pathParam, ignoredFileEndings).then(function(files) {
    let prom = Promise.resolve();
    files.forEach(function(fileName) {
      prom = prom.then(function() {
        const filePath = path.join(pathParam, fileName);

        return uglify(filePath);
      });
    });

    return prom;
  });
};

const distPath = path.join(rootPath, "dist");
const ignoredFormats = ["es.js", "min.js", ".map"];
uglifyPath(distPath, ignoredFormats);
