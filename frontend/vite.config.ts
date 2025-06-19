import { defineConfig } from 'vite';

// For dev mode
export default defineConfig({
    server: {
        host: '0.0.0.0',
        proxy: {
            '/api': {
                target: 'http://api-gateway:3000',  // adresse de ton backend user-service ou api-gateway
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '/api'),  // si tu veux garder /api, sinon adapte
            }
        }
    }
});
