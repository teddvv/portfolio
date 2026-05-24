import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// IMPORTANT — change "portfolio" to match your GitHub repository name.
// Example: if your repo URL is https://github.com/teddvv/portfolio
// then base must be '/portfolio/' (with the trailing slash).
// If you deploy on a custom domain (or user/organization site like teddvv.github.io),
// set base: '/'
export default defineConfig({
  plugins: [react()],
  base: '/portfolio/',
});
