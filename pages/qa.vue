<template>
  <div class="container">
    <div>
      <h1 class="title">Q&A</h1>
      <h2 class="subtitle mt-50">動作状況</h2>
      <p class="words">いずれも最新版<br />△は受信時に音がならないことがある</p>
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
          <td>△</td>
          <td>△</td>
          <td>〇</td>
          <td>△</td>
        </tr>
        <tr>
          <td>Safari</td>
          <td>―</td>
          <td>〇</td>
          <td>―</td>
          <td>〇</td>
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
          <td>〇</td>
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
      <h2 class="subtitle mt-50">無料ユーザーの仕様</h2>
      <ul class="words">
        <li>音声通信・・・webRTCによるメッシュ型P2Pネットワーク</li>
        <li>ルームの最大接続人数・・・10人</li>
        <li>立てられるルームの数・・・5部屋</li>
        <li>オーナー不在ではマイクは開けません</li>
      </ul>
      <h2 class="subtitle mt-50">Tips</h2>
      <ul class="words">
        <li>
          Android
          TwitterアプリだとツイートのリンクからそのままGoGoHouseを始めることができます。
        </li>
        <li>
          招待制ではありません。twitterアカウントを持っていれば誰でも参加できます。
        </li>
        <li>
          Twitterアカウントを持っているということは参加者は13歳以上のはずです。
        </li>
        <li>通信状態の安定した環境でご利用ください。</li>
        <li>
          マイクを開くボタンを押すとブラウザでマイクの使用許可を求められるので許可してください。
        </li>
        <li>
          マイクを開けないときはブラウザでマイクの使用許可の設定を見直してみてください。
        </li>
        <li>
          マイクを開いた状態で赤いマイクアイコンを押すとミュートできます。
        </li>
        <li>
          相手に聞こえてなさそうなときはマイクを閉じてから開きなおしてみてください。
        </li>
        <li>debugボタンからwebRTCのデバッグ情報が見られます。</li>
        <li>
          GoGoHouse内にプロフィール、アイコン、フォロー、チャット、お気に入り、DMなどの機能はありません。Twitterで行ってください。
        </li>
        <li>
          一度ログアウトしてログインしなおすとTwitterのプロフィールが反映されます。
        </li>
        <li>
          Twitterにドアのリンクを張ったあと、ルームの中で待機していればお客さんが入りやすくなります。
        </li>
      </ul>
      <h2 class="subtitle mt-50">既知の問題</h2>
      <ul class="words">
        <li>ファイアウォールの状態によっては音声の通信ができない</li>
        <li>プライベートウインドウでアイコンが表示されない</li>
        <li>短時間で連続入場しようとするとルームを追い出される</li>
        <li>
          すでにどこかのルームにいるときにルームに入ろうとするとすぐ追い出される
        </li>
        <li>
          長時間放置するとルームのページが表示されているのに自分がルームに入ってないときがある
        </li>
        <li>
          Twitter
          APIの制限により、ソーシャルルームの入場判定をするのに1時間に15回程度の制限がある
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
  width: 300px;
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
