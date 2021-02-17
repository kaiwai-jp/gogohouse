<template>
  <div class="container">
    <div>
      <h1 class="title">Welcome to<br />GoGoHouse</h1>
      <div class="links" v-if="!isSignin">
        <button class="button--grey" @click="twitterSignin">
          twitter連携してログイン
        </button>
      </div>
      <div v-if="isSignin">
        <div class="m-50">
          <nuxt-link to="/home">ホームへ</nuxt-link>
        </div>
        <button class="button--grey" @click="signout">ログアウト</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import roomMapper from '@/store/room'
import userMapper from '@/store/user'

export default Vue.extend({
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
    twitterSignin(): void {
      this.SIGN_IN_TWITTER()
        .then(() => this.$router.push(`/home`))
        .catch((err) => alert(err))
    },
    signout(): void {
      this.SIGN_OUT()
    },
  },
})
</script>

<style lang="scss" scoped></style>
