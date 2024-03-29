<template>
  <div class="container">
    <div>
      <h1 class="title">話してみたいフォロワーをつなぎます</h1>
      <div class="m-50" v-if="!isSignin">
        <TwitterLogin text="今すぐ話してみたい人リストを作る（無料）" />
        <div class="m-50 disalbed">
          <h2 class="subtitle bt-1">話してみたい人</h2>
          <input
            class="add-twitter"
            placeholder="@Twitterアカウント"
            disabled
          />
          <button class="button--mini" disabled>追加</button>
        </div>
      </div>
      <div v-if="isSignin" class="m-50">
        <ViewWishList class="wishlist" />
        <div class="m-50">
          <input
            class="add-twitter"
            v-model="addTwitter"
            placeholder="@Twitterアカウント"
          />
          <button @click="clickAddWishListByTwitter" class="button--mini">
            追加
          </button>
        </div>
        <ViewMatchList class="wishlist" />
      </div>
      <div class="impression">
        <h2 class="subtitle">仕組み</h2>
        <p>
          お互いに、話してみたい人のリストに入ると、両思いであることが通知されます。このリストは完全非公開です。
        </p>
      </div>
      <div class="impression twitter">
        <p>
          このページのURLをTwitterにシェアして、それとなくフォロワーに知らせよう！
          <TwitterPublish
            class="twitter-button"
            text="声で話してみたいTwitterフォロワーをつなぎます！お互いに、話してみたい人のリストに入ると、両思いであることが通知されます。もちろん無料。"
          />
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import userMapper from '@/store/user'
import warpMapper from '@/store/warp'
import { addWishlistByTwitter } from '@/service/wishlistAPI'

import ViewWishList from '@/components/ViewWishList.vue'
import ViewMatchList from '@/components/ViewMatchList.vue'
import TwitterLogin from '@/components/TwitterLogin.vue'
import TwitterPublish from '@/components/TwitterPublish.vue'

interface DataType {
  addTwitter: String
}

export default Vue.extend({
  components: { ViewWishList, ViewMatchList, TwitterLogin, TwitterPublish },
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
.disalbed {
  opacity: 0.8;
}

.wishlist {
  text-align: left;
}

.add-twitter {
  color: $color3;
  height: 27px;
  margin-right: 10px;
}

.impression {
  margin: 20px auto;
  width: calc(100vw - 20px);
  max-width: 380px;
  padding: 10px;
  background-color: white;
  border-radius: 10px;
  border: solid 1px $color6;
  text-align: left;
}

.impression p {
  padding: 0px 10px 10px 10px;
}

.twitter {
  padding-bottom: 0;
}

.twitter-button {
  margin-top: 5px;
}
</style>
