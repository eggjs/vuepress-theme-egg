const container = require('markdown-it-container');

// Theme API.
module.exports = () => {
  return {
    extend: '@vuepress/theme-default',

    extendMarkdown: md => {
      md.set({
        linkify: true
      });

      // open image in new tab
      md.renderer.rules.image = (tokens, idx) => {
        const token = tokens[idx];
        const src = token.attrs[token.attrIndex('src')][1];
        const alt = token.content;
        const altList = alt.split(':');
        const srcStr = src.startsWith('/') ? `:src="$withBase('${src}')"` : `src="${src}"`;
        return '<a target="_blank" class="md-img-wrapper" rel="noopener noreferrer">' +
          `<img ${srcStr} alt="${altList[0]}" class="${altList.slice(1).join(' ')}" onload="this.parentNode.href=this.src">` +
          '</a>';
      };

      // add custom block container
      const containerName = 'block';
      md.use(container, 'block', {
        render(tokens, idx) {
          const token = tokens[idx];
          const info = token.info.trim().slice(containerName.length).trim();
          return token.nesting === 1 ?
            `<div class="block-container ${info}">\n` :
            '</div>\n';
        },
      });
    },
    plugins: [
      ['@vuepress/active-header-links'],
      ['@vuepress/plugin-nprogress'],
      [require('./plugins/extract')],
      [require('./plugins/plantuml')],
      [ 'container', { type: 'tip', defaultTitle: { '/zh/': '提示' } }],
      [ 'container', { type: 'warning', defaultTitle: { '/zh/': '注意' } }],
      [ 'container', { type: 'danger', defaultTitle: { '/zh/': '警告' } }],
    ],
  };
};