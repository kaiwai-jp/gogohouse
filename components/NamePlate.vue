<template>
  <div class="plate">
    <client-only>
      <a :href="toLink" :disabled="isDisabled">
        <img class="icon" :src="userData.icon" alt="アイコン" />
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
        @click="PLAY_WEBRTC_SOUND"
      />
      <img
        class="speaker-icon"
        src="/speaker_disconnect_icon.png"
        alt="接続中"
        v-show="isSpeaker && isDisconnect"
      />
      <img
        v-if="signalShow && ifSignal('heart')"
        src="/heart_icon.png"
        alt="ハート"
        class="signal-icon"
      />
      <img
        v-if="signalShow && ifSignal('rest')"
        src="/tea_icon.png"
        alt="お茶"
        class="signal-icon"
      />
      <img
        v-if="signalShow && ifSignal('raise')"
        src="/raise_hand_icon.png"
        alt="挙手"
        class="signal-icon"
      />
    </client-only>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import userMapper from '@/store/user'
import webrtcMapper from '@/store/webrtc'
import warpMapper from '@/store/warp'

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
    ifSignal(): (arg0: string) => Boolean {
      const _this = this
      return function (signalString: string) {
        for (let i = 0; i < _this.roomOnlineUsers.length; i++) {
          if (
            _this.roomOnlineUsers[i].uid === _this.uid &&
            _this.roomOnlineUsers[i].signal &&
            _this.roomOnlineUsers[i].signal.includes(signalString)
          ) {
            return true
          }
        }
        return false
      }
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
    ...warpMapper.mapActions(['PLAY_WEBRTC_SOUND']),
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
  background-color: #aab8c2;
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
