<template>
  <div class="description">
    <div v-if="!localStream" class="mic_area">
      <div v-if="!permissionDialog">
        <MicIcon v-if="micPermitted" />
        <button class="button--green" @click="start" v-if="micPermitted">
          マイクを開く
        </button>
        <button class="button--green" v-if="!micPermitted" @click="cantMicOpen">
          マイク権なし
        </button>
      </div>
      <div v-if="permissionDialog">
        ブラウザからマイクを利用する許可をしてください
      </div>
    </div>
    <div v-else class="mic_area">
      <MicIcon :localStream="localStream" />
      <button class="button--green" @click="hangup">マイクを閉じる</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import roomMapper from '@/store/room'
import userMapper from '@/store/user'
import webrtcMapper from '@/store/webrtc'
import warpMapper from '@/store/warp'

import MicIcon from '@/components/MicIcon.vue'

interface DataType {
  localStream: MediaStream | undefined
  permissionDialog: boolean
}

interface User {
  uid: string | undefined
}

interface User {
  uid: string | undefined
}

export default Vue.extend({
  components: {
    MicIcon,
  },
  data(): DataType {
    return {
      localStream: undefined,
      permissionDialog: false,
    }
  },
  created() {
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
    ...roomMapper.mapGetters(['room']),
    ...userMapper.mapGetters([
      'me',
      'roomRemoteUsers',
      'roomOnlineUsers',
      'myData',
    ]),
    ...webrtcMapper.mapGetters(['remoteStreamObj']),
    roomId(): string {
      return this.$route.params.id
    },
    micPermitted(): boolean {
      const owner_id = this.room.owner_id

      if (owner_id === this.me.uid) return true

      if (this.room.mic_enable === 'any') return true

      if (this.room.mic_enable === 'owner' || !this.room.mic_enable) {
        for (let i = 0; i < this.roomOnlineUsers.length; i++) {
          //@ts-ignore
          if (owner_id === this.roomOnlineUsers[i].uid) {
            return true
          }
        }
      }

      if (this.room.mic_enable === 'assign') {
        if (!this.room.mic_assign) return false

        //@ts-ignore
        if (this.room.mic_assign.includes(this.me.uid)) {
          return true
        }
      }

      return false
    },
    localAudioEnable(): boolean {
      if (
        this.myData.mic_status === 'on' ||
        this.myData.mic_status === 'mute'
      ) {
        return true
      }
      return false
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
    ...userMapper.mapActions(['SET_MIC_ON', 'SET_MIC_OFF']),
    ...warpMapper.mapActions(['OPEN_ALERT_DIALOG']),
    async start() {
      /* ローカルストリームにマイクのストリームを割り当て */
      try {
        this.permissionDialog = true
        this.localStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        })
        this.SET_MIC_ON()
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
      /* 今オンラインのユーザーにオファーをする */
      this.roomRemoteUsers.forEach((user: User) => {
        if (this.me.uid != user.uid) {
          this.OFFER({ uid: user.uid, localStream: this.localStream })
        }
      })
    },
    hangup() {
      if (this.localStream) {
        const tracks = this.localStream.getTracks()
        tracks.forEach((track: MediaStreamTrack) => {
          track.stop()
        })
        this.localStream = undefined
        this.SET_MIC_OFF()
      }
      this.CONNECTION_END_FROM_ME()
    },
    cantMicOpen() {
      let message = 'このルームはオーナーが在室でないときはマイクは開けません'
      if (this.room.mic_enable === 'assign') {
        message = 'このルームはオーナーがマイク権を割り当てた人だけ発言できます'
      }
      this.OPEN_ALERT_DIALOG(message)
    },
  },
})
</script>

<style lang="scss">
.description {
  color: $color2;
  margin-bottom: 20px;
}

.mic_area {
  display: inline-block;
}
</style>
