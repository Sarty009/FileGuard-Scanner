import { defineConfig } from 'vite'
// Change the import to match the installed package
import react from '@vitejs/plugin-react-swc' 
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  // This line is still necessary to ensure correct asset paths
  base: './',
  
  // The plugin call remains the same
  plugins: [react()], 
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
