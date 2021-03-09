<template>
  <div class="plate">
    <client-only>
      <a :href="toLink" :disabled="isDisabled">
        <img class="icon" :src="userData.icon" />
        <div class="name-area">
          <span class="name">{{ userData.name }}</span>
          <br />
          <span class="twitter-id">{{ userData.twitter }}</span>
        </div>
      </a>
      <img
        class="speaker-icon"
        src="/speaker_icon.png"
        alt="接続確立"
        v-show="isSpeaker && !isDisconnect"
      />
      <img
        class="speaker-icon"
        src="/speaker_disconnect_icon.png"
        alt="接続中"
        v-show="isSpeaker && isDisconnect"
      />
      <img
        v-if="signalShow && ifRest"
        src="/tea_icon.png"
        class="signal-icon"
      />
      <img
        v-if="signalShow && ifRaise"
        src="/raise_hand_icon.png"
        class="signal-icon"
      />
    </client-only>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import userMapper from '@/store/user'
import webrtcMapper from '@/store/webrtc'

export default Vue.extend({
  props: {
    uid: { default: '', type: String },
    link: { default: false, type: Boolean },
    signalShow: { default: false, type: Boolean },
  },
  computed: {
    ...userMapper.mapGetters(['me', 'getUserData', 'roomOnlineUsers']),
    ...webrtcMapper.mapGetters(['userPeerConnectionState']),
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
    ifRest(): Boolean {
      for (let i = 0; i < this.roomOnlineUsers.length; i++) {
        if (
          this.roomOnlineUsers[i].uid === this.uid &&
          this.roomOnlineUsers[i].signal &&
          this.roomOnlineUsers[i].signal.includes('rest')
        ) {
          return true
        }
      }
      return false
    },
    ifRaise(): Boolean {
      for (let i = 0; i < this.roomOnlineUsers.length; i++) {
        if (
          this.roomOnlineUsers[i].uid === this.uid &&
          this.roomOnlineUsers[i].signal &&
          this.roomOnlineUsers[i].signal.includes('raise')
        ) {
          return true
        }
      }
      return false
    },
    isDisconnect(): Boolean {
      if (this.me && this.me.uid === this.uid) return false
      if (
        this.userPeerConnectionState &&
        this.userPeerConnectionState[this.uid] &&
        this.userPeerConnectionState[this.uid].inbound === 'connected'
      ) {
        return false
      }
      return true
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
  width: 42px;
  height: 42px;
}

.name-area {
  display: inline-block;
  vertical-align: top;
  margin-left: 5px;
  line-height: 1.4rem;
}

.name {
  color: #000000;
}

.twitter-id {
  color: $color3;
  font-size: 14px;
}

a {
  text-decoration: none;
}

.speaker-icon {
  display: inline-block;
  width: 32px;
  height: 32px;
  margin-bottom: 8px;
}

.signal-icon {
  width: 36px;
  height: 36px;
}
</style>
