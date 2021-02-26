<template>
  <div>
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import NamePlateMini from '@/components/NamePlateMini.vue'
import ManageRoomMembers from '@/components/ManageRoomMembers.vue'

import userMapper from '@/store/user'
import roomMapper from '@/store/room'
import {
  updateMicEnable,
  micAssign,
  releaseMicAssign,
} from '@/service/roomAPI'

export type DataType = {
  modal: boolean
  micEnable: 'owner' | 'any' | 'assign'
}

export default Vue.extend({
  components: { NamePlateMini, ManageRoomMembers },
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
.twitter_identity {
  display: inline-block;
}

.mic-enable-select {
  color: $color3;
  height: 40px;
}
</style>
