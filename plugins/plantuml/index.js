/**
 * markdown support plantuml
 */

const { execSync } = require('child_process');
const { path } = require('@vuepress/shared-utils');
const LRU = require('lru-cache');
const cache = new LRU({ max: 1000 });

module.exports = () => {
  return {
    name: 'vuepress-plugin-plantuml',

    enhanceAppFiles: path.resolve(__dirname, './enhanceAppFile.js'),

    extendMarkdown: md => {
      const highlight = md.options.highlight;
      md.set({
        highlight(str, lang) {
          if (lang === 'plantuml') {
            const result = convertStrToImgUrl(str.trim());
            if (result.url) {
              return `<img class="plantuml-img" src="${result.url}" />`;
            }

            return `<p class="plant-error">${result.error || 'plantuml parse error'}</p>`;
          }

          return highlight ? highlight.call(this, str, lang) : str;
        },
      });
    },
  };
};

function convertStrToImgUrl(str) {
  if (str.length < 100) {
    return {
      url: `//g.yuque.com/g?${encodeURIComponent(str)}`,
    };
  }

  const key = encodeURIComponent(str);
  const cached = cache.get(key);
  if (cached) {
    return { url: cached };
  }

  const result = execSync('node ./getPlantuml', {
    cwd: __dirname,
    env: {
      ...process.env,
      PLANTUML_PLAIN_TEXT: str,
    },
  });
  let json;

  if (!str) {
    return { error: 'unknown error' };
  }

  try {
    json = JSON.parse(result);
  } catch (e) {
    return { error: e.message };
  }

  if (json.success) {
    cache.set(key, json.data);
    return { url: json.data };
  }

  return { error: json.errMsg };
}
