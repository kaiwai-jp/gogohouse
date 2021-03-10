<template>
  <div class="container">
    <div>
      <div class="gogo-area">
        <h1 class="gogo-title">ゆるく音声トークしよう</h1>
      </div>
      <div class="picture-copyright">(C)テラサワマスミ</div>
      <div class="m-50" v-if="!isSignin">
        <TwitterLogin jump="/home" />
      </div>
      <div v-if="isSignin">
        <div class="home-area">
          <nuxt-link to="/home" class="to-home">
            <img src="/home.png" alt="ホーム" class="home-big" /><br />
            ホームへ
          </nuxt-link>
        </div>
        <button class="button--brown" @click="signout">ログアウト</button>
        <button class="button--green" @click="reload">リロード</button>
      </div>

      <TwitterPublish
        class="mt-20 mb-50"
        text="GoGoHouseはTwitter連携だけで参加できる無料の音声トークサービスです。聴くだけも可。"
      />
      <HowToUse />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import roomMapper from '@/store/room'
import userMapper from '@/store/user'
import warpMapper from '@/store/warp'

import TwitterLogin from '@/components/TwitterLogin.vue'
import TwitterPublish from '@/components/TwitterPublish.vue'
import HowToUse from '@/components/HowToUse.vue'

export default Vue.extend({
  components: { TwitterLogin, TwitterPublish, HowToUse },
  computed: {
    ...roomMapper.mapGetters(['room']),
    ...userMapper.mapGetters(['me', 'isSignin']),
    roomId(): string {
      return this.$route.params.room
    },
  },
  created() {
    this.GET_USER()
  },
  methods: {
    ...roomMapper.mapActions(['GET_ROOM']),
    ...userMapper.mapActions(['GET_USER', 'SIGN_IN_TWITTER', 'SIGN_OUT']),
    ...warpMapper.mapActions(['OPEN_ALERT_DIALOG']),
    twitterSignin() {
      this.SIGN_IN_TWITTER()
        .then(() => this.$router.push(`/home`))
        .catch((err) => this.OPEN_ALERT_DIALOG(err))
    },
    signout() {
      this.SIGN_OUT()
    },
    reload() {
      location.reload(true)
    },
  },
})
</script>

<style lang="scss" scoped>
.gogo-area {
  background-image: url('/gogo.jpg');
  background-size: cover;
  width: 100vw;
  max-width: 380px;
  height: 240px;
}

.gogo-title {
  font-size: 26px;
  color: #5997da;
  padding-top: 10px;
  padding-left: 15px;
  text-align: left;
}

.picture-copyright {
  text-align: right;
  color: $color2;
}

.home-area {
  margin-top: 20px;
  margin-bottom: 20px;
}

.home-big {
  width: 48px;
  height: 48px;
}

.to-home {
  text-decoration: none;
}
</style>
