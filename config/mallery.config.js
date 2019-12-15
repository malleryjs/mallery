const paths = require("../lib/node").paths;
const pkg = require(paths.project("package.json"));

module.exports = {
  title: pkg.name,
  paths: {
    src: "../docs",
    output: "../static/docs",
    public: "../docs/public"
  },
  toc: [
    {
      path: "README.md",
      title: "Mallery"
    },
    {
      path: "installation.md",
      title: "Installation"
    },
    {
      path: "usage.md",
      title: "Usage"
    },
    {
      path: "CHANGELOG.md",
      title: "Changelog"
    },
    {
      title: "Github",
      href: "https://github.com/malleryjs/mallery/"
    },
    {
      path: "examples",
      title: "Demo",
      children: [
        {
          path: "test.md"
        },
        {
          path: "readme2.md",
          title: "README"
        },
        {
          title: "Hello world",
          path: "index.md"
        },
        {
          path: "subfolder2"
        },
        {
          title: "Subfolder",
          path: "subfolder",
          children: [
            {
              path: "more-infos.md"
            }
          ]
        },
        {
          title: "Google",
          href: "https://google.ch"
        },
        {
          path: "more tests"
        }
      ]
    }
  ]
};
