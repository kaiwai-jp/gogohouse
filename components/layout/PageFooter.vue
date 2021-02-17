<template>
  <div>
    <footer>
      <ul>
        <li>利用規約</li>
        <li>プライバシーポリシー</li>
        <li>GoGoHouseとは</li>
      </ul>
      <span class="copyright">copyright @saikou_kunisaki</span>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>

<style lang="scss" scoped>
footer {
  background-color: #35495e;
  color: #ffffff;
  padding: 10px;
  text-align: center;
}

li {
  display: inline-block;
  padding-right: 10px;
  padding-left: 10px;
  border-right: solid 1px #efefef;
}

.copyright {
  font-weight: 600;
}
</style>
