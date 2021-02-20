<template>
  <div class="main">
    <ul class="notice">
      <li>
        ChromeかSafariかFirefoxかEdgeをご利用ください。<br>Twitterアプリ内からはマイクが開けません。
      </li>
      <li>
        iPhone/iPadでは、マイクを開かないと相手の音が聞こえません。
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>

<style lang="scss" scoped>
.main {
  padding: 20px;
  color: #526488;
  border: 3px solid #526488;
  border-radius: 5px;
}

.notice {
  text-align: left;
}

.notice li {
  margin-bottom: 10px;
}
</style>
