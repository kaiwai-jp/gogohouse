<template>
  <div class="container">
    <div>
      <h1 class="title">話したい人リスト</h1>
      <div class="m-50" v-if="!isSignin">
        <TwitterLogin jump="/home" />
      </div>
      <div v-if="isSignin">
        <div>
          <input
            class="add-twitter"
            v-model="addTwitter"
            placeholder="@Twitterアカウント"
          />
          <button @click="clickAddWishListByTwitter" class="button--mini">
            追加
          </button>
        </div>
      </div>
      <TwitterPublish
        class="mt-20 mb-50"
        text="会話したいフォロワーリストでマッチングしたらおしゃべりしましょう♪"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import userMapper from '@/store/user'
import warpMapper from '@/store/warp'
import { addWishlistByTwitter } from '@/service/wishlistAPI'

import TwitterLogin from '@/components/TwitterLogin.vue'
import TwitterPublish from '@/components/TwitterPublish.vue'

interface DataType {
  addTwitter: String
}

export default Vue.extend({
  components: { TwitterLogin, TwitterPublish },
  data(): DataType {
    return {
      addTwitter: '',
    }
  },
  computed: {
    ...userMapper.mapGetters(['me', 'isSignin']),
  },
  created() {
    this.GET_USER()
  },
  methods: {
    ...userMapper.mapActions(['GET_USER', 'SIGN_OUT']),
    ...warpMapper.mapActions(['OPEN_ALERT_DIALOG']),
    signout() {
      this.SIGN_OUT()
    },
    reload() {
      location.reload(true)
    },
    clickAddWishListByTwitter() {
      const screenName = this.addTwitter.trim()
      if (!screenName.match(/@[0-9a-zA-Z_]{1,15}/)) {
        this.OPEN_ALERT_DIALOG('@で始まるTwitterアカウントを入力してください')
        return
      }
      addWishlistByTwitter(this.me.uid, screenName)
        .then(() => {
          this.addTwitter = ''
        })
        .catch(() => {
          this.OPEN_ALERT_DIALOG('Twitterユーザーが見つかりませんでした')
        })
    },
  },
})
</script>

<style lang="scss" scoped>
.add-twitter {
  color: $color3;
  height: 27px;
  margin-right: 10px;
}
</style>
