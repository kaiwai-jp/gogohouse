<template>
  <div>
    <div v-if="!waiting" class="mb-50">
      <button class="button--grey" @click="enterRoom" v-if="ifPermit">
        部屋に入る
      </button>
    </div>
    <div v-if="waiting" class="mb-50">
      <button class="button--grey" diabled>処理中...</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import roomMapper from '@/store/room'
import userMapper from '@/store/user'
import warpMapper from '@/store/warp'
import { enterOpenRoom, enterClosedRoom } from '@/service/roomAPI'

export type DataType = {
  waiting: boolean
}

export default Vue.extend({
  data(): DataType {
    return {
      waiting: false,
    }
  },
  async created() {},
  beforeDestroy() {},
  computed: {
    ...userMapper.mapGetters(['me']),
    ...roomMapper.mapGetters(['room']),

    roomId(): string {
      return this.$route.params.id
    },
    ifPermit(): boolean {
      if (this.room.room_type === 'open') {
        return true
      }
      if (this.room.room_type === 'closed') {
        if (this.room.members.includes(this.me.uid)) {
          return true
        }
      }
      return false
    },
  },
  methods: {
    ...warpMapper.mapActions(['PLAY_SILENT_MUSIC']),
    enterRoom() {
      this.PLAY_SILENT_MUSIC()
      if (this.room.room_type === 'open') {
        this.waiting = true
        enterOpenRoom(this.roomId)
          .then(() => {
            this.$router.push(`/room/${this.roomId}`)
          })
          .catch((err) => alert(err))
          .finally(() => {
            this.waiting = false
          })
      } else if (this.room.room_type === 'closed') {
        this.waiting = true
        enterClosedRoom(this.roomId)
          .then(() => {
            this.$router.push(`/room/${this.roomId}`)
          })
          .catch((err) => alert(err))
          .finally(() => {
            this.waiting = false
          })
      }
    },
  },
})
</script>

<style lang="scss"></style>
