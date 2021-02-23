<template>
  <div>
    <a
      href="https://twitter.com/share?ref_src=twsrc%5Etfw"
      class="twitter-share-button"
      data-show-count="false"
      :data-text="text"
      data-hashtags="GoGoHouse"
    >
      Tweet
    </a>
    <a href="https://twitter.com" class="twitter-link">Go To Twitter</a>
    <script
      async
      src="https://platform.twitter.com/widgets.js"
      charset="utf-8"
    ></script>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    text: { default: '', type: String },
  },
})
</script>

<style lang="scss" scoped>
.twitter-link {
  text-decoration: none;
  margin-left: 5px;
}
</style>
