<template>
  <div class="message">
    <p>
      <UserIcon :uid="roomMessage.uid" v-if="roomMessage.uid" />
      {{ roomMessage.message }}
    </p>
    <div class="post-block">
      <input
        v-model="newMessage"
        placeholder="ひとことメッセージ"
        class="new-message"
      />
      <button class="button--mini" @click="postMessage">投稿</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import messageMapper from '@/store/message'
import warpMapper from '@/store/warp'

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
    ...messageMapper.mapGetters(['roomMessage']),
    roomId(): string {
      return this.$route.params.id
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
</style>
