<template>
  <div class="container">
    <div>
      <h1 class="title">ヘルプ</h1>
      <h2 class="subtitle mt-50">使い方</h2>
      <p>
        自分のルームを作りTwitterのフォロワーを誘って、音声トークをすることができます。(聴くだけも可)
        <br /><br />
        なんとTwitterアプリ内でそのまま動作します。
      </p>
      <h2 class="subtitle mt-50">動作状況</h2>
      <p>
        いずれも最新版にて確認。<br />
        ※iPhone/iPadではユーザーの操作がないと音声が聞こえないことがあります。
        スピーカーアイコンをタップしてみてください。
      </p>
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
            <td>〇</td>
          </tr>
        </tbody>
      </table>
      <h2 class="subtitle mt-50">公式アカウント</h2>
      <p>
        <a
          href="https://twitter.com/joinGoGoHouse"
          target="_blank"
          rel="noreferrer"
          class="official-twitter"
          >@joinGoGoHouse</a
        ><br />
        更新情報などをツイートします。問い合わせはこちらへ。
      </p>
      <h2 class="subtitle mt-50">用語解説</h2>
      <ul class="words">
        <li>※画面は開発中のものです</li>
        <li>
          <strong>ルーム</strong>
          ・・・音声トークができる場所です。数人がトークしてほかの人は聴くだけのような使い方もできます。<br />
        </li>
        <li>
          <strong>モデレーター</strong
          >・・・ルームを作成して管理する人です。会話の進行も任されます。
        </li>
        <li>
          <strong>スタンプ</strong>
          ・・・さりげなく休憩中や挙手の意思を表示できます
        </li>
        <img class="annotation" src="/help/room.png" alt="ルーム" />
        <li>
          <strong>メンバー</strong>
          ・・・ルームに属する人。ルーム内のピンクの☆を押して★にするとなれます<br />
          またクローズドルームではモデレーターがユーザー管理から追加することでメンバーになります
        </li>
        <li>
          <strong>オープンルーム</strong>
          ・・・Twitterアカウントで連携すれば誰でも入れます
        </li>
        <li>
          <strong>ソーシャルルーム</strong>
          ・・・Twitter上でモデレーターと相互フォローの人だけ入れます
        </li>
        <li>
          <strong>クローズドルーム</strong>・・・ルームのメンバーだけ入れます
        </li>
        <img class="annotation" src="/help/create_room.png" alt="ルーム作成" />
        <li>
          <strong>ルーム管理</strong>
          ・・・モデレーターがルームの管理をする画面です<br />
        </li>
        <li><strong>[KICK]</strong>・・・ルームから一度だけ追い出します</li>
        <li><strong>[BAN]</strong>・・・ルームに出入り禁止にします</li>
        <li><strong>[MIC]</strong>・・・ユーザーにマイク権を与えます</li>
        <li><strong>[MEM]</strong>・・・ルームのメンバーに追加します</li>
        <img class="annotation" src="/help/manage_room.png" alt="ルーム管理" />
        <li>
          <strong>予約メンバー</strong>
          ・・・TwitterユーザーがまだGoGoHouseにログインしていない場合は、
          予約メンバーとして登録しておき、ログイン後にメンバーに昇格する仕組みです。
        </li>
        <li>
          <strong>マイク権</strong>
          ・・・「いつでも誰でも」「モデレーターがルームにいるとき」「モデレーターが指名した時」から選べ細かく管理できます。
        </li>
        <img class="annotation" src="/help/mic_permission.png" alt="マイク権" />
        <li>
          <strong>マイルーム一覧</strong>
          ・・・ユーザーが作って管理しているルーム一覧です
        </li>
        <li>
          <strong>メンバールーム一覧</strong>
          ・・・ユーザーが属しているルーム一覧です
        </li>
      </ul>
      <h2 class="subtitle mt-50">ユーザーの仕様</h2>
      <ul class="words">
        <li><strong>無料</strong>で使えます</li>
        <li>
          <strong>音声通信</strong>・・・webRTCによるメッシュ型P2Pネットワーク
        </li>
        <li>
          <strong>ルームの最大接続人数</strong>
          ・・・20人（接続を保証するものではありません）
        </li>
        <li><strong>同時に保持できるマイルームの数</strong>・・・10ルーム</li>
      </ul>
      <h2 class="subtitle mt-50">Tips</h2>
      <ul class="words">
        <li>
          招待制ではありません。
          Twitterアカウントを持っていれば誰でも参加できます。
        </li>
        <li><strong>通信状態の安定した環境でご利用ください。</strong></li>
        <li>
          インターネット回線を使って音声データをやりとりします。電話代は発生しませんが、パケット使用料にご注意ください。
        </li>
        <li>
          二重に音声が聞こえるのとハウリング防止のため、ヘッドホンを使って音声を聴くのを推奨します。
        </li>
        <li>
          TwitterでURLをシェアしたあと、ルームの中で待機していればフォロワーさんが入りやすくなります。
          初対面の人はあいさつから始めましょう。
        </li>
        <li>
          1対1では気が引けるが、3人以上ならおしゃべりに参加しやすいという人も多いようです。
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
          debugボタンから音声の接続状況とエラーログを見ることができます（英語）
        </li>
        <li>
          GoGoHouseはシンプルな作りになっているためプロフィール、アイコン、フォロー、チャット、お気に入り、DMなどの機能はありません。申し訳ありませんがTwitterで行ってください。
        </li>
        <li>
          一度ログアウトしてログインしなおすとTwitterのプロフィールとアイコンが反映されます。
        </li>
        <li>
          デフォルトではモデレーター不在時にはマイクは開けません。ルーム管理から変更できます。
        </li>
        <li>ルームの名前は途中で変更できません。立て直してください。</li>
        <li>
          Twitterブラウザ内でのログインユーザーを切り替えたいときは
          <strong>
            <a href="https://twitter.com/account/switch">Twitterアカウント</a>
          </strong>
          からログインしなおしてください。
          （Twitterアプリのアカウントには影響を与えません）
        </li>
      </ul>
      <h2 class="subtitle mt-50">既知の問題</h2>
      <ul class="words">
        <li>
          <strong>
            ファイアウォールの状態によっては音声の通信ができないことがあります
          </strong>
          <br />
          会社内ネットワークや会社支給のパソコンだと失敗率が比較的高いです
        </li>
        <li>iPhone/iPadでマイクを開くと相手の音量が小さくなる</li>
        <li>プライベートウインドウでアイコンが表示されません</li>
        <li>Chromeのプライベートウインドウではログインできません</li>
        <li>Firefoxでは通信が確立してもスピーカーの色が黒色になりません</li>
        <li>短時間で連続入場しようとするとルームを追い出されます</li>
        <li>
          長時間放置するとルームのページが表示されているのに自分がルームに入ってないときがあります
        </li>
        <li>
          Twitter APIの制限により、
          ソーシャルルームの入場判定をするのに時間あたり回数制限があります
        </li>
      </ul>
      <h2 class="subtitle mt-50">名前の由来</h2>
      <p>
        Clubhouse、Discohouseときて次は何だ？ゴーゴーだ！知らない人はお父さんやお母さんに聞いてみよう。
        <a
          href="https://ja.wikipedia.org/wiki/%E3%82%B4%E3%83%BC%E3%82%B4%E3%83%BC%E5%96%AB%E8%8C%B6"
          target="_blank"
          rel="noreferrer"
        >
          Wikipedia - ゴーゴー喫茶
        </a>
      </p>
      <h2 class="subtitle mt-50">退会</h2>
      <p>
        退会はログインした状態で
        <nuxt-link to="/withdrawal">こちらのリンク</nuxt-link>
        から退会ボタンを押すとできます。退会後、お手数ですが認証したTwitterアプリ連携の解除をお願いいたします。
      </p>
      <p class="reload m-50">
        オープンβテスト中です<br /><br />動作がおかしくなったらトップページのリロードをクリックしてください
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import userMapper from '@/store/user'

export default Vue.extend({
  created() {
    this.GET_USER()
  },
  methods: {
    ...userMapper.mapActions(['GET_USER']),
  },
})
</script>

<style lang="scss" scoped>
strong {
  font-weight: 600;
}

.connect-info {
  width: 305px;
  border-collapse: collapse;
  table-layout: fixed;
}

.connect-info td {
  border: solid 1px $color1;
  background-color: white;
}

.official-twitter {
  font-size: 28px;
}

.words {
  text-align: left;
  font-size: 16px;
  list-style-type: none;
  padding-left: 0;
}

li {
  margin-bottom: 50px;
  padding-top: 5px;
  border-top: solid 1px $color6;
  border-left: solid 10px $color6;
  background-color: white;
  padding: 10px;
}

p {
  text-align: left;
  margin-bottom: 50px;
  padding-top: 5px;
  background-color: white;
  padding: 10px;
  border-radius: 10px;
  border: solid 1px $color6;
}

.reload {
  font-size: 24px;
  font-weight: 600;
  color: $color1;
}

.annotation {
  border: solid 2px black;
  border-radius: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
}

img {
  width: 90vw;
  max-width: 380px;
  filter: drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.5));
}
</style>
