<template>
  <div>
    <div v-if="!waiting" class="mb-50">
      <button
        class="button--green"
        @click="enterRoom"
        v-if="ifPermit && !alredyInRoom"
      >
        ルームに入る
      </button>
      <button class="button--green" v-if="!ifPermit" disalbed>
        入れません
      </button>
      <span v-if="alredyInRoom">すでにルームにいます</span>
    </div>
    <div v-if="waiting" class="mb-50">
      <button class="button--green" diabled>処理中...</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import roomMapper from '@/store/room'
import userMapper from '@/store/user'
import warpMapper from '@/store/warp'
import {
  enterOpenRoom,
  enterSocialRoom,
  enterClosedRoom,
} from '@/service/roomAPI'

export type DataType = {
  waiting: boolean
}

export default Vue.extend({
  data(): DataType {
    return {
      waiting: false,
    }
  },
  computed: {
    ...userMapper.mapGetters(['me', 'myData']),
    ...roomMapper.mapGetters(['room']),
    roomId(): string {
      return this.$route.params.id
    },
    ifPermit(): boolean {
      if (this.room.room_type === 'open') {
        return true
      }
      if (this.room.room_type === 'social') {
        return true
      }
      if (this.room.room_type === 'closed') {
        if (this.room.members.includes(this.me.uid)) {
          return true
        }
      }
      return false
    },
    alredyInRoom(): boolean {
      if (
        this.myData.current_room === this.roomId &&
        this.myData.status === 'online'
      ) {
        return true
      }
      return false
    },
  },
  methods: {
    ...userMapper.mapActions(['SET_MIC_OFF']),
    ...warpMapper.mapActions(['PLAY_SILENT_MUSIC']),
    ...warpMapper.mapActions(['OPEN_ALERT_DIALOG']),
    enterRoom() {
      this.PLAY_SILENT_MUSIC()
      if (this.room.room_type === 'open') {
        this.waiting = true
        enterOpenRoom(this.roomId)
          .then(() => {
            this.SET_MIC_OFF()
            this.$router.push(`/room/${this.roomId}`)
          })
          .catch((err) => {
            this.OPEN_ALERT_DIALOG(err)
            this.waiting = false
          })
      } else if (this.room.room_type === 'social') {
        this.waiting = true
        enterSocialRoom(this.roomId)
          .then(() => {
            this.SET_MIC_OFF()
            this.$router.push(`/room/${this.roomId}`)
          })
          .catch((err) => {
            this.OPEN_ALERT_DIALOG(err)
            this.waiting = false
          })
      } else if (this.room.room_type === 'closed') {
        this.waiting = true
        enterClosedRoom(this.roomId)
          .then(() => {
            this.SET_MIC_OFF()
            this.$router.push(`/room/${this.roomId}`)
          })
          .catch((err) => {
            this.OPEN_ALERT_DIALOG(err)
            this.waiting = false
          })
      }
    },
  },
})
</script>

<style lang="scss"></style>
