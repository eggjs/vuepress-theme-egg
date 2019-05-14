<template>
  <div class="global-foot">
    <div class="friend-links">
      <div class="friend-list-wrapper">
        <div class="friend-list" v-for="(item, index) in config.friendList" :key="index">
          <div class="friend-list-align">
            <div class="friend-list-title">{{ item.title }}</div>

            <a
              class="friend-list-item"
              v-for="(info, index) in item.list"
              :key="index"
              :href="info.url"
              target="_blank"
            >{{ info.name }}</a>

            <div class="friend-qrcode" v-if="item.qrcode">
              <img :src="$withBase(item.qrcode)" :alt="item.name">
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="copyright">
      <span class="span">
        <template v-for="(item, index) in config.copyright">
          <a v-if="item.url" :href="item.url" :key="index">{{ item.text }}</a>
          <span v-else :key="index">{{ item.text }}</span>
        </template>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    config() {
      return this.$themeLocaleConfig.foot;
    }
  }
};
</script>

<style lang="stylus">
@require '../styles/config';

.global-foot {
  position: relative;

  .friend-links {
    background: #06080A;
    min-height: $friendListHeight;
    color: rgba(255, 255, 255, 0.65);
    border-bottom: 1px solid #2b2b2b;
    box-sizing: border-box;

    * {
      color: rgba(255, 255, 255, 0.65);
    }

    .friend-list-wrapper {
      max-width: 80rem;
      display: flex;
      margin: auto;
      padding-top: 5.38rem;
    }

    .friend-list {
      flex: 1;
      text-align: center;
    }

    .friend-list-align {
      display: inline-block;
      text-align: left;
    }

    .friend-list-item {
      display: block;
      font-size: 0.88rem;
      line-height: 1.38rem;
      margin: 0.75rem 0;

      &:hover {
        color: #fff;
      }
    }

    .friend-list-title {
      font-size: 1rem;
      color: #FFF;
      line-height: 1.5rem;
      padding-bottom: 0.75rem;
      font-weight: bold;
    }

    .friend-qrcode {
      width: 11.63rem;
      height: 11.31rem;
      background: #fff;
      margin: 0.75rem auto;
      border-radius: 0.25rem;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .copyright {
    display: flex;
    min-height: $copyrightHeight;
    align-items: center;
    justify-content: center;
    background: #06080A;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.65);
    padding: 1rem 0;
    box-sizing: border-box;

    span {
      margin: 0 0.5rem;
    }

    * {
      color: rgba(255, 255, 255, 0.65);
    }
  }
}

@media (max-width: $MQMobile) {
  .global-foot {
    .friend-links {
      .friend-list-wrapper {
        display: block;
        padding-top: 2rem;

        .friend-list {
          display: block;
          margin-bottom: 2rem;
        }

        .friend-list-align {
          width: 21.88rem;
          text-align: center;
        }
      }
    }
  }
}
</style>

