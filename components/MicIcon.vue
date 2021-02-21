<template>
  <div class="main">
    <span v-if="!ifStream">
      <img src="/mic_off_icon.png" class="mic" />
    </span>
    <span v-if="ifStream">
      <span v-if="micStatusOn" @click="mute">
        <img src="/mic_on_icon.png" class="mic" />
        <img src="/mic_on_icon.png" class="mic_animation" />
      </span>
      <span v-if="micStatusMute" @click="unmute">
        <img src="/mic_mute_icon.png" class="mic" />
      </span>
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import userMapper from '@/store/user'

export default Vue.extend({
  props: {
    ifStream: { default: false, type: Boolean },
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
  },
  methods: {
    ...userMapper.mapActions(['SET_MIC_MUTE', 'SET_MIC_ON']),
    mute() {
      this.SET_MIC_MUTE()
    },
    unmute() {
      this.SET_MIC_ON()
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
  left: -30px;
  width: 36px;
  height: 36px;
}

.mic_animation {
  position: absolute;
  top: 0;
  left: -30px;
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
