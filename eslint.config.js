import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import error from "eslint-plugin-new-with-error";
import deprecation from "eslint-plugin-deprecation";

import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

export default [
	js.configs.recommended,
	{
		languageOptions: {
			sourceType: "module",
		},
		plugins: {
			error,
		},
	},
	...compat.extends("plugin:regexp/recommended"),
	...compat.extends("plugin:security/recommended"),
	...compat.extends("plugin:promise/recommended"),
	...compat.extends("plugin:@typescript-eslint/recommended"),
	{
		files: ["**/*.ts"],
		plugins: {
			deprecation,
		},
		rules: {
			"deprecation/deprecation": "warn",
		},
		languageOptions: {
			sourceType: "module",
			parser: tsParser,
			parserOptions: {
				ecmaVersion: "latest",
				project: ["./tsconfig.json"],
			},
		},
	},
	...compat.extends("plugin:json-schema-validator/recommended"),
	...compat.extends("prettier"),
];
