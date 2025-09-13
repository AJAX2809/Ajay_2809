import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import runtimeErrorModal from '@replit/vite-plugin-runtime-error-modal'

// Using an async function for the config to handle the conditional plugin
export default defineConfig(async ({ mode }) => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  const plugins = [
    react(),
    runtimeErrorModal(),
  ];

  // Conditionally add cartographer for the Replit dev environment
  if (mode !== 'production' && process.env.REPL_ID) {
    const { cartographer } = await import('@replit/vite-plugin-cartographer');
    plugins.push(cartographer());
  }

  return {
    plugins,
    root: 'client',
    build: {
      outDir: '../dist',
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './client/src'),
        '@shared': path.resolve(__dirname, './shared'),
        '@assets': path.resolve(__dirname, './attached_assets'),
      },
    },
    server: {
      fs: { strict: true, deny: ["**/.*"] },
    },
  };
});