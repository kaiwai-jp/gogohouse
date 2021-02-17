<template>
  <div class="plate">
    <img class="icon" :src="userData.icon" />
    <div class="name-area">
      <span class="name">{{ userData.name }}</span
      ><br />
      <span class="twitter-id">{{ userData.twitter }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import userMapper from '@/store/user'

export default Vue.extend({
  props: { uid: { default: '', type: String } },
  computed: {
    ...userMapper.mapGetters(['getUserData']),
    userData(): Object {
      this.REF_USER_DATA({ uid: this.uid })
      return this.getUserData(this.uid)
    },
  },
  methods: {
    ...userMapper.mapActions(['REF_USER_DATA']),
  },
})
</script>

<style lang="scss" scoped>
.plate {
  text-align: left;
}

.icon {
  display: inline-block;
  border-radius: 50%;
}

.name-area {
  display: inline-block;
  vertical-align: top;
  margin-left: 5px;
}

.twitter-id {
  color: #636363;
  font-size: 14px;
}
</style>
