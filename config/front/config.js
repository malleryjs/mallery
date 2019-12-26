module.exports = function({ envIsTesting }) {
  let config = {
    isNode: false,
    isLibrary: true,
    id: "front",
    useHot: true
  };

  config.useWorkBox = !config.isLibrary;
  config.useHtmlCreation = !config.isLibrary;
  config.useCodeSplitting = !config.isLibrary;
  config.excludeExternals = envIsTesting || config.isNode;

  return config;
};
