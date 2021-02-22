export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'GoGoHouse',
    htmlAttrs: {
      lang: 'ja',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'GoGoHouseでTwitterフォロワーとお喋りしよう',
      },
      { hid: 'og:site_name', property: 'og:site_name', content: 'GoGoHouse' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content: 'https://gogo.house' },
      { hid: 'og:title', property: 'og:title', content: 'ゴーゴーを踊ろう' },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'Twitterフォロワーとお喋りしよう',
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: 'https://gogohouse-bf623.web.app/logo.png',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/css/style.css'],

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
  modules: [],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
  router: {
    middleware: 'authenticated',
  },
}
