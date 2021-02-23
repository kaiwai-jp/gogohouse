<template>
  <div class="container">
    <div>
      <h1 class="title">{{ room.name }}</h1>
      オーナー：<NamePlateMini :uid="room.owner_id" class="owner-identity" />
      <IamMemberDisplay class="i-am-member" />
      <button @click="manageModal = true" v-if="ifOwner" class="button--mini">
        ルーム管理
      </button>
      <ManageRoom
        @close="manageModal = false"
        :roomId="room.id"
        v-if="manageModal"
      />
      <div class="links">
        <MicWebrtc />
        <div class="m-50">
          <OnlineUsers />
        </div>
        <LeaveRoom />
      </div>
      <WebrtcDebug class="m-50" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import roomMapper from '@/store/room'
import userMapper from '@/store/user'
import webrtcMapper from '@/store/webrtc'

import MicWebrtc from '@/components/MicWebrtc.vue'
import OnlineUsers from '@/components/OnlineUsers.vue'
import LeaveRoom from '@/components/LeaveRoom.vue'
import WebrtcDebug from '@/components/WebrtcDebug.vue'
import NamePlateMini from '@/components/NamePlateMini.vue'
import ManageRoom from '@/components/ManageRoom.vue'
import IamMemberDisplay from '@/components/IamMemberDisplay.vue'

interface DataType {
  localStream: MediaStream | undefined
  manageModal: Boolean
}

interface User {
  uid: string | undefined
}

export default Vue.extend({
  components: {
    MicWebrtc,
    OnlineUsers,
    LeaveRoom,
    WebrtcDebug,
    NamePlateMini,
    ManageRoom,
    IamMemberDisplay,
  },
  beforeRouteLeave(to, from, next) {
    if (window.confirm('本当にルームから離れますか？')) {
      next()
    } else {
      next(false)
    }
  },
  data(): DataType {
    return {
      localStream: undefined,
      manageModal: false,
    }
  },
  computed: {
    ...roomMapper.mapGetters(['room']),
    ...userMapper.mapGetters(['me', 'roomOnlineUsers']),
    roomId(): string {
      return this.$route.params.id
    },
    ifOwner(): Boolean {
      if (this.me.uid === this.room.owner_id) {
        return true
      }
      return false
    },
  },
  methods: {
    ...webrtcMapper.mapActions([
      'OFFER',
      'CONNECTION_END_FROM_ME',
      'CONNECTION_OFFERED_LISTENER',
      'END_CONNECTION_OFFERED_LISTENER',
    ]),
    async start() {
      /* ローカルストリームにマイクを割り当て */
      try {
        this.localStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        })
        /* カメラを開いて即ページ遷移した場合にマイクアクセスが残るのを防ぐ */
        if (this.$route.name != 'room-id') {
          this.hangup()
          return
        }
      } catch (err) {
        console.log(err.message)
        return
      }
      /* 音声と映像のミュート状態を反映 */
      const audioTrack = this.localStream.getAudioTracks()[0]
      //      audioTrack.enabled = this.localAudioEnable
      /* 今オンラインのユーザーにオファーをする */
      this.roomOnlineUsers.forEach((user: User) => {
        if (this.me.uid != user.uid) {
          this.OFFER({ uid: user.uid, localStream: this.localStream })
        }
      })
    },
    leave(): void {
      this.hangup()
      this.$router.push(`/home`)
    },
    hangup(): void {
      if (this.localStream) {
        const tracks = this.localStream.getTracks()
        tracks.forEach((track: MediaStreamTrack) => {
          track.stop()
        })
        this.localStream = undefined
      }
      this.CONNECTION_END_FROM_ME()
    },
  },
})
</script>

<style lang="scss" scoped>
.owner-identity {
  display: inline-block;
}

.i-am-member {
  display: inline-block;
}
</style>
