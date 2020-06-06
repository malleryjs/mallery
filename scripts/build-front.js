#!/usr/bin/env node

const { spawn, args, buildArgs, rmDir, pkgDir } = require("./lib");

(async () => {
  await rmDir(pkgDir("front", "dist"), { recursive: true });
  spawn("npx", [
    "microbundle",
    "--cwd",
    "front",
    "--css-modules",
    "false",
    "--raw",
    ...buildArgs(),
    ...args,
  ]);
})();
