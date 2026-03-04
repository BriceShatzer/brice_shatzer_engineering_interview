import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
	plugins: [svelte({ hot: false })],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./src/test-setup.ts']
	},
	resolve: {
		alias: {
			$lib: path.resolve('./src/lib'),
			'$env/static/private': path.resolve('./src/__mocks__/env.ts')
		}
	}
});
