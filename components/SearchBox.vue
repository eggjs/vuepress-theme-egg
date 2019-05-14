<template>
  <div class="search-box">
    <input @input="query = $event.target.value"
           v-bind="$attrs"
           aria-label="Search"
           :value="query"
           :class="{ 'focused': focused }"
           autocomplete="off"
           spellcheck="false"
           @focus="focused = true"
           @blur="focused = false"
           @keyup.enter="go(focusIndex)"
           @keyup.up="onUp"
           @keyup.down="onDown">
    <ul class="suggestions"
        v-if="showSuggestions"
        :class="{ 'align-right': alignRight }"
        @mouseleave="unfocus">
      <li class="suggestion"
          v-for="(s, i) in suggestions"
          :class="{ focused: i === focusIndex }"
          @mousedown="go(i)"
          @mouseenter="focus(i)"
          :key="i">
        <a :href="s.path"
           @click.prevent>
          {{ s.title || s.path }}
          <template v-if="s.header">&gt; {{ s.header.title }}</template>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
  /* global SEARCH_MAX_SUGGESTIONS, SEARCH_PATHS */
  export default {
    data() {
      return {
        query: '',
        focused: false,
        focusIndex: 0,
      }
    },

    computed: {
      showSuggestions() {
        return (
          this.focused
          && this.suggestions
          && this.suggestions.length
        )
      },

      suggestions() {
        const query = this.query.trim().toLowerCase()
        if (!query) return;
        if (this._search_cache_[query]) return this._search_cache_[query];

        const { pages } = this.$site
        const max = 10;
        const localePath = this.$localePath;
        // split query keyword
        const queryKeyword = query.split(' ').map(q => q.trim()).filter(q => !!q);
        const res = [];
        const cache = {};
        const matches = (info, cb, weight = 0) => {
          if (!info) return;
          info = info.toLowerCase();
          if (info.includes(query)) {
            // full equal should has max weight
            weight += (info === query) ? 10000 : 1000;
          } else if (queryKeyword.length > 1) {
            const result = queryKeyword.filter(q => {
              if (info.includes(q)) {
                weight += (q === info) ? 500 : 300;
                return true;
              }
            });

            if (!result.length) return;
          } else {
            return;
          }

          const page = cb();
          if (cache[page.path]) return;
          cache[page.path] = true;
          res.push({ weight, page: cb() });
        };

        for (let i = 0; i < pages.length; i++) {
          const p = pages[i]
          // filter out results that do not match current locale
          if (this.getPageLocalePath(p) !== localePath) {
            continue
          }

          // filter out results that do not match searchable paths
          if (!this.isSearchable(p)) {
            continue
          }

          // search keywords
          if (p.frontmatter && p.frontmatter.keyword) {
            if (!Array.isArray(p.frontmatter.keyword)) {
              p.frontmatter.keyword = p.frontmatter.keyword.split(',').map(k => k.trim());
            }

            for (let j = 0; j < p.frontmatter.keyword.length; j++) {
              matches(p.frontmatter.keyword[j], () => p, 10);
            }
          }

          // search title
          matches(p.title, () => p, 5);

          // search headers
          if (p.headers) {
            for (let j = 0; j < p.headers.length; j++) {
              const h = p.headers[j];
              matches(h.title, () => Object.assign({}, p, {
                path: p.path + '#' + h.slug,
                header: h
              }), 1);
            }
          }
        }

        this.focusIndex = 0;
        const searchResult = res.sort((a, b) => b.weight - a.weight)
          .slice(0, max)
          .map(({ page }) => page);
        this._search_cache_[query] = searchResult;
        return searchResult;
      },

      // make suggestions align right when there are not enough items
      alignRight() {
        const navCount = (this.$site.themeConfig.nav || []).length
        const repo = this.$site.repo ? 1 : 0
        return navCount + repo <= 2
      }
    },

    methods: {
      getPageLocalePath(page) {
        for (const localePath in this.$site.locales || {}) {
          if (localePath !== '/' && page.path.indexOf(localePath) === 0) {
            return localePath
          }
        }
        return '/'
      },

      isSearchable(page) {
        let searchIgnorePaths = this.$site.themeConfig.searchIgnorePaths;

        // all paths searchables
        if (!searchIgnorePaths) { return true }

        return !searchIgnorePaths.some(path => page.path.startsWith(path));
      },

      onUp() {
        if (this.showSuggestions) {
          if (this.focusIndex > 0) {
            this.focusIndex--
          } else {
            this.focusIndex = this.suggestions.length - 1
          }
        }
      },

      onDown() {
        if (this.showSuggestions) {
          if (this.focusIndex < this.suggestions.length - 1) {
            this.focusIndex++
          } else {
            this.focusIndex = 0
          }
        }
      },

      go(i) {
        if (!this.showSuggestions) {
          return
        }
        this.$router.push(this.suggestions[i].path)
        this.query = ''
        this.focusIndex = 0
      },

      focus(i) {
        this.focusIndex = i
      },

      unfocus() {
        this.focusIndex = -1
      }
    },

    mounted() {
      this._search_cache_ = {};
    },

    beforeDestroy() {
      this._search_cache_ = {};
    }
  }
</script>

<style lang="stylus">
  .search-box
    display: inline-block;
    position: relative;
    margin-right: 1rem;

    input
      cursor: text;
      width: 12.5rem;
      height: 1.5rem;
      color: lighten($textColor, 25%);
      display: inline-block;
      border: 1px solid darken($borderColor, 10%);
      border-radius: 2rem;
      font-size: 0.9rem;
      line-height: 2rem;
      padding: 0 0.5rem 0 2rem;
      outline: none;
      transition: all 0.2s ease;
      background: #fff url('../images/search.png') 0.6rem center no-repeat;
      background-size: 0.75rem;
      font-size: 0.75rem;
      box-sizing: border-box;

      &:focus
        cursor: auto;
        border-color: $accentColor;

    .suggestions
      background: #fff;
      width: 20rem;
      position: absolute;
      top: 1.5rem;
      padding: 0.4rem 0;
      list-style-type: none;
      box-shadow: 0 14px 11px -6px rgba(0, 0, 0, 0.15);

      &.align-right
        right: 0;

    .suggestion
      line-height: 1.4rem;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;

      a
        font-size: 0.88rem;
        white-space: normal;
        color: #0D261D;
        font-weight: 400;

      &.focused
        a
          color: #698C7C;

  @media (max-width: $MQNarrow)
    .search-box
      input
        cursor: pointer;
        width: 0;
        border-color: transparent;
        position: relative;
        background-size: 1rem;

        &:focus
          cursor: text;
          left: 0;
          width: 10rem;
          background-size: 0.75rem;

  // Match IE11
  @media all and (-ms-high-contrast: none)
    .search-box input
      height: 2rem;

  @media (max-width: $MQNarrow) and (min-width: $MQMobile)
    .search-box
      .suggestions
        left: 0;

  @media (max-width: $MQMobile)
    .search-box
      margin-right: 0;

      input
        left: 1rem;

      .suggestions
        right: 0;

  @media (max-width: $MQMobileNarrow)
    .search-box
      .suggestions
        width: calc(100vw - 4rem);

      input:focus
        width: 8rem;
</style>
