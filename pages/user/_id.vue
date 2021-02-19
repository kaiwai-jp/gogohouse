<template>
  <div class="container">
    <div>
      <NamePlate :uid="userId" class="mt-50" />
      <div class="profile">{{ userData.profile }}</div>
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
  computed: {
    ...userMapper.mapGetters(['getUserData']),
    userId(): String {
      return this.$route.params.id
    },
    userData(): any {
      this.REF_USER_DATA({ uid: this.userId })
      return this.getUserData(this.userId)
    },
  },
  methods: {
    ...userMapper.mapActions(['REF_USER_DATA']),
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
