<template>
  <div>
    <div class="impression">
      <h2 class="subtitle">使い方</h2>
      <p>Twitter連携してルームに入るとワイワイおしゃべり空間に参加できます。</p>
      <p>マイクを開くとあなたもおしゃべりできます。</p>
    </div>
    <div class="impression twitter">
      <p>
        このルームのURLをTwitterにシェア！
        <TwitterPublish :text="twitterText" class="twitter-button" />
      </p>
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
import roomMapper from '@/store/room'

import TwitterPublish from '@/components/TwitterPublish.vue'

export default Vue.extend({
  components: {
    TwitterPublish,
  },
  computed: {
    ...roomMapper.mapGetters(['room']),
    twitterText(): String {
      return (
        '「' +
        this.room.name +
        '」で音声トークに参加なう。GoGoHouseは無料でTwitterフォロワーと音声トークできるサービスです。'
      )
    },
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

.impression p {
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

.twitter {
  padding-bottom: 0;
}
.twitter-button {
  margin-top: 5px;
}
</style>
