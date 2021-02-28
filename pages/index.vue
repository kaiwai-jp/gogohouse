<template>
  <div class="container">
    <div>
      <div class="gogo-area">
        <h1 class="title gogo-title">フォロワーと<br />音声トークしよう</h1>
      </div>
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
        class="mt-50"
        text="DL不要でTwitterフォロワーとワイワイお喋りできる音声トークサービスができました！1ルーム20人まで。聴くだけも可。"
      />
      <ul class="feature">
        <li>アプリのインストール不要</li>
        <li>暗号化で安心</li>
        <li>音声が超低遅延で快適</li>
        <li>1ルーム20人まで</li>
      </ul>
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

export default Vue.extend({
  components: { TwitterLogin, TwitterPublish },
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
  color: white;
  padding-top: 20px;
  padding-left: 20px;
  text-align: left;
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
  color: black;
  font-weight: 700;
  text-decoration-color: red;
  text-decoration-thickness: 4px;
}

.feature {
  margin-top: 20px;
  margin-bottom: 10px;
  list-style-type: none;
  text-align: left;
  color: $color1;
}

.feature li::before {
  color: black;
  content: '☑';
  margin-right: 5px;
}
</style>
