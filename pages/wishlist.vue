<template>
  <div class="vuetify-container">
    <v-card elevation="1">
      <v-card-text>
        <h2 class="subtitle">話してみたいフォロワーをつなぎます</h2>
        <p>このページのURLをTwitterにシェア！</p>
        <TwitterPublish
          class="twitter-button"
          text="声で話してみたいTwitterフォロワーをつなぎます！お互いに、話してみたい人のリストに入ると、両思いであることが通知されます。"
        />
      </v-card-text>
    </v-card>
    <v-card elevation="1" class="mt-20 mb-50">
      <v-card-text>
        <h2 class="subtitle">仕組み</h2>
        <p>
          お互いに、話してみたい人のリストに入ると、両思いであることが通知されます。このリストは完全非公開です。
        </p>
      </v-card-text>
    </v-card>
    <div class="center m-50" v-if="!isSignin">
      <TwitterLogin text="今すぐ話してみたい人リストを作る（無料）" />
    </div>
    <div v-if="isSignin" class="m-50">
      <v-tabs v-model="tab">
        <v-tab>話してみたい人{{ wishListCountString }}</v-tab>
        <v-tab>両思いの人{{ matchListCountString }}</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab" background-color="transparent">
        <v-tab-item>
          <v-text-field
            v-model="addTwitter"
            placeholder="@Twitterアカウント"
            list="friends"
            @input="changeInput"
          >
            <template v-slot:append-outer>
              <v-btn @click="clickAddWishListByTwitter">追加</v-btn>
            </template>
          </v-text-field>
          <datalist id="friends">
            <option
              v-for="data in userPrivates.friends"
              :key="data.twitter"
              :label="data.name + ' ' + data.twitter"
            >
              {{ data.twitter }}
            </option>
          </datalist>

          <ViewWishList class="wishlist m-50" />
        </v-tab-item>
        <v-tab-item>
          <ViewMatchList class="wishlist" />
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import userMapper from '@/store/user'
import warpMapper from '@/store/warp'
import wishlistMapper from '@/store/wishlist'
import { addWishlistByTwitter, getFriendsData } from '@/service/wishlistAPI'

import ViewWishList from '@/components/ViewWishList.vue'
import ViewMatchList from '@/components/ViewMatchList.vue'
import TwitterLogin from '@/components/TwitterLogin.vue'
import TwitterPublish from '@/components/TwitterPublish.vue'

interface DataType {
  tab: String | null
  addTwitter: String
  onceFlag: Boolean
}

export default Vue.extend({
  components: { ViewWishList, ViewMatchList, TwitterLogin, TwitterPublish },
  data(): DataType {
    return {
      tab: null,
      addTwitter: '',
      onceFlag: true,
    }
  },
  computed: {
    ...userMapper.mapGetters(['me', 'isSignin']),
    ...wishlistMapper.mapGetters(['userPrivates']),
    wishListCountString(): String {
      let wishListLength = 0
      let reservedWishListLength = 0
      if (this.userPrivates.wishlist) {
        wishListLength = this.userPrivates.wishlist.length
      }
      if (this.userPrivates.reserved_wishlist) {
        reservedWishListLength = this.userPrivates.reserved_wishlist.length
      }
      const total = wishListLength + reservedWishListLength
      if (total === 0) return ''
      return '(' + total + ')'
    },
    matchListCountString(): String {
      let matchListLength = 0
      if (this.userPrivates.matchlist) {
        matchListLength = this.userPrivates.matchlist.length
      }
      if (matchListLength === 0) return ''
      return '(' + matchListLength + ')'
    },
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
    changeInput() {
      if (this.onceFlag) {
        this.onceFlag = false
        getFriendsData()
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.vuetify-container {
  max-width: 767px;
  margin: 0 auto;
}

.center {
  text-align: center;
}

.wishlist {
  text-align: left;
  padding-left: 10px;
  padding-right: 10px;
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
