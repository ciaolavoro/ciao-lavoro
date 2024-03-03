import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default () => {
  const config = {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'https://ciao-lavoro-l7qa.onrender.com/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
  return defineConfig(config);
}