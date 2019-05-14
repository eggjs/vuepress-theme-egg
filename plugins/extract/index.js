/**
 * extract title
 */

module.exports = {
  name: 'vuepress-plugin-extract',
  chainWebpack(config) {
    config.module.rule('markdown')
      .use('extract-loader')
      .loader(require.resolve('./loader.js'));
  },
};
