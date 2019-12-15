module.exports = function() {
  let config = {
    isNode: false,
    isLibrary: true,
    id: "front",
    useHot: true
  };

  config.useWorkBox = !config.isLibrary;
  config.useHtmlCreation = !config.isLibrary;
  config.useCodeSplitting = !config.isLibrary;

  return config;
};
