<template>
  <div class="container">
    <div v-if="room">
      <h1 class="title">{{ room.name }}</h1>
      <p class="description">{{ roomDescription }}</p>
      <h2 class="subtitle owner" v-show="roomDescription != 'loading...'">
        オーナー
      </h2>
      <NamePlate :uid="room.owner_id" class="mb-50" />
      <div v-if="!isSignin">
        <TwitterLogin class="mb-50" />
      </div>
      <div v-if="isSignin">
        <EnterRoom />
        <h2 class="subtitle mt-50" v-show="roomOnlineUsers.length">
          オンラインユーザー
        </h2>
        <OnlineUsers />
      </div>
      <DoorGuide class="m-50" />
    </div>
    <div v-if="!room">
      ルームが見つかりませんでした<br />
      <button class="button--grey mt-5" @click="goHome">ホームへ</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import NamePlate from '@/components/NamePlate.vue'
import OnlineUsers from '@/components/OnlineUsers.vue'
import EnterRoom from '@/components/EnterRoom.vue'
import TwitterLogin from '@/components/TwitterLogin.vue'
import DoorGuide from '@/components/DoorGuide.vue'

import roomMapper from '@/store/room'
import userMapper from '@/store/user'
import webrtcMapper from '@/store/webrtc'

export default Vue.extend({
  components: {
    NamePlate,
    OnlineUsers,
    EnterRoom,
    TwitterLogin,
    DoorGuide,
  },
  computed: {
    ...roomMapper.mapGetters(['room']),
    ...userMapper.mapGetters(['isSignin', 'roomOnlineUsers']),
    roomId(): String {
      return this.$route.params.id
    },
    roomDescription(): String {
      if (this.room.room_type === 'open') {
        return 'オープンルームです。誰でも入れます。'
      } else if (this.room.room_type === 'closed') {
        return 'クローズドルームです。メンバーだけが入れます。'
      }
      return 'loading...'
    },
  },
  async created() {
    this.GET_ROOM(this.roomId)
    await this.GET_USER()
    this.CLEAR_OFFERED_DB()
  },
  methods: {
    ...roomMapper.mapActions(['GET_ROOM']),
    ...userMapper.mapActions(['GET_USER', 'SIGN_IN_TWITTER', 'SIGN_OUT']),
    ...webrtcMapper.mapActions(['CLEAR_OFFERED_DB']),
    twitterSignin() {
      this.SIGN_IN_TWITTER()
        .then(() => {})
        .catch((err: any) => alert(err))

      return true
    },
    goHome() {
      this.$router.push(`/home`)
    },
  },
})
</script>

<style lang="scss" scoped>
.description {
  color: #526488;
  margin-bottom: 20px;
}
.owner {
  text-align: left;
}

.mt-5 {
  margin-top: 5px;
}
</style>
