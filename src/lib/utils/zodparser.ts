import { z, ZodType } from 'zod';

// =================================================================
// UTILITY FUNCTIONS
// =================================================================

/**
 * A recursive function to transform object keys from snake_case to camelCase.
 * It handles nested objects and arrays of objects.
 */
function keysToCamel(obj: any): any {
	if (Array.isArray(obj)) {
		return obj.map((v) => keysToCamel(v));
	} else if (obj !== null && obj.constructor === Object) {
		return Object.keys(obj).reduce(
			(result, key) => {
				const camelKey = key.replace(/([-_][a-z])/g, (group) =>
					group.toUpperCase().replace('-', '').replace('_', '')
				);
				result[camelKey] = keysToCamel(obj[key]);
				return result;
			},
			{} as { [key: string]: any }
		);
	}
	return obj;
}

/**
 * A recursive function to transform object keys from camelCase to snake_case.
 * It handles nested objects and arrays of objects.
 */
function keysToSnake(obj: any): any {
	if (Array.isArray(obj)) {
		return obj.map((v) => keysToSnake(v));
	} else if (obj !== null && obj.constructor === Object) {
		return Object.keys(obj).reduce(
			(result, key) => {
				const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
				result[snakeKey] = keysToSnake(obj[key]);
				return result;
			},
			{} as { [key: string]: any }
		);
	}
	return obj;
}

/**
 * Creates a new Zod schema that transforms its input's keys from snake_case to camelCase.
 * @param schema The Zod schema to wrap.
 * @returns A new Zod schema with the transformation.
 */
export function createSnakeToCamelSchema<T extends ZodType>(schema: T) {
	return z.preprocess((data) => {
		if (typeof data === 'object' && data !== null) {
			return keysToCamel(data);
		}
		return data;
	}, schema);
}

/**
 * Creates a new Zod schema that transforms its output's keys from camelCase to snake_case.
 * @param schema The Zod schema to wrap.
 * @returns A new Zod schema with the transformation.
 */
export function createCamelToSnakeSchema<T extends ZodType>(schema: T) {
	return schema.transform((data) => {
		if (typeof data === 'object' && data !== null) {
			return keysToSnake(data);
		}
		return data;
	});
}
