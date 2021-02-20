<template>
  <div class="main">
    <img src="/mic_icon.png" class="mic" />
    <img src="/mic_icon.png" class="mic_animation" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>

<style lang="scss" scoped>
.main {
  position: relative;
}

.mic {
  position: absolute;
  top: 0;
  left: -30px;
}

.mic_animation {
  position: absolute;
  top: 0;
  left: -30px;

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
