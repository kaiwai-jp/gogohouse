<template>
  <div>
    <h2 class="subtitle bt-1">話してみたい人</h2>
    <div v-for="uid in userPrivates.wishlist" :key="uid">
      <NamePlate :uid="uid" :link="true" class="twitter_identity" />
      <button
        v-if="uid != me.uid"
        @click="clickReleaseWishlist(uid)"
        class="button--mini"
      >
        解除
      </button>
    </div>

    <div v-for="screenName in userPrivates.reserved_wishlist" :key="screenName">
      <ReservedMemberNamePlate
        :screenName="screenName"
        class="twitter_identity"
      />
      <button
        @click="clickReleaseReservedWishlist(screenName)"
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
import ReservedMemberNamePlate from '@/components/ReservedMemberNamePlate.vue'

import userMapper from '@/store/user'
import wishlistMapper from '@/store/wishlist'
import { releaseWishlist, releaseReservedWishlist } from '@/service/wishlistAPI'

export default Vue.extend({
  components: { NamePlate, ReservedMemberNamePlate },
  computed: {
    ...wishlistMapper.mapGetters(['userPrivates']),
    ...userMapper.mapGetters(['me']),
  },
  created() {
    this.USER_PRIVATES_LISTENER()
  },
  methods: {
    ...wishlistMapper.mapActions([
      'USER_PRIVATES_LISTENER',
      'END_USER_PRIVATES_LISTENER',
    ]),
    clickReleaseWishlist(uid: String) {
      releaseWishlist(this.me.uid, uid)
    },
    clickReleaseReservedWishlist(uid: String) {
      releaseReservedWishlist(this.me.uid, uid)
    },
  },
  beforeDestroy() {
    this.END_USER_PRIVATES_LISTENER()
  },
})
</script>

<style lang="scss" scoped>
.twitter_identity {
  display: inline-block;
}
</style>
