<template>
  <div class="bt-1">
    <h2 class="subtitle">ルーム作成</h2>
    <input v-model="newRoomName" class="room-name" />
    <select v-model="roomType" class="room-type">
      <option value="open">オープン</option>
      <option value="social">ソーシャル</option>
      <option value="closed">クローズド</option>
    </select>

    <button class="button--grey" @click="clickCreateRoom">作成</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import roomMapper from '@/store/room'

export type DataType = {
  newRoomName: string
  roomType: 'open' | 'closed'
}

export default Vue.extend({
  data(): DataType {
    return {
      newRoomName: '',
      roomType: 'open',
    }
  },
  computed: {
    ...roomMapper.mapGetters(['myRoomList']),
  },
  methods: {
    ...roomMapper.mapActions(['CREATE_ROOM']),
    clickCreateRoom() {
      if (this.newRoomName.length === 0) {
        alert('作成するルーム名を入力してください')
        return
      }
      if (this.newRoomName.length > 50) {
        alert('ルーム名が長すぎます')
        return
      }

      if (this.myRoomList.length >= 5) {
        alert('無料ユーザーは5ルームまでしか作れません')
        return
      }

      const postJson = {
        name: this.newRoomName,
        room_type: this.roomType,
      }
      this.CREATE_ROOM(postJson).catch((err) => alert(err))

      this.newRoomName = ''
    },
  },
})
</script>

<style lang="scss" scoped>
.room-name {
  color: #636363;
  height: 40px;
  margin-bottom: 5px;
}

.room-type {
  color: #636363;
  height: 40px;
}
</style>
