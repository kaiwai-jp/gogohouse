<template>
  <div class="plate">
    <nuxt-link v-if="link" :to="toLink">
      <img :src="userData.icon" v-if="userData.icon" class="icon" />
      <span class="display-name" v-if="userData.name">
        {{ userData.name }}
      </span>
    </nuxt-link>
    <div v-if="!link">
      <img :src="userData.icon" v-if="userData.icon" class="icon" />
      <span class="display-name" v-if="userData.name">
        {{ userData.name }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import userMapper from '@/store/user'

export default Vue.extend({
  props: {
    uid: { default: '', type: String },
    link: { default: false, type: Boolean },
  },
  computed: {
    ...userMapper.mapGetters(['getUserData']),
    userData(): Object {
      this.REF_USER_DATA({ uid: this.uid })
      return this.getUserData(this.uid)
    },
    toLink(): String {
      return '/user/' + this.uid
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

a {
  text-decoration: none;
}
</style>
