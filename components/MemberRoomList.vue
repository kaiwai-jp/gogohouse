<template>
  <div class="bt-1">
    <h2 class="subtitle">メンバールーム一覧</h2>
    <div class="main">
      <div
        v-for="room in othersMemberRoomList"
        :key="room.id"
        class="list_square"
      >
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

import roomMapper from '@/store/room'

export default Vue.extend({
  components: { NamePlateMini },
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

.room-owner {
  font-size: 14px;
}
</style>
