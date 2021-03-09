<template>
  <div>
    <div class="impression">
      <h2 class="subtitle">使い方</h2>
      <p class="how-to">ルームを作成してTwitterフォロワーに知らせよう！</p>
      <p class="how-to">フォロワーとワイワイお喋りできます。</p>
      <p class="how-to">(リプライして誘ったほうが参加しやすいようです)</p>
    </div>
    <ul class="impression feature">
      <li>アプリのインストール不要</li>
      <li>すべての通信は暗号化されています</li>
      <li>音声を保存しません</li>
      <li>1ルーム20人まで</li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    text: { default: '', type: String },
  },
})
</script>

<style lang="scss" scoped>
.impression {
  margin: 20px auto;
  width: calc(100vw - 20px);
  max-width: 380px;
  padding: 10px;
  background-color: white;
  border-radius: 10px;
  border: solid 1px $color6;
  text-align: left;
}

.how-to {
  padding: 0px 10px 10px 10px;
}

.feature {
  list-style-type: none;
  padding-left: 20px;
}

.feature li::before {
  color: black;
  content: '☑';
  margin-right: 5px;
}
</style>
