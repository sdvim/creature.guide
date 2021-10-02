module.exports = function (eleventyConfig) {
  eleventyConfig.addWatchTarget("./src/sass/");
  eleventyConfig.addPassthroughCopy("./src/static");
  eleventyConfig.addPassthroughCopy("./src/*.png");

  return {
    dir: {
      input: "src",
      output: "public",
    },
  };
};
