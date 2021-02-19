<template>
  <div>
    <div v-for="userId in members" :key="userId" class="list">
      <NamePlateMini :uid="userId" :link="link" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import NamePlateMini from '@/components/NamePlateMini.vue'

export default Vue.extend({
  components: {
    NamePlateMini,
  },
  props: {
    link: { default: false, type: Boolean },
    members: { default: false, type: Array },
  },
})
</script>

<style lang="scss" scoped>
.list {
  margin-top: 2px;
  margin-bottom: 2px;
}
</style>
