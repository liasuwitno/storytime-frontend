export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  typescript: {
    typeCheck: true,
  },
  runtimeConfig: {
    public: {
      NUXT_PUBLIC_API_BASE_DEV: process.env.NUXT_API_BASE_DEV,
      NUXT_PUBLIC_API_BASE_PROD: process.env.NUXT_API_BASE_PROD,
      NUXT_API_ENV: process.env.NUXT_API_ENV,
      NUXT_PUSHER_APP_ID: process.env.NUXT_PUSHER_APP_ID,
      NUXT_PUSHER_APP_KEY: process.env.NUXT_PUSHER_APP_KEY,
      NUXT_PUSHER_APP_CLUSTER: process.env.NUXT_PUSHER_APP_CLUSTER,
      NUXT_PUSHER_APP_CHANNEL_NAME: process.env.NUXT_PUSHER_APP_CHANNEL_NAME,
      NUXT_PUSHER_APP_EVENT_NAME: process.env.NUXT_PUSHER_APP_EVENT_NAME,
    },
  },
  build: {
    transpile: ["pinia"],
  },
  plugins: ["~/plugins/request"],
  modules: ["@pinia/nuxt", "@nuxt/image"],
  css: ["~/styles/globals.css"],
  pinia: {
    storesDirs: ["~/store/**"],
  },
  devServer: {
    port: 3890,
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
