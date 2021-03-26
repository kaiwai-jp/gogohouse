<template>
  <div>
    <h2 class="subtitle mt-50">両想いの人</h2>
    <p v-if="ifNoMatch">マッチングしたらここに表示されます</p>
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
    ifNoMatch() {
      if (!this.userPrivates.matchlist) return true
      if (Object.keys(this.userPrivates.matchlist).length === 0) return true
    },
  },
  methods: {
    clickReleaseMatchlist(uid: String) {
      releaseMatchlist(this.me.uid, uid)
    },
  },
})
</script>

<style lang="scss" scoped>
.twitter_identity {
  display: inline-block;
}
</style>
