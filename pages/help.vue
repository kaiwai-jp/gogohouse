<template>
  <div class="container">
    <div>
      <h1 class="title">ヘルプ</h1>
      <h2 class="subtitle mt-50">使い方</h2>
      <ul class="words">
        <li>
          Twitter連携してルームに入るだけでフォロワーとワイワイお喋り空間に参加できます。
          <br />リンクをTwitterに貼ってフォロワーに知らせよう！
        </li>
      </ul>
      <h2 class="subtitle mt-50">動作状況</h2>
      <p class="words">いずれも最新版にて確認</p>
      <table class="connect-info">
        <tbody>
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
            <td>〇</td>
            <td>〇</td>
            <td>〇</td>
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
            <td>Edge</td>
            <td>〇</td>
            <td>―</td>
            <td>―</td>
            <td>―</td>
          </tr>
          <tr>
            <td>Twitter WebView</td>
            <td>―</td>
            <td>―</td>
            <td>〇</td>
            <td>×</td>
          </tr>
        </tbody>
      </table>
      <h2 class="subtitle mt-50">公式アカウント</h2>
      <a
        href="https://twitter.com/joinGoGoHouse"
        target="_blank"
        class="official-twitter"
      >
        @joinGoGoHouse
      </a>
      <p>更新情報などをツイートします。</p>
      <h2 class="subtitle mt-50">用語解説</h2>
      <ul class="words">
        <li>
          <strong>ルーム</strong
          >・・・音声トークができる場所です。数人がトークしてほかの人は聴くだけのような使い方もできます。
        </li>
        <li>
          <strong>ドア</strong
          >・・・ルームの入り口です。Twitterにリンクを張るときはここのURLをお願いします。
        </li>
        <li><strong>オーナー</strong>・・・ルームを作成して管理する人です</li>
        <li>
          <strong>メンバー</strong
          >・・・ルームに属する人。ルーム内のピンクの☆を押して★にするとなれます<br />
          またクローズドルームではオーナーがユーザー管理から追加することでメンバーになります
        </li>
        <li>
          <strong>オープンルーム</strong
          >・・・Twitterアカウントで連携すれば誰でも入れます
        </li>
        <li>
          <strong>ソーシャルルーム</strong
          >・・・Twitter上でオーナーと相互フォローの人だけ入れます
        </li>
        <li>
          <strong>クローズドルーム</strong>・・・ルームのメンバーだけ入れます
        </li>
        <li>
          <strong>ルーム管理</strong>・・・オーナーがルームの管理をする画面です
        </li>
        <li><strong>[BAN]</strong>・・・ルームに出入り禁止にします</li>
        <li><strong>[KICK]</strong>・・・ルームから一度だけ追い出します</li>
        <li><strong>[MEM]</strong>・・・ルームのメンバーに追加します</li>
        <li><strong>[MIC]</strong>・・・ユーザーにマイク権を与えます</li>
        <li>
          <strong>予約メンバー</strong
          >・・・TwitterユーザーがまだGoGoHouseにログインしていない場合は、
          予約メンバーとして登録しておき、連携後にメンバーに昇格します。
        </li>
        <li>
          <strong>マイク権</strong
          >・・・「いつでも誰でも」「オーナーがルームにいるとき」「オーナーが指名した時」から選べ細かく管理できるのが特徴です。
        </li>
        <li>
          <strong>マイルーム一覧</strong
          >・・・ユーザーが作って管理しているルーム一覧です
        </li>
        <li>
          <strong>メンバールーム一覧</strong
          >・・・ユーザーが属しているルーム一覧です
        </li>
      </ul>
      <h2 class="subtitle mt-50">無料ユーザーの仕様</h2>
      <ul class="words">
        <li>
          <strong>音声通信</strong>・・・webRTCによるメッシュ型P2Pネットワーク
        </li>
        <li>
          <strong>ルームの最大接続人数</strong
          >・・・20人（接続を保証するものではありません）
        </li>
        <li><strong>同時に保持できるマイルームの数</strong>・・・10ルーム</li>
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
          インターネット回線を使って音声データをやりとりします。電話代は発生しませんが、パケット使用料にご注意ください。
        </li>
        <li>
          マイクを開くボタンを押すとブラウザでマイクの使用許可を求められるので許可してください。
        </li>
        <li>
          マイクを開けないときはブラウザ内のマイクの使用許可の設定を見直してみてください。
        </li>
        <li>
          マイクを開いた状態で赤いマイクアイコンを押すとミュートできます。
        </li>
        <li>
          ルーム内で灰色のスピーカーは接続試行中、黒色のスピーカーは接続確立を表します。
        </li>
        <li>
          スマートフォンの画面が暗くなるとマイクの録音が止まることがあるようです。その時は画面を触り続けてください。
        </li>
        <li>
          相手に聞こえてなさそうなときはマイクを閉じてから開きなおすか、それでも直らないならリロードしてみてください。
        </li>
        <li>debugボタンからwebRTCのデバッグ情報とエラーログが見られます。</li>
        <li>
          GoGoHouse内にプロフィール、アイコン、フォロー、チャット、お気に入り、DMなどの機能はありません。Twitterで行ってください。
        </li>
        <li>
          一度ログアウトしてログインしなおすとTwitterのプロフィールが反映されます。
        </li>
        <li>
          TwitterにドアページのURLをシェアしたあと、ルームの中で待機していればフォロワーさんが入りやすくなります。
        </li>
        <li>
          デフォルトではオーナー不在時にはマイクは開けません。ルーム管理から変更できます。
        </li>
        <li>
          音声をサーバーに保存しません。基本的に参加者の端末同士が直接つながって音声をやりとりします。
        </li>
        <li>ルームの名前は途中で変更できません。</li>
        <li>
          Twitterブラウザ内でのログインユーザーを切り替えたいときは
          <a href="https://twitter.com/login">Twitterログイン画面</a>
          からログインしなおしてください。
        </li>
      </ul>
      <h2 class="subtitle mt-50">既知の問題</h2>
      <ul class="words">
        <li>
          ファイアウォールやNATの状態によっては音声の通信ができないことがあります
        </li>
        <li>プライベートウインドウでアイコンが表示されません</li>
        <li>短時間で連続入場しようとするとルームを追い出されます</li>
        <li>
          すでにどこかのルームにいるときにルームに入ろうとするとすぐ追い出されます
        </li>
        <li>
          長時間放置するとルームのページが表示されているのに自分がルームに入ってないときがあります
        </li>
        <li>
          Twitter
          APIの制限により、ソーシャルルームの入場判定をするのに回数制限があります
        </li>
        <li>Firefoxでは通信が確立してもスピーカーの色が黒色になりません</li>
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
  width: 305px;
  border-collapse: collapse;
  table-layout: fixed;
}

.connect-info td {
  border: solid 1px $color1;
}

.official-twitter {
  font-size: 28px;
}

.words {
  text-align: left;
  font-size: 16px;
  list-style-type: none;
  padding-left: 0;
  font-weight: 300;
}

li {
  margin-bottom: 30px;
  padding-top: 5px;
  border-top: solid 1px $color6;
}

.reload {
  font-size: 24px;
  font-weight: 600;
  color: $color1;
}
</style>
