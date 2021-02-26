<template>
  <div class="plate">
    <img :src="userData.icon" v-if="userData.icon" class="icon" />
    <span class="display-name" v-if="name">
      {{ name }}
    </span>
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
    shorten: { default: false, type: Boolean },
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
  computed: {
    name(): String | undefined {
      if (this.userData.name && this.shorten) {
        let shortenName = this.userData.name.substring(0, 8)
        if (this.userData.name.length > 8) {
          shortenName += '...'
        }
        return shortenName
      }
      return this.userData.name
    },
  },
})
</script>

<style lang="scss" scoped>
.icon {
  border-radius: 50%;
  width: 18px;
  height: 18px;
}

.display-name {
  color: $color3;
  vertical-align: top;
  text-decoration: none;
}
</style>
