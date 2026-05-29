import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import viteImagemin from '@vheemstra/vite-plugin-imagemin';
import imageminWebp from 'imagemin-webp';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminOptipng from 'imagemin-optipng';
import sitemap from 'vite-plugin-sitemap';

export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd(), '');
  return {
    base: '/',
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      viteImagemin({
        plugins: {
          jpg: imageminMozjpeg({ quality: 80 }),
          png: imageminOptipng({ optimizationLevel: 5 }),
        },
        makeWebp: {
          plugins: { jpg: imageminWebp({ quality: 80 }), png: imageminWebp({ quality: 80 }) },
        },
      }),
      sitemap({
        hostname: 'https://nxrscripts.co.ao',
        dynamicRoutes: ['/about', '/services', '/technologies', '/store', '/contact'],
        outDir: 'dist',
        changefreq: 'monthly',
        priority: 0.8,
        exclude: ['/admin', '/admin/login'],
        robots: [
          { userAgent: '*', allow: '/', disallow: ['/admin', '/admin/login'], crawlDelay: 10 },
        ],
      }),
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
