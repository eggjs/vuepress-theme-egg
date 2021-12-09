
module.exports = {
  async processSuggestions(suggestions, queryString, queryTerms) {
    const resAfterFilter = suggestions.filter(item => {
      for (const keyword of queryTerms) {
        if ((item.title || '').includes(keyword) || (item.headersStr || '').includes(keyword) || (item.normalizedContent || '').includes(keyword)) {
          return true;
        }
      }

      return false;
    });

    return resAfterFilter;
  }
};