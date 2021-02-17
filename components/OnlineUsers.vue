<template>
  <div>
    <div v-for="user in roomOnlineUsers" :key="user.uid" class="list">
      <NamePlate :uid="user.uid" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import userMapper from '@/store/user'
import NamePlate from '@/components/NamePlate.vue'

export default Vue.extend({
  components: {
    NamePlate,
  },
  async created() {
    this.ROOM_ONLINE_USERS_LISTENER(this.roomId)
  },
  beforeDestroy() {
    this.END_ROOM_ONLINE_USERS_LISTENER()
  },
  computed: {
    ...userMapper.mapGetters(['me', 'roomOnlineUsers', 'roomRemoteUsers']),
    roomId(): string {
      return this.$route.params.id
    },
  },
  methods: {
    ...userMapper.mapActions([
      'ROOM_ONLINE_USERS_LISTENER',
      'END_ROOM_ONLINE_USERS_LISTENER',
    ]),
  },
})
</script>

<style lang="scss" scoped>
.list {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
