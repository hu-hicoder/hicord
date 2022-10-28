import { defineConfig } from 'vitest/config'
import solidPlugin from 'vite-plugin-solid'
import { checker } from 'vite-plugin-checker'

export default defineConfig({
  plugins: [
    solidPlugin(),
    checker({
      typescript: true,
      eslint: { lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}" --cache' },
      overlay: { initialIsOpen: false },
    }),
  ],
  build: {
    target: 'esnext',
  },
  test: {
    environment: 'jsdom',
    transformMode: {
      web: [/.[jt]sx?/],
    },
    deps: {
      registerNodeLoader: true,
    },
    threads: false,
    isolate: false,
  },
})
