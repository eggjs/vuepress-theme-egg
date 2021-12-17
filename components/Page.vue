<template>
  <main class="page">
    <slot name="top" />

    <Content class="content"/>

    <footer class="page-edit"
            v-if="editLink">
      <div class="last-updated"
           v-if="lastUpdated">
        <span class="prefix">{{ lastUpdatedText }}: </span>
        <span class="time">{{ lastUpdated }}</span>
      </div>

      <div class="edit-link">
        <a :href="editLink"
           target="_blank"
           rel="noopener noreferrer">{{ editLinkText }}</a>
        <OutboundLink />
      </div>
    </footer>

    <div class="page-nav"
         v-if="prev || next">
      <p class="inner">
        <router-link v-if="prev"
                     class="prev"
                     :title="prev.title"
                     :to="prev.path">
          上一篇<br /><span>{{ prev.title || prev.path }}</span>
        </router-link>

        <router-link v-if="next"
                     class="next"
                     :title="next.title"
                     :to="next.path">
          下一篇<br /><span>{{ next.title || next.path }}</span>
        </router-link>
      </p>
    </div>

    <slot name="bottom" />
  </main>
</template>

<script>
  import { resolvePage, normalize, outboundRE, getAbsoluteTop, endingSlashRE } from "../util";

  export default {
    props: ["sidebarItems"],

    computed: {
      lastUpdated() {
        return this.$page.lastUpdated;
      },

      lastUpdatedText() {
        if (typeof this.$themeLocaleConfig.lastUpdated === "string") {
          return this.$themeLocaleConfig.lastUpdated;
        }
        if (typeof this.$site.themeConfig.lastUpdated === "string") {
          return this.$site.themeConfig.lastUpdated;
        }
        return "Last Updated";
      },

      prev() {
        const prev = this.$page.frontmatter.prev;
        if (prev === false) {
          return;
        } else if (prev) {
          return resolvePage(this.$site.pages, prev, this.$route.path);
        } else {
          return resolvePrev(this.$page, this.sidebarItems);
        }
      },

      next() {
        const next = this.$page.frontmatter.next;
        if (next === false) {
          return;
        } else if (next) {
          return resolvePage(this.$site.pages, next, this.$route.path);
        } else {
          return resolveNext(this.$page, this.sidebarItems);
        }
      },

      editLink() {
        if (this.$page.frontmatter.editLink === false) {
          return;
        }
        const {
          repo,
          editLinks,
          docsDir = "",
          docsBranch = "master",
          docsRepo = repo
        } = this.$site.themeConfig;

        let path = normalize(this.$page.path);
        if (endingSlashRE.test(path)) {
          path += "README.md";
        } else {
          path += ".md";
        }
        if (docsRepo && editLinks) {
          return this.createEditLink(repo, docsRepo, docsDir, docsBranch, path);
        }
      },

      editLinkText() {
        return (
          this.$themeLocaleConfig.editLinkText ||
          this.$site.themeConfig.editLinkText ||
          `Edit this page`
        );
      }
    },

    methods: {
      createEditLink(repo, docsRepo, docsDir, docsBranch, path) {
        const bitbucket = /bitbucket.org/;
        if (bitbucket.test(repo)) {
          const base = outboundRE.test(docsRepo) ? docsRepo : repo;
          return (
            base.replace(endingSlashRE, "") +
            `/src` +
            `/${docsBranch}` +
            (docsDir ? "/" + docsDir.replace(endingSlashRE, "") : "") +
            path +
            `?mode=edit&spa=0&at=${docsBranch}&fileviewer=file-view-default`
          );
        }

        const base = outboundRE.test(docsRepo)
          ? docsRepo
          : `https://github.com/${docsRepo}`;

        return (
          base.replace(endingSlashRE, "") +
          // change to `/edit/${docsBranch}` if want to goto edit page.
          `/edit/${docsBranch}` +
          (docsDir ? "/" + docsDir.replace(endingSlashRE, "") : "") +
          path
        );
      },

      autoJumpHash() {
        setTimeout(() => {
          const hash = decodeURIComponent(location.hash.substring(1));
          const dom = hash && document.getElementById(hash);
          if (dom) window.scrollTo(0, getAbsoluteTop(dom) - 5);
        }, 100);
      }
    },

    watch: {
      $route(newRoute, oldRoute) {
        if (newRoute.path === oldRoute.path) return;
        this.autoJumpHash();
      }
    },

    mounted() {
      this.autoJumpHash();
    }
  };

  function resolvePrev(page, items) {
    return find(page, items, -1);
  }

  function resolveNext(page, items) {
    return find(page, items, 1);
  }

  function find(page, items, offset) {
    const res = [];
    items.forEach(item => {
      if (item.type === "group") {
        res.push(...(item.children || []));
      } else {
        res.push(item);
      }
    });
    for (let i = 0; i < res.length; i++) {
      const cur = res[i];
      if (cur.type === "page" && cur.path === decodeURIComponent(page.path)) {
        return res[i + offset];
      }
    }
  }
</script>

<style lang="stylus">
  @require '../styles/wrapper.styl';

  .page
    padding-bottom: 2rem;
    display: block;
    min-height: 100vh;

  .page-edit
    @extend $wrapper;
    padding-top: 1rem;
    padding-bottom: 1rem;
    overflow: auto;
    font-size: 0.9em;

    .edit-link
      float: right;

      .outbound
        display: inline-block !important;

      a
        color: lighten($textColor, 25%);
        margin-right: 0.25rem;

    .last-updated
      display: inline-block;

      .prefix
        font-weight: 500;
        color: lighten($textColor, 25%);

      .time
        font-weight: 400;
        color: #aaa;

  .page-nav
    @extend $wrapper;
    padding-top: 1rem;
    padding-bottom: 0;
    font-size: 1rem;
    line-height: 1.5rem;

    .inner
      min-height: 2rem;
      margin-top: 0;
      border-top: 1px solid $borderColor;
      padding-top: 3rem;
      overflow: auto; // clear float

      a
        color: #698C7F;

        &:hover span
          color: #00B362;

      span
        font-size: 1rem;
        color: #0D261D;

    .prev
      float: left;

    .next
      float: right;

  @media (max-width: $MQMobile)
    .page-edit
      .edit-link
        margin-bottom: 0.5rem;

      .last-updated
        font-size: 0.8em;
        float: none;
        text-align: left;
</style>
