import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Força a injeção da variável API_KEY do ambiente de build para o código final
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || "")
  },
  server: {
    historyApiFallback: true,
  }
});