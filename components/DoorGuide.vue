<template>
  <div class="main">
    <ul class="notice">
      <li>
        ChromeかSafariをご利用ください。<br />Twitter内からはマイクが開けません
      </li>
      <li>
        iPhoneのブラウザでは、<br />マイクを開かないと相手の音が聞こえません
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
  border: 3px solid #636363;
}

.notice {
  text-align: left;
}

.notice li {
  margin-bottom: 10px;
}
</style>
