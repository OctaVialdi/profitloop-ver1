
/**
 * Safely parse a JSON string or return a fallback value
 * @param jsonString The JSON string to parse
 * @param fallback Fallback value if parsing fails
 * @returns Parsed object or fallback
 */
export function safeJsonParse<T>(jsonString: string | null | undefined, fallback: T): T {
  if (!jsonString) return fallback;
  
  try {
    return JSON.parse(jsonString) as T;
  } catch (e) {
    console.warn('Error parsing JSON:', e);
    return fallback;
  }
}

/**
 * Check if a value is a string-encoded JSON and parse it if needed
 * @param value The value to check and parse
 * @param fallback Fallback value if parsing fails
 * @returns Parsed object if input was JSON string, original value if already object, or fallback
 */
export function parseJsonIfString<T>(value: any, fallback: T): T {
  if (typeof value === 'string') {
    return safeJsonParse(value, fallback);
  } else if (value !== null && value !== undefined) {
    return value as T;
  }
  return fallback;
}
