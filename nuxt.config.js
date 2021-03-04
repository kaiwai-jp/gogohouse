export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  mode: 'spa',
  head: {
    title: 'GoGoHouse | 音声トークをフォロワーと',
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
          'DL不要でフォロワーとお喋りしよう。Twitter連携だけですぐに参加できる音声トークサービスです。聴くだけも可。',
      },
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: 'GoGoHouse | 音声トークをフォロワーと',
      },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content: 'https://gogo.house' },
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'GoGoHouse | 音声トークをフォロワーと',
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content:
          'DL不要でフォロワーとお喋りしよう。Twitter連携だけですぐに参加できる音声トークサービスです。聴くだけも可。',
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
        content: 'GoGoHouse | 音声トークをフォロワーと',
      },
      {
        hid: 'twitter:description',
        property: 'twitter:description',
        content:
          'DL不要でフォロワーとお喋りしよう。Twitter連携だけですぐに参加できる音声トークサービスです。聴くだけも可。',
      },
      {
        hid: 'twitter:image',
        property: 'twitter:image',
        content: 'https://gogo.house/logo_twitter.png',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
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
  modules: ['@nuxtjs/style-resources'],

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
}
