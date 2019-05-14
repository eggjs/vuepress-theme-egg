<template>
  <Sticker tag="aside"
           v-bind="$attrs"
           class="sidebar">
    <div class="sidebar-wrap">
      <NavLinks />
      <slot name="top" />
      <ul class="sidebar-links"
          v-if="items.length">
        <li v-for="(item, i) in items"
            :key="`${item.title}_${i}`">
          <SidebarItem :index="i"
                       :item="item"
                       @toggle="toggleGroup(i)" />
        </li>
      </ul>
      <slot name="bottom" />
    </div>
  </Sticker>
</template>

<script>
  import Sticker from './Sticker.vue';
  import SidebarItem from './SidebarItem.vue';
  import NavLinks from "./NavLinks.vue";
  import { isActive } from "../util";

  export default {
    components: { SidebarItem, NavLinks, Sticker },
    props: ["items"],
  };
</script>

<style lang="stylus">
  @require '../styles/config';

  .sidebar
    font-size: 15px;
    background-color: #fff;
    width: $sidebarWidth;
    position: fixed;
    z-index: 10;
    margin: 0;
    height: 100vh;
    left: 0;
    top: 0;
    box-sizing: border-box;
    overflow-y: auto;
    padding-top: $sidebarTop + $navbarHeight;

    .sidebar-wrap
      min-height: 100%;
      border-right: 1px solid $borderColor;
      padding-bottom: $sidebarTop;
      box-sizing: border-box;

    ul
      padding: 0;
      margin: 0;
      list-style-type: none;

    a
      display: block;

    .nav-links
      display: none;
      border-bottom: 1px solid $borderColor;
      padding: 0.5rem 0 0.75rem 0;

      a
        font-weight: 600;
        font-size: 1rem;

      .nav-item, .repo-link
        display: block;
        line-height: 1.25rem;
        font-size: 1.1em;
        padding: 0.2rem 0 0.2rem 1.18rem;

  @media (max-width: $MQMobile)
    .sidebar
      .nav-links
        display: block;
</style>
