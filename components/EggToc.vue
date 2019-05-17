<template>
  <Sticker class="egg-toc"
           v-bind="$attrs"
           v-if="visible">
    <div class="egg-toc-item"
         ref="eggTocItem"
         :class="[ `egg-toc-h${item.level}`, { active: activeIndex === index } ]"
         v-for="(item, index) in $page.headers"
         :key="index">
      <a :href="`#${item.slug}`"
         :title="item.title">{{ item.title }}</a>
    </div>
  </Sticker>
</template>

<script>
  import Sticker from './Sticker.vue';
  import { getAbsoluteTop } from '../util';
  let initTop;

  export default {
    components: {
      Sticker,
    },

    data() {
      return {
        activeIndex: 0
      };
    },

    computed: {
      visible() {
        return (
          this.$frontmatter &&
          this.$frontmatter.toc !== false &&
          !!(this.$page && this.$page.headers && this.$page.headers.length)
        );
      }
    },

    watch: {
      activeIndex() {
        const items = this.$refs.eggTocItem || [];
        const dom = items[this.activeIndex];
        if (!dom) return;
        const rect = dom.getBoundingClientRect();
        const wrapperRect = this.$el.getBoundingClientRect();
        const top = rect.top - wrapperRect.top;
        if (top < 20) {
          this.$el.scrollTop = this.$el.scrollTop + top - 20;
        } else if (top + rect.height > wrapperRect.height) {
          this.$el.scrollTop += rect.top - (wrapperRect.height - rect.height);
        }
      },
    },

    methods: {
      onScroll() {
        if (initTop === undefined) {
          initTop = getAbsoluteTop(this.$el);
        }

        // update position
        const scrollTop = document.body.scrollTop + document.documentElement.scrollTop;
        const headings = this.$page.headers || [];

        // change active toc with scrolling
        let i = 0;
        const addLink = index => {
          this.activeIndex = index;
        };

        for (; i < headings.length; i++) {
          const dom = document.getElementById(headings[i].slug);
          const top = getAbsoluteTop(dom);
          if (top - 50 < scrollTop) {
            addLink(i);
          } else {
            if (!i) addLink(i);
            break;
          }
        }
      },
    },

    mounted() {
      // sync visible to parent component
      const syncVisible = () => {
        this.$emit('visible-change', this.visible);
      }
      syncVisible();
      this.$watch('visible', syncVisible);

      // binding event
      setTimeout(() => this._onScroll(), 1000);
      this._onScroll = () => this.onScroll();
      window.addEventListener("scroll", this._onScroll);
    },

    beforeDestroy() {
      window.removeEventListener("scroll", this._onScroll);
    }
  };
</script>

<style lang="stylus">
  @require '../styles/config';

  .table-of-contents
    display: none !important;

  .egg-toc
    position: fixed;
    display: none;
    width: $tocWidth;
    max-height: 100vh;
    overflow-y: auto;
    padding: $sidebarTop + $navbarHeight 0;
    top: 0;
    right: 0;
    box-sizing: border-box;
    background: #fff;
    z-index: 0;

    .egg-toc-item
      position: relative;
      padding: 0.25rem 0.6rem 0.25rem 1.5rem;
      line-height: 1.5rem;
      border-left: 2px solid rgba(0, 0, 0, 0.08);
      overflow: hidden;

      a
        display: block;
        color: #2c3e50;
        width: 100%;
        box-sizing: border-box;
        font-size: 0.88rem;
        font-weight: 400;
        text-decoration: none;
        transition: color 0.3s;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

      &.active
        border-left-color: #3eaf7c;

        a
          color: #3eaf7c;

      &:hover
        a
          color: #3eaf7c;

    for i in range(3, 6)
      .egg-toc-h{i} a
        padding-left: 1rem * (i - 2);

  // for egg-toc
  @media (min-width: $MQNarrow)
    .egg-toc
      display: block;
</style>
