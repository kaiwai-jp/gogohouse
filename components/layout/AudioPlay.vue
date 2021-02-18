<template>
  <div class="description">
    <audio
      v-for="(stream, uid) in remoteStreamObj"
      :key="uid"
      :srcObject.prop="stream"
      autoplay
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import webrtcMapper from '@/store/webrtc'

export default Vue.extend({
  computed: {
    ...webrtcMapper.mapGetters(['remoteStreamObj']),
  },
})
</script>

<style lang="scss"></style>
