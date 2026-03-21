/**
 * Block type interfaces inferred from epilot journey implementations.
 *
 * These types describe the known block types available in the epilot Journey Builder,
 * their value shapes (what data they produce), and their UI schema options
 * (how they're configured). Use them for type-safe block manipulation.
 *
 * @module blockTypes
 */

// ─── Block Type Constants ────────────────────────────────────────

/**
 * Known block type identifiers used in epilot journeys.
 *
 * These correspond to the `type` field in UI schema elements or to the
 * block category in the Journey Builder. All blocks use `type: 'Control'`
 * in the uischema; the actual block type is determined by the `scope`
 * target's schema type and the `options` configuration.
 *
 * @example
 * ```ts
 * import { BlockType } from '@epilot/epilot-journey-sdk'
 *
 * if (block.options?.blockType === BlockType.PersonalInformation) {
 *   // handle personal info block
 * }
 * ```
 */
export const BlockType = {
  /** Collects personal info: name, email, phone, birth date, company details */
  PersonalInformation: 'PersonalInformationControl',
  /** Collects a street address with country, city, zip, street, house number */
  Address: 'AddressControl',
  /** Date picker for selecting single dates or date ranges */
  DatePicker: 'DatePickerControl',
  /** Binary yes/no toggle (switch or checkbox) */
  BinaryInput: 'BinaryControl',
  /** Single-choice selection from a set of options */
  SingleChoice: 'SingleChoiceControl',
  /** Free-form text input (single or multi-line) */
  TextInput: 'TextControl',
  /** Numeric input with optional min/max/step */
  NumberInput: 'NumberControl',
  /** Product selection / product tiles display */
  Product: 'ProductControl',
  /** Image display block */
  Image: 'ImageControl',
  /** Address-based availability check (e.g., for service coverage) */
  Availability: 'AvailabilityControl',
  /** Summary / review block showing collected data */
  Summary: 'SummaryControl',
  /** Contact information (similar to PersonalInformation but for contacts) */
  Contact: 'ContactControl',
  /** Account / company information block */
  Account: 'AccountControl',
  /** File upload block */
  FileUpload: 'FileUploadControl',
  /** Consent / terms acceptance checkbox */
  Consent: 'ConsentControl',
  /** IBAN / bank account input */
  IbanInput: 'IbanControl',
  /** Custom web component block */
  CustomBlock: 'CustomBlockControl',
} as const

/** Union type of all known block type identifiers */
export type BlockTypeName = (typeof BlockType)[keyof typeof BlockType]

// ─── Block Value Types ───────────────────────────────────────────
// These describe the data shape each block produces / accepts.

/**
 * Value shape for the Personal Information block.
 *
 * Contains identity and contact fields. The `_isValid` flag indicates
 * whether the block's internal validation passed.
 *
 * @example Data injection
 * ```ts
 * const personalInfo: PersonalInformationValue = {
 *   salutation: 'Mr.',
 *   firstName: 'Max',
 *   lastName: 'Mustermann',
 *   email: 'max@example.com',
 *   telephone: '+49 123 456789',
 *   _isValid: true,
 * }
 * ```
 */
export interface PersonalInformationValue {
  /** Salutation / title (e.g., 'Mr.', 'Ms.', 'Dr.') */
  salutation?: string
  /** First name */
  firstName?: string
  /** Last name */
  lastName?: string
  /** Email address */
  email?: string
  /** Phone number (international format recommended) */
  telephone?: string
  /** Date of birth (ISO 8601 date string, e.g., '1990-01-15') */
  birthDate?: string
  /** Company name (for business customers) */
  companyName?: string
  /** Registry court for company registration */
  registryCourt?: string
  /** Company register number */
  registerNumber?: string
  /** Internal validation state flag */
  _isValid?: boolean
}

/**
 * Value shape for the Address block.
 *
 * @example Data injection
 * ```ts
 * const address: AddressValue = {
 *   countryCode: 'DE',
 *   city: 'Köln',
 *   zipCode: '50670',
 *   streetName: 'Im Mediapark',
 *   houseNumber: '8',
 *   _isValid: true,
 * }
 * ```
 */
export interface AddressValue {
  /** ISO 3166-1 alpha-2 country code (e.g., 'DE', 'AT', 'CH') */
  countryCode?: string
  /** City name */
  city?: string
  /** Postal / ZIP code */
  zipCode?: string
  /** Street name */
  streetName?: string
  /** House/building number */
  houseNumber?: string
  /** Address extension / supplement (apartment, floor, etc.) */
  extention?: string
  /** Internal validation state flag */
  _isValid?: boolean
}

/**
 * Value shape for the Date Picker block.
 *
 * Supports single date or date range selection.
 *
 * @example Single date
 * ```ts
 * const date: DatePickerValue = { startDate: '2026-04-01' }
 * ```
 *
 * @example Date range
 * ```ts
 * const range: DatePickerValue = {
 *   startDate: '2026-04-01',
 *   endDate: '2026-04-15',
 * }
 * ```
 */
export interface DatePickerValue {
  /** Start date (ISO 8601 date string) */
  startDate?: string
  /** End date for range selection (ISO 8601 date string) */
  endDate?: string
  /** Internal validation state flag */
  _isValid?: boolean
}

/**
 * Value for the Binary Input block (yes/no toggle).
 *
 * The value is a simple boolean.
 *
 * @example
 * ```ts
 * const consent: BinaryInputValue = true
 * ```
 */
export type BinaryInputValue = boolean

/**
 * Value for the Single Choice block.
 *
 * The value is the selected option's string identifier.
 *
 * @example
 * ```ts
 * const selection: SingleChoiceValue = 'Option 1'
 * ```
 */
export type SingleChoiceValue = string

/**
 * Value for the Text Input block.
 *
 * @example
 * ```ts
 * const note: TextInputValue = 'Please call me in the afternoon.'
 * ```
 */
export type TextInputValue = string

/**
 * Value for the Number Input block.
 *
 * @example
 * ```ts
 * const consumption: NumberInputValue = 3500
 * ```
 */
export type NumberInputValue = number

/**
 * Value shape for the Product block.
 *
 * Contains the selected product(s) and associated configuration.
 */
export interface ProductValue {
  /** Selected product entity ID(s) */
  selectedProductIds?: string[]
  /** Selected product data (full product objects from the API) */
  selectedProducts?: Record<string, unknown>[]
  /** Quantity or consumption value associated with product selection */
  quantity?: number
  /** Internal validation state flag */
  _isValid?: boolean
}

/**
 * Value shape for the Contact block.
 *
 * Similar to PersonalInformation but scoped to contact-specific fields.
 */
export interface ContactValue {
  /** Salutation */
  salutation?: string
  /** First name */
  firstName?: string
  /** Last name */
  lastName?: string
  /** Email address */
  email?: string
  /** Phone number */
  telephone?: string
  /** Internal validation state flag */
  _isValid?: boolean
}

/**
 * Value shape for the Account block.
 *
 * Collects business/company account information.
 */
export interface AccountValue {
  /** Company / account name */
  companyName?: string
  /** Registry court */
  registryCourt?: string
  /** Register number */
  registerNumber?: string
  /** Internal validation state flag */
  _isValid?: boolean
}

/**
 * Value shape for the File Upload block.
 */
export interface FileUploadValue {
  /** Array of uploaded file references */
  files?: Array<{
    /** Original filename */
    filename?: string
    /** S3 reference for the uploaded file */
    s3ref?: {
      bucket: string
      key: string
    }
    /** MIME type */
    contentType?: string
    /** File size in bytes */
    size?: number
  }>
  /** Internal validation state flag */
  _isValid?: boolean
}

/**
 * Value for the Consent block.
 *
 * Boolean indicating whether the user accepted the terms.
 */
export type ConsentValue = boolean

/**
 * Value shape for the IBAN Input block.
 */
export interface IbanInputValue {
  /** IBAN string (e.g., 'DE89370400440532013000') */
  iban?: string
  /** Account holder name */
  accountHolder?: string
  /** Internal validation state flag */
  _isValid?: boolean
}

/**
 * Value for the Availability block.
 *
 * Contains address and availability check result.
 */
export interface AvailabilityValue {
  /** Address used for the availability check */
  address?: AddressValue
  /** Whether service is available at the address */
  isAvailable?: boolean
  /** Internal validation state flag */
  _isValid?: boolean
}

// ─── Block Value Type Map ────────────────────────────────────────

/**
 * Maps block type identifiers to their corresponding value types.
 *
 * Use this to get the correct value type for a given block type.
 *
 * @example
 * ```ts
 * import type { BlockValueMap, BlockType } from '@epilot/epilot-journey-sdk'
 *
 * type EmailBlockValue = BlockValueMap[typeof BlockType.PersonalInformation]
 * // => PersonalInformationValue
 * ```
 */
export interface BlockValueMap {
  [BlockType.PersonalInformation]: PersonalInformationValue
  [BlockType.Address]: AddressValue
  [BlockType.DatePicker]: DatePickerValue
  [BlockType.BinaryInput]: BinaryInputValue
  [BlockType.SingleChoice]: SingleChoiceValue
  [BlockType.TextInput]: TextInputValue
  [BlockType.NumberInput]: NumberInputValue
  [BlockType.Product]: ProductValue
  [BlockType.Contact]: ContactValue
  [BlockType.Account]: AccountValue
  [BlockType.FileUpload]: FileUploadValue
  [BlockType.Consent]: ConsentValue
  [BlockType.IbanInput]: IbanInputValue
  [BlockType.Availability]: AvailabilityValue
  [BlockType.Image]: Record<string, unknown>
  [BlockType.Summary]: Record<string, unknown>
  [BlockType.CustomBlock]: Record<string, unknown>
}

// ─── Data Injection Helpers ──────────────────────────────────────

/**
 * Represents a step's block data for use in `DataInjectionOptions.initialState`.
 *
 * Keys are block names (as configured in the Journey Builder), values are
 * the corresponding block value shapes.
 *
 * @example
 * ```ts
 * const step0Data: StepBlockData = {
 *   'Persönliche Informationen': {
 *     salutation: 'Mr.',
 *     firstName: 'Max',
 *     lastName: 'Mustermann',
 *     email: 'max@example.com',
 *     _isValid: true,
 *   } satisfies PersonalInformationValue,
 *   'Adresse': {
 *     countryCode: 'DE',
 *     city: 'Köln',
 *     zipCode: '50670',
 *     streetName: 'Im Mediapark',
 *     houseNumber: '8',
 *     _isValid: true,
 *   } satisfies AddressValue,
 * }
 * ```
 */
export type StepBlockData = Record<
  string,
  | PersonalInformationValue
  | AddressValue
  | DatePickerValue
  | ProductValue
  | ContactValue
  | AccountValue
  | FileUploadValue
  | IbanInputValue
  | AvailabilityValue
  | BinaryInputValue
  | SingleChoiceValue
  | TextInputValue
  | NumberInputValue
  | ConsentValue
  | Record<string, unknown>
>

// ─── Block UI Schema Option Types ────────────────────────────────
// These describe common configuration options per block type.

/**
 * Common options shared across most block types.
 *
 * These can be set in the `options` field of a `UISchemaElement`.
 */
export interface CommonBlockOptions {
  /** Whether this block is required for form submission */
  required?: boolean
  /** Whether this block is read-only / disabled */
  disabled?: boolean
  /** Placeholder text for input blocks */
  placeholder?: string
  /** Help text displayed below the block */
  helpText?: string
  /** Custom CSS class names for styling */
  className?: string
}

/**
 * UI schema options for the Personal Information block.
 *
 * @example
 * ```ts
 * const uischema: UISchemaElement = {
 *   type: 'Control',
 *   scope: '#/properties/personalInfo',
 *   label: 'Personal Information',
 *   options: {
 *     required: true,
 *     fields: ['firstName', 'lastName', 'email'],
 *   } satisfies PersonalInformationBlockOptions,
 * }
 * ```
 */
export interface PersonalInformationBlockOptions extends CommonBlockOptions {
  /**
   * Which fields to display in this block.
   * Omit to show all fields.
   */
  fields?: Array<
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'telephone'
    | 'birthDate'
    | 'companyName'
    | 'registryCourt'
    | 'registerNumber'
    | 'salutation'
  >
}

/**
 * UI schema options for the Address block.
 *
 * @example
 * ```ts
 * const options: AddressBlockOptions = {
 *   required: true,
 *   fields: ['streetName', 'houseNumber', 'zipCity', 'countryCode'],
 *   enableAutoComplete: true,
 * }
 * ```
 */
export interface AddressBlockOptions extends CommonBlockOptions {
  /**
   * Which fields to display in this block.
   * Omit to show all fields.
   */
  fields?: Array<
    | 'countryCode'
    | 'streetName'
    | 'houseNumber'
    | 'extention'
    | 'zipCity'
  >
  /** Whether to enable address auto-complete suggestions */
  enableAutoComplete?: boolean
  /** Whether to allow free text input when auto-complete is on */
  enableFreeText?: boolean
}

/**
 * UI schema options for the Date Picker block.
 *
 * @example
 * ```ts
 * const options: DatePickerBlockOptions = {
 *   required: true,
 *   isRange: true,
 *   fields: ['startDate', 'endDate'],
 * }
 * ```
 */
export interface DatePickerBlockOptions extends CommonBlockOptions {
  /** Whether to show a date range picker (start + end date) */
  isRange?: boolean
  /** Which date fields to display */
  fields?: Array<'startDate' | 'endDate'>
  /** Minimum selectable date (ISO 8601) */
  minDate?: string
  /** Maximum selectable date (ISO 8601) */
  maxDate?: string
}

/**
 * UI schema options for the Single Choice block.
 *
 * @example
 * ```ts
 * const options: SingleChoiceBlockOptions = {
 *   choices: [
 *     { label: 'Option A', value: 'a' },
 *     { label: 'Option B', value: 'b' },
 *   ],
 *   displayAs: 'toggle',
 * }
 * ```
 */
export interface SingleChoiceBlockOptions extends CommonBlockOptions {
  /** Available choices */
  choices?: Array<{
    label: string
    value: string
  }>
  /** How to render choices: radio buttons, dropdown, or toggle group */
  displayAs?: 'radio' | 'dropdown' | 'toggle'
}

/**
 * UI schema options for the Number Input block.
 *
 * @example
 * ```ts
 * const options: NumberInputBlockOptions = {
 *   min: 0,
 *   max: 100000,
 *   step: 100,
 *   unit: 'kWh',
 * }
 * ```
 */
export interface NumberInputBlockOptions extends CommonBlockOptions {
  /** Minimum allowed value */
  min?: number
  /** Maximum allowed value */
  max?: number
  /** Step increment for stepper controls */
  step?: number
  /** Unit label displayed alongside the input (e.g., 'kWh', 'EUR') */
  unit?: string
}

/**
 * UI schema options for the Text Input block.
 */
export interface TextInputBlockOptions extends CommonBlockOptions {
  /** Whether to render as a multi-line textarea */
  multiline?: boolean
  /** Maximum number of rows for multiline input */
  maxRows?: number
  /** Maximum character length */
  maxLength?: number
  /** Input format hint (e.g., 'email', 'tel', 'url') */
  format?: string
}

/**
 * UI schema options for the Product block.
 */
export interface ProductBlockOptions extends CommonBlockOptions {
  /** Product entity IDs to display */
  productIds?: string[]
  /** Whether to show product images */
  showImages?: boolean
  /** Whether to show product features/descriptions */
  showFeatures?: boolean
  /** Whether to show prices */
  showPrices?: boolean
}

/**
 * UI schema options for the File Upload block.
 */
export interface FileUploadBlockOptions extends CommonBlockOptions {
  /** Accepted MIME types (e.g., 'image/*', 'application/pdf') */
  accept?: string[]
  /** Maximum file size in bytes */
  maxSize?: number
  /** Maximum number of files */
  maxFiles?: number
  /** File purpose tags */
  filePurposes?: string[]
}

/**
 * UI schema options for the Custom Block.
 *
 * @example
 * ```ts
 * const options: CustomBlockOptions = {
 *   tagName: 'counter-block',
 *   bundleUrl: 'https://cdn.example.com/counter-block/bundle.js',
 *   args: { token: 'abc123', apiUrl: 'https://api.example.com' },
 * }
 * ```
 */
export interface CustomBlockOptions extends CommonBlockOptions {
  /** Web component tag name (e.g., 'counter-block', 'calendly-block') */
  tagName?: string
  /** URL to the JS bundle containing the web component */
  bundleUrl?: string
  /** Key-value arguments passed to the custom block's `args` prop */
  args?: Record<string, string>
}

// ─── Block Options Type Map ──────────────────────────────────────

/**
 * Maps block type identifiers to their corresponding UI schema options.
 *
 * @example
 * ```ts
 * import type { BlockOptionsMap, BlockType } from '@epilot/epilot-journey-sdk'
 *
 * type PersonalInfoOpts = BlockOptionsMap[typeof BlockType.PersonalInformation]
 * // => PersonalInformationBlockOptions
 * ```
 */
export interface BlockOptionsMap {
  [BlockType.PersonalInformation]: PersonalInformationBlockOptions
  [BlockType.Address]: AddressBlockOptions
  [BlockType.DatePicker]: DatePickerBlockOptions
  [BlockType.BinaryInput]: CommonBlockOptions
  [BlockType.SingleChoice]: SingleChoiceBlockOptions
  [BlockType.TextInput]: TextInputBlockOptions
  [BlockType.NumberInput]: NumberInputBlockOptions
  [BlockType.Product]: ProductBlockOptions
  [BlockType.Image]: CommonBlockOptions
  [BlockType.Availability]: AddressBlockOptions
  [BlockType.Summary]: CommonBlockOptions
  [BlockType.Contact]: PersonalInformationBlockOptions
  [BlockType.Account]: CommonBlockOptions
  [BlockType.FileUpload]: FileUploadBlockOptions
  [BlockType.Consent]: CommonBlockOptions
  [BlockType.IbanInput]: CommonBlockOptions
  [BlockType.CustomBlock]: CustomBlockOptions
}

// ─── Typed Block Helper ──────────────────────────────────────────

/**
 * A fully-typed block element combining the UISchemaElement structure
 * with specific option types for a known block type.
 *
 * @typeParam T - The block type identifier from {@link BlockType}
 *
 * @example
 * ```ts
 * import { BlockType, type TypedBlock } from '@epilot/epilot-journey-sdk'
 *
 * const personalInfoBlock: TypedBlock<typeof BlockType.PersonalInformation> = {
 *   type: 'Control',
 *   scope: '#/properties/personalInfo',
 *   label: 'Your Details',
 *   options: {
 *     required: true,
 *     fields: ['firstName', 'lastName', 'email'],
 *   },
 * }
 * ```
 */
export type TypedBlock<T extends BlockTypeName> = {
  type: string
  scope?: string
  label?: string
  elements?: import('./types.js').UISchemaElement[]
  options?: T extends keyof BlockOptionsMap ? BlockOptionsMap[T] : Record<string, unknown>
  [key: string]: unknown
}
