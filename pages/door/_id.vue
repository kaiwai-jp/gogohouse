<template>
  <div class="container">
    <div v-if="roomExists">
      <h1 class="title">{{ room.name }}</h1>
      <p class="description">{{ roomDescription }}</p>
      <h2 class="subtitle owner" v-show="roomDescription != 'loading...'">
        オーナー
      </h2>
      <NamePlate :uid="room.owner_id" :link="true" class="mb-50" />
      <div v-if="!isSignin">
        <TwitterLogin class="mb-50" />
      </div>
      <div v-if="isSignin">
        <div v-if="roomOnlineUsers.length <= 10"><EnterRoom /></div>
        <div v-else>満員です！</div>
        <div class="members">
          <h2 class="subtitle mt-50" v-show="roomOnlineUsers.length">
            オンラインユーザー
          </h2>
        </div>
        <OnlineUsers :link="true" />
        <div class="members" v-if="ifRoomMembersShow">
          <h2 class="subtitle mt-50">メンバー</h2>
          <RoomMembers :link="true" :members="room.members" />
        </div>
      </div>
      <button v-if="isOwner" @click="modal = true">ルーム管理</button>
      <DoorGuide class="m-50" />
    </div>
    <div v-if="!roomExists">
      Loading...<br />
      <button class="button--grey mt-5" @click="goHome">ホームへ</button>
    </div>
    <ManageRoom @close="modal = false" :roomId="room.id" v-if="modal" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import NamePlate from '@/components/NamePlate.vue'
import OnlineUsers from '@/components/OnlineUsers.vue'
import EnterRoom from '@/components/EnterRoom.vue'
import TwitterLogin from '@/components/TwitterLogin.vue'
import DoorGuide from '@/components/DoorGuide.vue'
import ManageRoom from '@/components/ManageRoom.vue'

import roomMapper from '@/store/room'
import userMapper from '@/store/user'
import webrtcMapper from '@/store/webrtc'

interface DataType {
  modal: Boolean
}

export default Vue.extend({
  components: {
    NamePlate,
    OnlineUsers,
    EnterRoom,
    TwitterLogin,
    DoorGuide,
    ManageRoom,
  },
  data(): DataType {
    return {
      modal: false,
    }
  },
  computed: {
    ...roomMapper.mapGetters(['room']),
    ...userMapper.mapGetters(['me', 'isSignin', 'roomOnlineUsers']),
    roomId(): String {
      return this.$route.params.id
    },
    isOwner(): Boolean {
      return this.me.uid === this.room.owner_id
    },
    roomExists(): Boolean {
      return Object.keys(this.room).length !== 0
    },
    roomDescription(): String {
      if (this.room.room_type === 'open') {
        return 'オープンルームです。誰でも入れます。'
      } else if (this.room.room_type === 'social') {
        return 'ソーシャルルームです。オーナーとTwitterで相互フォローの人だけが入れます。'
      } else if (this.room.room_type === 'closed') {
        return 'クローズドルームです。メンバーだけが入れます。'
      } else if (this.room.room_type) {
        return '不明なタイプの部屋です。'
      }
      return 'loading...'
    },
    ifRoomMembersShow(): Boolean {
      if (this.room.members && this.room.members.length > 1) return true
      return false
    },
  },
  async created() {
    this.ROOM_LISTENER(this.roomId)
    await this.GET_USER()
    this.CLEAR_OFFERED_DB()
  },
  beforeDestroy() {
    this.END_ROOM_LISTENER()
  },
  methods: {
    ...roomMapper.mapActions(['ROOM_LISTENER', 'END_ROOM_LISTENER']),
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

.members {
  text-align: left;
}

.mt-5 {
  margin-top: 5px;
}
</style>
