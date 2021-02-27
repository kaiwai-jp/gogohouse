<template>
  <div class="container">
    <div>
      <h1 class="title">Welcome to<br />GoGoHouse</h1>
      <div class="m-50" v-if="!isSignin">
        <TwitterLogin jump="/home" />
      </div>
      <div v-if="isSignin">
        <div class="m-50">
          <nuxt-link to="/home">ホームへ</nuxt-link>
        </div>
        <div class="mb-50">
          <button class="button--brown" @click="signout">ログアウト</button>
          <button class="button--green" @click="reload">リロード</button>
        </div>
      </div>
      <TwitterPublish
        text="DL不要でTwitterフォロワーとワイワイお喋りできる音声チャットサービスができました！1ルーム20人まで。聴くだけも可。"
      />
      <ul class="feature">
        <li>暗号化でセキュリティは安心</li>
        <li>超低遅延で快適</li>
        <li>各設定を細かく管理</li>
        <li>アプリのインストール不要</li>
        <li>Twitter for Android内で使える</li>
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
.feature {
  margin-top: 50px;
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
