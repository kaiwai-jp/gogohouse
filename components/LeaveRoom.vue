<template>
  <div>
    <button class="button--grey" @click="leave">退出</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import userMapper from '@/store/user'

export default Vue.extend({
  async created() {
    await this.GET_USER()
    if (this.me.current_room !== this.roomId) {
      this.$router.push(`/home`)
    }
    this.REGIST_CONNECT_AND_WHEN_DISCONNECT(this.roomId)
  },
  beforeDestroy() {
    this.UNREGIST_DISCONNECT_AND_OFFLINE()
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
    leave(): void {
      this.$router.push(`/home`)
    },
  },
})
</script>

<style lang="scss"></style>
