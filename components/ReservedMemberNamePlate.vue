<template>
  <div class="plate">
    <img
      :src="userData.icon"
      alt="アイコン"
      v-if="userData.icon"
      class="icon"
    />
    <div class="name-area">
      <span class="name">{{ userData.name }}</span>
      <br />
      <span class="twitter-id">{{ userData.twitter }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getReservedUserData } from '@/service/userAPI'

interface DataType {
  userData: { name: string | undefined }
}

export default Vue.extend({
  props: {
    screenName: { default: '', type: String },
  },
  data(): DataType {
    return {
      userData: { name: undefined },
    }
  },
  async created() {
    //@ts-ignore
    this.userData = await getReservedUserData(this.screenName)
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
  width: 42px;
  height: 42px;
  background-color: #aab8c2;
}

.name-area {
  display: inline-block;
  vertical-align: top;
  margin-left: 5px;
  line-height: 1.4rem;
}

.name {
  color: #000000;
}

.twitter-id {
  color: $color3;
  font-size: 14px;
}

a {
  text-decoration: none;
}
</style>
