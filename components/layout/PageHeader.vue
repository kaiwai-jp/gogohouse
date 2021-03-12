<template>
  <div>
    <header>
      <div class="left-area">
        <img src="/peace.png" alt="GoGoHouseアイコン" class="gogo-icon" />
        <nuxt-link to="/" class="top-link">GoGoHouse</nuxt-link>
      </div>
      <div class="right-area" v-if="me">
        <nuxt-link to="/home" class="home_area">
          <NamePlateMini
            :uid="me.uid"
            :shorten="true"
            class="twitter_identity"
          />
          <img src="/home.png" alt="ホームアイコン" class="home-icon" />
        </nuxt-link>
      </div>
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
  display: table;
  width: 100%;
  border-bottom: solid 1px $color6;
  color: $color1;
  padding: 10px;
  font-weight: 600;
}

.left-area {
  display: table-cell;
}

.right-area {
  display: table-cell;
  text-align: right;
}

a {
  text-decoration: none;
}

.gogo-icon {
  width: 18px;
  height: 18px;
}

.home_area {
  margin-left: 5px;
}

.home-icon {
  width: 18px;
  height: 18px;
}

.twitter_identity {
  display: inline;
}
</style>
