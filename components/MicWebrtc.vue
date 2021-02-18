<template>
  <div class="description">
    <div v-if="!localStream">
      <div v-if="!permissionDialog">
        マイクOFF<button class="button--grey" @click="start">
          マイクを開く
        </button>
      </div>
      <div v-if="permissionDialog">
        ブラウザからマイクを利用する許可をしてください
      </div>
    </div>
    <div v-else>
      マイクON<button class="button--grey" @click="hangup">
        マイクを閉じる
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import userMapper from '@/store/user'
import webrtcMapper from '@/store/webrtc'

interface Data {
  localStream: MediaStream | undefined
  permissionDialog: boolean
  localAudioEnable: boolean
}

interface User {
  uid: string | undefined
}

export default Vue.extend({
  data(): Data {
    return {
      localStream: undefined,
      permissionDialog: false,
      localAudioEnable: true,
    }
  },
  async mounted() {
    this.CONNECTION_OFFERED_LISTENER()
    this.$store.subscribe((mutation, state) => {
      if (!this.localStream) return
      if (this.me.uid === state.uid) return
      if (mutation.type === 'user/add_room_online_users') {
        if (mutation.payload.uid == this.me.uid) return
        this.OFFER({ uid: mutation.payload.uid, localStream: this.localStream })
      } else if (mutation.type === 'user/remove_room_online_users') {
        this.CONNECTION_FINISH_WITH_UID(state.uid)
      }
    })
    //this.$nextTick(this.start)
  },
  beforeDestroy() {
    this.END_CONNECTION_OFFERED_LISTENER()
    this.CONNECTION_FINISH_ALL()
    this.hangup()
  },
  computed: {
    ...userMapper.mapGetters(['me', 'roomRemoteUsers']),
    ...webrtcMapper.mapGetters(['remoteStreamObj']),
    roomId(): string {
      return this.$route.params.id
    },
  },
  methods: {
    ...webrtcMapper.mapActions([
      'OFFER',
      'CONNECTION_FINISH_WITH_UID',
      'CONNECTION_END_FROM_ME',
      'CONNECTION_OFFERED_LISTENER',
      'END_CONNECTION_OFFERED_LISTENER',
      'CONNECTION_FINISH_ALL',
    ]),
    async start() {
      /* ローカルストリームにマイクのストリームを割り当て */
      try {
        this.permissionDialog = true
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
      } finally {
        this.permissionDialog = false
      }
      /* 音声と映像のミュート状態を反映 */
      const audioTrack = this.localStream.getAudioTracks()[0]
      //      audioTrack.enabled = this.localAudioEnable
      /* 今オンラインのユーザーにオファーをする */
      this.roomRemoteUsers.forEach((user: User) => {
        if (this.me.uid != user.uid) {
          this.OFFER({ uid: user.uid, localStream: this.localStream })
        }
      })
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

<style lang="scss">
.description {
  color: #526488;
  margin-bottom: 20px;
}
</style>
