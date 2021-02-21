<template>
  <div class="entire">
    <PageHeader />
    <Nuxt class="main" />
    <AudioPlay />
    <PageFooter />
    <AlertModal />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import PageFooter from '@/components/layout/PageFooter.vue'
import AudioPlay from '@/components/layout/AudioPlay.vue'
import AlertModal from '@/components/layout/AlertModal.vue'

export default Vue.extend({
  components: { PageHeader, PageFooter, AudioPlay, AlertModal },
})
</script>

<style lang="scss" scoped>
.main {
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  padding-left: 20px;
  padding-right: 20px;
}
</style>
