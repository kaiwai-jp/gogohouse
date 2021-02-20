<template>
  <div class="main">
    <div class="agree-checkbox">
      <a href="term.html" target="_blank">利用規約</a>に
      <input type="checkbox" v-model="agree" id="checkbox" />
      <label for="checkbox">同意する</label>
    </div>
    <button class="button--grey" @click="twitterSignin">
      twitter連携してログイン
    </button>
    <div class="notice">※勝手にツイートすることはありません</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import userMapper from '@/store/user'

interface DataType {
  agree: boolean
}

export default Vue.extend({
  props: { jump: { default: '', type: String } },
  data(): DataType {
    return {
      agree: false,
    }
  },
  methods: {
    ...userMapper.mapActions(['SIGN_IN_TWITTER', 'SIGN_OUT']),
    twitterSignin() {
      if (!this.agree) {
        alert('利用規約を読んで同意するにチェックをしてください')
        return
      }
      this.SIGN_IN_TWITTER()
        .then(() => {
          if (this.jump) {
            this.$router.push(this.jump)
          }
        })
        .catch((err) => alert(err))
    },
  },
})
</script>

<style lang="scss" scoped>
.main {
  position: relative;
  display: inline-block;
}
.agree-checkbox {
  margin-bottom: 10px;
}

.agree-checkbox label:before {
  content: '';
  width: 20px;
  height: 20px;
  display: inline-block;
  position: absolute;
  right: 15px;
  background-color: #fff;
  box-shadow: inset 1px 1px 1px 0px #000;
  border-radius: 4px 4px 4px 4px;
}
.agree-checkbox input[type='checkbox'] {
  display: none;
}
.agree-checkbox input[type='checkbox']:checked + label:before {
  content: '\2713';
  font-size: 18px;
  color: #000000;
  background-color: #84b5ff;
}

a {
  color: #000000;
}

.notice {
  margin-top: 20px;
  color: #636363;
  font-size: 10px;
}
</style>
