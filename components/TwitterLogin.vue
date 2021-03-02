<template>
  <div class="main">
    <div class="agree-area">
      <div class="agree-checkbox">
        <a href="/term.html" target="_blank">利用規約</a>に
        <input type="checkbox" v-model="agree" id="checkbox" />
        <label for="checkbox">同意する</label>
      </div>
      <a class="button--twitter" @click="twitterSignin">
        <img
          alt="Twitterアイコン"
          src="/twitter_logo.png"
          class="twitter-logo"
        />twitter連携してログイン
      </a>
      <div class="notice">※勝手にツイートすることはありません</div>
    </div>
    <div class="ios-notice">※iPhone/iPadの人はブラウザからどうぞ</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import userMapper from '@/store/user'
import warpMapper from '@/store/warp'

interface DataType {
  agree: boolean
}

export default Vue.extend({
  props: { jump: { default: '', type: String } },
  data(): DataType {
    return {
      agree: false,
    }
  },
  methods: {
    ...userMapper.mapActions(['SIGN_IN_TWITTER', 'SIGN_OUT']),
    ...warpMapper.mapActions(['OPEN_ALERT_DIALOG']),
    twitterSignin() {
      if (!this.agree) {
        this.OPEN_ALERT_DIALOG(
          '利用規約を読んで同意するにチェックをしてください'
        )
        return
      }
      this.SIGN_IN_TWITTER()
        .then(() => {
          if (this.jump) {
            this.$router.push(this.jump)
          }
        })
        .catch((err) => this.OPEN_ALERT_DIALOG(err))
    },
  },
})
</script>

<style lang="scss" scoped>
.main {
  position: relative;
  display: inline-block;
}

.agree-area {
  padding: 20px 45px;
  background-color: white;
  box-shadow: 10px 10px 6px -6px #777;
}

.agree-checkbox {
  margin-bottom: 20px;
}

.agree-checkbox label:before {
  content: '';
  width: 20px;
  height: 20px;
  display: inline-block;
  position: absolute;
  right: 60px;
  background-color: #fff;
  box-shadow: inset 1px 1px 1px 0px #000;
  border-radius: 4px 4px 4px 4px;
}
.agree-checkbox input[type='checkbox'] {
  display: none;
}
.agree-checkbox input[type='checkbox']:checked + label:before {
  content: '\2713';
  font-size: 18px;
  color: #000000;
  background-color: #84b5ff;
}

a {
  color: #000000;
}

.notice {
  margin-top: 10px;
  color: $color3;
  font-size: 10px;
}

.twitter-logo {
  width: 20px;
  height: 18px;
  margin-right: 5px;
}

.button--twitter {
  display: inline-block;
  vertical-align: top;
  border-radius: 4px;
  background-color: #1da0f1;
  color: #ffffff;
  text-decoration: none;
  padding: 10px 20px;
  font-weight: 600;
  cursor: pointer;
}

.ios-notice {
  margin-top: 20px;
  font-weight: 600;
  border-bottom: solid 1px red;
}
</style>
