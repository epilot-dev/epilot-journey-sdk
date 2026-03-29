/**
 * Complete block type registry for the epilot Journey SDK.
 *
 * Block types, value shapes, and settings are sourced from
 * `journey-logic-commons` in the journey-monorepo. The API wire format
 * uses v3 control names (e.g., `PersonalInformationControl`), which map
 * to the v4 internal `BLOCK_TYPE` enum used by the Builder/Renderer apps.
 *
 * @module blockTypes
 */

// ─── Block Type Constants (CONTROL_NAME from journey-logic-commons) ──

/**
 * All known block type identifiers used in the v3 API wire format.
 *
 * These correspond to the `type` field in `uischema` elements stored by the
 * Journey API. Sourced from `CONTROL_NAME` in `journey-logic-commons`.
 *
 * Note: Generic `Control` maps to text input, single-choice, or binary
 * depending on the schema type at the `scope` path.
 */
export const ControlName = {
  /** Collects personal info: name, email, phone, birth date, company details */
  PersonalInformation: 'PersonalInformationControl',
  /** Collects contact-specific fields (salutation, name, email, phone, birthDate) */
  Contact: 'ContactControl',
  /** Collects business/company account info (email, phone, company, tax ID) */
  Account: 'AccountControl',
  /** Collects a street address with autocomplete and map integration */
  Address: 'AddressControl',
  /** Generic control — maps to text input, single-choice, or binary based on schema type */
  Control: 'Control',
  /** Summary / review block showing collected data from other blocks */
  Summary: 'SummaryControl',
  /** PDF document generator from a DocX template */
  PdfSummary: 'PdfSummaryControl',
  /** Shopping cart displaying selected products and prices */
  ShoppingCart: 'ShopCartControl',
  /** Success / thank-you message shown after submission */
  ConfirmationMessage: 'ConfirmationMessageControl',
  /** Navigation bar with next/back buttons and submit actions */
  ActionBar: 'ActionBarControl',
  /** Sign-in / sign-up / skip authentication flow */
  Auth: 'AuthControl',
  /** Hyperlink list block (secondary action bar) */
  Hyperlink: 'SecondaryActionBarControl',
  /** Rich text paragraph (stored as base64) */
  Paragraph: 'Label',
  /** Product selection tiles with pricing and features */
  ProductSelection: 'ProductSelectionControl',
  /** Product category filter for product blocks */
  ProductCategory: 'ProductCategoryControl',
  /** AI/contract-based product recommendations */
  ProductRecommendations: 'ProductRecommendationsControl',
  /** Payment method selector (bank transfer / SEPA) */
  Payment: 'PaymentControl',
  /** File upload with type restrictions and tagging */
  FileUpload: 'UploadPanelControl',
  /** Digital signature pad */
  DigitalSignature: 'DigitalSignatureControl',
  /** Date picker for single dates or date ranges with optional time */
  DatePicker: 'DatePickerControl',
  /** Cross-sell product selection (deprecated, use ProductSelection) */
  CrossSellProductSelection: 'CrossSellProductSelectionControl',
  /** Numeric input with unit, range, format, and suggestions */
  NumberInput: 'NumberInputControl',
  /** Device consumption calculator with preset/custom factors */
  InputCalculator: 'InputCalculatorControl',
  /** GDPR/terms consent checkboxes with topics */
  Consents: 'ConsentsControl',
  /** Address-based availability/coverage check */
  AvailabilityCheck: 'AvailabilityCheckControl',
  /** Multiple-choice selection (checkbox, button, or image) */
  MultiChoice: 'MultichoiceControl',
  /** Custom web component block (deprecated, use App) */
  CustomBlock: 'CustomBlockControl',
  /** Boolean control (switch or checkbox) */
  Boolean: 'BooleanControl',
  /** Enum/dropdown control */
  Enum: 'EnumControl',
  /** Text field control */
  TextField: 'TextfieldControl',
  /** Visual grouping container for child blocks */
  GroupLayout: 'GroupLayout',
  /** Standard meter reading entry */
  MeterReading: 'MeterReadingControl',
  /** Dynamic meter reading with entity-updating capabilities */
  DynamicMeterReading: 'DynamicMeterReadingControl',
  /** Launcher that starts other journeys (used in launcher-type journeys) */
  JourneyLauncher: 'JourneyLauncherControl',
  /** Previous energy provider lookup with BDEW code */
  PreviousProvider: 'PreviousProviderControl',
  /** Thank-you / confirmation control (legacy alias) */
  ThankYou: 'ThankYouControl',
  /** Image display block with alt text and responsive width */
  Image: 'ImageControl',
  /** Entity search, select, and display block */
  EntityLookup: 'EntityLookupControl',
  /** Entity attribute editor (read/write entity fields) */
  EntityAttribute: 'EntityAttributeControl',
  /** Solar panel roof planner / PV rooftop navigator */
  PVRoofPlanner: 'PVRoofPlannerControl',
  /** Installed app block (replaces CustomBlock) */
  AppBlock: 'AppBlockControl',
  /** Contract start date picker */
  ContractStartDate: 'ContractStartDateControl',
  /** Entity cards with optional selection */
  Cards: 'CardsControl',
} as const

export type ControlNameValue = (typeof ControlName)[keyof typeof ControlName]

/**
 * @deprecated Use `ControlName` instead. Kept for backwards compatibility.
 */
export const BlockType = {
  PersonalInformation: ControlName.PersonalInformation,
  Address: ControlName.Address,
  DatePicker: ControlName.DatePicker,
  BinaryInput: ControlName.Boolean,
  SingleChoice: ControlName.Control,
  TextInput: ControlName.Control,
  NumberInput: ControlName.NumberInput,
  Product: ControlName.ProductSelection,
  Image: ControlName.Image,
  Availability: ControlName.AvailabilityCheck,
  Summary: ControlName.Summary,
  Contact: ControlName.Contact,
  Account: ControlName.Account,
  FileUpload: ControlName.FileUpload,
  Consent: ControlName.Consents,
  IbanInput: ControlName.Payment,
  CustomBlock: ControlName.CustomBlock,
} as const

/** @deprecated Use `ControlNameValue` instead */
export type BlockTypeName = (typeof BlockType)[keyof typeof BlockType]

// ─── Block Value Types (from journey-logic-commons) ──────────────

export interface PersonalInformationValue {
  salutation?: string
  title?: string
  firstName?: string
  lastName?: string
  email?: string
  telephone?: string | null
  birthDate?: Date | string
  customerType?: string
  companyName?: string
  registryCourt?: string
  registerNumber?: string
}

export interface ContactValue {
  salutation?: string
  title?: string
  firstName?: string
  lastName?: string
  birthDate?: Date | string
  email?: string
  confirmationEmail?: string
  telephone?: string
}

export interface AccountValue {
  email?: string
  confirmationEmail?: string
  telephone?: string
  companyName?: string
  taxId?: string
  registryCourt?: string
  registerNumber?: string
}

export interface AddressValue {
  countryCode?: string
  city?: string
  zipCode?: string
  suburb?: string | null
  streetName?: string | null
  houseNumber?: string | null
  extension?: string | null
  extention?: string | null
  companyName?: string | null
}

export type TextInputValue = string | null

export interface NumberInputValue {
  numberInput?: string | null
  numberUnit?: string
  frequencyUnit?: string
}

export interface DatePickerValue {
  startDate?: Date | string | null
  endDate?: Date | string | null
}

export type BinaryInputValue = boolean

export type SingleChoiceValue = string | null | undefined

export type MultipleChoiceValue = string[] | null | undefined

export interface AvailabilityValue {
  countryCode?: string
  city?: string
  zipCode?: string
  suburb?: string | null
  streetName?: string | null
  streetNumber?: string | null
}

export interface ProductValue {
  /** Selected product tiles (single or array) */
  [key: string]: unknown
}

export interface PaymentMethodValue {
  type: 'payment_invoice' | 'payment_sepa'
  label?: string | null
  data?: {
    fullname?: string
    iban?: string
    consent?: boolean
    bic_number?: string
    bank_name?: string
  }
}

export interface ConsentsValue {
  [consentItemId: string]: {
    agreed: boolean
    topic: string
    text: string | null
    time: Date
  }
}

export interface FileUploadValue {
  files?: Array<{
    filename?: string
    s3ref?: { bucket: string; key: string }
    contentType?: string
    size?: number
  }>
}

export interface SignatureValue {
  /** Blob URL of the signature */
  value?: string
}

export interface PreviousProviderValue {
  company_name: string
  bdew_code?: string
}

export interface MeterReadingValue {
  maloId?: string
  meterId?: string
  meterType?: string
  readBy?: string
  readingDate?: Date | string | null
  readingValue?: number | null
  reason?: string
}

export interface InputCalculatorValue {
  numberInput?: string | null
  numberUnit?: string
  frequencyUnit?: string
  devices?: Array<{
    name: string | null
    otherName?: string | null
    quantity: string
    unitaryConsumption: string
    consumption?: string
  }>
}

export interface EntityFinderValue {
  entity: Record<string, unknown> | null
  slug?: string
}

export interface EntityAttributeValue {
  oldValue?: unknown
  newValue?: unknown
  entityId?: string
}

export interface ContractStartDateValue {
  type?: string
  startDate: string | null
  requiresTermination?: boolean
}

export interface PVRooftopValue {
  coordinates: string | undefined
  maxArrayAreaMeters2?: number
  maxSunshineHoursPerYear?: number
  solarPanelsUserCount?: number
  panelLifetimeYears?: number
  co2Savings?: number
  maxArrayPanelsCount?: number
}

export interface CardsValue {
  selected?: Array<{ entity_id: string; _schema: string }>
  searchQuery?: string
  page?: number
}

// ─── Block Value Type Map ────────────────────────────────────────

export interface BlockValueMap {
  [ControlName.PersonalInformation]: PersonalInformationValue
  [ControlName.Contact]: ContactValue
  [ControlName.Account]: AccountValue
  [ControlName.Address]: AddressValue
  [ControlName.Control]: TextInputValue | SingleChoiceValue | BinaryInputValue
  [ControlName.NumberInput]: NumberInputValue
  [ControlName.DatePicker]: DatePickerValue
  [ControlName.Boolean]: BinaryInputValue
  [ControlName.MultiChoice]: MultipleChoiceValue
  [ControlName.ProductSelection]: ProductValue
  [ControlName.AvailabilityCheck]: AvailabilityValue
  [ControlName.Payment]: PaymentMethodValue
  [ControlName.Consents]: ConsentsValue
  [ControlName.FileUpload]: FileUploadValue
  [ControlName.DigitalSignature]: SignatureValue
  [ControlName.MeterReading]: MeterReadingValue
  [ControlName.InputCalculator]: InputCalculatorValue
  [ControlName.PreviousProvider]: PreviousProviderValue
  [ControlName.EntityLookup]: EntityFinderValue
  [ControlName.EntityAttribute]: EntityAttributeValue
  [ControlName.ContractStartDate]: ContractStartDateValue
  [ControlName.PVRoofPlanner]: PVRooftopValue
  [ControlName.Cards]: CardsValue
  [ControlName.Image]: never
  [ControlName.Summary]: never
  [ControlName.Paragraph]: never
  [ControlName.ActionBar]: never
  [ControlName.Hyperlink]: never
  [ControlName.ConfirmationMessage]: never
  [ControlName.ShoppingCart]: never
  [ControlName.PdfSummary]: never
  [ControlName.GroupLayout]: never
  [ControlName.Auth]: Record<string, unknown>
  [ControlName.AppBlock]: Record<string, unknown>
  [ControlName.CustomBlock]: Record<string, unknown>
}

// ─── Data Injection Helpers ──────────────────────────────────────

export type StepBlockData = Record<string, BlockValueMap[keyof BlockValueMap] | Record<string, unknown>>

// ─── Block Settings Types (thin typed for top blocks) ────────────

export interface CommonBlockOptions {
  required?: boolean
  disabled?: boolean
  placeholder?: string
  helpText?: string
  className?: string
  [key: string]: unknown
}

export interface PersonalInformationBlockOptions extends CommonBlockOptions {
  customerType?: 'PRIVATE' | 'BUSINESS'
  purposeLabels?: string[]
  title?: string
  fields?: {
    salutation?: { required?: boolean; genderType?: string }
    title?: { required?: boolean }
    firstName?: { required?: boolean }
    lastName?: { required?: boolean }
    email?: { required?: boolean }
    telephone?: { required?: boolean }
    birthDate?: { required?: boolean }
    companyName?: { required?: boolean }
    registryCourt?: { required?: boolean }
    registerNumber?: { required?: boolean }
  }
}

export interface ContactBlockOptions extends CommonBlockOptions {
  purpose?: string[]
  title?: string
  fields?: {
    salutation?: { required?: boolean; genderType?: string }
    title?: { required?: boolean }
    firstName?: { required?: boolean }
    lastName?: { required?: boolean }
    email?: { required?: boolean }
    confirmationEmail?: { required?: boolean }
    telephone?: { required?: boolean }
    birthDate?: { required?: boolean }
  }
}

export interface AddressBlockOptions extends CommonBlockOptions {
  title?: string
  fields?: {
    zipCity?: { required?: boolean }
    suburb?: { required?: boolean }
    streetName?: { required?: boolean }
    houseNumber?: { required?: boolean }
    extention?: { required?: boolean }
  }
  countryAddressSettings?: {
    countryCode?: string
    enableAutoComplete?: boolean
    enableFreeText?: boolean
  }
  acceptSuggestedOnly?: boolean
  isDelivery?: boolean
  isBilling?: boolean
  related_pi?: string
  labels?: string[]
}

export interface TextInputBlockOptions extends CommonBlockOptions {
  label?: string
  placeholder?: string
  multiline?: boolean
}

export interface NumberInputBlockOptions extends CommonBlockOptions {
  unit?: { show: boolean; label: string }
  format?: { show?: boolean; validate?: boolean; digitsBeforeDecimalPoint?: number; decimalPlaces?: number }
  range?: { min: number; max: number | 'Infinity' }
  suggestions?: Array<{ label: string; value: string }>
}

export interface SingleChoiceBlockOptions extends CommonBlockOptions {
  label?: string
  uiType?: 'button' | 'radio' | 'dropdown' | 'image'
  buttonType?: string
  imageType?: string
  choices?: Array<{ label: string; value: string; icon?: string; imageUrl?: string }>
}

export interface MultipleChoiceBlockOptions extends CommonBlockOptions {
  uiType?: 'checkbox' | 'button' | 'image'
  maxSelection?: number | 'Infinity'
  choices?: Array<{ label: string; value: string; icon?: string; imageUrl?: string }>
}

export interface DatePickerBlockOptions extends CommonBlockOptions {
  fields?: {
    startDate?: { display: boolean; required?: boolean }
    endDate?: { display: boolean; required?: boolean }
  }
  disableDays?: number[]
  showTime?: boolean
  timeIntervals?: number
}

export interface ProductBlockOptions extends CommonBlockOptions {
  catalog?: 'epilot' | 'external'
  productsType?: 'static' | 'cross-selling-all' | 'cross-selling-selected'
  products?: Array<{ productId: string; priceId: string; isFeatured?: boolean }>
  selection?: 'one' | 'each-1' | 'each-n'
  alignment?: 'center' | 'left' | 'evenly-distributed'
  layout?: Record<string, unknown>
}

export interface ConsentsBlockOptions extends CommonBlockOptions {
  items?: Record<string, {
    required: boolean
    topics: string[]
    text?: string | null
    order: number
  }>
}

export interface FileUploadBlockOptions extends CommonBlockOptions {
  maxQuantity?: number
  restricted?: boolean
  supportedTypes?: string[]
  tags?: string[]
  zoneLabel?: string
}

export interface PaymentBlockOptions extends CommonBlockOptions {
  initialType?: 'BankTransfer' | 'SEPA'
  payment?: boolean
  title?: string
  implementations?: Array<{
    show?: boolean
    type: 'BankTransfer' | 'SEPA'
    label: string | null
    componentProps?: Record<string, unknown>
  }>
}

export interface CustomBlockOptions extends CommonBlockOptions {
  tagName?: string
  bundleUrl?: string
  args?: Record<string, string>
}

// ─── Block Options Type Map ──────────────────────────────────────

export interface BlockOptionsMap {
  [ControlName.PersonalInformation]: PersonalInformationBlockOptions
  [ControlName.Contact]: ContactBlockOptions
  [ControlName.Account]: CommonBlockOptions
  [ControlName.Address]: AddressBlockOptions
  [ControlName.Control]: TextInputBlockOptions | SingleChoiceBlockOptions
  [ControlName.NumberInput]: NumberInputBlockOptions
  [ControlName.DatePicker]: DatePickerBlockOptions
  [ControlName.Boolean]: CommonBlockOptions
  [ControlName.MultiChoice]: MultipleChoiceBlockOptions
  [ControlName.ProductSelection]: ProductBlockOptions
  [ControlName.AvailabilityCheck]: AddressBlockOptions
  [ControlName.Payment]: PaymentBlockOptions
  [ControlName.Consents]: ConsentsBlockOptions
  [ControlName.FileUpload]: FileUploadBlockOptions
  [ControlName.DigitalSignature]: CommonBlockOptions
  [ControlName.Image]: CommonBlockOptions
  [ControlName.Summary]: CommonBlockOptions
  [ControlName.Paragraph]: CommonBlockOptions
  [ControlName.ActionBar]: CommonBlockOptions
  [ControlName.Hyperlink]: CommonBlockOptions
  [ControlName.ConfirmationMessage]: CommonBlockOptions
  [ControlName.ShoppingCart]: CommonBlockOptions
  [ControlName.CustomBlock]: CustomBlockOptions
  [ControlName.AppBlock]: CommonBlockOptions
}

// ─── Typed Block Helper ──────────────────────────────────────────

export type TypedBlock<T extends ControlNameValue> = {
  type: string
  scope?: string
  label?: string
  elements?: import('./types.js').UISchemaElement[]
  options?: T extends keyof BlockOptionsMap ? BlockOptionsMap[T] : Record<string, unknown>
  [key: string]: unknown
}

// ─── Block Catalog (AI-friendly descriptions) ────────────────────

export interface BlockCatalogEntry {
  controlName: ControlNameValue
  displayName: string
  description: string
  category: 'input' | 'display' | 'composite' | 'navigation' | 'commerce' | 'utility' | 'third-party'
  hasValue: boolean
  commonlyUsed: boolean
}

export const BLOCK_CATALOG: BlockCatalogEntry[] = [
  { controlName: ControlName.PersonalInformation, displayName: 'Personal Information', description: 'Collects name, email, phone, birth date, and optional company details. Supports private/business/user-defined modes.', category: 'composite', hasValue: true, commonlyUsed: true },
  { controlName: ControlName.Contact, displayName: 'Contact', description: 'Collects contact fields: salutation, name, email, confirmation email, phone, birth date.', category: 'composite', hasValue: true, commonlyUsed: true },
  { controlName: ControlName.Account, displayName: 'Account', description: 'Collects business account info: email, phone, company name, tax ID, registry court, register number.', category: 'composite', hasValue: true, commonlyUsed: false },
  { controlName: ControlName.Address, displayName: 'Address', description: 'Collects a street address with optional autocomplete, map integration, and unlisted address support.', category: 'composite', hasValue: true, commonlyUsed: true },
  { controlName: ControlName.Control, displayName: 'Text / Choice / Binary', description: 'Generic control that renders as text input, single-choice, or binary toggle based on the JSON schema type at the scope path.', category: 'input', hasValue: true, commonlyUsed: true },
  { controlName: ControlName.TextField, displayName: 'Text Input', description: 'Free-form text input with optional label, placeholder, and multiline support.', category: 'input', hasValue: true, commonlyUsed: true },
  { controlName: ControlName.NumberInput, displayName: 'Number Input', description: 'Numeric input with optional unit, format, range constraints, and pre-set suggestions.', category: 'input', hasValue: true, commonlyUsed: true },
  { controlName: ControlName.DatePicker, displayName: 'Date Picker', description: 'Date or date range picker with optional time selection and day restrictions.', category: 'input', hasValue: true, commonlyUsed: true },
  { controlName: ControlName.Boolean, displayName: 'Binary / Toggle', description: 'Yes/no toggle rendered as a switch or checkbox.', category: 'input', hasValue: true, commonlyUsed: true },
  { controlName: ControlName.MultiChoice, displayName: 'Multiple Choice', description: 'Multi-select from a set of choices rendered as checkboxes, buttons, or image cards.', category: 'input', hasValue: true, commonlyUsed: true },
  { controlName: ControlName.Consents, displayName: 'Consents', description: 'GDPR/terms consent checkboxes with configurable topics (GTC, data privacy, marketing, etc.).', category: 'input', hasValue: true, commonlyUsed: true },
  { controlName: ControlName.FileUpload, displayName: 'File Upload', description: 'File upload with type restrictions, max quantity, and tagging support.', category: 'input', hasValue: true, commonlyUsed: true },
  { controlName: ControlName.DigitalSignature, displayName: 'Digital Signature', description: 'Digital signature pad for capturing signatures.', category: 'input', hasValue: true, commonlyUsed: false },
  { controlName: ControlName.Payment, displayName: 'Payment Method', description: 'Payment method selector supporting bank transfer and SEPA with IBAN validation.', category: 'commerce', hasValue: true, commonlyUsed: true },
  { controlName: ControlName.ProductSelection, displayName: 'Product Selection', description: 'Product tiles with pricing, features, and selection (single/multi). Supports epilot and external catalogs.', category: 'commerce', hasValue: true, commonlyUsed: true },
  { controlName: ControlName.ProductCategory, displayName: 'Product Categories', description: 'Filters products by category on linked product selection blocks.', category: 'commerce', hasValue: false, commonlyUsed: false },
  { controlName: ControlName.ProductRecommendations, displayName: 'Product Recommendations', description: 'Shows product recommendations based on contract or recommendation entity IDs.', category: 'commerce', hasValue: true, commonlyUsed: false },
  { controlName: ControlName.ShoppingCart, displayName: 'Shopping Cart', description: 'Displays selected products with prices, components, and optional promotions.', category: 'commerce', hasValue: false, commonlyUsed: true },
  { controlName: ControlName.AvailabilityCheck, displayName: 'Availability Check', description: 'Address-based service coverage check with postal code or file-based validation.', category: 'composite', hasValue: true, commonlyUsed: true },
  { controlName: ControlName.InputCalculator, displayName: 'Input Calculator', description: 'Device consumption calculator with preset factors (gas, power, water) or custom mappings.', category: 'input', hasValue: true, commonlyUsed: false },
  { controlName: ControlName.MeterReading, displayName: 'Meter Reading', description: 'Meter reading entry with counter type selection (one/two-tariff, bidirectional).', category: 'input', hasValue: true, commonlyUsed: false },
  { controlName: ControlName.PreviousProvider, displayName: 'Previous Provider', description: 'Energy provider lookup with BDEW code resolution. Can restrict to suggestions only.', category: 'input', hasValue: true, commonlyUsed: false },
  { controlName: ControlName.ContractStartDate, displayName: 'Contract Start Date', description: 'Contract start date picker with termination requirement flag.', category: 'input', hasValue: true, commonlyUsed: false },
  { controlName: ControlName.EntityLookup, displayName: 'Entity Finder', description: 'Search and select epilot entities by slug with configurable attributes display.', category: 'composite', hasValue: true, commonlyUsed: false },
  { controlName: ControlName.EntityAttribute, displayName: 'Entity Attribute', description: 'Read/write a specific entity attribute. Supports entity-based, auth-based, and context-based modes.', category: 'composite', hasValue: true, commonlyUsed: false },
  { controlName: ControlName.Cards, displayName: 'Cards', description: 'Entity cards with configurable content, table, and single/multi/no selection modes.', category: 'composite', hasValue: true, commonlyUsed: false },
  { controlName: ControlName.Auth, displayName: 'Authentication', description: 'Sign-in/sign-up/skip authentication block for portal users.', category: 'utility', hasValue: true, commonlyUsed: false },
  { controlName: ControlName.Paragraph, displayName: 'Paragraph', description: 'Rich text content block (stored as base64-encoded HTML).', category: 'display', hasValue: false, commonlyUsed: true },
  { controlName: ControlName.Image, displayName: 'Image', description: 'Image display with alt text, responsive width (100%/50%/30%), and aspect ratio preservation.', category: 'display', hasValue: false, commonlyUsed: true },
  { controlName: ControlName.Hyperlink, displayName: 'Hyperlinks', description: 'List of clickable hyperlinks with optional labels.', category: 'display', hasValue: false, commonlyUsed: false },
  { controlName: ControlName.Summary, displayName: 'Summary', description: 'Review block showing collected data from referenced blocks with optional title overrides.', category: 'display', hasValue: false, commonlyUsed: true },
  { controlName: ControlName.ActionBar, displayName: 'Action Bar', description: 'Navigation bar with configurable next/back buttons and submit-and-navigate actions.', category: 'navigation', hasValue: false, commonlyUsed: true },
  { controlName: ControlName.ConfirmationMessage, displayName: 'Success Message', description: 'Success/thank-you message with configurable title, body, and CTA button.', category: 'navigation', hasValue: false, commonlyUsed: true },
  { controlName: ControlName.PVRoofPlanner, displayName: 'PV Rooftop Planner', description: 'Solar panel roof planner with coordinates, array area, sunshine hours, and CO2 savings.', category: 'composite', hasValue: true, commonlyUsed: false },
  { controlName: ControlName.AppBlock, displayName: 'App Block', description: 'Installed app rendered inside the journey. Configured with appId, componentId, and args.', category: 'third-party', hasValue: true, commonlyUsed: false },
  { controlName: ControlName.CustomBlock, displayName: 'Custom Block (Legacy)', description: 'Custom web component block. Deprecated — use App Block instead.', category: 'third-party', hasValue: true, commonlyUsed: false },
  { controlName: ControlName.GroupLayout, displayName: 'Group', description: 'Visual grouping container for child blocks. Cannot be nested.', category: 'display', hasValue: false, commonlyUsed: true },
  { controlName: ControlName.PdfSummary, displayName: 'PDF Generator', description: 'Generates a PDF from a DocX template with journey data. Shows a download link.', category: 'utility', hasValue: false, commonlyUsed: false },
]
