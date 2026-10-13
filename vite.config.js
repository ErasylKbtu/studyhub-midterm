import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Match this value to the GitHub repository name if you rename the repo.
// Example: https://USERNAME.github.io/studyhub-midterm/
export default defineConfig({
  plugins: [react()],
  base: '/studyhub-midterm/',
});
