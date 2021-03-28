<template>
  <div>
    <h2 class="subtitle bt-1">両思いの人</h2>
    <p v-if="!ifMatch">マッチングしたらここに表示されます</p>
    <p v-if="ifMatch" class="congratulations">
      おめでとうございます。勇気を出してTwitterのリプライかDMで連絡しよう！
    </p>
    <div v-for="uid in userPrivates.matchlist" :key="uid">
      <NamePlate :uid="uid" :link="true" class="twitter_identity" />
      <button
        v-if="uid != me.uid"
        @click="clickReleaseMatchlist(uid)"
        class="button--mini"
      >
        解除
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import NamePlate from '@/components/NamePlate.vue'

import userMapper from '@/store/user'
import wishlistMapper from '@/store/wishlist'
import { releaseMatchlist } from '@/service/wishlistAPI'

export default Vue.extend({
  components: { NamePlate },
  computed: {
    ...wishlistMapper.mapGetters(['userPrivates']),
    ...userMapper.mapGetters(['me']),
    ifMatch() {
      if (!this.userPrivates.matchlist) return false
      if (Object.keys(this.userPrivates.matchlist).length === 0) return false
      return true
    },
  },
  methods: {
    clickReleaseMatchlist(uid: String) {
      if (window.confirm('本当に解除しますか？相手には通知されません。')) {
        releaseMatchlist(this.me.uid, uid)
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.congratulations {
  margin-bottom: 10px;
}

.twitter_identity {
  display: inline-block;
}
</style>
