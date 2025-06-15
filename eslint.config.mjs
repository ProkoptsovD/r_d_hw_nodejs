// eslint.config.js
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';

export default defineConfig([
	{
		files: ['**/*.js'],

		languageOptions: {
			ecmaVersion: 2022,
			globals: {
				...globals.node,
			},
		},

		plugins: { js },
		extends: ['js/recommended'],

		rules: {
			'no-unused-vars': 'warn',
			'no-undef': 'warn',
		},
	},
]);
