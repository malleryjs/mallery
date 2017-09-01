# Usage
## CLI
Most of the config file [options](options) can also be used directly from
the CLI. If paths are provided via CLI argument, they will be relative to the
current working directory!

```bash
mallery --title "Iron Man Suit" --colors-accent orange --brandIcon false
  --footer-html "&copy; &copy; &copy; Copypasta" --paths-output="custom/output"
```

> Notice how recursive options like colors-accent or footer-html can be used!

### Additional options

#### First argument
The first CLI argument can be a path to the [config file](#configuration-file):

```bash
mallery custom/path/to/config.js
```


## Configuration file
Mallery will search for a `mallery.config.js` file in the current working folder.
A custom path to this file can be provided via [CLI](#first-argument)!

### Options
| Name                   | Description                                                              | Default     |
| ---------------------- | ------------------------------------------------------------------------ | ----------- |
| <pre>brandIcon</pre>   | Copy the Mallory favicon to the root of the website                      | true        |
| <pre>title</pre>       | A base title (postfixed to all page titles)                              |             |
| <pre>colors</pre>      | Multible color settings                                                  | {...}       |
| <pre>  accent</pre>    | Color of links in content, active menu items and mobile hamburger button | <span style="color: #00BF63;">#00BF63</span> |
| <pre>paths</pre>       | Several path options (paths relative to config file<br><small>Paths in config file are relative to the file</small><br><small>Path arguments via CLI are relative to current working dir</small>           | {...}       |
| <pre>  src</pre>       | Path to the folder with source files (markdown etc)                      | docs        |
| <pre>  output</pre>    | Destination path of the compiled website                                 | site        |
| <pre>  public</pre>    | Folder which should be used (copied) as the root of the website          | docs/public |
| <pre>includes</pre>    | Object - file content type controls                                      | {...}       |
| <pre>  plaintext</pre> | Files with these associations will be interpreted as plaintext           | [ .txt ]    |
| <pre>  html</pre>      | Files with these associations will be interpreted as markdown            | [ .html ]   |
| <pre>  markdown</pre>  | Files with these associations will be interpreted as plaintext           | [ .md ]     |
| <pre>toc</pre>         | Table of contents (automatically generated if not provided)<br><small>Have a look at the example!</small> | [...]       |


### Example
```js
module.exports = {
  brandIcon: false,
  title: 'Iron Man Suit',
  paths: {
    output: 'customFolder'
  },
  colors: {
    accent: 'red'
  },
  footer: {
    html: '"Copyright &copy; 2017"'
  },
  toc: [
    // All files of this folder are automatically included
    { path: 'a_folder', title: 'A folder with custom title' },
    // Title will be "A file"
    { path: 'a_file.md' }
    { path: 'a_second_folder', children: [
      // Path of parent is automatically prepended!
      { path: 'file_in_second_folder.md' },
      { path: 'file2_in_second_folder.md' },
      // A child item with more own child items (... is just a placeholder)
      { path: 'folder_in_second_folder', children: [ '...' ] },
    ]},
    // Link item
    { href: 'http://wikipedia.org', title: 'Just a link' }
  ]
};
```


## Tips

### Folder as root of another git branch
Github Pages can host the ouput of Mallery!

Use the following command after updating the site:

```bash
git subtree push --prefix site origin gh-pages
```

This command will push the changes from the folder `site` to the
branch `gh-pages`.

### Git updates were rejected

```bash
git push origin `git subtree split --prefix site gh-pages`:gh-pages --force
```
