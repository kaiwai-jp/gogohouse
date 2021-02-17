<template>
  <div>
    <div v-for="user in roomRemoteUsers" :key="user.uid">
      {{ user.uid }}
      {{ userInboundState(user.uid) }}
      {{ userOutboundState(user.uid) }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import userMapper from '@/store/user'
import webrtcMapper from '@/store/webrtc'

export default Vue.extend({
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

<style lang="scss"></style>
