<template>
  <div class="main">
    <span v-show="!ifStream">
      <img src="/mic_off_icon.png" alt="マイクオフ" class="mic" />
    </span>
    <span v-show="ifStream">
      <span v-show="micStatusOn" @click="mute">
        <img src="/mic_on_icon.png" alt="マイクオン" class="mic" />
        <img src="/mic_on_icon.png" class="mic-animation" />
      </span>
      <span v-show="micStatusMute" @click="unmute">
        <img src="/mic_mute_icon.png" alt="マイクミュート" class="mic" />
      </span>
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import userMapper from '@/store/user'

export default Vue.extend({
  props: {
    localStream: { default: undefined }, // type?
  },
  computed: {
    ...userMapper.mapGetters(['myData']),
    micStatusOn(): Boolean {
      if (this.myData.mic_status && this.myData.mic_status === 'on') {
        return true
      }
      return false
    },
    micStatusOff(): Boolean {
      if (!this.myData.mic_status || this.myData.mic_status === 'off') {
        return true
      }
      return false
    },
    micStatusMute(): Boolean {
      if (this.myData.mic_status && this.myData.mic_status === 'mute') {
        return true
      }
      return false
    },
    ifStream(): Boolean {
      if (this.localStream) return true
      return false
    },
  },
  methods: {
    ...userMapper.mapActions(['SET_MIC_MUTE', 'SET_MIC_ON']),
    mute() {
      this.SET_MIC_MUTE()
      if (this.localStream) {
        // @ts-ignore
        let audioTrack = this.localStream.getAudioTracks()[0]
        audioTrack.enabled = false
      }
    },
    unmute() {
      this.SET_MIC_ON()
      if (this.localStream) {
        // @ts-ignore
        let audioTrack = this.localStream.getAudioTracks()[0]
        audioTrack.enabled = true
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.main {
  position: relative;
}

.mic {
  position: absolute;
  top: 0;
  left: -35px;
  width: 36px;
  height: 36px;
}

.mic-animation {
  position: absolute;
  top: 0;
  left: -35px;
  width: 36px;
  height: 36px;

  animation-name: blur;
  animation-duration: 1.5s;
  animation-iteration-count: infinite;
}

@keyframes blur {
  0% {
    filter: blur(0);
  }
  100% {
    filter: blur(10px);
  }
}
</style>
