const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const eleventyPluginToc = require("@uncenter/eleventy-plugin-toc");
const striptags = require("striptags");

module.exports = function (eleventyConfig) {
    // Add plugins
    eleventyConfig.addPlugin(eleventyNavigationPlugin);
    eleventyConfig.addPlugin(syntaxHighlight);
    eleventyConfig.addPlugin(eleventyPluginToc, {
        tags: ["h2", "h3"], // Which headings to include in ToC
        ul: true, // This correctly creates the <ul>
    });

    // Add a filter to strip HTML tags for search
    eleventyConfig.addFilter("striptags", (content) => {
        if (content) {
            return striptags(content);
        }
        return "";
    });

    // Configure Markdown-it to add header anchors
    const md = new markdownIt({
        html: true,
        breaks: true,
        linkify: true,
    }).use(markdownItAnchor, {
        permalink: markdownItAnchor.permalink.ariaHidden({
            placement: "after",
            class: "header-anchor",
            symbol: "#",
            level: [1, 2, 3, 4], // Add anchors to h1-h4
        }),
        slugify: eleventyConfig.getFilter("slugify"),
    });
    eleventyConfig.setLibrary("md", md);

    // Passthrough copy for static assets (CSS, images)
    eleventyConfig.addPassthroughCopy("src/assets");

    // Define input/output directories
    return {
        pathPrefix: "/sop-docs/",
        dir: {
            input: "src",
            output: "_site",
            includes: "_includes",
        },
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
    };
};