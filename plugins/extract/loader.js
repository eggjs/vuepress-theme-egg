const { hash } = require('@vuepress/shared-utils');
const LRU = require('lru-cache');
const cache = new LRU({ max: 1000 });
const titleRE = /\ntitle *:([^\n]+)/;
const matterRE = /^\s*---(\n[\s\S]+?\n)---/;

module.exports = function(src) {
  const file = this.resourcePath;
  const key = hash(file + src);
  const cached = cache.get(key);
  if (cached) {
    return cached;
  }

  let parsedSrc = src;
  const result = src.match(matterRE);
  const end = () => {
    cache.set(key, parsedSrc);
    return parsedSrc;
  };

  if (!result) {
    return end();
  }

  const content = result[1];
  const checkTitleResult = content.match(titleRE);
  if (!checkTitleResult) {
    return end();
  }

  let title = checkTitleResult[1].trim();
  if (!title) {
    return end();
  }

  if ([ '\'', '"' ].some(k => title.startsWith(k) && title.endsWith(k))) {
    // remove quote
    title = title.substring(1, title.length - 1);
  }

  const matterStr = result[0];
  parsedSrc = `${matterStr}\n# ${title}\n${src.substring(matterStr.length).trim()}`;

  return end();
};
