<template>
  <div>
    <div class="impression" v-if="ifMac">
      <h2 class="subtitle">iPhoneで音が聞こえない時</h2>
      <p>スピーカーアイコンをタップしてみてください。</p>
    </div>
    <div class="impression twitter" v-if="room.name">
      <p>
        Twitterに貼ってフォロワーに知らせよう
        <TwitterPublish :text="twitterText" class="twitter-button" />
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import roomMapper from '@/store/room'

export default Vue.extend({
  props: {
    text: { default: '', type: String },
  },
  computed: {
    ...roomMapper.mapGetters(['room']),
    ifMac(): boolean {
      if (window.navigator.userAgent.indexOf('Mac') > 0) return true
      return false
    },
    twitterText(): string {
      return (
        '「' +
        this.room.name +
        '」でおしゃべりなう。GoGoHouseは無料でTwitterフォロワーと音声トークできるサービスです。 @joinGoGoHouse'
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

.twitter {
  padding-bottom: 0;
}

.twitter-button {
  margin-top: 5px;
}
</style>
