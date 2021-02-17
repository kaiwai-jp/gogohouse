<template>
  <div class="container">
    <div v-if="room">
      <h1 class="title">{{ room.name }}</h1>
      <p class="description">{{ roomDescription }}</p>
      <h2 class="subtitle owner">オーナー</h2>
      <NamePlate :uid="room.owner_id" class="mb-50" />
      <div v-if="!isSignin">
        <p></p>
        <button class="button--grey" @click="twitterSignin">
          twitter連携してログイン
        </button>
        <button class="button--grey mt-5" @click="home">ホームへ</button>
      </div>
      <div v-if="isSignin">
        <p></p>
        <div v-if="!waiting">
          <button class="button--grey" @click="enterRoom" v-if="ifPermit">
            部屋に入る
          </button>
        </div>
        <div v-if="waiting">
          <button class="button--grey" diabled>処理中...</button>
        </div>
        <button class="button--grey mt-5" @click="home">ホームへ</button>
        <h2 class="subtitle mt-50" v-show="roomOnlineUsers.length">
          オンラインユーザー
        </h2>
        <OnlineUsers />
      </div>
    </div>
    <div v-if="!room">
      部屋が見つかりませんでした<br />
      <button class="button--grey mt-5" @click="home">ホームへ</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import NamePlate from '@/components/NamePlate.vue'
import OnlineUsers from '@/components/OnlineUsers.vue'

import roomMapper from '@/store/room'
import userMapper from '@/store/user'
import webrtcMapper from '@/store/webrtc'
import { enterOpenRoom, enterClosedRoom } from '@/service/roomAPI'

export type DataType = {
  waiting: boolean
}

export default Vue.extend({
  data(): DataType {
    return {
      waiting: false,
    }
  },
  components: {
    NamePlate,
    OnlineUsers,
  },
  computed: {
    ...roomMapper.mapGetters(['room']),
    ...userMapper.mapGetters(['me', 'isSignin', 'roomOnlineUsers']),
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
    ifPermit(): boolean {
      if (this.room.room_type === 'open') {
        return true
      }
      if (this.room.room_type === 'closed') {
        if (this.room.members.includes(this.me.uid)) {
          return true
        }
      }
      return false
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
      // @ts-ignore
      this.SIGN_IN_TWITTER()
        .then(() => {})
        .catch((err: any) => alert(err))

      return true
    },
    enterRoom() {
      if (this.room.room_type === 'open') {
        this.waiting = true
        enterOpenRoom(this.roomId)
          .then(() => {
            this.$router.push(`/room/${this.roomId}`)
          })
          .catch((err) => alert(err))
          .finally(() => {
            this.waiting = false
          })
      } else if (this.room.room_type === 'closed') {
        this.waiting = true
        enterClosedRoom(this.roomId)
          .then(() => {
            this.$router.push(`/room/${this.roomId}`)
          })
          .catch((err) => alert(err))
          .finally(() => {
            this.waiting = false
          })
      }
    },
    home() {
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
