const pkg = require("./package");

let toc = [
  { title: pkg.name, path: "README.md" },
  {
    path: "installation.md",
    title: "Installation",
  },
  {
    path: "usage.md",
    title: "Usage",
  },
  { title: "Changelog", path: "CHANGELOG.md" },
  { title: "Contributing", path: "CONTRIBUTING.md" },
];

if (pkg.repository && pkg.repository.url) {
  toc.push({ title: "Repository", href: pkg.repository.url });
}

toc.push({
  path: "examples",
  title: "Demo",
  children: [
    {
      path: "test.md",
    },
    {
      path: "readme2.md",
      title: "README",
    },
    {
      title: "Hello world",
      path: "index.md",
    },
    {
      path: "subfolder2",
    },
    {
      title: "Subfolder",
      path: "subfolder",
      children: [
        {
          path: "more-infos.md",
        },
      ],
    },
    {
      title: "Google",
      href: "https://google.ch",
    },
    {
      path: "more tests",
    },
  ],
});

module.exports = {
  title: pkg.name,
  paths: {
    src: "./docs",
    output: "./site",
    public: "./docs/public",
  },
  toc,
};
