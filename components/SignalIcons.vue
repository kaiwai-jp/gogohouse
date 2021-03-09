<template>
  <div>
    <img
      v-if="!ifRest"
      src="/tea_icon.png"
      @click="addRest"
      class="signal-icon"
    />
    <img
      v-if="ifRest"
      src="/tea_icon.png"
      @click="removeRest"
      class="signal-icon"
    />

    <img
      v-if="!ifRaise"
      src="/raise_hand_icon.png"
      @click="addRaise"
      class="signal-icon"
    />
    <img
      v-if="ifRaise"
      src="/raise_hand_icon.png"
      @click="removeRaise"
      class="signal-icon"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import userMapper from '@/store/user'

import { addSignal, removeSignal } from '@/service/userAPI'

export default Vue.extend({
  computed: {
    ...userMapper.mapGetters(['me', 'roomOnlineUsers']),
    ifRest(): Boolean {
      for (let i = 0; i < this.roomOnlineUsers.length; i++) {
        if (
          this.roomOnlineUsers[i].signal &&
          this.roomOnlineUsers[i].signal.includes('rest')
        )
          return true
      }
      return false
    },
    ifRaise(): Boolean {
      for (let i = 0; i < this.roomOnlineUsers.length; i++) {
        if (
          this.roomOnlineUsers[i].uid === this.me.uid &&
          this.roomOnlineUsers[i].signal &&
          this.roomOnlineUsers[i].signal.includes('raise')
        )
          return true
      }
      return false
    },
  },
  methods: {
    addRest() {
      addSignal(this.me.uid, 'rest')
    },
    removeRest() {
      removeSignal(this.me.uid, 'rest')
    },
    addRaise() {
      addSignal(this.me.uid, 'raise')
    },
    removeRaise() {
      removeSignal(this.me.uid, 'raise')
    },
  },
})
</script>

<style lang="scss" scoped>
.signal-icon {
  width: 36px;
  height: 36px;
  filter: drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.5));
}
</style>
