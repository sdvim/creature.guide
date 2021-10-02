module.exports = function (eleventyConfig) {
  eleventyConfig.addWatchTarget("./src/sass/");
  eleventyConfig.addPassthroughCopy("./src/static");

  return {
    dir: {
      input: "src",
      output: "public",
    },
  };
};
