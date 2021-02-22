<template>
  <div class="container">
    <div>
      <h1 class="title">Q&A</h1>
      <h2 class="subtitle mt-50">動作状況</h2>
      <table class="connect-info">
        <tr>
          <td></td>
          <td>Windows</td>
          <td>Mac</td>
          <td>Android</td>
          <td>iOS</td>
        </tr>
        <tr>
          <td>Chrome</td>
          <td>〇</td>
          <td>△</td>
          <td>〇</td>
          <td>△</td>
        </tr>
        <tr>
          <td>Safari</td>
          <td>―</td>
          <td>〇</td>
          <td>―</td>
          <td>×</td>
        </tr>
        <tr>
          <td>Firefox</td>
          <td>〇</td>
          <td>〇</td>
          <td>〇</td>
          <td>〇</td>
        </tr>
        <tr>
          <td>Twitter WebView</td>
          <td>―</td>
          <td>―</td>
          <td>△</td>
          <td>×</td>
        </tr>
      </table>
      <h2 class="subtitle mt-50">用語解説</h2>
      <ul class="words">
        <li>ルーム・・・音声チャットができる場所</li>
        <li>オーナー・・・ルームを作成して管理する人</li>
        <li>
          メンバー・・・ルームに属する人。ルーム内のピンクの☆を押して★にするとなれる。<br />
          またクローズドルームではオーナーがユーザー管理から追加する。
        </li>
        <li>オープンルーム・・・Twitterアカウントがあれば誰でも入れる</li>
        <li>
          ソーシャルルーム・・・Twitter上でオーナーと相互フォローの人だけ入れる
        </li>
        <li>クローズドルーム・・・ルームのメンバーだけ入れる</li>
        <li>BAN・・・ルームに出入り禁止</li>
        <li>KICK・・・ルームから一度だけ追い出す</li>
        <li>マイルーム一覧・・・ユーザーが作って管理しているルーム一覧</li>
        <li>メンバールーム一覧・・・ユーザーが属しているルーム一覧</li>
        <li>オンラインユーザー・・・ルームにこの瞬間に入っているユーザー</li>
      </ul>
      <h2 class="subtitle mt-50">Tips</h2>
      <ul class="words">
        <li>
          招待制ではありません。twitterアカウントを持っていれば誰でも参加できます。
        </li>
        <li>
          一度ログアウトしてログインしなおすとTwitterのプロフィールが反映されます。
        </li>
        <li>通信状態の安定した環境でご利用ください。</li>
      </ul>
      <h2 class="subtitle mt-50">既知の問題</h2>
      <ul class="words">
        <li>/user/を直接リンクで表示できない</li>
        <li>ファイアウォールの状態によっては音声の通信ができない</li>
        <li>プライベートウインドウでアイコンが表示されない</li>
        <li>短時間で連続入場しようとするとルームを追い出される</li>
        <li>
          Twitter
          APIの制限により、ソーシャルルームに入場判定をするのに1時間に15回程度の制限がある
        </li>
      </ul>
      <p class="reload m-50">
        動作がおかしくなったらトップページのリロードをクリックしてください
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>

<style lang="scss" scoped>
.connect-info {
  width: 320px;
  border: solid 1px #35495e;
  border-collapse: collapse;
  table-layout: fixed;
}

.connect-info td {
  border: solid 1px #35495e;
}

.words {
  text-align: left;
}

.reload {
  font-size: 24px;
  font-weight: 500;
}
</style>
