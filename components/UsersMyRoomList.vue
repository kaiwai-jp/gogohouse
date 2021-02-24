<template>
  <div class="bt-1">
    <h2 class="subtitle">マイルーム一覧</h2>
    <div class="main">
      <div v-for="room in myRoomList" :key="room.id" class="list_square">
        <nuxt-link :to="{ name: 'door-id', params: { id: room.id } }">
          {{ room.name }}
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getUsersMyRoomList } from '@/service/roomAPI'

interface DataType {
  myRoomList: Object
}

export default Vue.extend({
  props: {
    uid: { default: '', type: String },
  },
  data(): DataType {
    return {
      myRoomList: {},
    }
  },
  async created() {
    this.myRoomList = await getUsersMyRoomList(this.uid)
  },
})
</script>

<style lang="scss" scoped>
.main {
  text-align: left;
}
</style>
