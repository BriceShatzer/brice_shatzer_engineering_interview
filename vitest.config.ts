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
		alias: [
			{ find: /^.*\.svg$/, replacement: path.resolve('./src/__mocks__/svgMock.ts') },
			{ find: '$lib', replacement: path.resolve('./src/lib') },
			{ find: '$env/static/private', replacement: path.resolve('./src/__mocks__/env.ts') },
			{ find: '$app/stores', replacement: path.resolve('./src/__mocks__/app-stores.ts') },
			{ find: '$app/paths', replacement: path.resolve('./src/__mocks__/app-paths.ts') }
		]
	}
});
