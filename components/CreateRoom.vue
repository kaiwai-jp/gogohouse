<template>
  <div class="bt-1">
    <h2 class="subtitle">ルーム作成</h2>
    <p class="description">自分のルームを作るのはここから</p>
    <div class="room-block">
      <input
        v-model="newRoomName"
        placeholder="ルーム名 50文字まで"
        class="room-name"
        id="room-name"
      />
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

      if (this.myRoomList.length >= 10) {
        this.OPEN_ALERT_DIALOG('無料ユーザーは10ルームまでしか作れません')
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
.description {
  color: $color3;
  margin-bottom: 10px;
}
.room-block {
  display: inline-block;
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
