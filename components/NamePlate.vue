<template>
  <div class="plate">
    <no-ssr>
      <a :href="toLink" :disabled="isDisabled">
        <img class="icon" :src="userData.icon" />
        <div class="name-area">
          <span class="name">{{ userData.name }}</span>
          <br />
          <span class="twitter-id">{{ userData.twitter }}</span>
        </div>
      </a>
      <img class="speaker_icon" src="/speaker.png" v-if="isSpeaker" />
    </no-ssr>
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
    ...userMapper.mapGetters(['getUserData', 'roomOnlineUsers']),
    userData(): Object {
      this.REF_USER_DATA({ uid: this.uid })
      return this.getUserData(this.uid)
    },
    toLink(): String | Boolean {
      if (this.link) {
        return '/user/' + this.uid
      }
      return false
    },
    isDisabled(): Boolean {
      return !this.link
    },
    isSpeaker(): Boolean {
      for (let i = 0; i < this.roomOnlineUsers.length; i++) {
        if (
          this.roomOnlineUsers[i].uid === this.uid &&
          this.roomOnlineUsers[i].current_room &&
          this.roomOnlineUsers[i].mic_status === 'on'
        ) {
          return true
        }
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
.plate {
  text-align: left;
}

.icon {
  display: inline-block;
  border-radius: 50%;
}

.name-area {
  display: inline-block;
  vertical-align: top;
  margin-left: 5px;
}

.name {
  color: #000000;
}

.twitter-id {
  color: #636363;
  font-size: 14px;
}

a {
  text-decoration: none;
}

.speaker_icon {
  width: 36px;
  height: 36px;
}
</style>
