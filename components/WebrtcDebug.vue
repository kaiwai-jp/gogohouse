<template>
  <div>
    <button @click="modal = true">Debug</button>
    <div v-if="modal" class="debug-modal">
      information
      <table>
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
      </table>
      <button @click="modal = false">閉じる</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import userMapper from '@/store/user'
import webrtcMapper from '@/store/webrtc'

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
    ...webrtcMapper.mapGetters(['userPeerConnectionState']),
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
  },
  methods: {
    async reConnect() {},
  },
})
</script>

<style lang="scss" scoped>
.debug-modal {
  position: absolute;
  justify-content: center;
  z-index: 100;
  width: 80vw;
  height: 80vh;
  left: 10vw;
  top: 10vh;
  background-color: #ffffff;
  border: solid 1px #35495e;
  padding: 10px;
}
</style>
