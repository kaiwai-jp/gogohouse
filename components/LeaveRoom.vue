<template>
  <div>
    <button class="button--green" @click="leave">退出</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import userMapper from '@/store/user'
import roomMapper from '@/store/room'

export default Vue.extend({
  async created() {
    await this.GET_USER(true)
    if (this.me.current_room !== this.roomId) {
      this.$router.push(`/home`)
    }
    this.REGIST_CONNECT_AND_WHEN_DISCONNECT(this.roomId)

    this.$store.subscribe((mutation, state) => {
      if (
        mutation.type === 'user/add_room_online_users' ||
        mutation.type === 'user/modify_room_online_users'
      ) {
        if (mutation.payload.uid === this.me.uid) {
          if (!mutation.payload.current_room) {
            location.reload()
          }
        }
      }
      if (mutation.type === 'room/set_room') {
        if (Object.keys(mutation.payload).length === 0) {
          location.reload()
        }
      }
    })
    this.ROOM_LISTENER(this.roomId)
  },
  beforeDestroy() {
    this.UNREGIST_DISCONNECT_AND_OFFLINE()
    this.END_ROOM_LISTENER()
  },
  computed: {
    ...userMapper.mapGetters(['me']),
    roomId(): string {
      return this.$route.params.id
    },
  },
  methods: {
    ...userMapper.mapActions([
      'GET_USER',
      'REGIST_CONNECT_AND_WHEN_DISCONNECT',
      'UNREGIST_DISCONNECT_AND_OFFLINE',
    ]),
    ...roomMapper.mapActions(['ROOM_LISTENER', 'END_ROOM_LISTENER']),
    leave(): void {
      this.$router.push(`/home`)
    },
  },
})
</script>

<style lang="scss"></style>
