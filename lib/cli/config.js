const yargs = require("yargs");
const path = require("path");
const cwd = process.cwd();
const util = require("./util");

const loadConfigFile = function(configPath) {
  if (!path.isAbsolute(configPath)) {
    configPath = path.join(cwd, configPath);
  }

  return util
    .lstatP(configPath)
    .catch(err => {
      return false;
    })
    .then(res => {
      return res !== false
        ? __non_webpack_require__("./" + path.relative(__dirname, configPath))
        : false;
    })
    .catch(err => {
      console.error(err);
      console.error(
        `Something went wrong while reading the config file: "${configPath}"`
      );
      process.exit();
    });
};

const overwriteFromYargs = function(config, onlyLong, keyPrefix) {
  if (keyPrefix == null) keyPrefix = "";
  if (onlyLong == null) onlyLong = false;
  Object.keys(config).forEach(k => {
    if (["includes", "toc"].indexOf(k) >= 0) {
      return;
    }
    var yk = keyPrefix + k;
    var v = config[k];
    var isBoolean = v === true || v === false;
    if (util.isObject(v)) {
      overwriteFromYargs(config[k], true, k + "-");
    } else {
      var k1 = k[0];
      if (yargs.argv[yk] !== undefined) {
        v = yargs.argv[yk];
      } else if (onlyLong && yargs.argv[k1] !== undefined) {
        v = yargs.argv[k1];
      }
      if (isBoolean) {
        config[k] = v === true || v === "true";
      } else {
        config[k] = v;
      }
    }
  });
};

export const get = function() {
  let config = {
    brandIcon: true,
    colors: {
      accent: "#00BF63"
    },
    title: "",
    footer: {
      html: ""
    },
    paths: {
      config: "mallery.config.js",
      src: "docs",
      output: "site",
      public: "docs/public"
    },
    includes: {
      plaintext: [".txt"],
      html: [".html"],
      markdown: [".md"]
    },
    // TODO: Implement a server and watcher feature
    serve: false
  };

  // Several options can be provided with cli arguments
  if (yargs.argv._[0] != null) {
    config.paths.config = yargs.argv._[0];
  }
  overwriteFromYargs(config.paths);
  overwriteFromYargs(config);

  return loadConfigFile(config.paths.config).then(fileConfig => {
    if (fileConfig !== false) {
      if (fileConfig.paths != null) {
        var basename = path.basename(path.dirname(config.paths.config));
        Object.keys(fileConfig.paths).forEach(function(k) {
          var v = fileConfig.paths[k];
          if (v != null) {
            if (!path.isAbsolute(v)) {
              fileConfig.paths[k] = path.join(basename, v);
            }
          }
        });
      }

      config = util.merge(config, fileConfig);
    }

    overwriteFromYargs(config.paths);
    overwriteFromYargs(config);

    // Transform paths to absolute paths
    Object.keys(config.paths).forEach(function(k) {
      var v = config.paths[k];
      if (v != null) {
        if (!path.isAbsolute(v)) {
          config.paths[k] = path.join(cwd, v);
        }
      }
    });

    return config;
  });
};
