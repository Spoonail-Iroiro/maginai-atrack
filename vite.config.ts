/// <reference types="vitest" />
import { resolve } from 'path';
import { defineConfig } from 'vite';
import * as fs from 'node:fs/promises';

const MOD_NAME = 'atrack'

export default defineConfig({
  build: {
    target: 'es2015',
    outDir: resolve(__dirname, 'game/game/js/mod/mods/' + MOD_NAME),
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/init.ts'),
      name: MOD_NAME,
      formats: ['iife'],
    },
    rollupOptions: {
      //!重要! ここのexternal/output.globalsでmaginaiをバンドルから除外し、
      //    グローバル変数ライブラリとして読み込む設定をしないと
      //    modとして正しく動作しません
      external: ['maginai'],
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        globals: {
          maginai: 'maginai',
        },
      },
    },
  },
  test: {
    setupFiles: ['./tests/vitest.setup.ts'],

    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  plugins: [
    {
      name: 'copy-mod-assets',
      closeBundle: async () => {
        // ここで同梱するアセットファイルを定義
        const assets = [
          // 'message.js'
        ];


        const devRoot = 'src/';
        const buildRoot = 'game/game/js/mod/mods/' + MOD_NAME;
        try {
          await fs.mkdir(resolve(__dirname, buildRoot));
        } catch (err) {
          if (err.code !== 'EEXIST') throw err;
        }
        // Copy assets
        for (let assetName of assets) {
          await fs.cp(
            resolve(__dirname, devRoot, assetName),
            resolve(__dirname, buildRoot, assetName),
            {
              recursive: true,
            }
          );
        }
      },
    },
  ],
});
