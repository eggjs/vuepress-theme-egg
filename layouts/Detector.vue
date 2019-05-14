<template></template>

<script>
export default {
  mounted() {
    const lang = navigator.language || navigator.languages[0];
    const to = lang.toLowerCase() === "zh-cn" ? "zh-CN/" : "en-US/";
    location.href = location.href + to;
  }
};
</script>

<style lang="stylus">
</style>
