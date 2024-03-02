import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default () => {
  const config = {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: URL_DEL_BACKEND,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
  return defineConfig(config);
}