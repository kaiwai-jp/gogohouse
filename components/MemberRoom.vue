<template>
  <div class="bt-1">
    <h2 class="subtitle">メンバールーム一覧</h2>
    <div class="main">
      <div v-for="room in othersMemberRoomList" :key="room.id">
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
    this.MEMBER_ROOM_LIST_LISTENER()
  },
  beforeDestroy() {
    this.END_MEMBER_ROOM_LIST_LISTENER()
  },
  computed: {
    ...roomMapper.mapGetters(['memberRoomList', 'myRoomList']),
    othersMemberRoomList() {
      let roomList = []
      for (let j = 0; j < this.memberRoomList.length; j++) {
        let pushFlag = true
        for (let i = 0; i < this.myRoomList.length; i++) {
          if (this.myRoomList[i].id === this.memberRoomList[j].id) {
            pushFlag = false
            break
          }
        }
        if (pushFlag) roomList.push(this.memberRoomList[j])
      }
      return roomList
    },
  },
  methods: {
    ...roomMapper.mapActions([
      'MEMBER_ROOM_LIST_LISTENER',
      'END_MEMBER_ROOM_LIST_LISTENER',
    ]),
  },
})
</script>

<style lang="scss" scoped>
.main {
  text-align: left;
}
</style>
