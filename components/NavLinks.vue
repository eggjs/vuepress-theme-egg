<template>
  <nav class="nav-links" v-if="userLinks.length || repoLink">
    <!-- user links -->
    <div class="nav-item" v-for="item in userLinks" :key="item.link">
      <DropdownLink v-if="item.type === 'links'" :item="item"/>
      <NavLink v-else :item="item"/>
    </div>

    <!-- repo link -->
    <a v-if="repoLink" :href="repoLink" class="repo-link" target="_blank" rel="noopener noreferrer">
      {{ repoLabel }}
      <OutboundLink/>
    </a>
  </nav>
</template>

<script>
import DropdownLink from "./DropdownLink.vue";
import { resolveNavItems } from "../util";
import NavLink from "./NavLink.vue";

export default {
  components: { NavLink, DropdownLink },

  computed: {
    userNav() {
      return resolveNavItems(
        this.$themeLocaleConfig.nav || this.$site.themeConfig.nav || [],
        this.$site
      );
    },

    userLinks() {
      const { locales } = this.$site;

      if (locales && Object.keys(locales).length > 1) {
        // change locales
        const currentLink = this.$page.path;
        const routes = this.$router.options.routes;
        const themeLocales = this.$site.themeConfig.locales || {};
        const languageDropdown = {
          text: this.$themeLocaleConfig.selectText || "Languages",
          type: "links",
          addr: "langs",          
          items: Object.keys(locales).map(path => {
            const locale = locales[path];
            const text =
              (themeLocales[path] && themeLocales[path].label) || locale.lang;
            let link;
            // Stay on the current page
            if (locale.lang === this.$lang) {
              link = currentLink;
            } else {
              // Try to stay on the same page
              link = currentLink.replace(this.$localeConfig.path, path);
              // fallback to homepage
              if (!routes.some(route => route.path === link)) {
                link = path;
              }
            }
            return { text, link };
          })
        };
        return [...this.userNav, languageDropdown];
      }
      return this.userNav;
    },

    repoLink() {
      let { repo, repoLink } = this.$site.themeConfig;
      repoLink = repoLink === false ? undefined : repoLink || repo;
      if (repoLink) {
        return /^https?:/.test(repoLink)
          ? repoLink
          : `https://github.com/${repoLink}`;
      }
    },

    repoLabel() {
      if (!this.repoLink) return;
      if (this.$site.themeConfig.repoLabel) {
        return this.$site.themeConfig.repoLabel;
      }

      const repoHost = this.repoLink.match(/^https?:\/\/[^/]+/)[0];
      const platforms = ["GitHub", "GitLab", "Bitbucket"];
      for (let i = 0; i < platforms.length; i++) {
        const platform = platforms[i];
        if (new RegExp(platform, "i").test(repoHost)) {
          return platform;
        }
      }

      return "Source";
    }
  }
};
</script>

<style lang="stylus">
.nav-links {
  display: inline-block;
  height: 100%;

  a {
    line-height: 1.4rem;
    color: inherit;

    &:hover, &.router-link-active {
      color: $accentColor;
    }
  }

  .nav-item {
    position: relative;
    display: inline-block;
    height: 100%;
    padding-left: 1.5rem;
    line-height: 2rem;
    vertical-align: top;

    &>a, .dropdown-title {
      position: relative;
      display: flex;
      padding: 0 0.38rem;
      height: 100%;
      align-items: center;
      line-height: 2rem;
    }

    &:first-child {
      padding-left: 0;
    }
  }

  .repo-link {
    padding-left: 1.5rem;
  }
}

@media (max-width: $MQMobile) {
  .nav-links {
    .nav-item, .repo-link {
      padding-left: 0;
    }
  }
}

@media (min-width: $MQMobile) {
  .nav-links a {
    &:hover, &.router-link-active {
      color: $textColor;
    }
  }

  .nav-item > a:not(.external):hover, .nav-item > a:not(.external).router-link-active, .dropdown-wrapper.active {
    &::after {
      position: absolute;
      display: block;
      content: '';
      width: 100%;
      height: 2px;
      bottom: 0;
      left: 0;
      background-color: lighten($accentColor, 8%);
    }
  }
}
</style>
