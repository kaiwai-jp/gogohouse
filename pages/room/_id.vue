<template>
  <div class="container">
    <div>
      <h1 class="title">{{ room.name }}</h1>
      <div class="links">
        <AudioWebrtc />
        <div class="m-50">
          <OnlineUsers />
        </div>
        <LeaveRoom />
      </div>
      <WebrtcDebug />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import roomMapper from '@/store/room'
import userMapper from '@/store/user'
import webrtcMapper from '@/store/webrtc'

import AudioWebrtc from '@/components/AudioWebrtc.vue'
import OnlineUsers from '@/components/OnlineUsers.vue'
import LeaveRoom from '@/components/LeaveRoom.vue'
import WebrtcDebug from '@/components/WebrtcDebug.vue'

interface Data {
  localStream: MediaStream | undefined
}

interface User {
  uid: string | undefined
}

export default Vue.extend({
  components: {
    AudioWebrtc,
    OnlineUsers,
    LeaveRoom,
    WebrtcDebug,
  },
  beforeRouteLeave(to, from, next) {
    if (window.confirm('本当にルームから離れますか？')) {
      next()
    } else {
      next(false)
    }
  },
  data(): Data {
    return {
      localStream: undefined,
    }
  },
  async created() {
    this.GET_ROOM(this.roomId)
  },
  beforeDestroy() {},
  computed: {
    ...roomMapper.mapGetters(['room']),
    ...userMapper.mapGetters(['me', 'roomOnlineUsers']),
    roomId(): string {
      return this.$route.params.id
    },
  },
  methods: {
    ...roomMapper.mapActions(['GET_ROOM']),
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

<style lang="scss" scoped></style>
