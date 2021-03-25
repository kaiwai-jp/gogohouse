<template>
  <div class="profile">
    {{ me.profile }}
    <button class="button--mini" @click="refreshMyData">再読み込み</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import userMapper from '@/store/user'
import { refreshTwitterData } from '@/service/userAPI'

export default Vue.extend({
  computed: {
    ...userMapper.mapGetters(['me']),
  },
  methods: {
    ...userMapper.mapActions(['SET_MY_DATA']),
    refreshMyData() {
      refreshTwitterData(this.me.twitter_id)
        .then(() => this.SET_MY_DATA())
        .catch()
    },
  },
})
</script>

<style lang="scss" scoped>
.profile {
  max-width: 300px;
  margin-top: 10px;
  text-align: left;
}
</style>
