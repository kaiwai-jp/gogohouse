<template>
  <div>
    <header>
      <img src="/peace.png" class="gogo-icon" />
      <a class="top-link" href="/">GoGoHouse</a>
      <div class="profile">
        <img :src="twitter_icon" v-show="twitter_icon" class="twitter-icon" />
        <span class="display-name">{{ name }}</span>
      </div>
    </header>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import userMapper from '@/store/user'

export default Vue.extend({
  computed: {
    ...userMapper.mapGetters(['me']),
    twitter_icon() {
      return this.me.icon
    },
    name() {
      return this.me.name
    },
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

.profile {
  display: inline-block;
  float: right;
}

.display-name {
  vertical-align: top;
}

.twitter-icon {
  border-radius: 50%;
  width: 20px;
  height: 20px;
}
</style>
