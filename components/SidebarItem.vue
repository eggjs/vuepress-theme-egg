<template>
  <section class="sidebar-item">
    <component class="sidebar-item-heading"
               :class="{ 'active': selfActive }"
               :is="item.path ? 'router-link' : 'a'"
               :to="item.path ? { path: item.path } : undefined"
               @click="collapse">
      <i class="arrow"
         :class="isOpen ? 'down' : 'right'"
         v-if="showArrow"></i>
      {{ item.title }}
    </component>

    <DropdownTransition v-if="isGroup">
      <ul ref="items"
          class="sidebar-group-items"
          v-if="isOpen">
        <li v-for="(child, index) in item.children">
          <router-link :class="{ 'active': childActiveIndex === index }"
                       :to="{ path: child.path }">{{ child.title }}</router-link>
        </li>
      </ul>
    </DropdownTransition>
  </section>
</template>

<script>
  import DropdownTransition from './DropdownTransition.vue';
  import { isActive } from "../util";

  export default {
    components: {
      DropdownTransition,
    },

    data() {
      return {
        selfActive: false,
        childActiveIndex: -1,
        isOpen: true,
      }
    },

    props: ['item', 'index'],

    computed: {
      isGroup() {
        return this.item.type === 'group';
      },

      showArrow() {
        return this.isGroup;
      },
    },

    watch: {
      $route() {
        this.updateActiveIndex();
      }
    },

    methods: {
      collapse() {
        if (this.showArrow) {
          this.isOpen = !this.isOpen;
        }
      },

      updateActiveIndex() {
        if (this.item.path) {
          this.selfActive = isActive(this.$route, this.item.path);
        }

        if (this.isGroup) {
          this.childActiveIndex = this.item.children.findIndex(child => isActive(this.$route, child.path));
        }
      }
    },

    mounted() {
      this.updateActiveIndex();
    }
  }
</script>

<style lang="stylus">
  @require '../styles/config';

  .sidebar-item
    margin-right: -1px;

    .sidebar-item-heading
      position: relative;
      font-size: 1rem;
      color: #0D261D;
      line-height: 2.5rem;
      box-sizing: border-box;
      padding-left: $sidebarIndent;
      padding-right: 1rem;
      display: block;
      cursor: pointer;

    .sidebar-item-heading,
    .sidebar-group-items a
      &.active
        border-right: 2px solid #00B362;

      &:hover, &.active
        background: rgba(60, 241, 173, 0.15);

    .arrow
      position: absolute;
      left: $sidebarIndent - 1rem;
      top: 0;
      bottom: 0;
      margin: auto;

    .sidebar-group-items
      transition: height 0.1s ease-out;
      overflow: hidden;
      line-height: 2rem;
      font-size: 0.88rem;

      a
        color: #315947;
        padding-left: $sidebarIndent + 1rem;
        padding-right: 1rem;

  @media (max-width: $MQMobile)
    .sidebar-item
      margin-left: 1.5rem - $sidebarIndent;
</style>
