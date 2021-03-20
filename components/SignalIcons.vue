<template>
  <div>
    <img
      v-if="!ifSignal('heart')"
      src="/heart_icon.png"
      @click="clickAddSignal('heart')"
      class="signal-icon"
    />
    <img
      v-if="ifSignal('heart')"
      src="/heart_icon.png"
      @click="clickRemoveSignal('heart')"
      class="signal-icon__clicked"
    />

    <img
      v-if="!ifSignal('rest')"
      src="/tea_icon.png"
      @click="clickAddSignal('rest')"
      class="signal-icon"
    />
    <img
      v-if="ifSignal('rest')"
      src="/tea_icon.png"
      @click="clickRemoveSignal('rest')"
      class="signal-icon__clicked"
    />

    <img
      v-if="!ifSignal('raise')"
      src="/raise_hand_icon.png"
      @click="clickAddSignal('raise')"
      class="signal-icon"
    />
    <img
      v-if="ifSignal('raise')"
      src="/raise_hand_icon.png"
      @click="clickRemoveSignal('raise')"
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
    ...userMapper.mapGetters(['me', 'roomOnlineUsers', 'myData']),
    ifSignal(): (arg0: string) => Boolean {
      const _this = this
      return function (signalString: string) {
        if (_this.myData.signal && _this.myData.signal.includes(signalString)) {
          return true
        }
        return false
      }
    },
  },
  methods: {
    clickAddSignal(signalString: string) {
      addSignal(this.me.uid, signalString)
    },
    clickRemoveSignal(signalString: string) {
      removeSignal(this.me.uid, signalString)
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
