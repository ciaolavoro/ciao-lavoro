import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const config = {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.BACKEND_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          prependPath: false,
        },
      },
    },
  };
  return defineConfig(config);
}