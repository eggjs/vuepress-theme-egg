<template>
  <header class="navbar">
    <SidebarButton @toggle-sidebar="$emit('toggle-sidebar')"/>

    <div class="left-logo-part">
      <router-link :to="$localePath" class="home-link">
        <img
          class="logo"
          v-if="$site.themeConfig.logo"
          :src="$withBase($site.themeConfig.logo)"
          :alt="$siteTitle"
        >
        <!-- <span
          ref="siteName"
          class="site-name"
          v-if="$siteTitle"
          :class="{ 'can-hide': $site.themeConfig.logo }"
        >{{ $siteTitle }}</span> -->
      </router-link>

      <SearchBox :placeholder="searchTitle" v-if="$site.themeConfig.search !== false"/>
    </div>

    <div class="links" :style="linksWrapMaxWidth ? { 'max-width': linksWrapMaxWidth + 'px' } : {}">
      <NavLinks class="can-hide"/>
    </div>
  </header>
</template>

<script>
import SidebarButton from "./SidebarButton.vue";
import SearchBox from "./SearchBox.vue";
import NavLinks from "./NavLinks.vue";

export default {
  components: { SidebarButton, NavLinks, SearchBox },

  data() {
    return {
      linksWrapMaxWidth: null
    };
  },

  mounted() {
    const MOBILE_DESKTOP_BREAKPOINT = 719; // refer to config.styl
    const NAVBAR_VERTICAL_PADDING =
      parseInt(css(this.$el, "paddingLeft")) +
      parseInt(css(this.$el, "paddingRight"));
    const handleLinksWrapWidth = () => {
      if (document.documentElement.clientWidth < MOBILE_DESKTOP_BREAKPOINT) {
        this.linksWrapMaxWidth = null;
      } else {
        this.linksWrapMaxWidth =
          this.$el.offsetWidth -
          NAVBAR_VERTICAL_PADDING -
          ((this.$refs.siteName && this.$refs.siteName.offsetWidth) || 0);
      }
    };
    handleLinksWrapWidth();
    window.addEventListener("resize", handleLinksWrapWidth, false);
  },

  computed: {
    algolia() {
      return (
        this.$themeLocaleConfig.algolia || this.$site.themeConfig.algolia || {}
      );
    },

    isAlgoliaSearch() {
      return this.algolia && this.algolia.apiKey && this.algolia.indexName;
    },

    searchTitle() {
      return this.$siteTitle ? `在 ${this.$siteTitle} 中搜索` : "搜索";
    }
  }
};

function css(el, property) {
  // NOTE: Known bug, will return 'auto' if style value is 'auto'
  const win = el.ownerDocument.defaultView;
  // null means not to return pseudo styles
  return win.getComputedStyle(el, null)[property];
}
</script>

<style lang="stylus">
@require '../styles/config';

$navbar-vertical-padding = 0.7rem;
$navbar-horizontal-padding = 1.5rem;

.navbar {
  padding: 0 $navbar-horizontal-padding;
  line-height: $navbarHeight - 1.4rem;
  position: fixed;
  z-index: 20;
  top: 0;
  left: 0;
  right: 0;
  height: $navbarHeight;
  background-color: #fff;
  box-sizing: border-box;
  box-shadow: 0 0.13rem 1.5rem 0 rgba(0, 0, 0, 0.08);

  .left-logo-part {
    position: absolute;
    width: $sidebarWidth;
    left: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    text-align: right;
    display: flex;
    align-items: center;
    justify-content: right;
    color: #0D261D;
    z-index: 1;

    img {
      vertical-align: middle;
      margin-top: -0.3rem;
    }

    & > a {
      width: 100%;
      height: 1.88rem;
      line-height: 1.88rem;
      box-sizing: border-box;
      padding: 0 2.5rem;
      border-right: 1px solid #ebebeb;
    }

    .search-box {
      position: absolute;
      vertical-align: top;
      top: 0;
      left: 100%;
      bottom: 0;
      margin: auto;
      margin-left: 2.5rem;

      .suggestions {
        top: $navbarHeight;
        padding-top: 0;
        margin: 0;
        text-align: left;
      }

      input {
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;
      }
    }
  }

  a, span, img {
    display: inline-block;
  }

  .logo {
    /* height: $navbarHeight - 1.4rem; */
    height: 100%;
    min-width: $navbarHeight - 1.4rem;
    margin-right: 0.8rem;
    vertical-align: top;
  }

  .site-name {
    font-size: 1.3rem;
    font-weight: 600;
    color: $textColor;
    position: relative;
  }

  .links {
    padding-left: 1.5rem;
    box-sizing: border-box;
    background-color: white;
    white-space: nowrap;
    font-size: 0.9rem;
    position: absolute;
    right: $tocWidth;
    top: 0;
    bottom: 0;
    margin: auto;
    display: flex;
  }
}

@media (max-width: 1200px) {
  .navbar {
    .left-logo-part {
      position: relative;
      width: auto;
      text-align: left;
      display: inline-block;
      height: $navbarHeight;
      line-height: $navbarHeight;

      img {
        display: none;
      }

      & > a {
        padding: 0 2.5rem 0 0;
      }
    }

    .links {
      right: $navbar-horizontal-padding;
    }
  }
}

@media (max-width: $MQNarrow) {
  .navbar {
    .left-logo-part {
      & > a {
        padding-right: 1rem;
      }

      .search-box {
        margin-left: 0.5rem;
      }
    }
  }
}

@media (max-width: $MQMobile) {
  .navbar {
    padding-left: 4rem;

    .left-logo-part {
      width: 100%;

      & > a {
        width: auto;
        display: inline-block;
        border-right: none;
      }

      .search-box {
        right: 0;
        left: auto;

        input {
          left: auto;
          right: 0;

          &:focus {
            right: 0;
          }
        }
      }
    }

    .can-hide {
      display: none;
    }

    .links {
      padding-left: 1.5rem;
    }
  }
}
</style>
