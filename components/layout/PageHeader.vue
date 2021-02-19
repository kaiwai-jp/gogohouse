<template>
  <div>
    <header>
      <img src="/peace.png" class="gogo-icon" />
      <nuxt-link to="/" class="top-link">GoGoHouse</nuxt-link>
      <nuxt-link to="/home">
        <NamePlateMini :uid="me.uid" class="twitter_identity" />
      </nuxt-link>
    </header>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import userMapper from '@/store/user'

import NamePlateMini from '@/components/NamePlateMini.vue'

export default Vue.extend({
  components: { NamePlateMini },
  computed: {
    ...userMapper.mapGetters(['me']),
  },
})
</script>

<style lang="scss" scoped>
header {
  border-bottom: solid 1px #efefef;
  color: #35495e;
  padding: 10px;
  font-weight: 600;
}

.top-link {
  text-decoration: none;
}

.gogo-icon {
  display: inline-block;
  width: 18px;
  height: 18px;
}

.twitter_identity {
  float: right;
}
</style>
