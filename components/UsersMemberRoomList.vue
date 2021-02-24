<template>
  <div class="bt-1">
    <h2 class="subtitle">メンバールーム一覧</h2>
    <div class="main">
      <div v-for="room in othersMemberRoomList" :key="room.id" class="list_square">
        <nuxt-link :to="{ name: 'door-id', params: { id: room.id } }">
          {{ room.name }}
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getUsersMemberRoomList } from '@/service/roomAPI'

interface DataType {
  memberRoomList: Array<Object>
}

export default Vue.extend({
  props: {
    uid: { default: '', type: String },
  },
  data(): DataType {
    return {
      memberRoomList: [],
    }
  },
  computed: {
    othersMemberRoomList(): Array<Object> {
      let roomList = []
      for (let i = 0; i < this.memberRoomList.length; i++) {
        // @ts-ignore
        if (this.memberRoomList[i].owner_id !== this.uid) {
          roomList.push(this.memberRoomList[i])
        }
      }
      return roomList
    },
  },

  async created() {
    this.memberRoomList = await getUsersMemberRoomList(this.uid)
  },
})
</script>

<style lang="scss" scoped>
.main {
  text-align: left;
}
</style>
