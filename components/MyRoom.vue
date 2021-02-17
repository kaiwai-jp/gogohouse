<template>
  <div class="bt-1">
    <h2 class="subtitle">マイルーム一覧</h2>
    <div class="main">
      <div v-for="room in myRoomList" :key="room.id">
        <nuxt-link :to="{ name: 'door-id', params: { id: room.id } }">{{
          room.name
        }}</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import roomMapper from '@/store/room'

export default Vue.extend({
  created() {
    this.MY_ROOM_LIST_LISTENER()
  },
  beforeDestroy() {
    this.END_MY_ROOM_LIST_LISTENER()
  },
  computed: {
    ...roomMapper.mapGetters(['myRoomList']),
  },
  methods: {
    ...roomMapper.mapActions([
      'MY_ROOM_LIST_LISTENER',
      'END_MY_ROOM_LIST_LISTENER',
    ]),
  },
})
</script>

<style lang="scss" scoped>
.main {
  text-align: left;
}

</style>
