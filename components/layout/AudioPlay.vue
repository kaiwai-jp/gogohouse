<template>
  <div>
    <audio
      v-for="(stream, uid) in remoteStreamObj"
      :key="uid"
      :srcObject.prop="stream"
      autoplay
    />
    <audio ref="audioEl" src="/500-milliseconds-of-silence.mp3"></audio>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import webrtcMapper from '@/store/webrtc'

export default Vue.extend({
  computed: {
    ...webrtcMapper.mapGetters(['remoteStreamObj']),
  },
  mounted() {
    this.$store.subscribeAction(async (action, state) => {
      if (action.type == 'warp/PLAY_SILENT_MUSIC') {
        // @ts-ignore
        this.$refs.audioEl.currentTime = 0
        // @ts-ignore
        this.$refs.audioEl.play()
      }
    })
  },
})
</script>

<style lang="scss"></style>
