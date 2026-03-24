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
  CommonBlockOptions,
  PersonalInformationBlockOptions,
  ContactBlockOptions,
  AddressBlockOptions,
  TextInputBlockOptions,
  NumberInputBlockOptions,
  SingleChoiceBlockOptions,
  MultipleChoiceBlockOptions,
  DatePickerBlockOptions,
  ProductBlockOptions,
  ConsentsBlockOptions,
  FileUploadBlockOptions,
  PaymentBlockOptions,
  CustomBlockOptions,
} from './blockTypes.js'
import type { UISchemaElement, StepConfig } from './types.js'

// ─── ID Generation ───────────────────────────────────────────────

let _counter = 0

function generateId(): string {
  _counter++
  const ts = Date.now().toString(36)
  const rand = Math.random().toString(36).slice(2, 8)
  return `${ts}-${rand}-${_counter}`
}

// ─── Block Creation ──────────────────────────────────────────────

export interface CreateBlockOptions {
  /** Block name used as property key in the step schema */
  name: string
  /** Display label shown to end users */
  label?: string
  /** Whether this block is required */
  required?: boolean
  /** Block-specific options (varies by type) */
  options?: Record<string, unknown>
}

/**
 * Creates a UI schema element for a given block type.
 *
 * This produces a valid v3 `uischema` element that can be added to a step.
 * The `scope` is auto-generated from the block name as `#/properties/{name}`.
 *
 * @example
 * ```ts
 * const emailBlock = createBlock(ControlName.Control, {
 *   name: 'email',
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
    type,
    scope,
    label: opts.label ?? opts.name,
  }

  const options: Record<string, unknown> = { ...opts.options }
  if (opts.required !== undefined) {
    options.required = opts.required
  }

  if (Object.keys(options).length > 0) {
    element.options = options
  }

  return element
}

// ─── Typed Block Factories ───────────────────────────────────────

/**
 * Creates a text input block.
 *
 * @example
 * ```ts
 * const notes = createTextInput({
 *   name: 'notes',
 *   label: 'Additional Notes',
 *   options: { multiline: true, placeholder: 'Enter any additional information...' },
 * })
 * ```
 */
export function createTextInput(opts: CreateBlockOptions & { options?: TextInputBlockOptions }): UISchemaElement {
  return createBlock(ControlName.Control, opts)
}

/**
 * Creates a number input block.
 *
 * @example
 * ```ts
 * const consumption = createNumberInput({
 *   name: 'consumption',
 *   label: 'Annual Consumption',
 *   required: true,
 *   options: {
 *     unit: { show: true, label: 'kWh' },
 *     range: { min: 0, max: 100000 },
 *   },
 * })
 * ```
 */
export function createNumberInput(opts: CreateBlockOptions & { options?: NumberInputBlockOptions }): UISchemaElement {
  return createBlock(ControlName.NumberInput, opts)
}

/**
 * Creates a single-choice selection block.
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
export function createSingleChoice(opts: CreateBlockOptions & { options?: SingleChoiceBlockOptions }): UISchemaElement {
  return createBlock(ControlName.Control, {
    ...opts,
    options: { ...opts.options },
  })
}

/**
 * Creates a multiple-choice selection block.
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
export function createMultipleChoice(opts: CreateBlockOptions & { options?: MultipleChoiceBlockOptions }): UISchemaElement {
  return createBlock(ControlName.MultiChoice, opts)
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
export function createBinaryInput(opts: CreateBlockOptions): UISchemaElement {
  return createBlock(ControlName.Boolean, opts)
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
export function createDatePicker(opts: CreateBlockOptions & { options?: DatePickerBlockOptions }): UISchemaElement {
  return createBlock(ControlName.DatePicker, opts)
}

/**
 * Creates a personal information block.
 *
 * @example
 * ```ts
 * const personalInfo = createPersonalInformation({
 *   name: 'personalInfo',
 *   label: 'Your Details',
 *   required: true,
 *   options: {
 *     customerType: 'PRIVATE',
 *     fields: {
 *       firstName: { display: true, required: true },
 *       lastName: { display: true, required: true },
 *       email: { display: true, required: true },
 *       telephone: { display: true, required: false },
 *     },
 *   },
 * })
 * ```
 */
export function createPersonalInformation(opts: CreateBlockOptions & { options?: PersonalInformationBlockOptions }): UISchemaElement {
  return createBlock(ControlName.PersonalInformation, opts)
}

/**
 * Creates a contact block.
 *
 * @example
 * ```ts
 * const contact = createContact({
 *   name: 'contact',
 *   label: 'Contact Information',
 *   required: true,
 *   options: {
 *     purpose: ['customer'],
 *     fields: {
 *       firstName: { display: true, required: true },
 *       lastName: { display: true, required: true },
 *       email: { display: true, required: true },
 *     },
 *   },
 * })
 * ```
 */
export function createContact(opts: CreateBlockOptions & { options?: ContactBlockOptions }): UISchemaElement {
  return createBlock(ControlName.Contact, opts)
}

/**
 * Creates an address block.
 *
 * @example
 * ```ts
 * const address = createAddress({
 *   name: 'address',
 *   label: 'Delivery Address',
 *   required: true,
 *   options: {
 *     autocomplete: { enabled: true, countryCode: 'DE' },
 *     fields: {
 *       zipCity: { display: true, required: true },
 *       streetName: { display: true, required: true },
 *       houseNumber: { display: true, required: true },
 *     },
 *   },
 * })
 * ```
 */
export function createAddress(opts: CreateBlockOptions & { options?: AddressBlockOptions }): UISchemaElement {
  return createBlock(ControlName.Address, opts)
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
export function createProductSelection(opts: CreateBlockOptions & { options?: ProductBlockOptions }): UISchemaElement {
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
export function createConsents(opts: CreateBlockOptions & { options?: ConsentsBlockOptions }): UISchemaElement {
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
export function createFileUpload(opts: CreateBlockOptions & { options?: FileUploadBlockOptions }): UISchemaElement {
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
export function createPaymentMethod(opts: CreateBlockOptions & { options?: PaymentBlockOptions }): UISchemaElement {
  return createBlock(ControlName.Payment, opts)
}

/**
 * Creates a paragraph (rich text) block.
 *
 * @param name - Property name
 * @param text - Rich text content (will be base64-encoded if not already)
 * @param label - Optional label
 */
export function createParagraph(name: string, text: string, label?: string): UISchemaElement {
  let encodedText: string
  try {
    encodedText = btoa(unescape(encodeURIComponent(text)))
  } catch {
    encodedText = text
  }
  return createBlock(ControlName.Paragraph, {
    name,
    label: label ?? '',
    options: { text: encodedText },
  })
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
 * @example
 * ```ts
 * const actionBar = createActionBar('actionBar', {
 *   next: { display: true, label: 'Continue', action: 'navigate-only' },
 *   back: { display: true, label: 'Back' },
 * })
 * ```
 */
export function createActionBar(name: string, opts?: {
  next?: { display: boolean; label?: string; action?: 'navigate-only' | 'submit-and-navigate' }
  back?: { display: boolean; label?: string }
}): UISchemaElement {
  return createBlock(ControlName.ActionBar, {
    name,
    label: '',
    options: {
      next: opts?.next ?? { display: true, label: 'Next', action: 'navigate-only' },
      back: opts?.back ?? { display: true, label: 'Back' },
    },
  })
}

/**
 * Creates a success/confirmation message block.
 *
 * @example
 * ```ts
 * const success = createSuccessMessage('success', {
 *   messageTitle: 'Thank you!',
 *   messageBody: 'Your request has been submitted successfully.',
 *   closeButtonText: 'Back to Homepage',
 * })
 * ```
 */
export function createSuccessMessage(name: string, opts?: {
  messageTitle?: string
  messageBody?: string
  closeButtonText?: string
}): UISchemaElement {
  return createBlock(ControlName.ConfirmationMessage, {
    name,
    label: '',
    options: {
      messageTitle: opts?.messageTitle ?? 'Success',
      messageBody: opts?.messageBody ?? 'Your submission has been received.',
      showCloseButton: !!opts?.closeButtonText,
      closeButtonText: opts?.closeButtonText,
    },
  })
}

/**
 * Creates a summary block.
 */
export function createSummary(name: string, label?: string): UISchemaElement {
  return createBlock(ControlName.Summary, {
    name,
    label: label ?? 'Summary',
  })
}

/**
 * Creates a shopping cart block.
 */
export function createShoppingCart(name: string, opts?: {
  title?: string
  footnote?: string
  showComponents?: boolean
}): UISchemaElement {
  return createBlock(ControlName.ShoppingCart, {
    name,
    label: opts?.title ?? 'Shopping Cart',
    options: {
      title: opts?.title ?? 'Shopping Cart',
      footnote: opts?.footnote ?? '',
      price: { showComponents: opts?.showComponents ?? true, showTrailingDecimalZeros: true, showUnitaryAverage: false },
      product: { expandedItemDetails: false, enableProductDetails: true },
      promotions: { enabled: false },
    },
  })
}

// ─── Step Creation ───────────────────────────────────────────────

export interface CreateStepOptions {
  /** Human-readable step name */
  name: string
  /** Blocks to include in this step */
  blocks: UISchemaElement[]
  /** Step title displayed to end users */
  title?: string | null
  /** Step subtitle */
  subTitle?: string | null
  /** Whether to show step name */
  showStepName?: boolean
  /** Whether to show stepper navigation */
  showStepper?: boolean
  /** Whether to show stepper labels */
  showStepperLabels?: boolean
  /** Whether to hide the next button */
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
  const properties: Record<string, unknown> = {}
  const required: string[] = []

  for (const block of opts.blocks) {
    if (block.scope) {
      const propName = block.scope.replace('#/properties/', '')
      properties[propName] = { type: 'object' }
      if (block.options?.required) {
        required.push(propName)
      }
    }
  }

  const schema: Record<string, unknown> = {
    type: 'object',
    properties,
  }
  if (required.length > 0) {
    schema.required = required
  }

  const uischema: UISchemaElement = {
    type: 'VerticalLayout',
    elements: opts.blocks,
  }

  return {
    name: opts.name,
    stepId: generateId(),
    schema,
    uischema,
    title: opts.title,
    subTitle: opts.subTitle,
    showStepName: opts.showStepName,
    showStepper: opts.showStepper,
    showStepperLabels: opts.showStepperLabels,
    hideNextButton: opts.hideNextButton,
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
