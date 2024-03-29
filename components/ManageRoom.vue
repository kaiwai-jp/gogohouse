<template>
  <div class="modal-base">
    <div class="debug-modal">
      <h2 class="subtitle">今ルームにいるユーザー</h2>
      <div v-for="user in roomOnlineUsers" :key="user.uid + 'online'">
        <NamePlateMini :uid="user.uid" class="twitter_identity" />
        <button
          v-if="user.uid != me.uid"
          @click="clickKick(user.uid)"
          class="button--mini"
        >
          KICK
        </button>
        <button
          v-if="user.uid != me.uid"
          @click="clickBan(user.uid)"
          class="button--mini"
        >
          BAN
        </button>
        <button
          v-if="user.uid != me.uid"
          @click="clickMicAssign(user.uid)"
          class="button--mini"
        >
          MIC
        </button>
        <button
          v-if="user.uid != me.uid"
          @click="clickAddMember(user.uid)"
          class="button--mini"
        >
          MEM
        </button>
      </div>

      <h2 class="subtitle mt-50">BAN</h2>
      <div v-for="uid in room.ban" :key="uid + 'ban'">
        <NamePlateMini :uid="uid" class="twitter_identity" />
        <button @click="clickReleaseBan(uid)" class="button--mini">解除</button>
      </div>

      <ManageRoomMembers :roomId="roomId" />

      <ManageRoomMics :roomId="roomId" />

      <button @click="clickDeleteRoom" class="danger mt-50 button--mini">
        ルーム削除
      </button>
      <button @click="$emit('close')" class="close button--green">
        閉じる
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import NamePlateMini from '@/components/NamePlateMini.vue'
import ManageRoomMembers from '@/components/ManageRoomMembers.vue'
import ManageRoomMics from '@/components/ManageRoomMics.vue'

import userMapper from '@/store/user'
import roomMapper from '@/store/room'
import { kickUser } from '@/service/userAPI'
import {
  ban,
  releaseBan,
  deleteRoom,
  addMember,
  micAssign,
} from '@/service/roomAPI'

export type DataType = {
  modal: boolean
  micEnable: 'owner' | 'any' | 'assign'
}

export default Vue.extend({
  components: { NamePlateMini, ManageRoomMembers, ManageRoomMics },
  props: {
    roomId: { default: '', type: String },
  },
  data(): DataType {
    return {
      modal: false,
      micEnable: 'owner',
    }
  },
  computed: {
    ...userMapper.mapGetters(['me', 'roomOnlineUsers']),
    ...roomMapper.mapGetters(['room']),
  },
  created() {
    this.micEnable = this.room.mic_enable || 'owner'
  },
  methods: {
    clickDeleteRoom() {
      if (window.confirm('本当に' + this.room.name + 'を削除しますか？')) {
        deleteRoom(this.roomId)
        this.$emit('close')
      }
    },
    clickKick(uid: String) {
      let user
      for (let i = 0; i < this.roomOnlineUsers.length; i++) {
        if (this.roomOnlineUsers[i].uid === uid) {
          user = this.roomOnlineUsers[i]
        }
      }
      if (!user) return
      if (window.confirm('本当に' + user.name + 'を部屋からキックしますか？')) {
        kickUser({ roomId: this.roomId, userId: uid })
      }
    },
    clickBan(uid: String) {
      let user
      for (let i = 0; i < this.roomOnlineUsers.length; i++) {
        if (this.roomOnlineUsers[i].uid === uid) {
          user = this.roomOnlineUsers[i]
        }
      }
      if (!user) return
      if (window.confirm('本当に' + user.name + 'をBANしますか？')) {
        kickUser({ roomId: this.roomId, userId: uid })
        ban(this.roomId, uid)
      }
    },
    clickReleaseBan(uid: String) {
      releaseBan(this.roomId, uid)
    },
    clickAddMember(uid: String) {
      addMember(this.roomId, uid)
    },
    clickMicAssign(uid: String) {
      micAssign(this.roomId, uid)
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
  width: 95vw;
  left: 10vw;
  top: 10vh;
  max-height: 95vh;
  background-color: #ffffff;
  overflow-y: scroll;
  word-wrap: break-word;
}

.twitter_identity {
  display: inline-block;
}

.room-name {
  color: $color3;
  height: 27px;
  margin-right: 10px;
}

.mic-enable-select {
  color: $color3;
  height: 40px;
}
.disable-option {
  background-color: $color6;
}

.danger {
  border: solid 3px red;
}

.close {
  margin-left: 30px;
  margin-bottom: 100px;
}
</style>
