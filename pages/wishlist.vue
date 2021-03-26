<template>
  <div class="container">
    <div>
      <h1 class="title">話したい人リスト</h1>
      <div class="m-50" v-if="!isSignin">
        <TwitterLogin jump="/home" />
      </div>
      <div v-if="isSignin" class="mb-50">
        <ViewWishList class="wishlist" />
        <div class="mt-50">
          <input
            class="add-twitter"
            v-model="addTwitter"
            placeholder="@Twitterアカウント"
          />
          <button @click="clickAddWishListByTwitter" class="button--mini">
            追加
          </button>
          <ViewMatchList class="wishlist" />
        </div>
      </div>
      <div class="impression">
        <h2 class="subtitle">マッチング</h2>
        <p>
          お互いに話したい人のリスト入りすると、両想いの人のリストに表示されます。それまでこのリストは完全非公開です。
        </p>
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
</style>
