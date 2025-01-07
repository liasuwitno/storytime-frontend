export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  typescript: {
    typeCheck: true,
  },

  runtimeConfig: {
    public: {
      NUXT_PUBLIC_API_BASE: process.env.NUXT_PUBLIC_API_BASE,
    },
  },
  build: {
    transpile: ["pinia"],
  },
  devServer: {
    port: 3290,
  },
  modules: ["@pinia/nuxt", "@nuxt/image"],
  css: ["~/styles/globals.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
