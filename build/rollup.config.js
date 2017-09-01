const path = require("path");
const fs = require("fs");
import buble from "rollup-plugin-buble";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import css from 'rollup-plugin-css-only';
import handlebars from "handlebars";
import includePaths from 'rollup-plugin-includepaths';

const rootPath = path.join(__dirname, "..");
const templatesPath = path.join(__dirname, "templates");
const pkg = require(path.join(rootPath, "package.json"));
const moduleName = pkg.name;
const distPath = path.join(rootPath, "dist");

const getBanner = function() {
  const tplPath = path.join(templatesPath, "dist-banner.hds.js");
  const tplSource = fs.readFileSync(tplPath, "utf-8");

  const tpl = handlebars.compile(tplSource);

  return tpl({
    pkg
  });
};

const getTargets = function() {
  const formats = ["iife", "cjs", "es"];

  return formats.map(function(format) {
    const suffix = format === "iife" ? "" : `.${format}`;
    const destPath = path.join(distPath, `${moduleName}${suffix}.js`);

    return {
      dest: destPath,
      format: format
    };
  });
};

export default {
  entry: "src/main.js",
  banner: getBanner(),
  targets: getTargets(),
  moduleName,
  plugins: [
    resolve({
      jsnext: true
    }),
    commonjs(),
    includePaths({
      paths: [ 'src/app', './' ]
    }),

    css({
      output: path.join(distPath, `${moduleName}.css`)
    }),
    buble()
  ]
};
