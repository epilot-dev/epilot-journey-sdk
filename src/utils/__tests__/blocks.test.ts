import { describe, it, expect } from 'vitest'
import {
  findBlock,
  getStepBlocks,
  getAllBlocks,
  updateBlock,
  addBlock,
  removeBlock,
} from '../blocks.js'
import type { StepConfig, UISchemaElement } from '../../client/types.js'

// ─── Helpers ──────────────────────────────────────────────────────

function makeBlock(scope: string, label?: string): UISchemaElement {
  return { type: 'Control', scope, ...(label && { label }) }
}

function makeLayout(elements: UISchemaElement[]): UISchemaElement {
  return { type: 'VerticalLayout', elements }
}

function makeStep(blocks: UISchemaElement[], name = 'Step'): StepConfig {
  return {
    name,
    schema: { type: 'object', properties: {} },
    uischema: makeLayout(blocks),
  }
}

function makeNestedStep(): StepConfig {
  return {
    name: 'Nested',
    schema: { type: 'object', properties: {} },
    uischema: makeLayout([
      makeBlock('#/properties/top'),
      {
        type: 'Group',
        elements: [
          makeBlock('#/properties/nested_a', 'Nested A'),
          makeBlock('#/properties/nested_b'),
        ],
      },
    ]),
  }
}

// ─── findBlock ────────────────────────────────────────────────────

describe('findBlock', () => {
  it('finds a block by scope in a flat layout', () => {
    const steps = [makeStep([makeBlock('#/properties/email'), makeBlock('#/properties/phone')])]
    const result = findBlock(steps, { stepIndex: 0, blockName: '#/properties/email' })
    expect(result).toBeDefined()
    expect(result!.scope).toBe('#/properties/email')
  })

  it('finds a block by label fallback', () => {
    const steps = [makeStep([makeBlock('#/properties/email', 'Email Address')])]
    const result = findBlock(steps, { stepIndex: 0, blockName: 'Email Address' })
    expect(result).toBeDefined()
    expect(result!.scope).toBe('#/properties/email')
  })

  it('finds a block nested inside a Group', () => {
    const steps = [makeNestedStep()]
    const result = findBlock(steps, { stepIndex: 0, blockName: '#/properties/nested_a' })
    expect(result).toBeDefined()
    expect(result!.label).toBe('Nested A')
  })

  it('returns undefined for non-existent block', () => {
    const steps = [makeStep([makeBlock('#/properties/email')])]
    expect(findBlock(steps, { stepIndex: 0, blockName: '#/properties/nope' })).toBeUndefined()
  })

  it('returns undefined for out-of-bounds step index', () => {
    const steps = [makeStep([makeBlock('#/properties/email')])]
    expect(findBlock(steps, { stepIndex: 5, blockName: '#/properties/email' })).toBeUndefined()
  })
})

// ─── getStepBlocks ────────────────────────────────────────────────

describe('getStepBlocks', () => {
  it('returns flat list of leaf blocks from a layout', () => {
    const step = makeStep([makeBlock('#/properties/a'), makeBlock('#/properties/b')])
    const blocks = getStepBlocks(step)
    expect(blocks).toHaveLength(2)
    expect(blocks.map((b) => b.scope)).toEqual(['#/properties/a', '#/properties/b'])
  })

  it('flattens nested layouts', () => {
    const step = makeNestedStep()
    const blocks = getStepBlocks(step)
    expect(blocks).toHaveLength(3)
    expect(blocks.map((b) => b.scope)).toEqual([
      '#/properties/top',
      '#/properties/nested_a',
      '#/properties/nested_b',
    ])
  })
})

// ─── getAllBlocks ──────────────────────────────────────────────────

describe('getAllBlocks', () => {
  it('collects blocks across multiple steps with correct step indices', () => {
    const steps = [
      makeStep([makeBlock('#/properties/a')]),
      makeStep([makeBlock('#/properties/b'), makeBlock('#/properties/c')]),
    ]
    const all = getAllBlocks(steps)
    expect(all).toHaveLength(3)
    expect(all[0].stepIndex).toBe(0)
    expect(all[1].stepIndex).toBe(1)
    expect(all[2].stepIndex).toBe(1)
  })

  it('returns empty array for empty steps', () => {
    expect(getAllBlocks([])).toEqual([])
  })
})

// ─── updateBlock ──────────────────────────────────────────────────

describe('updateBlock', () => {
  it('patches a block and returns a new steps array (immutable)', () => {
    const steps = [makeStep([makeBlock('#/properties/email', 'Email')])]
    const updated = updateBlock(steps, { stepIndex: 0, blockName: '#/properties/email' }, { label: 'Work Email' })

    // New array, original untouched
    expect(updated).not.toBe(steps)
    expect(steps[0].uischema.elements![0].label).toBe('Email')

    // Updated value
    const block = findBlock(updated, { stepIndex: 0, blockName: '#/properties/email' })
    expect(block!.label).toBe('Work Email')
  })

  it('patches a nested block', () => {
    const steps = [makeNestedStep()]
    const updated = updateBlock(steps, { stepIndex: 0, blockName: '#/properties/nested_a' }, { label: 'Updated' })
    const block = findBlock(updated, { stepIndex: 0, blockName: '#/properties/nested_a' })
    expect(block!.label).toBe('Updated')
  })

  it('returns original array when block not found', () => {
    const steps = [makeStep([makeBlock('#/properties/email')])]
    const result = updateBlock(steps, { stepIndex: 0, blockName: '#/properties/nope' }, { label: 'X' })
    expect(result).toBe(steps)
  })

  it('returns original array when step index is out of bounds', () => {
    const steps = [makeStep([makeBlock('#/properties/email')])]
    const result = updateBlock(steps, { stepIndex: 99, blockName: '#/properties/email' }, { label: 'X' })
    expect(result).toBe(steps)
  })
})

// ─── addBlock ─────────────────────────────────────────────────────

describe('addBlock', () => {
  it('appends a block to the end by default', () => {
    const steps = [makeStep([makeBlock('#/properties/a')])]
    const newBlock = makeBlock('#/properties/b')
    const updated = addBlock(steps, 0, newBlock)

    expect(updated[0].uischema.elements).toHaveLength(2)
    expect(updated[0].uischema.elements![1].scope).toBe('#/properties/b')
  })

  it('inserts a block at a specific position', () => {
    const steps = [makeStep([makeBlock('#/properties/a'), makeBlock('#/properties/c')])]
    const newBlock = makeBlock('#/properties/b')
    const updated = addBlock(steps, 0, newBlock, 1)

    const scopes = updated[0].uischema.elements!.map((e) => e.scope)
    expect(scopes).toEqual(['#/properties/a', '#/properties/b', '#/properties/c'])
  })

  it('does not mutate the original', () => {
    const steps = [makeStep([makeBlock('#/properties/a')])]
    const origLen = steps[0].uischema.elements!.length
    addBlock(steps, 0, makeBlock('#/properties/b'))
    expect(steps[0].uischema.elements).toHaveLength(origLen)
  })

  it('returns original array for invalid step index', () => {
    const steps = [makeStep([makeBlock('#/properties/a')])]
    const result = addBlock(steps, 5, makeBlock('#/properties/b'))
    expect(result).toBe(steps)
  })
})

// ─── removeBlock ──────────────────────────────────────────────────

describe('removeBlock', () => {
  it('removes a block by scope', () => {
    const steps = [makeStep([makeBlock('#/properties/a'), makeBlock('#/properties/b')])]
    const updated = removeBlock(steps, { stepIndex: 0, blockName: '#/properties/a' })
    expect(updated[0].uischema.elements).toHaveLength(1)
    expect(updated[0].uischema.elements![0].scope).toBe('#/properties/b')
  })

  it('removes a nested block', () => {
    const steps = [makeNestedStep()]
    const updated = removeBlock(steps, { stepIndex: 0, blockName: '#/properties/nested_a' })
    const blocks = getStepBlocks(updated[0])
    expect(blocks.map((b) => b.scope)).toEqual(['#/properties/top', '#/properties/nested_b'])
  })

  it('returns original array when block not found', () => {
    const steps = [makeStep([makeBlock('#/properties/a')])]
    const result = removeBlock(steps, { stepIndex: 0, blockName: '#/properties/nope' })
    expect(result).toBe(steps)
  })

  it('does not mutate the original', () => {
    const steps = [makeStep([makeBlock('#/properties/a'), makeBlock('#/properties/b')])]
    removeBlock(steps, { stepIndex: 0, blockName: '#/properties/a' })
    expect(steps[0].uischema.elements).toHaveLength(2)
  })
})
