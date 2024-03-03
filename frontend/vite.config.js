import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default () => {
  const config = {
    plugins: [react()],
  };
  return defineConfig(config);
}