<template>
  <div v-if="members">
    <div v-for="screenName in members" :key="screenName" class="list">
      <ReservedMemberNamePlateMini :screenName="screenName" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ReservedMemberNamePlateMini from '@/components/ReservedMemberNamePlateMini.vue'

export default Vue.extend({
  components: {
    ReservedMemberNamePlateMini,
  },
  props: {
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
