<template>
  <div class="container">
    <div>
      <h1 class="title">{{ room.name }}</h1>
      モデレーター：
      <NamePlateMini :uid="room.owner_id" class="owner-identity" />
      <IamMemberDisplay class="inline-block" />
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
        <SignalIcons class="signal-icons" />
        <div class="m-50">
          <OnlineUsers />
        </div>
        <LeaveRoom />
      </div>
      <HowToUseInRoom />
      <WebrtcDebug class="mb-50 inline-block" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import roomMapper from '@/store/room'
import userMapper from '@/store/user'

import MicWebrtc from '@/components/MicWebrtc.vue'
import OnlineUsers from '@/components/OnlineUsers.vue'
import LeaveRoom from '@/components/LeaveRoom.vue'
import WebrtcDebug from '@/components/WebrtcDebug.vue'
import NamePlateMini from '@/components/NamePlateMini.vue'
import ManageRoom from '@/components/ManageRoom.vue'
import IamMemberDisplay from '@/components/IamMemberDisplay.vue'
import TwitterPublish from '@/components/TwitterPublish.vue'
import SignalIcons from '@/components/SignalIcons.vue'
import HowToUseInRoom from '@/components/HowToUseInRoom.vue'

interface DataType {
  localStream: MediaStream | undefined
  manageModal: Boolean
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
    TwitterPublish,
    SignalIcons,
    HowToUseInRoom,
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
  beforeRouteLeave(to, from, next) {
    const promise = new Promise((resolve, reject) => {
      this.$store.commit('warp/set_leaveroom_dialog_object', {
        message: 'ルームを離れますか？',
        resolve,
        reject,
        next,
      })
    })
    promise.catch(() => null)
  },
  methods: {
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
    },
  },
})
</script>

<style lang="scss" scoped>
.owner-identity {
  display: inline-block;
}

.inline-block {
  display: inline-block;
}

.mt-10 {
  margin-top: 10px;
}

.signal-icons {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  background-color: $color5;
  border-top: solid 1px $color6;
}
</style>
