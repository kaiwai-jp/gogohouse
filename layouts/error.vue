<template>
  <div class="container">
    <div class="error-message">
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

.error-message {
  display: block;
  font-size: 40px;
  color: $color1;
}
</style>
