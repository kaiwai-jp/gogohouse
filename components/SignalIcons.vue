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
      class="signal-icon__clicked"
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
      class="signal-icon__clicked"
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
          this.roomOnlineUsers[i].uid === this.me.uid &&
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
  width: 44px;
  height: 44px;
  box-shadow: 4px 4px 2px -2px #777;
  background-color: white;
  margin-left: 4px;
  margin-right: 4px;
  padding: 4px;
  border-radius: 5px;
  cursor: pointer;
}

.signal-icon__clicked {
  @extend .signal-icon;
  box-shadow: inset 4px 4px 2px -2px #777;
}
</style>
