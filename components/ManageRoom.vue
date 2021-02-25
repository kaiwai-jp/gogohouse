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

      <h2 class="subtitle mt-50">メンバー</h2>
      <div v-for="uid in room.members" :key="uid + 'member'">
        <NamePlateMini :uid="uid" class="twitter_identity" />
        <button
          v-if="uid != me.uid"
          @click="clickReleaseMember(uid)"
          class="button--mini"
        >
          解除
        </button>
        <button
          v-if="uid != me.uid"
          @click="clickMicAssign(uid)"
          class="button--mini"
        >
          MIC
        </button>
      </div>

      <h2 class="subtitle mt-50">Twitterアカウントで<wbr />メンバー追加</h2>
      <div>
        <input class="room-name" v-model="addTwitter" />
        <button @click="clickAddMemberByTwitter" class="button--mini">
          追加
        </button>
      </div>

      <h2 class="subtitle mt-50">マイク権</h2>
      <div>
        <select
          v-model="micEnable"
          @change="clickUpdateMicEnable"
          class="mic-enable-select"
        >
          <option value="owner">オーナーがルームにいるとき</option>
          <option value="any">いつでも誰でも</option>
          <option value="assign">オーナーが指名したとき</option>
        </select>
      </div>

      <h2 class="subtitle mt-50">マイク権ありの人</h2>
      <div v-for="uid in room.mic_assign" :key="uid + 'mic_enable'">
        <NamePlateMini :uid="uid" class="twitter_identity" />
        <button @click="clickReleaseMicAssign(uid)" class="button--mini">
          解除
        </button>
      </div>

      <button @click="clickDeleteRoom" class="danger m-50 button--mini">
        ルーム削除
      </button>
      <button @click="$emit('close')" class="close button--grey">閉じる</button>
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
  addMember,
  releaseMember,
  addMemberByTwitter,
  deleteRoom,
  updateMicEnable,
  micAssign,
  releaseMicAssign,
} from '@/service/roomAPI'

export type DataType = {
  modal: boolean
  addTwitter: String
  micEnable: 'owner' | 'any' | 'assign'
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
    clickAddMember(uid: String) {
      addMember(this.roomId, uid)
    },
    clickReleaseMember(uid: String) {
      releaseMember(this.roomId, uid)
    },
    clickAddMemberByTwitter() {
      const screenName = this.addTwitter.trim()
      if (!screenName.match(/@[0-9a-zA-Z_]{1,15}/)) {
        alert('@で始まるTwitterアカウントを入力してください')
      }
      addMemberByTwitter(this.roomId, screenName)
    },
    clickUpdateMicEnable() {
      updateMicEnable(this.roomId, this.micEnable)
    },
    clickMicAssign(uid: String) {
      micAssign(this.roomId, uid)
    },
    clickReleaseMicAssign(uid: String) {
      releaseMicAssign(this.roomId, uid)
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
}
</style>
