<template>
  <div class="modal-base">
    <div class="debug-modal">
      <h2 class="subtitle">オンラインユーザー</h2>
      <div v-for="user in roomOnlineUsers" :key="user.uid + 'online'">
        <NamePlateMini :uid="user.uid" class="twitter_identity" />
        <button v-if="user.uid != me.uid" @click="clickKick(user.uid)">
          KICK
        </button>
        <button v-if="user.uid != me.uid" @click="clickBan(user.uid)">
          BAN
        </button>
      </div>
      <h2 class="subtitle mt-50">BAN</h2>
      <div v-for="uid in room.ban" :key="uid + 'ban'">
        <NamePlateMini :uid="uid" class="twitter_identity" />
        <button @click="clickReleaseBan(uid)">解除</button>
      </div>
      <h2 class="subtitle mt-50">メンバー</h2>
      <div v-for="uid in room.members" :key="uid + 'member'">
        <NamePlateMini :uid="uid" class="twitter_identity" />
        <button v-if="uid != me.uid" @click="clickReleaseMember(uid)">
          解除
        </button>
      </div>
      <h2 class="subtitle mt-50">Twitterアカウントで<wbr>メンバー追加</h2>
      <div>
        <input class="room-name" v-model="addTwitter" />
        <button @click="clickAddMemberByTwitter">追加</button>
      </div>
      <button @click="clickDeleteRoom" class="danger mt-50">ルーム削除</button>
      <button @click="$emit('close')" class="close">閉じる</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import NamePlateMini from '@/components/NamePlateMini.vue'

import userMapper from '@/store/user'
import roomMapper from '@/store/room'
import { kickUser } from '@/service/userAPI'
import {
  ban,
  releaseBan,
  releaseMember,
  addMemberByTwitter,
  deleteRoom,
} from '@/service/roomAPI'

export type DataType = {
  modal: boolean
  addTwitter: String
}

export default Vue.extend({
  components: { NamePlateMini },
  props: {
    roomId: { default: '', type: String },
  },
  data(): DataType {
    return {
      modal: false,
      addTwitter: '',
    }
  },
  computed: {
    ...userMapper.mapGetters(['me', 'roomOnlineUsers']),
    ...roomMapper.mapGetters(['room']),
  },
  methods: {
    clickDeleteRoom() {
      if (window.confirm('本当に' + this.room.name + 'を削除しますか？')) {
        deleteRoom(this.roomId)
        this.$emit('close')
      }
    },
    clickKick(uid: String, move: String) {
      let user
      let moveString = move || 'KICK'

      for (let i = 0; i < this.roomOnlineUsers.length; i++) {
        user = this.roomOnlineUsers[i]
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
    clickReleaseBan(uid: String) {
      releaseBan(this.roomId, uid)
    },
    clickReleaseMember(uid: String) {
      releaseMember(this.roomId, uid)
    },
    clickAddMemberByTwitter() {
      addMemberByTwitter(this.roomId, this.addTwitter)
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
  max-height: 100vh;
  background-color: #ffffff;
  overflow-y: scroll;
  word-wrap: break-word;
}

.twitter_identity {
  display: inline-block;
}

.room-name {
  color: #636363;
  height: 27px;
  margin-right: 10px;
}

.danger {
  border: solid 3px red;
}

.close {
  margin-left: 30px;
}
</style>
