<template>
  <div>
    <footer>
      <ul>
        <li><a href="/term.html" target="_blank">利用規約</a></li>
        <li>
          <a href="/privacy.html" target="_blank">プライバシーポリシー</a>
        </li>
        <li><nuxt-link to="/help">ヘルプ</nuxt-link></li>
      </ul>
      <span class="copyright">Copyright 国崎犀考@saikou_kunisaki</span>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>

<style lang="scss" scoped>
footer {
  background-color: $color1;
  color: #ffffff;
  padding: 10px;
  text-align: center;
}

ul {
  padding-left: 0;
  margin-bottom: 5px;
}

li {
  display: inline-block;
  padding-right: 7px;
  padding-left: 7px;
  border-left: solid 1px $color6;
  &:first-child {
    border-left: none;
  }
}

.copyright {
  font-weight: 600;
}

a {
  color: #ffffff;
  text-decoration: none;
}
</style>
