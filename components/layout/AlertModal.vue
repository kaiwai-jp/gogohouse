<template>
  <div class="modal-base" v-if="modal">
    <div class="alert-modal">
      <p>{{ alertDialogObject.message }}</p>
      <button class="button--green mt-50" @click="close">OK</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import warpMapper from '@/store/warp'

export default Vue.extend({
  computed: {
    ...warpMapper.mapGetters(['alertDialogObject']),
    modal(): Boolean {
      return Object.keys(this.alertDialogObject).length > 0
    },
  },
  methods: {
    ...warpMapper.mapActions(['RESOLVE_ALERT_DIALOG']),
    close() {
      this.RESOLVE_ALERT_DIALOG()
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
