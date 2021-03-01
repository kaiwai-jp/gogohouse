<template>
  <div class="container">
    <div v-if="roomLoaded">
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
        <div v-if="roomOnlineUsers.length <= 20"><EnterRoom /></div>
        <div v-else>満員です！</div>
      </div>
      <div class="members">
        <h2 class="subtitle mt-50" v-show="roomOnlineUsers.length">
          今ルームにいるユーザー
        </h2>
      </div>
      <OnlineUsers :link="true" />
      <div class="members" v-if="ifRoomMembersShow">
        <h2 class="subtitle mt-50">メンバー</h2>
        <RoomMembers :link="true" :members="room.members" />
        <ReservedRoomMembers :members="room.reserved_members || []" />
      </div>
      <button v-if="isOwner" @click="modal = true" class="button--mini">
        ルーム管理
      </button>
      <DoorGuide class="m-50" />
      <p class="service">
        Twitterフォロワーと音声トークができるサービスです。聴くだけも可。
      </p>
    </div>
    <div v-if="!roomLoaded">
      <div v-show="room" class="subtitle">Loading...</div>
      <div v-show="!room" class="subtitle">ルームが見つかりません</div>
      <HomeButton />
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
import HomeButton from '@/components/HomeButton.vue'

import roomMapper from '@/store/room'
import userMapper from '@/store/user'
import webrtcMapper from '@/store/webrtc'
import warpMapper from '@/store/warp'

interface DataType {
  modal: Boolean
  loading: Boolean
}

export default Vue.extend({
  components: {
    NamePlate,
    OnlineUsers,
    EnterRoom,
    TwitterLogin,
    DoorGuide,
    ManageRoom,
    HomeButton,
  },
  data(): DataType {
    return {
      modal: false,
      loading: true,
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
    roomLoaded(): Boolean {
      if (!this.room) return false
      if (Object.keys(this.room).length === 0) return false
      return true
    },
    roomDescription(): String {
      if (this.room.room_type === 'open') {
        return 'オープンルームです。誰でも入れます。'
      } else if (this.room.room_type === 'social') {
        return 'ソーシャルルームです。オーナーとTwitterで相互フォローの人だけが入れます。'
      } else if (this.room.room_type === 'closed') {
        return 'クローズドルームです。メンバーだけが入れます。'
      } else if (this.room.room_type) {
        return '不明なタイプのルームです。'
      }
      return 'loading...'
    },
    ifRoomMembersShow(): Boolean {
      if (typeof this.room.members === 'object' && this.room.members.length > 1)
        return true
      return false
    },
    twitterText(): String {
      return (
        'GoGoHouse「' +
        this.room.name +
        '」で音声トークをします。ご参加ください。'
      )
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
    ...warpMapper.mapActions(['OPEN_ALERT_DIALOG']),
    twitterSignin() {
      this.SIGN_IN_TWITTER()
        .then(() => {})
        .catch((err: any) => this.OPEN_ALERT_DIALOG(err))

      return true
    },
  },
})
</script>

<style lang="scss" scoped>
.description {
  color: $color2;
  margin-bottom: 20px;
}

.owner {
  text-align: left;
}

.members {
  text-align: left;
}

.twitter-publish {
  display: block;
}

.service {
  margin-bottom: 10px;
}
</style>
