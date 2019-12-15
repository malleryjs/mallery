#!/usr/bin/env node

const { paths } = require("../../lib/node");

require("../templates/build")({
  nameSpaceId: "front",
  useDevServer: true,
  useBundleAnalyzer: true
});
