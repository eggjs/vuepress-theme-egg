<template>
  <main class="home"
        aria-labelledby="main-title">
    <header class="hero"
            :style="heroStyle">
      <h1>{{ data.heroText }}</h1>
      <h2>{{ data.tagline }}</h2>
      <router-link class="action-button"
                   :to="{ path: data.actionLink }"
                   :title="data.actionText">
        {{ data.actionText }}
      </router-link>
    </header>

    <div class="features">
      <div class="feature"
           v-for="(item, index) in data.features"
           :key="index">
        <div class="feature-icon">
          <img :src="$withBase(item.icon)"
               alt="">
        </div>
        <h2>{{ item.title }}</h2>
        <p>{{ item.details }}</p>
      </div>
    </div>

    <div class="whosusing"
         v-if="data.whosusing.list && data.whosusing.list.length">
      <img class="icon"
           :src="$withBase(data.whosusing.icon)">

      <ul class="using-list">
        <li v-for="(user, index) in data.whosusing.list"
            :key="index">
          <div class="info-wrapper">
            <div class="avatar">
              <img :src="user.avatar">
            </div>

            <p class="comment">{{ user.comment }}</p>
            <p class="user-name">{{ user.name }}</p>
          </div>
        </li>
      </ul>

      <img :src="$withBase('/img_2/background.png')"
           class="background-icon">
    </div>
  </main>
</template>

<script>
  export default {
    computed: {
      heroStyle() {
        return this.data.banner
          ? { backgroundImage: `url(${this.$withBase(this.data.banner)})` }
          : { backgroundColor: '#000' };
      },

      data() {
        return this.$page.frontmatter
      },
    }
  }
</script>

<style lang="stylus">
  @require '../styles/config';

  .home
    padding: $navbarHeight 0 0;
    margin: 0 auto;
    display: block;
    font-size: 0.88rem;

    .hero
      text-align: center;
      background: #fff no-repeat center center;
      background-size: cover;
      color: #fff;
      overflow: hidden;

      h1
        font-size: 2rem;
        letter-spacing: 0.13rem;
        text-align: center;
        line-height: 2rem;
        margin: 3rem 0 1rem 0;

      h2
        font-size: 2rem;
        text-align: center;
        margin: 1rem 0 2rem 0;
        line-height: 2.25rem;
        border: none;
        font-weight: 200;
        padding: 0 1rem;

      .description
        max-width: 35rem;
        font-size: 1.6rem;
        line-height: 1.3;
        color: lighten($textColor, 40%);

      .action-button
        display: flex;
        margin: auto;
        width: 12.13rem;
        height: 2.38rem;
        font-size: 1rem;
        align-items: center;
        justify-content: center;
        color: #fff;
        background-color: $accentColor;
        border-radius: 0.25rem;
        margin: 2.94rem auto 3.06rem;
        transition: background-color 0.3s;
        border: 1px solid transparent;
        border-bottom-color: #0aea85;

        &:hover
          background-color: lighten($accentColor, 10%);

    .features
      padding: 4.5rem 0 9.88rem;
      margin: auto;
      text-align: center;
      color: #62726B;

    .feature
      width: 11.88rem + 4.13rem;
      padding: 0 4.13rem / 2;
      display: inline-block;
      vertical-align: top;
      margin-bottom: 1rem;
      box-sizing: border-box;

      .feature-icon
        height: 8.5rem;
        display: flex;
        align-items: center;
        justify-content: center;

        img
          transform: scale(0.5);

      h2
        font-size: 1.25rem;
        line-height: 2rem;
        color: #0D261B;
        margin: 1.5rem 0 1rem;
        border-bottom: none;
        padding-bottom: 0;

      p
        color: #315947;
        text-align: justify;
        line-height: 1.5rem;
        width: 11.88rem;
        margin: auto;

    .whosusing
      position: relative;
      background: #F8F8F8;
      border: 1px solid transparent;

      .icon
        display: block;
        margin: 3.38rem auto 2.75rem;
        width: 19.81rem;

      .using-list
        position: relative;
        max-width: 58.25rem;
        margin: 0 auto 7.75rem;
        padding: 0;
        z-index: 2;

        li
          list-style-type: none;
          margin: 0 1rem;
          background: #fff;
          margin-bottom: 1rem;
          overflow: hidden;
          padding: 1.5rem 1rem;
          border-radius: 0.5rem;
          box-shadow: 0 0 2rem rgba(0, 0, 0, 0.1);

        .avatar
          position: absolute;
          width: 4rem;
          height: 4rem;
          border-radius: 100%;
          overflow: hidden;
          border: 1px solid #16D98E;
          box-sizing: border-box;
          left: 0;

          img
            width: 100%;
            height: 100%;

        .info-wrapper
          position: relative;
          max-width: 43.13rem;
          min-height: 4rem;
          padding-left: 6rem;
          overflow: hidden;
          margin: auto;

        .comment
          margin: 0.69rem 0 0.5rem;
          line-height: 1.13rem;
          color: #0D261B;

        .user-name
          margin: 0;
          line-height: 1rem;
          font-size: 0.75rem;
          color: #698C7C;

    .background-icon
      position: absolute;
      right: 0;
      bottom: -3.13rem;
      z-index: 1;

  @media (max-width: 1150px)
    .home
      .features
        max-width: 700px;
</style>
