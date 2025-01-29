import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
	{
		files: ['**/*.js'],
		languageOptions: {
			sourceType: 'module', // Cambiar a "module" para permitir import/export
			globals: {
				process: 'readonly', // Añade process como una variable global de solo lectura
				node: true, // Habilita el entorno de Node.js
			},
		},
	},
	{
		languageOptions: {
			globals: globals.browser,
		},
	},
	pluginJs.configs.recommended,
];
