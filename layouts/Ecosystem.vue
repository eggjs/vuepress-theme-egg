<template>
  <div class="module-layout">
    <Navbar />
    <Content />
    <Foot />
  </div>
</template>

<script>
  import Navbar from "../components/Navbar.vue";
  import Foot from '../components/Foot.vue';

  export default {
    components: {
      Navbar,
      Foot,
    }
  };
</script>

<style src="prismjs/themes/prism-tomorrow.css"></style>
<style src="../styles/theme.styl" lang="stylus"></style>

<style lang="stylus">
  .module-layout
    .content
      text-align: center;
      max-width: 1000px;

    h1
      position: relative;
      font-size: 1.5rem;
      height: 1.75rem;
      line-height: 1.75rem;

      &>a
        display: none;

      &::after
        content: '';
        position: absolute;
        width: 3.5rem;
        height: 2px;
        background-color: #16D98E;
        bottom: -1rem;
        left: 0;
        right: 0;
        margin: auto;

    .ecosystem-list
      padding-top: 0.38rem;

    .ecosystem-item
      position: relative;
      width: 16.44rem;
      height: 11rem;
      padding: 1rem 1.5rem;
      box-sizing: border-box;
      box-shadow: 0 1.06rem 2.38rem -1.25rem #CED9D5;
      display: inline-block;
      overflow: hidden;
      text-align: left;
      margin: 1.5rem;
      transition: box-shadow 0.3s;

      &:hover
        box-shadow: 0 1.06rem 2.38rem -0.5rem #CED9D5;

      &>h2
        font-size: 1rem;
        border-bottom: none;
        height: 1.5rem;
        line-height: 1.5rem;
        margin: 0;

      &>ul
        height: 6rem;
        overflow: hidden;

      ul
        padding-left: 1.25rem;
        color: #698C7F;
        margin: 0;

      li
        font-size: 0.75rem;
        text-align: justify;
        height: 1.25rem;
        line-height: 1.25rem;
        margin: 0.25rem 0;

        a
          color: #698C7F;

          &:hover
            color: #16D98E;
</style>
