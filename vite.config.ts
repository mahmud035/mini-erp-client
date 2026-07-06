import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Documented default: the same Railway origin the prod Vercel rewrite points at.
const DEFAULT_PROXY_TARGET = 'https://mini-erp-server.up.railway.app'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_DEV_PROXY_TARGET || DEFAULT_PROXY_TARGET

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      // Mirror the prod Vercel `/api/(.*)` rewrite so local dev has same-origin
      // cookies. cookieDomainRewrite strips the upstream cookie Domain so the
      // httpOnly auth cookies stick on localhost.
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: true,
          cookieDomainRewrite: '',
        },
      },
    },
  }
})
