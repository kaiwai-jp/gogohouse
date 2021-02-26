<template>
  <div class="bt-1">
    <h2 class="subtitle">ルーム作成</h2>
    <div class="room-block">
      <label for="room-name" class="room-label">ルーム名 50文字まで</label>
      <input v-model="newRoomName" class="room-name" id="room-name" />
      <select v-model="roomType" class="room-type">
        <option value="open">オープン</option>
        <option value="social">ソーシャル</option>
        <option value="closed">クローズド</option>
      </select>
    </div>
    <button class="button--green create-room" @click="clickCreateRoom">
      作成
    </button>
    <ul class="room-type-description">
      <li>オープン・・・誰でも入れるルーム</li>
      <li>ソーシャル・・・Twitterで相互フォローの人だけ入れるルーム</li>
      <li>クローズド・・・メンバーになった人だけ入れるルーム</li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import roomMapper from '@/store/room'
import warpMapper from '@/store/warp'

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
    ...warpMapper.mapActions(['OPEN_ALERT_DIALOG']),
    clickCreateRoom() {
      if (this.newRoomName.length === 0) {
        this.OPEN_ALERT_DIALOG('作成するルーム名を入力してください')
        return
      }
      if (this.newRoomName.length > 50) {
        this.OPEN_ALERT_DIALOG('ルーム名が長すぎます')
        return
      }

      if (this.myRoomList.length >= 5) {
        this.OPEN_ALERT_DIALOG('無料ユーザーは5ルームまでしか作れません')
        return
      }

      const postJson = {
        name: this.newRoomName,
        room_type: this.roomType,
      }
      this.CREATE_ROOM(postJson).catch((err) => this.OPEN_ALERT_DIALOG(err))

      this.newRoomName = ''
    },
  },
})
</script>

<style lang="scss" scoped>
.room-block {
  display: inline-block;
}

.room-label {
  display: block;
  margin-bottom: 5px;
  text-align: left;
  font-size: 11px;
  color: $color2;
}

.room-name {
  color: $color3;
  height: 40px;
  margin-bottom: 5px;
}

.room-type {
  color: $color3;
  height: 40px;
}

.room-type-description {
  width: 310px;
  margin: 20px auto;
  padding: 0;
  font-size: 11px;
  color: $color2;
  list-style-type: none;
}

.room-type-description li {
  text-align: left;
}
</style>
