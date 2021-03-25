<template>
  <div class="plate">
    <a :href="toLink" :disabled="!link">
      <img :src="userData.icon" alt="" v-if="userData.icon" class="icon" />
      <span class="display-name" v-if="name">
        {{ name }}
      </span>
    </a>
  </div>
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
    shorten: { default: false, type: Boolean },
  },
  computed: {
    ...userMapper.mapGetters(['me', 'getUserData', 'roomOnlineUsers']),
    userData(): User {
      if (this.me.uid == this.uid && this.me.icon) return this.me

      for (let i = 0; i < this.roomOnlineUsers.length; i++) {
        if (this.roomOnlineUsers[i].uid === this.uid) {
          return this.roomOnlineUsers[i]
        }
      }

      this.REF_USER_DATA({ uid: this.uid })
      return this.getUserData(this.uid)
    },
    toLink(): String | Boolean {
      if (this.link) {
        return '/user/' + this.uid
      }
      return false
    },
    name(): String | undefined {
      if (this.userData.name && this.shorten) {
        let shortenName = this.userData.name.substring(0, 8)
        if (this.userData.name.length > 8) {
          shortenName += '...'
        }
        return shortenName
      }
      return this.userData.name
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
