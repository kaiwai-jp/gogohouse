<template>
  <div class="container">
    <div class="subtitle">
      <img src="/gogo.jpg" class="gogo-image" />
      ページが見つかりません
      <div><HomeButton /></div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import HomeButton from '@/components/HomeButton.vue'

export default Vue.extend({ components: { HomeButton } })
</script>

<style lang="scss" scoped>
.container {
  background-color: #f2efe4;
}

.gogo-image {
  display: block;
  width: 100vw;
  max-width: 380px;
  height: 240px;
  margin-bottom: 50px;
}
</style>
