<template>
  <div class="modal-base">
    <div class="debug-modal">
      <div v-for="user in roomRemoteUsers" :key="user.id">
        {{ user.twitter }}
        <button @click="clickKick(user.uid)">KICK</button>
        <button @click="clickBan(user.uid)">BAN</button>
      </div>
      <button @click="clickDeleteRoom">ルーム削除</button>

      <button @click="$emit('close')">閉じる</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import userMapper from '@/store/user'
import roomMapper from '@/store/room'
import { kickUser } from '@/service/userAPI'
import { ban, deleteRoom } from '@/service/roomAPI'

export type DataType = {
  modal: boolean
}

export default Vue.extend({
  props: {
    roomId: { default: '', type: String },
  },
  data(): DataType {
    return {
      modal: false,
    }
  },
  computed: {
    ...userMapper.mapGetters(['roomRemoteUsers']),
    ...roomMapper.mapGetters(['room']),
  },
  methods: {
    clickDeleteRoom() {
      if (window.confirm('本当に' + this.room.name + 'を削除しますか？')) {
        deleteRoom(this.roomId)
      }
    },
    clickKick(uid: String, move: String) {
      let user
      let moveString = move || 'KICK'

      for (let i = 0; i < this.roomRemoteUsers.length; i++) {
        user = this.roomRemoteUsers[i]
      }
      if (!user) return
      //@ts-ignore
      if (
        window.confirm('本当に' + user.name + 'を' + moveString + 'しますか？')
      ) {
        kickUser({ roomId: this.roomId, userId: uid })
      }
    },
    clickBan(uid: String) {
      this.clickKick(uid, 'BAN')
      ban(this.roomId, uid)
    },
  },
})
</script>

<style lang="scss" scoped>
.modal-base {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.debug-modal {
  padding: 10px;
  text-align: left;
  width: 90vw;
  left: 10vw;
  top: 10vh;
  background-color: #ffffff;
  overflow-y: scroll;
  word-wrap: break-word;
}
</style>
