import { existsSync } from 'node:fs';
import { HtmlBasePlugin } from '@11ty/eleventy';
import site from './src/_data/site.js';
import { absoluteUrl } from './src/lib/url.js';

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.amendLibrary('md', (markdown) => markdown.set({ html: false }));
  eleventyConfig.addFilter('absoluteUrl', absoluteUrl);
  eleventyConfig.ignores.add('src/content/**');
  eleventyConfig.ignores.add('src/styles/**');
  eleventyConfig.ignores.add('src/lib/**');

  if (existsSync('public')) {
    eleventyConfig.addPassthroughCopy({ public: '.' });
  }

  return {
    dir: {
      input: 'src',
      includes: '_includes',
      data: '_data',
      output: 'dist',
    },
    pathPrefix: site.basePath,
  };
}
