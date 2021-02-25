<template>
  <div>
    <button @click="modal = true" class="button--mini">Debug</button>
    <div class="modal-base" v-if="modal">
      <div class="debug-modal">
        information
        <table class="connect-info">
          <tbody>
            <tr>
              <td>twitter</td>
              <td>inbound</td>
              <td>outbound</td>
            </tr>
            <tr v-for="user in roomRemoteUsers" :key="user.uid">
              <td>{{ user.twitter }}</td>
              <td>{{ userInboundState(user.uid) }}</td>
              <td>{{ userOutboundState(user.uid) }}</td>
            </tr>
          </tbody>
        </table>
        <div v-for="report in errReport" :key="random(report)">
          {{ report }}
        </div>
        <button @click="playSilentMusic" class="button--mini">無音再生</button>
        <button @click="modal = false" class="button--mini">閉じる</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import userMapper from '@/store/user'
import webrtcMapper from '@/store/webrtc'
import warpMapper from '@/store/warp'

export type DataType = {
  modal: boolean
}

export default Vue.extend({
  data(): DataType {
    return {
      modal: false,
    }
  },
  computed: {
    ...userMapper.mapGetters(['me', 'roomRemoteUsers']),
    ...webrtcMapper.mapGetters(['userPeerConnectionState', 'errReport']),
    userInboundState(): (arg0: String) => String {
      return function (uid: String) {
        if (
          //@ts-ignore
          this.userPeerConnectionState[uid] &&
          //@ts-ignore
          this.userPeerConnectionState[uid]['inbound']
        ) {
          //@ts-ignore
          return this.userPeerConnectionState[uid]['inbound']
        }
        return '-'
      }
    },
    userOutboundState(): (arg0: String) => String {
      return function (uid: String) {
        if (
          //@ts-ignore
          this.userPeerConnectionState[uid] &&
          //@ts-ignore
          this.userPeerConnectionState[uid]['outbound']
        ) {
          //@ts-ignore
          return this.userPeerConnectionState[uid]['outbound']
        }
        return '-'
      }
    },
    random(): (arg0: string) => String {
      return function (string: string) {
        return Math.random().toString()
      }
    },
  },
  methods: {
    ...warpMapper.mapActions(['PLAY_SILENT_MUSIC']),
    playSilentMusic() {
      this.PLAY_SILENT_MUSIC()
    },
  },
})
</script>

<style lang="scss" scoped>
.modal-base {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.debug-modal {
  padding: 10px;
  text-align: left;
  width: 90vw;
  max-height: 90vh;
  left: 10vw;
  top: 10vh;
  background-color: #ffffff;
  overflow-y: scroll;
  word-wrap: break-word;
}

.connect-info {
  border: solid 1px $color1;
  border-collapse: collapse;
}

.connect-info td {
  border: solid 1px $color1;
}
</style>
