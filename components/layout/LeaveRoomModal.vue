<template>
  <div class="modal-base" v-if="modal">
    <div class="alert-modal">
      <p>{{ leaveroomDialogObject.message }}</p>
      <button class="button--green mt-50" @click="success">OK</button>
      <button class="button--brown mt-50" @click="fail">キャンセル</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import warpMapper from '@/store/warp'

export default Vue.extend({
  computed: {
    ...warpMapper.mapGetters(['leaveroomDialogObject']),
    modal(): Boolean {
      return Object.keys(this.leaveroomDialogObject).length > 0
    },
  },
  methods: {
    ...warpMapper.mapActions(['RESOLVE_LEAVEROOM_DIALOG', 'REJECT_LEAVEROOM_DIALOG']),
    success() {
      this.RESOLVE_LEAVEROOM_DIALOG()
    },
    fail() {
      this.REJECT_LEAVEROOM_DIALOG()
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

.alert-modal {
  padding: 30px;
  min-width: 100px;
  max-width: 90vw;
  background-color: #ffffff;
  overflow-y: scroll;
  word-wrap: break-word;
  text-align: center;
}
</style>
