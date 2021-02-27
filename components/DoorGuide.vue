<template>
  <div class="main">
    <ul class="notice">
      <li>iPhone/iPadのTwitterアプリ内では動作しません。</li>
      <li>このページのURLをTwitterでシェアしてください。</li>
      <TwitterPublish :text="twitterText" />
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
        'GoGoHouse「' + this.room.name + '」ルームでフォロワーとお喋りしよう'
      )
    },
  },
})
</script>

<style lang="scss" scoped>
.main {
  padding: 20px 20px 10px 10px;
  color: $color2;
  border: 3px solid $color2;
  border-radius: 5px;
}

.notice {
  text-align: left;
}

.notice li {
  margin-bottom: 10px;
}
</style>
