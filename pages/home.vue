<template>
  <div class="container">
    <div>
      <NamePlate :uid="me.uid" :link="true" class="mt-50" />
      <MyProfile />
      <CreateRoom class="m-50" />
      <MyRoomList class="mt-50" />
      <MemberRoomList class="m-50" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import userMapper from '@/store/user'
import NamePlate from '@/components/NamePlate.vue'
import MyProfile from '@/components/MyProfile.vue'
import MyRoomList from '@/components/MyRoomList.vue'
import MemberRoomList from '@/components/MemberRoomList.vue'
import CreateRoom from '@/components/CreateRoom.vue'

export default Vue.extend({
  components: {
    NamePlate,
    MyProfile,
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
</style>
