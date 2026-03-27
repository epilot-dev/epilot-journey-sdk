import { describe, it, expect } from 'vitest'
import {
  createBlock,
  createSingleChoice,
  createMultipleChoice,
  createParagraph,
  createStep,
  createNumberInput,
  createFileUpload,
  createActionBar,
  createSuccessMessage,
  createBinaryInput,
  createJourney,
} from '../factories.js'
import { ControlName } from '../blockTypes.js'

// ─── createBlock ──────────────────────────────────────────────────

describe('createBlock', () => {
  it('produces a valid UISchemaElement with scope, type, and id', () => {
    const block = createBlock(ControlName.Control, { name: 'email', label: 'Email' })
    expect(block.type).toBe('Control')
    expect(block.scope).toBe('#/properties/email')
    expect(block.label).toBe('Email')
    expect(block.id).toBeDefined()
  })

  it('sets required in options when specified', () => {
    const block = createBlock(ControlName.Control, { name: 'x', required: true })
    expect(block.options!.required).toBe(true)
  })

  it('defaults showPaper to false', () => {
    const block = createBlock(ControlName.Control, { name: 'x' })
    expect(block.options!.showPaper).toBe(false)
  })

  it('omits label when not provided', () => {
    const block = createBlock(ControlName.Control, { name: 'x' })
    expect(block.label).toBeUndefined()
  })
})

// ─── createSingleChoice — parallel arrays wire format ─────────────

describe('createSingleChoice', () => {
  it('converts choices array to parallel options/optionsLabels arrays', () => {
    const block = createSingleChoice({
      name: 'tariff',
      label: 'Tariff',
      options: {
        choices: [
          { label: 'Basic', value: 'basic' },
          { label: 'Premium', value: 'premium' },
        ],
      },
    })

    expect(block.options!.options).toEqual(['basic', 'premium'])
    expect(block.options!.optionsLabels).toEqual(['Basic', 'Premium'])
  })

  it('includes optionsIcons when icons are provided', () => {
    const block = createSingleChoice({
      name: 'plan',
      options: {
        choices: [
          { label: 'A', value: 'a', icon: 'star' },
          { label: 'B', value: 'b' },
        ],
      },
    })

    expect(block.options!.optionsIcons).toEqual([{ name: 'star' }, undefined])
  })

  it('omits optionsIcons when no choices have icons', () => {
    const block = createSingleChoice({
      name: 'plan',
      options: {
        choices: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
      },
    })

    expect(block.options!.optionsIcons).toBeUndefined()
  })

  it('sets button:true by default (not radio)', () => {
    const block = createSingleChoice({ name: 'x', options: { choices: [{ label: 'A', value: 'a' }] } })
    expect(block.options!.button).toBe(true)
    expect(block.options!.radio).toBeUndefined()
  })

  it('sets radio:true when uiType is radio', () => {
    const block = createSingleChoice({ name: 'x', options: { uiType: 'radio', choices: [{ label: 'A', value: 'a' }] } })
    expect(block.options!.radio).toBe(true)
    expect(block.options!.button).toBeUndefined()
  })

  it('uses Control type (not a custom enum type)', () => {
    const block = createSingleChoice({ name: 'x', options: { choices: [] } })
    expect(block.type).toBe('Control')
  })
})

// ─── createMultipleChoice — parallel arrays wire format ───────────

describe('createMultipleChoice', () => {
  it('converts choices to parallel arrays', () => {
    const block = createMultipleChoice({
      name: 'interests',
      options: {
        choices: [
          { label: 'Solar', value: 'solar' },
          { label: 'Wind', value: 'wind' },
        ],
      },
    })

    expect(block.type).toBe(ControlName.MultiChoice)
    expect(block.options!.options).toEqual(['solar', 'wind'])
    expect(block.options!.optionsLabels).toEqual(['Solar', 'Wind'])
  })
})

// ─── createParagraph — UTF-16LE base64 encoding ──────────────────

describe('createParagraph', () => {
  it('produces Label type with base64-encoded UTF-16LE text', () => {
    const block = createParagraph('intro', 'Hello')
    expect(block.type).toBe('Label')
    expect(block.scope).toBe('#/properties/intro')
    expect(block.text).toBeDefined()

    // Decode to verify round-trip
    const raw = atob(block.text as string)
    const codePoints: number[] = []
    for (let i = 0; i < raw.length; i += 2) {
      codePoints.push(raw.charCodeAt(i) | (raw.charCodeAt(i + 1) << 8))
    }
    const decoded = String.fromCharCode(...codePoints)
    expect(decoded).toBe('Hello')
  })

  it('strips HTML tags from text', () => {
    const block = createParagraph('intro', '<p>Hello <b>World</b></p>')
    const raw = atob(block.text as string)
    const codePoints: number[] = []
    for (let i = 0; i < raw.length; i += 2) {
      codePoints.push(raw.charCodeAt(i) | (raw.charCodeAt(i + 1) << 8))
    }
    const decoded = String.fromCharCode(...codePoints)
    expect(decoded).toBe('Hello World')
  })

  it('decodes HTML entities', () => {
    const block = createParagraph('intro', '&amp; &lt; &gt; &quot; &#39;')
    const raw = atob(block.text as string)
    const codePoints: number[] = []
    for (let i = 0; i < raw.length; i += 2) {
      codePoints.push(raw.charCodeAt(i) | (raw.charCodeAt(i + 1) << 8))
    }
    const decoded = String.fromCharCode(...codePoints)
    expect(decoded).toBe("& < > \" '")
  })

  it('has text at top level, not in options (v3 wire format)', () => {
    const block = createParagraph('intro', 'Test')
    expect(block.text).toBeDefined()
    expect(block.options).toBeUndefined()
  })
})

// ─── createNumberInput — nested fields format ─────────────────────

describe('createNumberInput', () => {
  it('nests unit and range under fields.numberInput', () => {
    const block = createNumberInput({
      name: 'consumption',
      label: 'Annual kWh',
      unit: { show: true, label: 'kWh' },
      range: { min: 0, max: 100000 },
    })

    const fields = block.options!.fields as any
    expect(fields.numberInput.unit).toEqual({ show: true, label: 'kWh' })
    expect(fields.numberInput.range).toEqual({ min: 0, max: 100000 })
    expect(fields.numberInput.label).toBe('Annual kWh')
  })

  it('uses NumberInputControl type', () => {
    const block = createNumberInput({ name: 'x', label: 'X' })
    expect(block.type).toBe(ControlName.NumberInput)
  })
})

// ─── createFileUpload — array-to-string conversion ────────────────

describe('createFileUpload', () => {
  it('converts supportedTypes array to comma-separated string', () => {
    const block = createFileUpload({
      name: 'docs',
      options: { supportedTypes: ['PDF', 'Image'] },
    })

    expect(block.options!.supportedTypes).toBe('PDF, Image')
  })

  it('leaves string supportedTypes unchanged', () => {
    const block = createFileUpload({
      name: 'docs',
      options: { supportedTypes: 'PDF, Image' },
    })

    expect(block.options!.supportedTypes).toBe('PDF, Image')
  })
})

// ─── createBinaryInput ────────────────────────────────────────────

describe('createBinaryInput', () => {
  it('uses Control type (not BooleanControl)', () => {
    const block = createBinaryInput({ name: 'newsletter', label: 'Subscribe' })
    expect(block.type).toBe('Control')
  })

  it('sets _binaryInput marker in options', () => {
    const block = createBinaryInput({ name: 'newsletter' })
    expect(block.options!._binaryInput).toBe(true)
  })
})

// ─── createActionBar ──────────────────────────────────────────────

describe('createActionBar', () => {
  it('generates 4 default consent slots when none provided', () => {
    const block = createActionBar('Next')
    const consents = block.options!.consents as any[]
    expect(consents).toHaveLength(4)
    expect(consents.every((c: any) => c.isVisible === false)).toBe(true)
  })

  it('uses provided consents', () => {
    const block = createActionBar('Submit', {
      consents: [
        { name: 'terms', isRequired: true, isVisible: true, text: 'I agree' },
      ],
    })
    const consents = block.options!.consents as any[]
    expect(consents).toHaveLength(1)
    expect(consents[0].isRequired).toBe(true)
  })

  it('sets ctaButton action type', () => {
    const block = createActionBar('Submit', { actionType: 'SubmitAndGoNext', label: 'Send' })
    const cta = block.options!.ctaButton as any
    expect(cta.actionType).toBe('SubmitAndGoNext')
    expect(cta.label).toBe('Send')
  })
})

// ─── createSuccessMessage ─────────────────────────────────────────

describe('createSuccessMessage', () => {
  it('shows close button when closeButtonText is provided', () => {
    const block = createSuccessMessage('Thanks', { closeButtonText: 'Done' })
    expect(block.options!.showCloseButton).toBe(true)
    expect(block.options!.closeButtonText).toBe('Done')
  })

  it('hides close button by default', () => {
    const block = createSuccessMessage('Thanks')
    expect(block.options!.showCloseButton).toBe(false)
  })
})

// ─── createStep — schema generation ──────────────────────────────

describe('createStep', () => {
  it('generates schema properties from block scopes', () => {
    const step = createStep({
      name: 'Info',
      blocks: [
        createBlock(ControlName.Control, { name: 'email', label: 'Email', required: true }),
        createBlock(ControlName.Address, { name: 'address' }),
      ],
    })

    const props = (step.schema as any).properties
    expect(props.email).toEqual({ type: 'string' })
    expect(props.address).toEqual({ type: 'object' })
    expect((step.schema as any).required).toContain('email')
  })

  it('generates boolean schema for binary input blocks', () => {
    const step = createStep({
      name: 'Prefs',
      blocks: [createBinaryInput({ name: 'newsletter' })],
    })

    const props = (step.schema as any).properties
    expect(props.newsletter).toEqual({ type: 'boolean' })
  })

  it('generates enum schema for single-choice blocks', () => {
    const step = createStep({
      name: 'Select',
      blocks: [
        createSingleChoice({
          name: 'tariff',
          options: {
            choices: [
              { label: 'Basic', value: 'basic' },
              { label: 'Pro', value: 'pro' },
            ],
          },
        }),
      ],
    })

    const props = (step.schema as any).properties
    expect(props.tariff.enum).toEqual(['basic', 'pro'])
  })

  it('generates array schema for multi-choice blocks', () => {
    const step = createStep({
      name: 'Multi',
      blocks: [
        createMultipleChoice({ name: 'interests', options: { choices: [{ label: 'A', value: 'a' }] } }),
      ],
    })

    const props = (step.schema as any).properties
    expect(props.interests).toEqual({ type: 'array' })
  })

  it('uses MainContentCartLayout when sidebarBlocks are provided', () => {
    const step = createStep({
      name: 'Products',
      blocks: [createBlock(ControlName.ProductSelection, { name: 'products' })],
      sidebarBlocks: [createBlock(ControlName.ShoppingCart, { name: 'cart' })],
    })

    expect(step.uischema.type).toBe('MainContentCartLayout')
    // MainContentCartLayout nests elements as [[main], [sidebar], [], []]
    const elements = step.uischema.elements as unknown[][]
    expect(elements).toHaveLength(4)
    expect(elements[0]).toHaveLength(1)
    expect(elements[1]).toHaveLength(1)
  })

  it('uses MainLinearLayout by default', () => {
    const step = createStep({
      name: 'Simple',
      blocks: [createBlock(ControlName.Control, { name: 'x' })],
    })

    expect(step.uischema.type).toBe('MainLinearLayout')
  })

  it('assigns variablePath to stateful blocks but not display-only blocks', () => {
    const step = createStep({
      name: 'Mixed',
      blocks: [
        createBlock(ControlName.Control, { name: 'email' }),
        createParagraph('intro', 'Hello'),
        createActionBar('Next'),
      ],
    })

    // The email block should have variablePath
    const emailBlock = step.uischema.elements![0]
    expect(emailBlock.options!.variablePath).toBe('Mixed_email')

    // Paragraph and ActionBar are display-only – no variablePath
    const paragraph = step.uischema.elements![1]
    expect(paragraph.options?.variablePath).toBeUndefined()
  })
})

// ─── createJourney ────────────────────────────────────────────────

describe('createJourney', () => {
  it('includes required v1 API fields', () => {
    const journey = createJourney({
      organizationId: 'org-1',
      name: 'Test',
      steps: [],
    })

    expect(journey.organizationId).toBe('org-1')
    expect(journey.name).toBe('Test')
    expect(journey.rules).toEqual([])
    expect(journey.contextSchema).toEqual([])
    expect(journey.logics).toEqual([])
    expect(journey.logicsV4).toEqual({})
  })

  it('includes settings when provided', () => {
    const journey = createJourney({
      organizationId: 'org-1',
      name: 'Test',
      steps: [],
      settings: { designId: 'design-abc', language: 'de' },
    })

    expect((journey.settings as any).designId).toBe('design-abc')
  })

  it('omits settings when not provided', () => {
    const journey = createJourney({
      organizationId: 'org-1',
      name: 'Test',
      steps: [],
    })

    expect(journey.settings).toBeUndefined()
  })
})
