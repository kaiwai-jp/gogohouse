<template>
  <div class="main">
    <ul class="notice">
      <li>
        ChromeかFirefoxをご利用ください。現状Twitterアプリ内からはうまく動作しません。
      </li>
      <li>iPhone/iPadのSafariでは動作しません。</li>
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
