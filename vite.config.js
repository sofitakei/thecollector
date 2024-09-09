import react from '@vitejs/plugin-react'
import { defineConfig, transformWithEsbuild } from 'vite'

export default defineConfig({
  plugins: [
    {
      name: 'treat-js-files-as-jsx',
      transform: async (code, id) => {
        if (!id.match(/src\/.*\.js$/)) return null

        // Use the exposed transform from vite, instead of directly
        // transforming with esbuild
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic',
        })
      },
    },
    react(),
  ],

  optimizeDeps: {
    force: true,
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
})
