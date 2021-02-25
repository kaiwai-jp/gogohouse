<template>
  <div v-if="inRoomName">
    <div class="now">
      ただいま「
      <nuxt-link :to="inRoomLink">{{ inRoomName }}</nuxt-link>
      」にいます
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getRoomTargetUserIn } from '@/service/roomAPI'

export type DataType = {
  roomData: Object
}

export default Vue.extend({
  props: {
    uid: { default: '', type: String },
  },
  data(): DataType {
    return {
      roomData: {},
    }
  },
  computed: {
    inRoomName(): String {
      // @ts-ignore
      return this.roomData.name
    },
    inRoomLink(): String {
      // @ts-ignore
      return `/door/${this.roomData.id}`
    },
  },
  async created() {
    // @ts-ignore
    this.roomData = await getRoomTargetUserIn(this.uid)
  },
})
</script>

<style lang="scss" scoped>
.now {
  font-size: 22px;
}
</style>
