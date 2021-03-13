<template>
  <div class="container">
    <div>
      <h1 class="title">退会ページ</h1>
      <p class="m-50">{{ message }}</p>
      <button class="button--green" @click="clickWithdrawal">退会する</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import userMapper from '@/store/user'

import { withdrawal } from '@/service/userAPI'

interface DataType {
  message: string
}

export default Vue.extend({
  data(): DataType {
    return {
      message: '退会するとユーザーの全データが削除されます',
    }
  },
  methods: {
    ...userMapper.mapActions(['SIGN_OUT']),
    clickWithdrawal() {
      if (window.confirm('本当にユーザーデータを削除して退会しますか？')) {
        this.message =
          'ご利用ありがとうございました。まもなくトップページへ移動します。'
        withdrawal()
        this.SIGN_OUT()
        this.$router.push(`/`)
      }
    },
  },
})
</script>

<style lang="scss" scoped></style>
