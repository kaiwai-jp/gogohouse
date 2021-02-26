<template>
  <button class="button--green mt-5" @click="goHome">ホームへ</button>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  methods: {
    goHome() {
      this.$router.push(`/home`)
    },
  },
})
</script>

<style lang="scss" scoped>
.mt-5 {
  margin-top: 5px;
}
</style>
