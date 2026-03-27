/**
 * Factory functions for programmatic journey and block creation.
 *
 * These functions produce valid v3 API wire format payloads that can be
 * sent directly to the Journey API via {@link JourneyClient}.
 *
 * @module factories
 */

import { ControlName } from './blockTypes.js'
import type {
  ControlNameValue,
} from './blockTypes.js'
import type { UISchemaElement, StepConfig } from './types.js'

// ─── ID Generation ───────────────────────────────────────────────

function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function stepId(name: string): string {
  return name
}

function variablePath(stepName: string, blockName: string): string {
  return `${stepName.replace(/[^a-zA-Z0-9]/g, '_')}_${blockName.replace(/[^a-zA-Z0-9]/g, '_')}`
}

// ─── Block Creation ──────────────────────────────────────────────

export interface CreateBlockOptions {
  /** Block name used as property key in the step schema (can be human-readable, e.g. 'Contact Info') */
  name: string
  /** Display label shown to end users */
  label?: string
  /** Whether this block is required */
  required?: boolean
  /** Whether to render with a card/paper background */
  showPaper?: boolean
  /** Block-specific options (varies by type) */
  options?: Record<string, unknown>
}

/**
 * Creates a UI schema element for a given block type.
 *
 * Produces a valid v3 `uischema` element matching the real Journey API format.
 * Each element gets a UUID `id` and the scope uses the block name as-is.
 *
 * @example
 * ```ts
 * const emailBlock = createBlock(ControlName.Control, {
 *   name: 'Email',
 *   label: 'Email Address',
 *   required: true,
 *   options: { placeholder: 'you@example.com' },
 * })
 * ```
 */
export function createBlock(
  type: ControlNameValue,
  opts: CreateBlockOptions
): UISchemaElement {
  const scope = `#/properties/${opts.name}`
  const element: UISchemaElement = {
    id: uuid(),
    type,
    scope,
  }

  if (opts.label) {
    element.label = opts.label
  }

  const options: Record<string, unknown> = {
    showPaper: opts.showPaper ?? false,
    ...opts.options,
  }

  // Propagate required into options so createStep can pick it up for the schema
  if (opts.required) {
    options.required = true
  }

  element.options = options

  return element
}

// ─── Typed Block Factories ───────────────────────────────────────

/**
 * Creates a text input block.
 *
 * In the v3 format, text inputs use the generic `Control` type.
 * The schema type at the scope path determines the rendering.
 *
 * @example
 * ```ts
 * const notes = createTextInput({
 *   name: 'Notes',
 *   label: 'Additional Notes',
 *   options: { multiline: true, placeholder: 'Enter any additional information...' },
 * })
 * ```
 */
export function createTextInput(opts: CreateBlockOptions & { options?: Record<string, unknown> }): UISchemaElement {
  return createBlock(ControlName.Control, opts)
}

/**
 * Creates a number input block.
 *
 * Options must be nested under `fields.numberInput` to match the v3 format
 * expected by the journey renderer's `transformUp`.
 *
 * @example
 * ```ts
 * const consumption = createNumberInput({
 *   name: 'Consumption',
 *   label: 'Annual Consumption',
 *   required: true,
 *   unit: { show: true, label: 'kWh' },
 *   range: { min: 0, max: 100000 },
 * })
 * ```
 */
export function createNumberInput(opts: CreateBlockOptions & {
  unit?: { show: boolean; label: string }
  range?: { min: number; max: number }
  format?: { show?: boolean; validate?: boolean; decimalPlaces?: number; digitsBeforeDecimalPoint?: number }
  suggestions?: Array<{ label: string; value: string }>
}): UISchemaElement {
  const { unit, range, format, suggestions, ...rest } = opts
  return createBlock(ControlName.NumberInput, {
    ...rest,
    options: {
      ...rest.options,
      fields: {
        numberInput: {
          ...(unit && { unit }),
          ...(range && { range }),
          ...(format && { format }),
          label: rest.label ?? rest.name,
        },
      },
      ...(suggestions && { suggestions }),
    },
  })
}

/**
 * Creates a single-choice selection block.
 *
 * The v3 wire format uses parallel arrays (`options`, `optionsLabels`,
 * `optionsIcons`) rather than a single `choices` array. This factory
 * accepts a friendlier `choices` array and converts it automatically.
 *
 * @example
 * ```ts
 * const tariff = createSingleChoice({
 *   name: 'tariff',
 *   label: 'Select your tariff',
 *   required: true,
 *   options: {
 *     uiType: 'button',
 *     choices: [
 *       { label: 'Basic', value: 'basic' },
 *       { label: 'Premium', value: 'premium' },
 *     ],
 *   },
 * })
 * ```
 */
export function createSingleChoice(opts: CreateBlockOptions & { options?: Record<string, unknown> }): UISchemaElement {
  const { choices, ...restOptions } = (opts.options ?? {}) as Record<string, unknown>

  const choicesArr = choices as Array<{ label: string; value: string; icon?: string | { name: string } }> | undefined
  const wireOptions: Record<string, unknown> = { ...restOptions }

  if (choicesArr?.length) {
    wireOptions.options = choicesArr.map((c) => c.value)
    wireOptions.optionsLabels = choicesArr.map((c) => c.label)
    const icons = choicesArr.map((c) =>
      c.icon ? (typeof c.icon === 'string' ? { name: c.icon } : c.icon) : undefined,
    )
    if (icons.some(Boolean)) {
      wireOptions.optionsIcons = icons
    }
  }

  // transformUp requires type='Control'. Testers match via isEnumControl (schema.enum) + the mode flag:
  //   EnumButtonControlTester: optionIs('button', true)
  //   RadioTester:             optionIs('radio', true)
  // The schema enum values are injected by createStep based on options.options.
  const uiType = (wireOptions.uiType ?? 'button') as string
  const modeFlag = uiType === 'radio' ? { radio: true } : { button: true }

  return createBlock(ControlName.Control, {
    ...opts,
    options: { ...wireOptions, ...modeFlag },
  })
}

/**
 * Creates a multiple-choice selection block.
 *
 * The v3 wire format uses parallel arrays (`options`, `optionsLabels`,
 * `optionsIcons`) rather than a single `choices` array. This factory
 * accepts a friendlier `choices` array and converts it automatically.
 *
 * @example
 * ```ts
 * const interests = createMultipleChoice({
 *   name: 'interests',
 *   label: 'Select your interests',
 *   options: {
 *     uiType: 'checkbox',
 *     choices: [
 *       { label: 'Solar', value: 'solar' },
 *       { label: 'Wind', value: 'wind' },
 *       { label: 'Gas', value: 'gas' },
 *     ],
 *   },
 * })
 * ```
 */
export function createMultipleChoice(opts: CreateBlockOptions & { options?: Record<string, unknown> }): UISchemaElement {
  const { choices, ...restOptions } = (opts.options ?? {}) as Record<string, unknown>

  // Convert friendly choices array to v3 parallel arrays format
  const choicesArr = choices as Array<{ label: string; value: string; icon?: string | { name: string } }> | undefined
  const wireOptions: Record<string, unknown> = { ...restOptions }

  if (choicesArr?.length) {
    wireOptions.options = choicesArr.map((c) => c.value)
    wireOptions.optionsLabels = choicesArr.map((c) => c.label)
    const icons = choicesArr.map((c) =>
      c.icon ? (typeof c.icon === 'string' ? { name: c.icon } : c.icon) : undefined,
    )
    if (icons.some(Boolean)) {
      wireOptions.optionsIcons = icons
    }
  }

  return createBlock(ControlName.MultiChoice, {
    ...opts,
    options: wireOptions,
  })
}

/**
 * Creates a binary input (switch/checkbox) block.
 *
 * @example
 * ```ts
 * const newsletter = createBinaryInput({
 *   name: 'newsletter',
 *   label: 'Subscribe to newsletter',
 * })
 * ```
 */
export function createBinaryInput(opts: CreateBlockOptions & { toggle?: boolean }): UISchemaElement {
  // transformUp dispatches type:'Control' with boolean schema → upBinaryInput.
  // BooleanControl type is not in the upHandlerMap and would throw.
  return createBlock(ControlName.Control, {
    ...opts,
    options: {
      ...opts.options,
      // Mark as binary so createStep generates boolean schema (not string)
      _binaryInput: true,
      ...(opts.toggle !== undefined && { toggle: opts.toggle }),
    },
  })
}

/**
 * Creates a date picker block.
 *
 * @example
 * ```ts
 * const moveDate = createDatePicker({
 *   name: 'moveDate',
 *   label: 'Moving Date',
 *   required: true,
 *   options: { showTime: false },
 * })
 * ```
 */
export function createDatePicker(opts: CreateBlockOptions & {
  options?: Record<string, unknown>
  showTime?: boolean
  disablePast?: boolean
}): UISchemaElement {
  const { showTime, disablePast, ...rest } = opts
  return createBlock(ControlName.DatePicker, {
    ...rest,
    options: {
      ...rest.options,
      showTime: showTime ?? false,
      fields: (rest.options as any)?.fields ?? {
        startDate: {
          label: rest.label ?? rest.name,
          ...(disablePast && { limits: { disablePast: true } }),
        },
      },
    },
  })
}

/**
 * Creates a personal information block.
 *
 * Fields listed in `fields` are displayed; omit a field to hide it.
 * Set `{ required: true }` on each field that must be filled.
 *
 * @example
 * ```ts
 * const personalInfo = createPersonalInformation({
 *   name: 'Contact Info',
 *   required: true,
 *   options: {
 *     customerType: 'PRIVATE',
 *     purposeLabels: ['customer'],
 *     title: 'Your Details',
 *     fields: {
 *       firstName: { required: true },
 *       lastName: { required: true },
 *       email: { required: true },
 *       telephone: {},
 *     },
 *   },
 * })
 * ```
 */
export function createPersonalInformation(opts: CreateBlockOptions & { options?: Record<string, unknown> }): UISchemaElement {
  return createBlock(ControlName.PersonalInformation, {
    ...opts,
    showPaper: opts.showPaper ?? true,
  })
}

/**
 * Creates a contact block.
 *
 * @example
 * ```ts
 * const contact = createContact({
 *   name: 'Contact',
 *   required: true,
 *   options: {
 *     purpose: ['customer'],
 *     title: 'Contact Information',
 *     fields: {
 *       firstName: { required: true },
 *       lastName: { required: true },
 *       email: { required: true },
 *     },
 *   },
 * })
 * ```
 */
export function createContact(opts: CreateBlockOptions & { options?: Record<string, unknown> }): UISchemaElement {
  return createBlock(ControlName.Contact, {
    ...opts,
    showPaper: opts.showPaper ?? true,
  })
}

/**
 * Creates an address block.
 *
 * Fields listed in `fields` are displayed; omit a field to hide it.
 *
 * @example
 * ```ts
 * const address = createAddress({
 *   name: 'Address',
 *   required: true,
 *   options: {
 *     title: 'Delivery Address',
 *     countryAddressSettings: { countryCode: 'DE', enableAutoComplete: true, enableFreeText: false },
 *     acceptSuggestedOnly: true,
 *     fields: {
 *       zipCity: { required: true },
 *       streetName: { required: true },
 *       houseNumber: { required: true },
 *       extention: {},
 *     },
 *   },
 * })
 * ```
 */
export function createAddress(opts: CreateBlockOptions & { options?: Record<string, unknown> }): UISchemaElement {
  return createBlock(ControlName.Address, {
    ...opts,
    showPaper: opts.showPaper ?? true,
  })
}

/**
 * Creates a product selection block.
 *
 * @example
 * ```ts
 * const products = createProductSelection({
 *   name: 'products',
 *   label: 'Choose your plan',
 *   required: true,
 *   options: {
 *     catalog: 'epilot',
 *     productsType: 'static',
 *     selection: 'one',
 *     products: [
 *       { productId: 'prod-1', priceId: 'price-1', isFeatured: true },
 *       { productId: 'prod-2', priceId: 'price-2' },
 *     ],
 *   },
 * })
 * ```
 */
export function createProductSelection(opts: CreateBlockOptions & { options?: Record<string, unknown> }): UISchemaElement {
  return createBlock(ControlName.ProductSelection, opts)
}

/**
 * Creates a consents block.
 *
 * @example
 * ```ts
 * const consents = createConsents({
 *   name: 'consents',
 *   label: 'Terms & Conditions',
 *   required: true,
 *   options: {
 *     items: {
 *       'consent-1': {
 *         required: true,
 *         topics: ['GTC'],
 *         text: 'I agree to the [Terms & Conditions](https://example.com/terms)',
 *         order: 0,
 *       },
 *       'consent-2': {
 *         required: false,
 *         topics: ['EMAIL_MARKETING'],
 *         text: 'I would like to receive marketing emails',
 *         order: 1,
 *       },
 *     },
 *   },
 * })
 * ```
 */
export function createConsents(opts: CreateBlockOptions & { options?: Record<string, unknown> }): UISchemaElement {
  return createBlock(ControlName.Consents, opts)
}

/**
 * Creates a file upload block.
 *
 * @example
 * ```ts
 * const upload = createFileUpload({
 *   name: 'documents',
 *   label: 'Upload Documents',
 *   options: { maxQuantity: 5, supportedTypes: ['PDF', 'Image'] },
 * })
 * ```
 */
export function createFileUpload(opts: CreateBlockOptions & { options?: Record<string, unknown> }): UISchemaElement {
  return createBlock(ControlName.FileUpload, opts)
}

/**
 * Creates a payment method block.
 *
 * @example
 * ```ts
 * const payment = createPaymentMethod({
 *   name: 'payment',
 *   label: 'Payment Method',
 *   required: true,
 *   options: {
 *     implementations: [
 *       { type: 'SEPA', label: 'SEPA Direct Debit', settings: { accountNumberValidationURL: 'https://...' } },
 *       { type: 'BankTransfer', label: 'Bank Transfer' },
 *     ],
 *   },
 * })
 * ```
 */
export function createPaymentMethod(opts: CreateBlockOptions & { options?: Record<string, unknown> }): UISchemaElement {
  return createBlock(ControlName.Payment, {
    ...opts,
    showPaper: opts.showPaper ?? true,
  })
}

/**
 * Creates a paragraph (rich text) block.
 *
 * Text is base64-encoded as required by the journey renderer.
 *
 * @param name - Property name (e.g. 'Intro Text')
 * @param text - HTML content (will be base64-encoded)
 * @param label - Optional label
 */
export function createParagraph(name: string, text: string, label?: string): UISchemaElement {
  // The journey renderer decodes paragraph text as UTF-16LE base64.
  // Text should be plain text (no HTML). The builder's WYSIWYG/Lexical
  // editor handles formatting — raw HTML tags are shown as literal text.
  const plainText = text
    .replace(/<[^>]+>/g, '') // strip HTML tags
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()

  const utf16leBytes: number[] = []
  for (let i = 0; i < plainText.length; i++) {
    const code = plainText.charCodeAt(i)
    utf16leBytes.push(code & 0xff, (code >> 8) & 0xff)
  }
  const encodedText = btoa(String.fromCharCode(...utf16leBytes))

  // Real v3 format: Label blocks have `text` at top level, not in options
  return {
    type: ControlName.Paragraph,
    scope: `#/properties/${name}`,
    text: encodedText,
  }
}

/**
 * Creates an image block.
 *
 * @example
 * ```ts
 * const banner = createImage('banner', 'https://cdn.example.com/banner.png', {
 *   altText: 'Company banner',
 *   width: '100%',
 * })
 * ```
 */
export function createImage(name: string, url: string, opts?: { altText?: string; width?: '100%' | '50%' | '30%'; label?: string }): UISchemaElement {
  return createBlock(ControlName.Image, {
    name,
    label: opts?.label ?? '',
    options: {
      url,
      altText: opts?.altText,
      width: opts?.width ?? '100%',
    },
  })
}

/**
 * Creates an action bar (navigation) block.
 *
 * Matches the real v3 format: `ctaButton` for the primary action,
 * `consents` array for inline consent checkboxes.
 *
 * @param name - Block name (e.g. 'Next', 'Action bar')
 * @param opts - CTA button config and optional consents
 *
 * @example
 * ```ts
 * // Simple "Continue" button
 * createActionBar('Next', { label: 'Continue' })
 *
 * // Submit button (triggers submission + navigates)
 * createActionBar('Action bar', { label: 'Submit', actionType: 'SubmitAndGoNext' })
 * ```
 */
export function createActionBar(name: string, opts?: {
  label?: string
  actionType?: 'GoNext' | 'SubmitAndGoNext'
  backLabel?: string
  showBack?: boolean
  consents?: Array<{
    name: string
    isRequired: boolean
    isVisible: boolean
    text: string | null
  }>
}): UISchemaElement {
  const defaultConsents = [
    { name: 'first_consent', isRequired: false, isVisible: false, text: null },
    { name: 'second_consent', isRequired: false, isVisible: false, text: null },
    { name: 'third_consent', isRequired: false, isVisible: false, text: null },
    { name: 'fourth_consent', isRequired: false, isVisible: false, text: null },
  ]
  return createBlock(ControlName.ActionBar, {
    name,
    options: {
      showPaper: false,
      consents: opts?.consents ?? defaultConsents,
      ctaButton: {
        actionType: opts?.actionType ?? 'GoNext',
        isVisible: true,
        label: opts?.label ?? 'Next',
      },
      goBackButton: {
        actionType: 'GoBack' as const,
        label: opts?.backLabel ?? 'Back',
        isVisible: opts?.showBack ?? false,
      },
    },
  })
}

/**
 * Creates a success/confirmation message block.
 *
 * Matches the real v3 format: `title`, `text`, `icon`, `showCloseButton`, `closeButtonText`.
 *
 * @example
 * ```ts
 * createSuccessMessage('Thank you', {
 *   title: 'Thank you!',
 *   text: 'Your request has been submitted successfully.',
 *   closeButtonText: 'Back to Homepage',
 * })
 * ```
 */
export function createSuccessMessage(name: string, opts?: {
  title?: string
  text?: string
  icon?: string
  closeButtonText?: string
}): UISchemaElement {
  return createBlock(ControlName.ConfirmationMessage, {
    name,
    options: {
      title: opts?.title ?? 'Success',
      text: opts?.text ?? 'Your submission has been received.',
      icon: opts?.icon ?? 'check-circle-fill',
      showCloseButton: !!opts?.closeButtonText,
      closeButtonText: opts?.closeButtonText ?? '',
    },
  })
}

/**
 * Creates a summary block.
 */
export function createSummary(name: string, opts?: { subTitle?: string }): UISchemaElement {
  return createBlock(ControlName.Summary, {
    name,
    showPaper: true,
    options: {
      blocksInSummary: {},
      subTitle: opts?.subTitle ?? '',
      fields: [],
    },
  })
}

/**
 * Creates a shopping cart block.
 */
export function createShoppingCart(name: string, opts?: {
  cartTitle?: string
  cartFootnote?: string
}): UISchemaElement {
  return createBlock(ControlName.ShoppingCart, {
    name,
    options: {
      cartTitle: opts?.cartTitle ?? 'Shopping Cart',
      cartFootnote: opts?.cartFootnote ?? '',
    },
  })
}

// ─── Step Creation ───────────────────────────────────────────────

/** Layout types used in real journey configs */
export type StepLayoutType =
  | 'MainLinearLayout'
  | 'MainContentCartLayout'
  | 'GridLayout'

export interface CreateStepOptions {
  /** Human-readable step name (also used as stepId) */
  name: string
  /** Blocks to include in the main content area */
  blocks: UISchemaElement[]
  /** Sidebar blocks (e.g. shopping cart) — only for MainContentCartLayout */
  sidebarBlocks?: UISchemaElement[]
  /** Layout type. Defaults to MainLinearLayout */
  layout?: StepLayoutType
  /** Step title displayed to end users */
  title?: string | null
  /** Step subtitle */
  subTitle?: string | null
  /** Whether to show step name */
  showStepName?: boolean
  /** Whether to show step subtitle */
  showStepSubtitle?: boolean
  /** Whether to show stepper navigation */
  showStepper?: boolean
  /** Whether to show stepper labels */
  showStepperLabels?: boolean
  /** Whether to hide the next button (true when using ActionBarControl) */
  hideNextButton?: boolean
}

/**
 * Creates a step configuration with auto-generated schema and uischema.
 *
 * The schema is built by extracting property names from the blocks' `scope` paths.
 * The uischema wraps blocks in a VerticalLayout.
 *
 * @example
 * ```ts
 * const step = createStep({
 *   name: 'Contact Info',
 *   blocks: [
 *     createPersonalInformation({ name: 'personalInfo', label: 'Your Details', required: true }),
 *     createAddress({ name: 'address', label: 'Address', required: true }),
 *   ],
 * })
 * ```
 */
export function createStep(opts: CreateStepOptions): StepConfig {
  const allBlocks = [...opts.blocks, ...(opts.sidebarBlocks ?? [])]
  const properties: Record<string, unknown> = {}
  const required: string[] = []

  // Block types that store array values (multi-choice)
  const arrayTypes: Set<string> = new Set([
    ControlName.MultiChoice,
  ])
  // BooleanControl type has no upHandler — binary inputs use type:'Control' with boolean schema
  // Detected via _binaryInput marker set by createBinaryInput factory

  for (const block of allBlocks) {
    if (block.scope) {
      const propName = block.scope.replace('#/properties/', '')
      let schemaType = 'object'
      if (arrayTypes.has(block.type)) {
        schemaType = 'array'
      } else if (block.type === ControlName.Control || block.type === ControlName.TextField) {
        const opts = block.options as Record<string, unknown> | undefined

        if (opts?._binaryInput === true) {
          // Binary input (switch/checkbox): schema boolean → transformUp routes to upBinaryInput
          properties[propName] = { type: 'boolean' }
        } else {
          // Single-choice: needs enum[] in schema so EnumButtonControlTester (isEnumControl) matches
          // and transformUp doesn't fall through to text input path (it checks !schema.enum)
          const enumValues = opts?.options as string[] | undefined
          const isChoiceBlock = Array.isArray(enumValues) && (opts?.button === true || opts?.radio === true)
          if (isChoiceBlock) {
            properties[propName] = { type: 'string', enum: enumValues }
          } else {
            // Plain text input — TextFieldTester (schemaTypeIs('string')) matches
            properties[propName] = { type: 'string' }
          }
        }
        if (block.options?.required) {
          required.push(propName)
        }
        continue
      }
      properties[propName] = { type: schemaType }
      if (block.options?.required) {
        required.push(propName)
      }
    }
  }

  // Display-only block types that don't produce submission data
  const displayOnlyTypes: Set<string> = new Set([
    ControlName.Paragraph,
    ControlName.Image,
    ControlName.ActionBar,
    ControlName.Hyperlink,
    ControlName.ConfirmationMessage,
    ControlName.Summary,
    ControlName.ShoppingCart,
    ControlName.PdfSummary,
    ControlName.GroupLayout,
  ])

  // Add variablePath to stateful blocks only
  for (const block of allBlocks) {
    if (block.scope && block.options && !block.options.variablePath && !displayOnlyTypes.has(block.type)) {
      const propName = block.scope.replace('#/properties/', '')
      block.options.variablePath = variablePath(opts.name, propName)
    }
  }

  const schema: Record<string, unknown> = {
    type: 'object',
    properties,
    required,
  }

  const layoutType = opts.layout ?? (opts.sidebarBlocks?.length ? 'MainContentCartLayout' : 'MainLinearLayout')

  let elements: unknown
  if (layoutType === 'MainContentCartLayout') {
    // MainContentCartLayout expects [[main blocks], [sidebar blocks], [], []]
    elements = [
      opts.blocks,
      opts.sidebarBlocks ?? [],
      [],
      [],
    ]
  } else {
    elements = opts.blocks
  }

  const layoutOptions = layoutType === 'MainContentCartLayout'
    ? { spacing: 4 }
    : { scale: 3 }

  const uischema: UISchemaElement = {
    type: layoutType,
    options: layoutOptions,
    elements: elements as UISchemaElement[],
  }

  return {
    name: opts.name,
    stepId: stepId(opts.name),
    schema,
    uischema,
    title: opts.title ?? opts.name,
    subTitle: opts.subTitle ?? null,
    showStepName: opts.showStepName ?? true,
    showStepSubtitle: opts.showStepSubtitle ?? false,
    showStepper: opts.showStepper ?? true,
    showStepperLabels: opts.showStepperLabels ?? true,
    hideNextButton: opts.hideNextButton ?? true,
  }
}

// ─── Journey Creation ────────────────────────────────────────────

export interface CreateJourneyOptions {
  /** Organization ID */
  organizationId: string
  /** Journey name */
  name: string
  /** Steps to include */
  steps: StepConfig[]
  /** Journey settings */
  settings?: {
    designId?: string
    language?: 'de' | 'en' | 'fr'
    description?: string
    embedOptions?: {
      mode: 'full-screen' | 'inline'
      width?: string
      topBar?: boolean
    }
    accessMode?: 'PUBLIC' | 'PRIVATE'
    runtimeEntities?: ('ORDER' | 'OPPORTUNITY')[]
    thirdPartyCookies?: boolean
    [key: string]: unknown
  }
  /** Design configuration */
  design?: {
    logoUrl?: string | null
    theme?: Record<string, unknown>
    designTokens?: Record<string, unknown>
  }
}

/**
 * Creates a complete journey payload ready for the Journey API.
 *
 * @example
 * ```ts
 * const journey = createJourney({
 *   organizationId: 'org-123',
 *   name: 'Energy Contract Signup',
 *   settings: {
 *     designId: 'design-abc',
 *     language: 'de',
 *     description: 'A journey for signing up for energy contracts',
 *   },
 *   steps: [
 *     createStep({
 *       name: 'Personal Details',
 *       blocks: [
 *         createPersonalInformation({ name: 'personalInfo', label: 'Your Details', required: true }),
 *         createAddress({ name: 'address', label: 'Address', required: true }),
 *       ],
 *     }),
 *     createStep({
 *       name: 'Product Selection',
 *       blocks: [
 *         createProductSelection({ name: 'products', label: 'Choose your plan', required: true }),
 *         createShoppingCart('cart'),
 *       ],
 *     }),
 *     createStep({
 *       name: 'Review & Submit',
 *       blocks: [
 *         createSummary('summary'),
 *         createConsents({ name: 'consents', label: 'Terms', required: true }),
 *         createActionBar('submit', { next: { display: true, label: 'Submit', action: 'submit-and-navigate' } }),
 *       ],
 *     }),
 *     createStep({
 *       name: 'Confirmation',
 *       blocks: [
 *         createSuccessMessage('success', {
 *           messageTitle: 'Thank you!',
 *           messageBody: 'Your energy contract has been submitted.',
 *         }),
 *       ],
 *     }),
 *   ],
 * })
 *
 * const created = await client.createJourney(journey)
 * ```
 */
export function createJourney(opts: CreateJourneyOptions): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    organizationId: opts.organizationId,
    name: opts.name,
    steps: opts.steps,
  }

  if (opts.settings) {
    payload.settings = opts.settings
  }

  if (opts.design) {
    payload.design = opts.design
  }

  return payload
}
