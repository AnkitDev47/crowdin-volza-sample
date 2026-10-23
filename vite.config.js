import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// /controllers -> TranslationApi (backend/TranslationApi, `dotnet run` on :5000), so no CORS needed in dev.
export default defineConfig({ plugins: [react()], server: { port: 3000, proxy: { '/controllers': 'http://localhost:5000' } } });
