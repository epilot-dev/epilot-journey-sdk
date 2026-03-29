/**
 * Safely parses a custom block's JSON string value.
 *
 * Handles `undefined`, `null`, empty strings, invalid JSON, and already-parsed objects.
 * Returns the fallback value when parsing fails — never throws.
 *
 * @param value - The raw block value (typically a JSON string from the `value` prop)
 * @param fallback - Default value when parsing fails. Defaults to `{}`.
 * @returns The parsed block value
 *
 * @example
 * ```ts
 * type MyBlock = { count: number; label: string }
 *
 * const data = parseBlockValue<MyBlock>(props.value, { count: 0, label: '' })
 * // data.count and data.label are safely accessible
 * ```
 */
export function parseBlockValue<T extends Record<string, unknown>>(
  value: unknown,
  fallback?: T
): T {
  const defaultValue = (fallback ?? {}) as T

  if (value === undefined || value === null) {
    return defaultValue
  }

  if (typeof value === 'object') {
    return value as T
  }

  if (typeof value === 'string') {
    if (value.trim() === '') {
      return defaultValue
    }
    try {
      const parsed = JSON.parse(value)
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed as T
      }
      return defaultValue
    } catch {
      return defaultValue
    }
  }

  return defaultValue
}

/**
 * Shallow-merges a partial update into a JSON-serialized block value.
 *
 * Parses the current value, merges the patch, and returns the serialized result.
 * Use this with `setValue` to update only specific fields without replacing everything.
 *
 * @param currentValue - The block's current `value` prop (JSON string or object)
 * @param patch - Fields to update (only provided fields are changed)
 * @returns JSON string ready to pass to `setValue`
 *
 * @example
 * ```ts
 * type MyBlock = { firstName: string; lastName: string; email: string }
 *
 * // Only update email, keep firstName and lastName unchanged
 * const updated = mergeBlockValue<MyBlock>(props.value, { email: 'new@email.com' })
 * setValue(updated)
 * ```
 */
export function mergeBlockValue<T extends Record<string, unknown>>(
  currentValue: unknown,
  patch: Partial<T>
): string {
  const current = parseBlockValue<T>(currentValue)
  const merged = { ...current, ...patch }
  return JSON.stringify(merged)
}
