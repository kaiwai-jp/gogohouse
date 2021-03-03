<template>
  <div class="bt-1">
    <h2 class="subtitle">新着ルーム</h2>
    <div class="main">
      <div v-for="room in newRoomList" :key="room.id" class="list_square">
        <nuxt-link :to="{ name: 'door-id', params: { id: room.id } }">
          {{ room.name }}
        </nuxt-link>
        <NamePlateMini
          :uid="room.owner_id"
          class="room-owner ml-20"
          :shorten="true"
          :link="true"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import NamePlateMini from '@/components/NamePlateMini.vue'

import { getNewRoomList } from '@/service/roomAPI'

interface DataType {
  newRoomList: Object
}

export default Vue.extend({
  components: { NamePlateMini },
  data(): DataType {
    return {
      newRoomList: [],
    }
  },

  async created() {
    this.newRoomList = await getNewRoomList(5)
  },
})
</script>

<style lang="scss" scoped>
.main {
  text-align: left;
}

.room-owner {
  font-size: 14px;
}
</style>
