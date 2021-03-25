export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  mode: 'spa',
  head: {
    title: 'GoGoHouse | ゆるく音声トーク',
    htmlAttrs: {
      lang: 'ja',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'アプリ不要でフォロワーとおしゃべりしよう。Twitter連携だけですぐに参加できる音声トークサービスです。あの人としゃべってみたいと思ったことはありませんか？そんな願いを叶えます。',
      },
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: 'GoGoHouse | ゆるく音声トーク',
      },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content: 'https://gogo.house' },
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'GoGoHouse | ゆるく音声トーク',
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content:
          'アプリ不要でフォロワーとおしゃべりしよう。Twitter連携だけですぐに参加できる音声トークサービスです。',
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: 'https://gogo.house/logo.png',
      },
      {
        hid: 'twitter:card',
        property: 'twitter:card',
        content: 'summary',
      },
      {
        hid: 'twitter:site',
        property: 'twitter:site',
        content: '@joinGoGoHouse',
      },
      {
        hid: 'twitter:title',
        property: 'twitter:title',
        content: 'GoGoHouse | ゆるく音声トーク',
      },
      {
        hid: 'twitter:description',
        property: 'twitter:description',
        content:
          'アプリ不要でフォロワーとおしゃべりしよう。Twitter連携だけですぐに参加できる音声トークサービスです。',
      },
      {
        hid: 'twitter:image',
        property: 'twitter:image',
        content: 'https://gogo.house/logo_twitter.png',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    link: [
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/css/style.css'],
  styleResources: {
    scss: ['~/assets/scss/_variable.scss'],
  },
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxtjs/style-resources', '@nuxtjs/pwa'],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
  router: {
    middleware: 'authenticated',
  },
  loadingIndicator: {
    name: 'rectangle-bounce',
    color: '#3B8070',
    background: 'white',
  },
  manifest: {
    name: 'GoGoHouse',
    lang: 'ja',
    short_name: 'GoGoHouse',
    start_url: 'https://gogo.house/',
    display: 'browser',
    title: 'GoGoHouse',
    'og:title': 'GoGoHouse',
    description: 'Twitter連携だけですぐに参加できる音声トークサービスです。',
    'og:description':
      'Twitter連携だけですぐに参加できる音声トークサービスです。',
    theme_color: '#f2efe4',
    background_color: '#f2efe4',
  },
}
