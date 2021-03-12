<template>
  <div class="container">
    <div>
      <img src="/gogo.jpg" class="gogo-image" alt="猫" />
      <h2 class="subtitle">ページが見つかりません</h2>
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
  margin-bottom: 50px;
}
</style>
