/// <reference types="vitest/config" />
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  preview: {
    // Lets `vite preview` be configured the same way as a SvelteKit adapter-node
    // server (systemd Environment=HOST=... PORT=...), for a consistent deploy story.
    host: process.env.HOST ?? '127.0.0.1',
    port: process.env.PORT ? Number(process.env.PORT) : 4173,
    strictPort: true,
    // Vite blocks unrecognized Host headers by default (DNS-rebinding defense); this is
    // reached through Tailscale Serve, which forwards the original tailnet hostname.
    allowedHosts: ['pop-os.tail3c9f72.ts.net'],
  },
  test: {
    environment: 'jsdom',
  },
})
