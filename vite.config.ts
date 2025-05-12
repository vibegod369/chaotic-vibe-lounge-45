
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Import lovable-tagger conditionally to avoid build issues on Vercel
let componentTagger;
try {
  // Only try to import in development mode
  if (process.env.NODE_ENV === 'development') {
    const taggerModule = require("lovable-tagger");
    componentTagger = taggerModule.componentTagger;
  }
} catch (error) {
  console.log("Lovable tagger not available, skipping in production build");
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Only use componentTagger in development mode and if it's available
    mode === 'development' && componentTagger ? componentTagger() : null,
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
    }
  },
  build: {
    target: 'es2020',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  esbuild: {
    // Force esbuild to use a specific target version
    target: 'es2020',
    // Disable automatic version detection
    supported: {
      'top-level-await': true
    }
  }
}));
