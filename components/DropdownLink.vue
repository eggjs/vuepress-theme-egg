<template>
  <div
    class="dropdown-wrapper"
    :class="{ open, 'dropdown-horizontal': item.horizontal, active: !!activeLink }"
  >
    <a class="dropdown-title" @click="toggle">
      <span class="title">{{ item.text }}</span>
      <span class="arrow" :class="open ? 'down' : 'right'"></span>
    </a>

    <DropdownTransition>
      <ul class="nav-dropdown" v-show="open">
        <li
          class="dropdown-item"
          :class="{ 'dropdown-item-single': !subItem.items || !subItem.items.length }"
          :key="subItem.link || index"
          v-for="(subItem, index) in item.items"
        >
          <h4>
            <span v-if="!subItem.link">{{ subItem.text }}</span>
            <NavLink v-else :item="subItem"/>
          </h4>

          <ul class="dropdown-subitem-wrapper" v-if="subItem.type === 'links'">
            <li
              class="dropdown-subitem"
              :key="childSubItem.link"
              v-for="childSubItem in subItem.items"
            >
              <NavLink :item="childSubItem" :active-class="realActiveClass(childSubItem)"/>
            </li>
          </ul>
        </li>
      </ul>
    </DropdownTransition>
  </div>
</template>

<script>
import NavLink from "./NavLink.vue";
import DropdownTransition from "./DropdownTransition.vue";

export default {
  components: { NavLink, DropdownTransition },

  data() {
    return {
      open: false,
      activeLink: "",
      exactLink: false
    };
  },

  props: {
    item: {
      required: true
    }
  },

  watch: {
    $route() {
      this.exactLink = false;
      this.activeLink = "";
      this.checkActive([this.item]);
    }
  },

  mounted() {
    this.checkActive([this.item]);
  },

  methods: {
    toggle() {
      this.open = !this.open;
    },

    checkActive(items) {
      // find active link
      items.forEach(item => {
        if (
          this.exactLink ||
          this.$route.path === "/" ||
          this.$route.path === this.$localePath ||
          item.addr
        )
          return;
        if (item.items) this.checkActive(item.items);

        if (!item.link) return;
        const realLink = item.link.split(/#|\?/)[0];

        if (realLink === this.$route.path) {
          this.activeLink = item.link;
          this.exactLink = true;
        } else if (
          realLink.startsWith(this.$route.path) ||
          this.$route.path.startsWith(realLink)
        ) {
          if (this.activeLink && realLink.length < this.activeLink.length) {
            return;
          }

          this.activeLink = item.link;
        }
      });
    },

    realActiveClass(item) {
      // allow only one active class in child item
      return this.activeLink === item.link
        ? "router-link-active"
        : "router-link-active-like";
    }
  }
};
</script>

<style lang="stylus">
.dropdown-wrapper {
  position: relative;
  cursor: pointer;
  height: 100%;

  .dropdown-title {
    display: block;

    &:hover {
      border-color: transparent;
    }

    .arrow {
      vertical-align: middle;
      margin-top: -1px;
      margin-left: 0.4rem;
    }
  }

  .dropdown-item {
    color: inherit;
    line-height: 1.7rem;

    h4 {
      position: relative;
      margin: 0.1rem 0 0;
      padding: 0.2rem 1.5rem 0.2rem 1.25rem;

      & > a {
        position: static;
      }
    }

    .dropdown-subitem-wrapper {
      padding: 0;
      list-style: none;

      .dropdown-subitem {
        font-size: 0.9em;
      }
    }

    .dropdown-subitem-wrapper a {
      line-height: 1.7rem;
      border-bottom: none;
      font-weight: 400;
      margin-bottom: 0;
      padding: 0 1.5rem 0 1.25rem;
      color: #444;
    }

    a {
      position: relative;
      display: block;

      &:hover {
        color: $accentColor;
      }

      &.router-link-active {
        color: $accentColor;
      }
    }

    &:first-child h4 {
      margin-top: 0;
    }
  }
}

@media (max-width: $MQMobile) {
  .dropdown-wrapper {
    &.open .dropdown-title {
      margin-bottom: 0.5rem;
    }

    .nav-dropdown {
      transition: height 0.1s ease-out;
      overflow: hidden;

      .dropdown-item {
        h4 {
          border-top: 0;
          margin-top: 0;
          padding-top: 0;
        }

        h4, & > a {
          line-height: 2rem;
        }

        .dropdown-subitem {
          font-size: 14px;
          padding-left: 1rem;
        }
      }
    }

    .dropdown-title {
      position: relative;

      .arrow {
        position: absolute;
        right: 100%;
      }
    }

    .dropdown-subitem-wrapper {
      a {
        font-size: 0.88rem !important;
      }
    }
  }
}

@media (min-width: $MQMobile) {
  .dropdown-wrapper.dropdown-horizontal {
    .nav-dropdown {
      right: 0;
      transform: translateX(20%);
      left: auto;
      width: 42rem;

      .dropdown-item {
        float: left;
        list-style-type: none;
        height: 14rem;
        width: 25%;

        h4 {
          margin-bottom: 0.5rem;
        }
      }
    }
  }

  .nav-item:hover .nav-dropdown {
    // override the inline style.
    display: block !important;
  }

  .dropdown-wrapper {
    &:hover .nav-dropdown {
      // override the inline style.
      display: block !important;
    }

    .dropdown-title .arrow {
      // make the arrow always down at desktop
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 6px solid $arrowBgColor;
      border-bottom: 0;
    }

    .nav-dropdown {
      display: none;
      // Avoid height shaked by clicking
      height: auto !important;
      box-sizing: border-box;
      max-height: calc(100vh - 2.7rem);
      overflow-y: auto;
      position: absolute;
      top: 100%;
      left: 0;
      margin: 0;
      background-color: #fff;
      padding: 0.6rem 0;
      box-shadow: 0 0.68rem 0.69rem -0.2rem rgba(0, 0, 0, 0.15);
      text-align: left;
      white-space: nowrap;
    }
  }
}
</style>
