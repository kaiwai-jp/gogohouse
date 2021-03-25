<template>
  <img :src="userData.icon" alt="アイコン" v-if="userData.icon" class="icon" />
</template>

<script lang="ts">
import Vue from 'vue'
import userMapper from '@/store/user'

interface User {
  name: string | undefined
}
export default Vue.extend({
  props: {
    uid: { default: '', type: String },
    link: { default: false, type: Boolean },
  },
  computed: {
    ...userMapper.mapGetters(['getUserData']),
    userData(): User {
      this.REF_USER_DATA({ uid: this.uid })
      return this.getUserData(this.uid)
    },
    toLink(): String | Boolean {
      if (this.link) {
        return '/user/' + this.uid
      }
      return false
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
  background-color: #aab8c2;
}

.display-name {
  color: $color1;
  vertical-align: top;
  text-decoration: none;
}

a {
  text-decoration: none;
}
</style>
