<template>
  <div>
    <button @click="clear">実行</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { clearConnectionsDB } from '@/service/webrtcAPI'

export default Vue.extend({
  methods: {
    clear() {
      clearConnectionsDB()
    },
  },
})
</script>
