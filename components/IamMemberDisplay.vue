<template>
  <div v-if="!isOwner">
    <a v-if="isMember" @click="clickRemoveMember" class="star">★</a>
    <a v-if="!isMember" @click="clickAddMember" class="star">☆</a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import roomMapper from '@/store/room'
import userMapper from '@/store/user'
import { addMeMembers, removeMeMembers } from '@/service/roomAPI'

export default Vue.extend({
  computed: {
    ...userMapper.mapGetters(['me']),
    ...roomMapper.mapGetters(['room']),
    roomId(): string {
      return this.$route.params.id
    },

    isMember(): Boolean {
      if (this.room.members && this.room.members.includes(this.me.uid)) {
        return true
      }
      return false
    },
    isOwner(): Boolean {
      if (this.room.owner_id === this.me.uid) {
        return true
      }
      return false
    },
  },
  methods: {
    clickAddMember() {
      addMeMembers(this.roomId)
    },
    clickRemoveMember() {
      removeMeMembers(this.roomId)
    },
  },
})
</script>

<style lang="scss" scoped>
a {
  font-size: 24px;
  font-weight: 700;
  text-decoration: none;
  color: #ff1493;
  cursor: pointer;
}
</style>
