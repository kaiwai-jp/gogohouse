<template>
  <div class="message">
    <UserIcon :uid="roomMessage.uid" v-if="roomMessage.uid" />
    <p v-html="autoLinkText"></p>
    <div class="post-block">
      <input
        v-model="newMessage"
        placeholder="ひとことメッセージ"
        class="new-message"
      />
      <button class="button--mini" @click="postMessage">投稿</button>
      <button
        class="button--mini"
        @click="clickDeleteMessage"
        v-if="roomMessage.uid == me.uid || room.owner_id == me.uid"
      >
        削除
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import messageMapper from '@/store/message'
import roomMapper from '@/store/room'
import userMapper from '@/store/user'
import warpMapper from '@/store/warp'
import { deleteMessage } from '@/service/messageAPI'

import UserIcon from '@/components/UserIcon.vue'

export type DataType = {
  newMessage: string
}

export default Vue.extend({
  components: {
    UserIcon,
  },
  data(): DataType {
    return {
      newMessage: '',
    }
  },
  computed: {
    ...roomMapper.mapGetters(['room']),
    ...userMapper.mapGetters(['me']),
    ...messageMapper.mapGetters(['roomMessage']),
    roomId(): string {
      return this.$route.params.id
    },
    autoLinkText(): string {
      if (!this.roomMessage.message) return ''
      const exp = /(https?:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi
      return this.roomMessage.message.replace(
        exp,
        '<a href="$1" target="_blank">$1</a>'
      )
    },
  },
  created() {
    this.ROOM_MESSAGE_LISTENER(this.roomId)
  },
  methods: {
    ...messageMapper.mapActions([
      'POST_MESSAGE',
      'ROOM_MESSAGE_LISTENER',
      'END_ROOM_MESSAGE_LISTENER',
    ]),
    ...warpMapper.mapActions(['OPEN_ALERT_DIALOG']),
    postMessage() {
      this.POST_MESSAGE({
        message: this.newMessage,
        roomId: this.roomId,
      }).catch((err) => this.OPEN_ALERT_DIALOG(err))

      this.newMessage = ''
    },
    clickDeleteMessage() {
      deleteMessage(this.roomId)
    },
  },
  beforeDestroy() {
    this.END_ROOM_MESSAGE_LISTENER()
  },
})
</script>

<style lang="scss" scoped>
.new-message {
  color: $color3;
  height: 30px;
  margin-top: 5px;
  margin-bottom: 5px;
}

.message {
  margin: 20px auto;
  width: calc(100vw - 20px);
  max-width: 380px;
  padding: 10px;
  background-color: white;
  border-radius: 10px;
  border: solid 1px $color6;
  text-align: left;
}

p {
  display: inline;
}
</style>
