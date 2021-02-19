<template>
  <div class="container">
    <div>
      <NamePlate :uid="me.uid" class="mt-50" />
      <div class="profile">{{ me.profile }}</div>
      <MyRoomList class="mt-50" />
      <MemberRoomList class="mt-50" />
      <CreateRoom class="m-50" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import userMapper from '@/store/user'
import NamePlate from '@/components/NamePlate.vue'
import MyRoomList from '@/components/MyRoomList.vue'
import MemberRoomList from '@/components/MemberRoom.vue'
import CreateRoom from '@/components/CreateRoom.vue'

export default Vue.extend({
  components: {
    NamePlate,
    MyRoomList,
    MemberRoomList,
    CreateRoom,
  },
  computed: {
    ...userMapper.mapGetters(['me']),
  },
})
</script>

<style lang="scss" scoped>
.profile {
  max-width: 300px;
  margin-top: 10px;
  text-align: left;
}
</style>
