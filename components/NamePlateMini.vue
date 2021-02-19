<template>
  <div class="plate">
    <img :src="userData.icon" v-if="userData.icon" class="icon" />
    <nuxt-link to="/home" class="display-name" v-if="userData.name">{{
      userData.name
    }}</nuxt-link>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import userMapper from '@/store/user'

export default Vue.extend({
  props: { uid: { default: '', type: String } },
  computed: {
    ...userMapper.mapGetters(['getUserData']),
    userData(): Object {
      this.REF_USER_DATA({ uid: this.uid })
      return this.getUserData(this.uid)
    },
  },
  methods: {
    ...userMapper.mapActions(['REF_USER_DATA']),
  },
})
</script>

<style lang="scss" scoped>
.icon {
  border-radius: 50%;
  width: 18px;
  height: 18px;
}

.display-name {
  vertical-align: top;
  text-decoration: none;
}
</style>
