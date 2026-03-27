import { describe, it, expect } from 'vitest'
import { parseBlockValue, mergeBlockValue } from '../parse.js'

describe('parseBlockValue', () => {
  it('returns parsed object from valid JSON string', () => {
    const result = parseBlockValue<{ count: number }>(JSON.stringify({ count: 42 }))
    expect(result.count).toBe(42)
  })

  it('returns fallback for undefined', () => {
    const result = parseBlockValue<{ x: number }>(undefined, { x: 0 })
    expect(result).toEqual({ x: 0 })
  })

  it('returns fallback for null', () => {
    const result = parseBlockValue(null, { fallback: true })
    expect(result).toEqual({ fallback: true })
  })

  it('returns fallback for empty string', () => {
    const result = parseBlockValue('', { empty: true })
    expect(result).toEqual({ empty: true })
  })

  it('returns fallback for whitespace-only string', () => {
    const result = parseBlockValue('   ', { ws: true })
    expect(result).toEqual({ ws: true })
  })

  it('returns fallback for invalid JSON string', () => {
    const result = parseBlockValue('not-json', { bad: true })
    expect(result).toEqual({ bad: true })
  })

  it('returns fallback for JSON primitive (not object)', () => {
    const result = parseBlockValue('"just a string"', { prim: true })
    expect(result).toEqual({ prim: true })
  })

  it('passes through an already-parsed object', () => {
    const obj = { already: 'parsed' }
    expect(parseBlockValue(obj)).toBe(obj)
  })

  it('defaults to empty object when no fallback given', () => {
    expect(parseBlockValue(undefined)).toEqual({})
  })

  it('returns fallback for non-string, non-object types', () => {
    expect(parseBlockValue(42, { num: true })).toEqual({ num: true })
    expect(parseBlockValue(true, { bool: true })).toEqual({ bool: true })
  })
})

describe('mergeBlockValue', () => {
  it('merges a patch into a JSON-string current value', () => {
    const current = JSON.stringify({ a: 1, b: 2 })
    const result = JSON.parse(mergeBlockValue(current, { b: 99, c: 3 }))
    expect(result).toEqual({ a: 1, b: 99, c: 3 })
  })

  it('returns a JSON string', () => {
    const result = mergeBlockValue('{}', { x: 1 })
    expect(typeof result).toBe('string')
    expect(JSON.parse(result)).toEqual({ x: 1 })
  })

  it('handles undefined current value gracefully', () => {
    const result = JSON.parse(mergeBlockValue(undefined, { fresh: true }))
    expect(result).toEqual({ fresh: true })
  })
})
