/**
 * Exports a journey's wire format JSON into readable SDK factory code.
 *
 * Takes the raw journey object (from the API) and produces a TypeScript
 * string that recreates it using the SDK's factory functions.
 *
 * @module export
 */

import { ControlName } from '../client/blockTypes.js'
import type { StepConfig, UISchemaElement } from '../client/types.js'

// ─── Control name → factory mapping ──────────────────────────────

const CONTROL_TO_FACTORY: Record<string, string> = {
  [ControlName.PersonalInformation]: 'createPersonalInformation',
  [ControlName.Contact]: 'createContact',
  [ControlName.Account]: 'createBlock',
  [ControlName.Address]: 'createAddress',
  [ControlName.NumberInput]: 'createNumberInput',
  [ControlName.DatePicker]: 'createDatePicker',
  [ControlName.MultiChoice]: 'createMultipleChoice',
  [ControlName.ProductSelection]: 'createProductSelection',
  [ControlName.Payment]: 'createPaymentMethod',
  [ControlName.FileUpload]: 'createFileUpload',
  [ControlName.Consents]: 'createConsents',
  [ControlName.AvailabilityCheck]: 'createAvailabilityCheck',
  [ControlName.PVRoofPlanner]: 'createPVRoofPlanner',
  [ControlName.DigitalSignature]: 'createBlock',
  [ControlName.MeterReading]: 'createBlock',
  [ControlName.InputCalculator]: 'createBlock',
  [ControlName.PreviousProvider]: 'createBlock',
  [ControlName.EntityLookup]: 'createBlock',
  [ControlName.EntityAttribute]: 'createBlock',
  [ControlName.Cards]: 'createBlock',
  [ControlName.Auth]: 'createBlock',
  [ControlName.AppBlock]: 'createBlock',
  [ControlName.CustomBlock]: 'createBlock',
  [ControlName.GroupLayout]: 'createBlock',
  [ControlName.ContractStartDate]: 'createBlock',
}

// Positional-arg factories
const POSITIONAL_FACTORIES = new Set([
  'createParagraph', 'createImage', 'createActionBar',
  'createSuccessMessage', 'createSummary', 'createShoppingCart',
])

// ─── Helpers ─────────────────────────────────────────────────────

function indent(str: string, level: number): string {
  const pad = '  '.repeat(level)
  return str.split('\n').map(line => pad + line).join('\n')
}

function formatValue(value: unknown, depth = 0): string {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'string') return JSON.stringify(value)
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    const items = value.map(v => formatValue(v, depth + 1))
    if (items.join(', ').length < 80 && !items.some(i => i.includes('\n'))) {
      return `[${items.join(', ')}]`
    }
    return `[\n${items.map(i => indent(i + ',', depth + 1)).join('\n')}\n${'  '.repeat(depth)}]`
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
    if (entries.length === 0) return '{}'

    const lines = entries.map(([k, v]) => {
      const key = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : JSON.stringify(k)
      return `${key}: ${formatValue(v, depth + 1)}`
    })

    if (lines.join(', ').length < 80 && !lines.some(l => l.includes('\n'))) {
      return `{ ${lines.join(', ')} }`
    }
    return `{\n${lines.map(l => indent(l + ',', depth + 1)).join('\n')}\n${'  '.repeat(depth)}}`
  }

  return String(value)
}

// ─── Block decoder ───────────────────────────────────────────────

function decodeBase64Utf16le(encoded: string): string {
  try {
    const raw = atob(encoded)
    const codePoints: number[] = []
    for (let i = 0; i < raw.length; i += 2) {
      codePoints.push(raw.charCodeAt(i) | (raw.charCodeAt(i + 1) << 8))
    }
    return String.fromCharCode(...codePoints)
  } catch {
    return '(could not decode)'
  }
}

function blockName(block: UISchemaElement): string {
  return block.scope?.replace('#/properties/', '') || 'unnamed'
}

function exportBlock(block: UISchemaElement, schema: Record<string, unknown>): string {
  const name = blockName(block)
  const opts = block.options || {}

  // Skip internal options for cleaner output
  const cleanOpts = { ...opts } as Record<string, unknown>
  delete cleanOpts.variablePath
  delete cleanOpts.showPaper
  if (cleanOpts.showPaper === false) delete cleanOpts.showPaper

  // ── Paragraph (Label) ──
  if (block.type === ControlName.Paragraph) {
    const text = typeof block.text === 'string' ? decodeBase64Utf16le(block.text) : ''
    return `createParagraph(${JSON.stringify(name)}, ${JSON.stringify(text)})`
  }

  // ── Image ──
  if (block.type === ControlName.Image) {
    const url = cleanOpts.url as string || ''
    const imgOpts: Record<string, unknown> = {}
    if (cleanOpts.altText) imgOpts.altText = cleanOpts.altText
    if (cleanOpts.width && cleanOpts.width !== '100%') imgOpts.width = cleanOpts.width
    const optsStr = Object.keys(imgOpts).length ? `, ${formatValue(imgOpts)}` : ''
    return `createImage(${JSON.stringify(name)}, ${JSON.stringify(url)}${optsStr})`
  }

  // ── ActionBar ──
  if (block.type === ControlName.ActionBar) {
    const cta = cleanOpts.ctaButton as Record<string, unknown> | undefined
    const back = cleanOpts.goBackButton as Record<string, unknown> | undefined
    const consents = cleanOpts.consents as unknown[] | undefined
    const abOpts: Record<string, unknown> = {}
    if (cta?.label && cta.label !== 'Next') abOpts.label = cta.label
    if (cta?.actionType && cta.actionType !== 'GoNext') abOpts.actionType = cta.actionType
    if (back?.isVisible) {
      abOpts.showBack = true
      if (back.label && back.label !== 'Back') abOpts.backLabel = back.label
    }
    // Include consents if any are visible
    const visibleConsents = (consents || []).filter((c: any) => c.isVisible)
    if (visibleConsents.length > 0) {
      abOpts.consents = consents
    }
    const optsStr = Object.keys(abOpts).length ? `, ${formatValue(abOpts)}` : ''
    return `createActionBar(${JSON.stringify(name)}${optsStr})`
  }

  // ── Success Message ──
  if (block.type === ControlName.ConfirmationMessage) {
    const msgOpts: Record<string, unknown> = {}
    if (cleanOpts.title) msgOpts.title = cleanOpts.title
    if (cleanOpts.text) msgOpts.text = cleanOpts.text
    if (cleanOpts.closeButtonText) msgOpts.closeButtonText = cleanOpts.closeButtonText
    return `createSuccessMessage(${JSON.stringify(name)}, ${formatValue(msgOpts)})`
  }

  // ── Summary ──
  if (block.type === ControlName.Summary) {
    const sumOpts: Record<string, unknown> = {}
    if (cleanOpts.subTitle) sumOpts.subTitle = cleanOpts.subTitle
    const optsStr = Object.keys(sumOpts).length ? `, ${formatValue(sumOpts)}` : ''
    return `createSummary(${JSON.stringify(name)}${optsStr})`
  }

  // ── Shopping Cart ──
  if (block.type === ControlName.ShoppingCart) {
    const cartOpts: Record<string, unknown> = {}
    if (cleanOpts.cartTitle) cartOpts.cartTitle = cleanOpts.cartTitle
    if (cleanOpts.cartFootnote) cartOpts.cartFootnote = cleanOpts.cartFootnote
    const optsStr = Object.keys(cartOpts).length ? `, ${formatValue(cartOpts)}` : ''
    return `createShoppingCart(${JSON.stringify(name)}${optsStr})`
  }

  // ── Control (dispatcher: text / single-choice / binary) ──
  if (block.type === ControlName.Control || block.type === ControlName.TextField) {
    const props = (schema as any)?.properties?.[name]

    // Binary input
    if (props?.type === 'boolean' || cleanOpts._binaryInput) {
      const biOpts: Record<string, unknown> = { name }
      if (block.label) biOpts.label = block.label
      if (cleanOpts.toggle) biOpts.toggle = true
      return `createBinaryInput(${formatValue(biOpts)})`
    }

    // Single choice (has enum or button/radio flag)
    if (props?.enum || cleanOpts.button || cleanOpts.radio) {
      const scOpts: Record<string, unknown> = { name }
      if (block.label) scOpts.label = block.label
      if (cleanOpts.required) scOpts.required = true

      const choiceOpts: Record<string, unknown> = {}
      if (cleanOpts.radio) choiceOpts.uiType = 'radio'
      else if (cleanOpts.button || cleanOpts.imageButton) choiceOpts.uiType = 'button'
      else choiceOpts.uiType = 'dropdown'

      // Reconstruct choices from parallel arrays
      const values = (cleanOpts.options || []) as string[]
      const labels = (cleanOpts.optionsLabels || []) as string[]
      const icons = (cleanOpts.optionsIcons || []) as Array<{ name: string } | undefined>
      const choices = values.map((v, i) => {
        const choice: Record<string, unknown> = { label: labels[i] || v, value: v }
        if (icons[i]?.name) choice.icon = icons[i]!.name
        return choice
      })
      if (choices.length) choiceOpts.choices = choices

      scOpts.options = choiceOpts
      return `createSingleChoice(${formatValue(scOpts)})`
    }

    // Text input (default)
    const tiOpts: Record<string, unknown> = { name }
    if (block.label) tiOpts.label = block.label
    if (cleanOpts.required) tiOpts.required = true
    const inputOpts: Record<string, unknown> = {}
    if (cleanOpts.multiline) inputOpts.multiline = true
    if (cleanOpts.placeholder) inputOpts.placeholder = cleanOpts.placeholder
    if (Object.keys(inputOpts).length) tiOpts.options = inputOpts
    return `createTextInput(${formatValue(tiOpts)})`
  }

  // ── MultipleChoice ──
  if (block.type === ControlName.MultiChoice) {
    const mcOpts: Record<string, unknown> = { name }
    if (block.label) mcOpts.label = block.label
    if (cleanOpts.required) mcOpts.required = true

    const choiceOpts: Record<string, unknown> = {}
    choiceOpts.uiType = (cleanOpts.uiType as string) || 'checkbox'
    if (cleanOpts.maxSelection) choiceOpts.maxSelection = cleanOpts.maxSelection

    const values = (cleanOpts.options || []) as string[]
    const labels = (cleanOpts.optionsLabels || []) as string[]
    const icons = (cleanOpts.optionsIcons || []) as Array<{ name: string } | undefined>
    const choices = values.map((v, i) => {
      const choice: Record<string, unknown> = { label: labels[i] || v, value: v }
      if (icons[i]?.name) choice.icon = icons[i]!.name
      return choice
    })
    if (choices.length) choiceOpts.choices = choices

    mcOpts.options = choiceOpts
    return `createMultipleChoice(${formatValue(mcOpts)})`
  }

  // ── NumberInput ──
  if (block.type === ControlName.NumberInput) {
    const niOpts: Record<string, unknown> = { name }
    if (block.label) niOpts.label = block.label
    if (cleanOpts.required) niOpts.required = true
    const fields = (cleanOpts.fields as any)?.numberInput
    if (fields?.unit) niOpts.unit = fields.unit
    if (fields?.range) niOpts.range = fields.range
    if (cleanOpts.suggestions) niOpts.suggestions = cleanOpts.suggestions
    return `createNumberInput(${formatValue(niOpts)})`
  }

  // ── DatePicker ──
  if (block.type === ControlName.DatePicker) {
    const dpOpts: Record<string, unknown> = { name }
    if (block.label) dpOpts.label = block.label
    if (cleanOpts.required) dpOpts.required = true
    if (cleanOpts.showTime) dpOpts.showTime = true
    const startDate = (cleanOpts.fields as any)?.startDate
    if (startDate?.limits?.disablePast) dpOpts.disablePast = true
    return `createDatePicker(${formatValue(dpOpts)})`
  }

  // ── Options-style factories (PI, Contact, Address, etc.) ──
  const factory = CONTROL_TO_FACTORY[block.type]
  if (factory && factory !== 'createBlock') {
    const fOpts: Record<string, unknown> = { name }
    if (block.label) fOpts.label = block.label
    if (cleanOpts.required) fOpts.required = true
    if (opts.showPaper) fOpts.showPaper = true
    if (Object.keys(cleanOpts).length) fOpts.options = cleanOpts
    return `${factory}(${formatValue(fOpts)})`
  }

  // ── Fallback: createBlock for unknown types ──
  const fbOpts: Record<string, unknown> = { name }
  if (block.label) fbOpts.label = block.label
  if (Object.keys(cleanOpts).length) fbOpts.options = cleanOpts
  return `createBlock(ControlName.${Object.entries(ControlName).find(([, v]) => v === block.type)?.[0] || block.type}, ${formatValue(fbOpts)})`
}

// ─── Step exporter ───────────────────────────────────────────────

function exportStep(step: StepConfig, stepIndex: number): string {
  const isCartLayout = step.uischema.type === 'MainContentCartLayout'

  let mainBlocks: UISchemaElement[]
  let sidebarBlocks: UISchemaElement[] = []

  if (isCartLayout && Array.isArray(step.uischema.elements?.[0])) {
    const zones = step.uischema.elements as unknown as UISchemaElement[][]
    mainBlocks = zones[0] || []
    sidebarBlocks = zones[1] || []
  } else {
    mainBlocks = step.uischema.elements || []
  }

  const blockLines = mainBlocks
    .map(b => exportBlock(b, step.schema))
    .map(line => indent(line + ',', 3))
    .join('\n')

  let sidebarStr = ''
  if (sidebarBlocks.length) {
    const sidebarLines = sidebarBlocks
      .map(b => exportBlock(b, step.schema))
      .map(line => indent(line + ',', 3))
      .join('\n')
    sidebarStr = `\n      sidebarBlocks: [\n${sidebarLines}\n      ],`
  }

  const stepOpts: string[] = []
  stepOpts.push(`      name: ${JSON.stringify(step.name)},`)
  if (isCartLayout) stepOpts.push(`      layout: 'MainContentCartLayout',`)
  if (step.showStepper !== undefined) stepOpts.push(`      showStepper: ${step.showStepper},`)
  if (step.showStepperLabels !== undefined) stepOpts.push(`      showStepperLabels: ${step.showStepperLabels},`)
  if (step.showStepName === false) stepOpts.push(`      showStepName: false,`)
  if (step.hideNextButton) stepOpts.push(`      hideNextButton: true,`)

  return `    createStep({
${stepOpts.join('\n')}
      blocks: [
${blockLines}
      ],${sidebarStr}
    })`
}

// ─── Journey exporter ────────────────────────────────────────────

/**
 * Exports a raw journey object into SDK factory code.
 *
 * @param journey - The journey object from the API (JourneyRaw)
 * @returns TypeScript source code string
 *
 * @example
 * ```ts
 * const journey = await client.getJourney('journey-id')
 * const code = exportJourneyCode(journey)
 * console.log(code) // prints createJourney({ ... }) with all factory calls
 * ```
 */
export function exportJourneyCode(journey: Record<string, unknown>): string {
  const steps = (journey.steps || []) as StepConfig[]
  const settings = journey.settings as Record<string, unknown> | undefined
  const name = journey.name as string || 'Exported Journey'
  const orgId = journey.organizationId as string || '<ORG_ID>'

  // Collect which imports are needed
  const imports = new Set<string>(['createJourney', 'createStep', 'JourneyClient'])
  const code = steps.map((step, i) => exportStep(step, i)).join(',\n\n')

  // Scan the code for factory calls to build import list
  const factoryPattern = /(create\w+)\(/g
  let match
  while ((match = factoryPattern.exec(code)) !== null) {
    imports.add(match[1])
  }
  if (code.includes('ControlName.')) imports.add('ControlName')

  // Build settings
  const settingsObj: Record<string, unknown> = {}
  if (settings?.designId) settingsObj.designId = settings.designId
  if (settings?.runtimeEntities) settingsObj.runtimeEntities = settings.runtimeEntities
  if (settings?.description) settingsObj.description = settings.description

  const settingsStr = Object.keys(settingsObj).length
    ? `\n  settings: ${formatValue(settingsObj, 1)},`
    : ''

  const importList = Array.from(imports).sort().join(',\n  ')

  return `import {
  ${importList},
} from '@epilot/epilot-journey-sdk'

const client = new JourneyClient({
  auth: process.env.EPILOT_TOKEN!,
  apiUrl: 'https://journey-config.dev.sls.epilot.io',
})

const journey = createJourney({
  organizationId: ${JSON.stringify(orgId)},
  name: ${JSON.stringify(name)},${settingsStr}
  steps: [
${code},
  ],
})

const created = await client.createJourney(journey)
console.log('Journey created:', (created as any).journeyId)
`
}
