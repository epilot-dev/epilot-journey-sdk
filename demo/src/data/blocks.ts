// ─── Block Catalog Types ─────────────────────────────────────────

export type BlockCategory =
  | 'input'
  | 'composite'
  | 'commerce'
  | 'display'
  | 'navigation'
  | 'utility'
  | 'third-party';

export interface BlockEntry {
  controlName: string;
  displayName: string;
  category: BlockCategory;
  description: string;
  hasValue: boolean;
  commonlyUsed: boolean;
  deprecated?: boolean;
  icon: string;
  factory: string | null;
  valueType: string;
  optionsType: string;
  codeExample: string;
  wireExample: string;
}

// ─── Block Catalog Entries ────────────────────────────────────────

export const BLOCK_CATALOG: BlockEntry[] = [
  // ── Composite ────────────────────────────────────────────────
  {
    controlName: 'PersonalInformationControl',
    displayName: 'Personal Information',
    category: 'composite',
    description:
      'Collects name, email, phone, birth date, and optional company details. Supports private/business/user-defined modes.',
    hasValue: true,
    commonlyUsed: true,
    icon: '👤',
    factory: 'createPersonalInformation',
    valueType: `interface PersonalInformationValue {
  salutation?: string        // 'Mr' | 'Ms' | 'Diverse' | …
  title?: string             // Academic title
  firstName?: string
  lastName?: string
  email?: string
  telephone?: string | null
  birthDate?: Date | string
  customerType?: string      // 'PRIVATE' | 'BUSINESS'
  companyName?: string
  registryCourt?: string
  registerNumber?: string
}`,
    optionsType: `interface PersonalInformationBlockOptions {
  customerType?: 'PRIVATE' | 'BUSINESS'
  purposeLabels?: string[]   // e.g. ['customer', 'partner']
  title?: string             // Block heading
  required?: boolean
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
}`,
    codeExample: `const block = createPersonalInformation({
  name: 'Contact Info',
  required: true,
  options: {
    customerType: 'PRIVATE',
    purposeLabels: ['customer'],
    title: 'Your Details',
    fields: {
      firstName: { required: true },
      lastName: { required: true },
      email: { required: true },
      telephone: {},
    },
  },
})`,
    wireExample: `{
  "id": "a1b2-...",
  "type": "PersonalInformationControl",
  "scope": "#/properties/Contact Info",
  "options": {
    "showPaper": true,
    "required": true,
    "customerType": "PRIVATE",
    "purposeLabels": ["customer"],
    "fields": {
      "firstName": { "required": true },
      "lastName": { "required": true },
      "email": { "required": true }
    },
    "variablePath": "Contact_Info_Contact_Info"
  }
}`,
  },
  {
    controlName: 'ContactControl',
    displayName: 'Contact',
    category: 'composite',
    description:
      'Collects contact-specific fields: salutation, name, email, confirmation email, phone, birth date. Maps to an epilot Contact entity.',
    hasValue: true,
    commonlyUsed: true,
    icon: '📇',
    factory: 'createContact',
    valueType: `interface ContactValue {
  salutation?: string
  title?: string
  firstName?: string
  lastName?: string
  birthDate?: Date | string
  email?: string
  confirmationEmail?: string
  telephone?: string
}`,
    optionsType: `interface ContactBlockOptions {
  purpose?: string[]
  title?: string
  required?: boolean
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
}`,
    codeExample: `const block = createContact({
  name: 'Contact',
  required: true,
  options: {
    purpose: ['customer'],
    title: 'Contact Information',
    fields: {
      firstName: { required: true },
      lastName: { required: true },
      email: { required: true },
    },
  },
})`,
    wireExample: `{
  "id": "a1b2-...",
  "type": "ContactControl",
  "scope": "#/properties/Contact",
  "options": {
    "showPaper": true,
    "required": true,
    "purpose": ["customer"],
    "fields": {
      "firstName": { "required": true },
      "lastName": { "required": true },
      "email": { "required": true }
    }
  }
}`,
  },
  {
    controlName: 'AccountControl',
    displayName: 'Account',
    category: 'composite',
    description:
      'Collects business account info: email, phone, company name, tax ID, registry court, register number. Maps to an epilot Account entity.',
    hasValue: true,
    commonlyUsed: false,
    icon: '🏢',
    factory: null,
    valueType: `interface AccountValue {
  email?: string
  confirmationEmail?: string
  telephone?: string
  companyName?: string
  taxId?: string
  registryCourt?: string
  registerNumber?: string
}`,
    optionsType: `// CommonBlockOptions
{
  required?: boolean
  disabled?: boolean
  placeholder?: string
  helpText?: string
}`,
    codeExample: `const block = createBlock('AccountControl', {
  name: 'Company',
  required: true,
  showPaper: true,
})`,
    wireExample: `{
  "id": "a1b2-...",
  "type": "AccountControl",
  "scope": "#/properties/Company",
  "options": { "showPaper": true, "required": true }
}`,
  },
  {
    controlName: 'AddressControl',
    displayName: 'Address',
    category: 'composite',
    description:
      'Collects a street address with optional autocomplete, map integration, and free-text fallback. Supports delivery/billing tagging and country-specific field rules.',
    hasValue: true,
    commonlyUsed: true,
    icon: '📍',
    factory: 'createAddress',
    valueType: `interface AddressValue {
  countryCode?: string
  city?: string
  zipCode?: string
  suburb?: string | null
  streetName?: string | null
  houseNumber?: string | null
  extension?: string | null
  extention?: string | null   // legacy typo alias
  companyName?: string | null
}`,
    optionsType: `interface AddressBlockOptions {
  title?: string
  required?: boolean
  fields?: {
    zipCity?: { required?: boolean }
    suburb?: { required?: boolean }
    streetName?: { required?: boolean }
    houseNumber?: { required?: boolean }
    extention?: { required?: boolean }
  }
  countryAddressSettings?: {
    countryCode?: string        // e.g. 'DE'
    enableAutoComplete?: boolean
    enableFreeText?: boolean
  }
  acceptSuggestedOnly?: boolean
  isDelivery?: boolean
  isBilling?: boolean
  related_pi?: string           // link to PI block name
  labels?: string[]
}`,
    codeExample: `const block = createAddress({
  name: 'Address',
  required: true,
  options: {
    title: 'Delivery Address',
    countryAddressSettings: {
      countryCode: 'DE',
      enableAutoComplete: true,
      enableFreeText: false,
    },
    acceptSuggestedOnly: true,
    fields: {
      zipCity: { required: true },
      streetName: { required: true },
      houseNumber: { required: true },
    },
  },
})`,
    wireExample: `{
  "id": "a1b2-...",
  "type": "AddressControl",
  "scope": "#/properties/Address",
  "options": {
    "showPaper": true,
    "required": true,
    "countryAddressSettings": {
      "countryCode": "DE",
      "enableAutoComplete": true
    },
    "fields": {
      "zipCity": { "required": true },
      "streetName": { "required": true },
      "houseNumber": { "required": true }
    }
  }
}`,
  },
  {
    controlName: 'AvailabilityCheckControl',
    displayName: 'Availability Check',
    category: 'composite',
    description:
      'Address-based service coverage check using postal code lookup or a coverage file. Blocks journey progression if the address is outside the service area.',
    hasValue: true,
    commonlyUsed: true,
    icon: '📡',
    factory: 'createAvailabilityCheck',
    valueType: `interface AvailabilityValue {
  countryCode?: string
  city?: string
  zipCode?: string
  suburb?: string | null
  streetName?: string | null
  streetNumber?: string | null
}`,
    optionsType: `{
  required?: boolean
  countryAddressSettings?: {
    countryCode?: string
    enableAutoComplete?: boolean
  }
  fields?: {
    zipCity?: { required?: boolean }
  }
}`,
    codeExample: `const block = createAvailabilityCheck({
  name: 'availability',
  required: true,
  options: {
    countryCode: 'DE',
    availabilityMode: 'postalCode',
    enableAutoComplete: true,
    enableFreeText: false,
    fields: { zipCode: { required: true, label: 'Postal Code' } },
  },
})`,
    wireExample: `{
  "type": "AvailabilityCheckControl",
  "scope": "#/properties/availability",
  "options": {
    "required": true,
    "countryAddressSettings": { "countryCode": "DE" }
  }
}`,
  },
  {
    controlName: 'EntityLookupControl',
    displayName: 'Entity Finder',
    category: 'composite',
    description:
      'Search and select epilot entities by slug with configurable attribute display. Useful for finding existing orders, contracts, or customer records.',
    hasValue: true,
    commonlyUsed: false,
    icon: '🔍',
    factory: null,
    valueType: `interface EntityFinderValue {
  entity: Record<string, unknown> | null
  slug?: string    // e.g. 'contact', 'order', 'contract'
}`,
    optionsType: `{
  required?: boolean
  slug?: string
  attributes?: string[]
  searchableAttributes?: string[]
}`,
    codeExample: `const block = createBlock('EntityLookupControl', {
  name: 'customer',
  label: 'Find Customer',
  options: {
    slug: 'contact',
    searchableAttributes: ['email', 'firstName', 'lastName'],
  },
})`,
    wireExample: `{
  "type": "EntityLookupControl",
  "scope": "#/properties/customer",
  "options": {
    "slug": "contact",
    "searchableAttributes": ["email", "firstName"]
  }
}`,
  },
  {
    controlName: 'EntityAttributeControl',
    displayName: 'Entity Attribute',
    category: 'composite',
    description:
      'Read/write a specific attribute of an epilot entity. Three modes: entity-based (linked entity), auth-based (logged-in portal user), context-based (journey context).',
    hasValue: true,
    commonlyUsed: false,
    icon: '🏷️',
    factory: null,
    valueType: `interface EntityAttributeValue {
  oldValue?: unknown
  newValue?: unknown
  entityId?: string
}`,
    optionsType: `{
  required?: boolean
  mode?: 'entity' | 'auth' | 'context'
  slug?: string
  attribute?: string
  entityId?: string
}`,
    codeExample: `const block = createBlock('EntityAttributeControl', {
  name: 'customerEmail',
  label: 'Customer Email',
  options: {
    mode: 'auth',
    slug: 'contact',
    attribute: 'email',
  },
})`,
    wireExample: `{
  "type": "EntityAttributeControl",
  "scope": "#/properties/customerEmail",
  "options": {
    "mode": "auth",
    "slug": "contact",
    "attribute": "email"
  }
}`,
  },
  {
    controlName: 'CardsControl',
    displayName: 'Cards',
    category: 'composite',
    description:
      'Entity cards with configurable content, table view, and selection modes (single, multi, none). Useful for selecting from a list of existing offers or orders.',
    hasValue: true,
    commonlyUsed: false,
    icon: '🃏',
    factory: null,
    valueType: `interface CardsValue {
  selected?: Array<{ entity_id: string; _schema: string }>
  searchQuery?: string
  page?: number
}`,
    optionsType: `{
  required?: boolean
  selectionMode?: 'single' | 'multi' | 'none'
  slug?: string
  attributes?: string[]
}`,
    codeExample: `const block = createBlock('CardsControl', {
  name: 'offers',
  label: 'Select Offer',
  options: {
    selectionMode: 'single',
    slug: 'order',
  },
})`,
    wireExample: `{
  "type": "CardsControl",
  "scope": "#/properties/offers",
  "options": {
    "selectionMode": "single",
    "slug": "order"
  }
}`,
  },

  // ── Input ─────────────────────────────────────────────────────
  {
    controlName: 'Control',
    displayName: 'Text / Single Choice / Binary',
    category: 'input',
    description:
      'Generic control that renders differently based on JSON schema type at the scope path: string → text input, enum → single choice, boolean → toggle. Three factory functions target each mode.',
    hasValue: true,
    commonlyUsed: true,
    icon: '✏️',
    factory: 'createTextInput / createSingleChoice',
    valueType: `type TextInputValue = string | null
type SingleChoiceValue = string | null | undefined
type BinaryInputValue = boolean

// Schema type at scope determines rendering:
// { type: 'string' }  → text input or single choice
// { type: 'boolean' } → binary toggle`,
    optionsType: `// For text input:
interface TextInputBlockOptions {
  label?: string
  placeholder?: string
  multiline?: boolean
  required?: boolean
}

// For single choice:
interface SingleChoiceBlockOptions {
  uiType?: 'button' | 'radio' | 'dropdown' | 'image'
  // v3 wire format: parallel arrays
  // (factory auto-converts from a choices[] array)
  options?: string[]
  optionsLabels?: string[]
  optionsIcons?: Array<{ name: string } | undefined>
  required?: boolean
}`,
    codeExample: `// Text input
const notes = createTextInput({
  name: 'Notes',
  label: 'Additional Notes',
  options: { multiline: true, placeholder: 'Enter notes…' },
})

// Single choice (buttons)
const tariff = createSingleChoice({
  name: 'tariff',
  label: 'Select tariff',
  required: true,
  options: {
    uiType: 'button',
    choices: [
      { label: 'Basic', value: 'basic' },
      { label: 'Premium', value: 'premium', icon: 'star' },
    ],
  },
})`,
    wireExample: `// Wire format uses parallel arrays, NOT choices[]:
{
  "type": "Control",
  "scope": "#/properties/tariff",
  "options": {
    "uiType": "button",
    "options": ["basic", "premium"],
    "optionsLabels": ["Basic", "Premium"],
    "optionsIcons": [undefined, { "name": "star" }],
    "required": true
  }
}`,
  },
  {
    controlName: 'NumberInputControl',
    displayName: 'Number Input',
    category: 'input',
    description:
      'Numeric input with optional unit display, format constraints, min/max range validation, and pre-set suggestion chips.',
    hasValue: true,
    commonlyUsed: true,
    icon: '🔢',
    factory: 'createNumberInput',
    valueType: `interface NumberInputValue {
  numberInput?: string | null   // stored as string despite being numeric
  numberUnit?: string
  frequencyUnit?: string
}`,
    optionsType: `interface NumberInputBlockOptions {
  unit?: { show: boolean; label: string }
  format?: {
    show?: boolean
    validate?: boolean
    digitsBeforeDecimalPoint?: number
    decimalPlaces?: number
  }
  range?: { min: number; max: number | 'Infinity' }
  suggestions?: Array<{ label: string; value: string }>
  required?: boolean
}`,
    codeExample: `const block = createNumberInput({
  name: 'Consumption',
  label: 'Annual Consumption',
  required: true,
  unit: { show: true, label: 'kWh' },
  range: { min: 0, max: 100000 },
  suggestions: [
    { label: 'Avg 1-person', value: '1500' },
    { label: 'Avg 2-person', value: '2500' },
    { label: 'Avg 4-person', value: '4000' },
  ],
})`,
    wireExample: `// Note: options are nested under fields.numberInput
{
  "type": "NumberInputControl",
  "scope": "#/properties/Consumption",
  "options": {
    "fields": {
      "numberInput": {
        "unit": { "show": true, "label": "kWh" },
        "range": { "min": 0, "max": 100000 },
        "label": "Annual Consumption"
      }
    },
    "suggestions": [
      { "label": "Avg 1-person", "value": "1500" }
    ]
  }
}`,
  },
  {
    controlName: 'DatePickerControl',
    displayName: 'Date Picker',
    category: 'input',
    description:
      'Date or date range picker with optional time selection, day-of-week restrictions, and configurable start/end date fields.',
    hasValue: true,
    commonlyUsed: true,
    icon: '📅',
    factory: 'createDatePicker',
    valueType: `interface DatePickerValue {
  startDate?: Date | string | null
  endDate?: Date | string | null
}`,
    optionsType: `interface DatePickerBlockOptions {
  fields?: {
    startDate?: { display: boolean; required?: boolean }
    endDate?: { display: boolean; required?: boolean }
  }
  disableDays?: number[]     // 0=Sun … 6=Sat
  showTime?: boolean
  timeIntervals?: number     // e.g. 30 (minutes)
  required?: boolean
}`,
    codeExample: `const block = createDatePicker({
  name: 'moveDate',
  label: 'Moving Date',
  required: true,
  options: {
    showTime: false,
    disableDays: [0, 6],   // no weekends
    fields: {
      startDate: { display: true, required: true },
      endDate: { display: false },
    },
  },
})`,
    wireExample: `{
  "type": "DatePickerControl",
  "scope": "#/properties/moveDate",
  "options": {
    "required": true,
    "showTime": false,
    "disableDays": [0, 6],
    "fields": {
      "startDate": { "display": true, "required": true },
      "endDate": { "display": false }
    }
  }
}`,
  },
  {
    controlName: 'BooleanControl',
    displayName: 'Binary / Toggle',
    category: 'input',
    description: 'Yes/no boolean toggle rendered as a switch or checkbox.',
    hasValue: true,
    commonlyUsed: true,
    icon: '🔘',
    factory: 'createBinaryInput',
    valueType: `type BinaryInputValue = boolean`,
    optionsType: `{
  required?: boolean
  disabled?: boolean
  helpText?: string
  label?: string
}`,
    codeExample: `const block = createBinaryInput({
  name: 'newsletter',
  label: 'Subscribe to newsletter',
})`,
    wireExample: `{
  "type": "BooleanControl",
  "scope": "#/properties/newsletter",
  "options": { "showPaper": false }
}`,
  },
  {
    controlName: 'MultichoiceControl',
    displayName: 'Multiple Choice',
    category: 'input',
    description:
      'Multi-select from a set of choices. Rendered as checkboxes, toggle buttons, or image cards. Uses v3 parallel arrays in wire format.',
    hasValue: true,
    commonlyUsed: true,
    icon: '☑️',
    factory: 'createMultipleChoice',
    valueType: `type MultipleChoiceValue = string[] | null | undefined`,
    optionsType: `interface MultipleChoiceBlockOptions {
  uiType?: 'checkbox' | 'button' | 'image'
  maxSelection?: number | 'Infinity'
  // v3 wire format: parallel arrays
  // (factory auto-converts from choices[])
  options?: string[]
  optionsLabels?: string[]
  optionsIcons?: Array<{ name: string } | undefined>
  required?: boolean
}`,
    codeExample: `const block = createMultipleChoice({
  name: 'interests',
  label: 'Select your interests',
  options: {
    uiType: 'checkbox',
    maxSelection: 3,
    choices: [
      { label: 'Solar', value: 'solar', icon: 'sun' },
      { label: 'Wind', value: 'wind', icon: 'wind' },
      { label: 'Gas', value: 'gas' },
    ],
  },
})`,
    wireExample: `// Choices expanded to parallel arrays:
{
  "type": "MultichoiceControl",
  "scope": "#/properties/interests",
  "options": {
    "uiType": "checkbox",
    "maxSelection": 3,
    "options": ["solar", "wind", "gas"],
    "optionsLabels": ["Solar", "Wind", "Gas"],
    "optionsIcons": [
      { "name": "sun" },
      { "name": "wind" },
      undefined
    ]
  }
}`,
  },
  {
    controlName: 'ConsentsControl',
    displayName: 'Consents',
    category: 'input',
    description:
      'GDPR/terms consent checkboxes. Each item has configurable topics (GTC, EMAIL_MARKETING, DATA_USAGE, etc.), required flag, and markdown text with links.',
    hasValue: true,
    commonlyUsed: true,
    icon: '✅',
    factory: 'createConsents',
    valueType: `interface ConsentsValue {
  [consentItemId: string]: {
    agreed: boolean
    topic: string
    text: string | null
    time: Date
  }
}`,
    optionsType: `interface ConsentsBlockOptions {
  items?: Record<string, {
    required: boolean
    topics: string[]   // 'GTC' | 'DATA_USAGE' | 'EMAIL_MARKETING' | …
    text?: string | null
    order: number
  }>
  required?: boolean
}`,
    codeExample: `const block = createConsents({
  name: 'consents',
  label: 'Terms & Conditions',
  required: true,
  options: {
    items: {
      'gtc': {
        required: true,
        topics: ['GTC'],
        text: 'I agree to the [Terms & Conditions](https://example.com/terms)',
        order: 0,
      },
      'marketing': {
        required: false,
        topics: ['EMAIL_MARKETING'],
        text: 'I would like to receive marketing emails',
        order: 1,
      },
    },
  },
})`,
    wireExample: `{
  "type": "ConsentsControl",
  "scope": "#/properties/consents",
  "options": {
    "required": true,
    "items": {
      "gtc": {
        "required": true,
        "topics": ["GTC"],
        "text": "I agree to the [Terms](https://…)",
        "order": 0
      }
    }
  }
}`,
  },
  {
    controlName: 'UploadPanelControl',
    displayName: 'File Upload',
    category: 'input',
    description:
      'Drag-and-drop file upload with MIME type restrictions, max quantity, and auto-tagging. Files are stored in epilot S3.',
    hasValue: true,
    commonlyUsed: true,
    icon: '📎',
    factory: 'createFileUpload',
    valueType: `interface FileUploadValue {
  files?: Array<{
    filename?: string
    s3ref?: { bucket: string; key: string }
    contentType?: string
    size?: number
  }>
}`,
    optionsType: `interface FileUploadBlockOptions {
  maxQuantity?: number
  restricted?: boolean
  supportedTypes?: string[]  // 'PDF' | 'Image' | 'Video' | 'CSV' | …
  tags?: string[]            // auto-applied tags
  zoneLabel?: string
  required?: boolean
}`,
    codeExample: `const block = createFileUpload({
  name: 'documents',
  label: 'Upload Documents',
  options: {
    maxQuantity: 5,
    supportedTypes: ['PDF', 'Image'],
    tags: ['contract-document'],
    zoneLabel: 'Drop files here or click to browse',
  },
})`,
    wireExample: `{
  "type": "UploadPanelControl",
  "scope": "#/properties/documents",
  "options": {
    "maxQuantity": 5,
    "supportedTypes": ["PDF", "Image"],
    "tags": ["contract-document"]
  }
}`,
  },
  {
    controlName: 'DigitalSignatureControl',
    displayName: 'Digital Signature',
    category: 'input',
    description: 'Signature pad for capturing digital signatures. Value is stored as a Blob URL.',
    hasValue: true,
    commonlyUsed: false,
    icon: '✍️',
    factory: null,
    valueType: `interface SignatureValue {
  value?: string   // Blob URL of the signature image
}`,
    optionsType: `{ required?: boolean; disabled?: boolean }`,
    codeExample: `const block = createBlock('DigitalSignatureControl', {
  name: 'signature',
  label: 'Customer Signature',
  required: true,
})`,
    wireExample: `{
  "type": "DigitalSignatureControl",
  "scope": "#/properties/signature",
  "options": { "required": true }
}`,
  },
  {
    controlName: 'InputCalculatorControl',
    displayName: 'Input Calculator',
    category: 'input',
    description:
      'Device consumption calculator. Users select devices (gas appliances, power equipment, etc.) and the block calculates total energy consumption.',
    hasValue: true,
    commonlyUsed: false,
    icon: '🧮',
    factory: null,
    valueType: `interface InputCalculatorValue {
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
}`,
    optionsType: `{
  required?: boolean
  factors?: 'gas' | 'power' | 'water'
}`,
    codeExample: `const block = createBlock('InputCalculatorControl', {
  name: 'consumption',
  label: 'Calculate your consumption',
  options: { factors: 'power' },
})`,
    wireExample: `{
  "type": "InputCalculatorControl",
  "scope": "#/properties/consumption",
  "options": { "factors": "power" }
}`,
  },
  {
    controlName: 'MeterReadingControl',
    displayName: 'Meter Reading',
    category: 'input',
    description:
      'Meter reading entry with counter type selection (one-tariff, two-tariff, bidirectional). Captures MALO ID, meter ID, type, read-by, date, value, and reason.',
    hasValue: true,
    commonlyUsed: false,
    icon: '⚡',
    factory: null,
    valueType: `interface MeterReadingValue {
  maloId?: string
  meterId?: string
  meterType?: string      // 'ONE_TARIFF' | 'TWO_TARIFF' | 'BIDIRECTIONAL'
  readBy?: string
  readingDate?: Date | string | null
  readingValue?: number | null
  reason?: string         // 'MOVE' | 'TERMINATION' | 'CONTRACT_START'
}`,
    optionsType: `{ required?: boolean; meterTypes?: string[] }`,
    codeExample: `const block = createBlock('MeterReadingControl', {
  name: 'meterReading',
  label: 'Meter Reading',
  required: true,
})`,
    wireExample: `{
  "type": "MeterReadingControl",
  "scope": "#/properties/meterReading",
  "options": { "required": true }
}`,
  },
  {
    controlName: 'PreviousProviderControl',
    displayName: 'Previous Provider',
    category: 'input',
    description:
      'Energy provider lookup with BDEW code resolution for Germany. Typeahead search with provider list. Can restrict to suggestions-only mode.',
    hasValue: true,
    commonlyUsed: false,
    icon: '🏭',
    factory: null,
    valueType: `interface PreviousProviderValue {
  company_name: string
  bdew_code?: string    // 13-digit BDEW market partner code
}`,
    optionsType: `{ required?: boolean; restrictToSuggestions?: boolean }`,
    codeExample: `const block = createBlock('PreviousProviderControl', {
  name: 'previousProvider',
  label: 'Previous Energy Provider',
  required: true,
})`,
    wireExample: `{
  "type": "PreviousProviderControl",
  "scope": "#/properties/previousProvider",
  "options": { "required": true }
}`,
  },
  {
    controlName: 'ContractStartDateControl',
    displayName: 'Contract Start Date',
    category: 'input',
    description:
      'Contract start date picker with termination requirement flag and configurable start date types (earliest possible, specific date, etc.).',
    hasValue: true,
    commonlyUsed: false,
    icon: '📋',
    factory: null,
    valueType: `interface ContractStartDateValue {
  type?: string          // 'ASAP' | 'SPECIFIC_DATE' | …
  startDate: string | null
  requiresTermination?: boolean
}`,
    optionsType: `{ required?: boolean; dateTypes?: string[] }`,
    codeExample: `const block = createBlock('ContractStartDateControl', {
  name: 'contractStart',
  label: 'Contract Start Date',
  required: true,
})`,
    wireExample: `{
  "type": "ContractStartDateControl",
  "scope": "#/properties/contractStart",
  "options": { "required": true }
}`,
  },

  // ── Commerce ──────────────────────────────────────────────────
  {
    controlName: 'ProductSelectionControl',
    displayName: 'Product Selection',
    category: 'commerce',
    description:
      'Product tiles with pricing, features, and selection modes (one, each-1, each-n). Supports epilot catalog and external catalogs. Most commonly used commerce block.',
    hasValue: true,
    commonlyUsed: true,
    icon: '🛒',
    factory: 'createProductSelection',
    valueType: `interface ProductValue {
  // Dynamic: keyed by product/price combination
  [key: string]: unknown
}`,
    optionsType: `interface ProductBlockOptions {
  catalog?: 'epilot' | 'external'
  productsType?: 'static' | 'cross-selling-all' | 'cross-selling-selected'
  products?: Array<{
    productId: string
    priceId: string
    isFeatured?: boolean
  }>
  selection?: 'one' | 'each-1' | 'each-n'
  alignment?: 'center' | 'left' | 'evenly-distributed'
  required?: boolean
}`,
    codeExample: `const block = createProductSelection({
  name: 'products',
  label: 'Choose your plan',
  required: true,
  options: {
    catalog: 'epilot',
    productsType: 'static',
    selection: 'one',
    products: [
      { productId: 'prod-basic', priceId: 'price-monthly' },
      { productId: 'prod-pro', priceId: 'price-monthly', isFeatured: true },
    ],
  },
})`,
    wireExample: `{
  "type": "ProductSelectionControl",
  "scope": "#/properties/products",
  "options": {
    "catalog": "epilot",
    "productsType": "static",
    "selection": "one",
    "products": [
      { "productId": "prod-basic", "priceId": "price-monthly" },
      { "productId": "prod-pro", "priceId": "price-monthly", "isFeatured": true }
    ]
  }
}`,
  },
  {
    controlName: 'PaymentControl',
    displayName: 'Payment Method',
    category: 'commerce',
    description:
      'Payment method selector supporting Bank Transfer (invoice) and SEPA Direct Debit with IBAN validation. Configurable per implementation type.',
    hasValue: true,
    commonlyUsed: true,
    icon: '💳',
    factory: 'createPaymentMethod',
    valueType: `interface PaymentMethodValue {
  type: 'payment_invoice' | 'payment_sepa'
  label?: string | null
  data?: {
    fullname?: string
    iban?: string
    consent?: boolean
    bic_number?: string
    bank_name?: string
  }
}`,
    optionsType: `interface PaymentBlockOptions {
  initialType?: 'BankTransfer' | 'SEPA'
  title?: string
  implementations?: Array<{
    show?: boolean
    type: 'BankTransfer' | 'SEPA'
    label: string | null
    componentProps?: Record<string, unknown>
  }>
  required?: boolean
}`,
    codeExample: `const block = createPaymentMethod({
  name: 'payment',
  label: 'Payment Method',
  required: true,
  options: {
    implementations: [
      { type: 'SEPA', label: 'SEPA Direct Debit', show: true },
      { type: 'BankTransfer', label: 'Invoice', show: true },
    ],
  },
})`,
    wireExample: `{
  "type": "PaymentControl",
  "scope": "#/properties/payment",
  "options": {
    "showPaper": true,
    "required": true,
    "implementations": [
      { "type": "SEPA", "label": "SEPA Direct Debit", "show": true },
      { "type": "BankTransfer", "label": "Invoice", "show": true }
    ]
  }
}`,
  },
  {
    controlName: 'ShopCartControl',
    displayName: 'Shopping Cart',
    category: 'commerce',
    description:
      'Displays selected products, pricing breakdown, and components. Read-only display block that reacts to ProductSelection changes — no value submitted.',
    hasValue: false,
    commonlyUsed: true,
    icon: '🛍️',
    factory: 'createShoppingCart',
    valueType: `// No value — display block only`,
    optionsType: `{
  cartTitle?: string
  cartFootnote?: string
}`,
    codeExample: `const block = createShoppingCart('cart', {
  cartTitle: 'Your Order',
  cartFootnote: '* Prices include VAT',
})`,
    wireExample: `{
  "type": "ShopCartControl",
  "scope": "#/properties/cart",
  "options": {
    "cartTitle": "Your Order",
    "cartFootnote": "* Prices include VAT"
  }
}`,
  },
  {
    controlName: 'ProductCategoryControl',
    displayName: 'Product Categories',
    category: 'commerce',
    description: 'Filters products by category on linked product selection blocks. Purely a UI filter — no value submitted.',
    hasValue: false,
    commonlyUsed: false,
    icon: '🗂️',
    factory: null,
    valueType: `// No value — display/filter block only`,
    optionsType: `{ required?: boolean }`,
    codeExample: `const block = createBlock('ProductCategoryControl', {
  name: 'category',
  options: {},
})`,
    wireExample: `{
  "type": "ProductCategoryControl",
  "scope": "#/properties/category",
  "options": {}
}`,
  },
  {
    controlName: 'ProductRecommendationsControl',
    displayName: 'Product Recommendations',
    category: 'commerce',
    description:
      'Shows product recommendations based on contract or recommendation entity IDs. AI/contract-based product matching.',
    hasValue: true,
    commonlyUsed: false,
    icon: '💡',
    factory: null,
    valueType: `Record<string, unknown>`,
    optionsType: `{ contractIds?: string[]; required?: boolean }`,
    codeExample: `const block = createBlock('ProductRecommendationsControl', {
  name: 'recommendations',
  options: { contractIds: ['contract-1'] },
})`,
    wireExample: `{
  "type": "ProductRecommendationsControl",
  "scope": "#/properties/recommendations",
  "options": {}
}`,
  },

  // ── Display ───────────────────────────────────────────────────
  {
    controlName: 'Label',
    displayName: 'Paragraph',
    category: 'display',
    description:
      'Rich text content block. Text is stored as UTF-16LE base64-encoded. The factory handles encoding automatically — just pass plain text.',
    hasValue: false,
    commonlyUsed: true,
    icon: '📄',
    factory: 'createParagraph',
    valueType: `// No value — display block only`,
    optionsType: `// No options object.
// Text goes to the top-level 'text' field (base64)`,
    codeExample: `// createParagraph handles base64 encoding automatically
const block = createParagraph(
  'intro',
  'Welcome! Please fill out your details below.',
)`,
    wireExample: `// Note: 'text' is at top level, NOT inside options
{
  "type": "Label",
  "scope": "#/properties/intro",
  "text": "VwBlAGwAYwBvAG0AZQ..."  // UTF-16LE base64
}`,
  },
  {
    controlName: 'ImageControl',
    displayName: 'Image',
    category: 'display',
    description:
      'Image display block with alt text, responsive width (100%/50%/30%), and automatic aspect ratio preservation.',
    hasValue: false,
    commonlyUsed: true,
    icon: '🖼️',
    factory: 'createImage',
    valueType: `// No value — display block only`,
    optionsType: `{
  url: string
  altText?: string
  width?: '100%' | '50%' | '30%'
}`,
    codeExample: `const block = createImage('banner', 'https://cdn.example.com/banner.png', {
  altText: 'Company banner',
  width: '100%',
})`,
    wireExample: `{
  "type": "ImageControl",
  "scope": "#/properties/banner",
  "options": {
    "url": "https://cdn.example.com/banner.png",
    "altText": "Company banner",
    "width": "100%"
  }
}`,
  },
  {
    controlName: 'SummaryControl',
    displayName: 'Summary',
    category: 'display',
    description:
      'Review block showing data collected from other blocks in a read-only view. Optional title overrides per referenced block.',
    hasValue: false,
    commonlyUsed: true,
    icon: '📋',
    factory: 'createSummary',
    valueType: `// No value — display block only`,
    optionsType: `{
  blocksInSummary?: Record<string, unknown>
  subTitle?: string
  fields?: unknown[]
}`,
    codeExample: `const block = createSummary('Summary', {
  subTitle: 'Review your order before submitting',
})`,
    wireExample: `{
  "type": "SummaryControl",
  "scope": "#/properties/Summary",
  "options": {
    "showPaper": true,
    "blocksInSummary": {},
    "subTitle": "Review your order before submitting",
    "fields": []
  }
}`,
  },
  {
    controlName: 'GroupLayout',
    displayName: 'Group',
    category: 'display',
    description:
      'Visual grouping container for child blocks. Renders a card with a title wrapping nested blocks. Cannot be nested inside another GroupLayout.',
    hasValue: false,
    commonlyUsed: true,
    icon: '📐',
    factory: null,
    valueType: `// No value — layout container only`,
    optionsType: `{
  label?: string
  elements?: UISchemaElement[]
}`,
    codeExample: `const group = {
  type: 'GroupLayout',
  label: 'Contact Details',
  elements: [
    createTextInput({ name: 'firstName', label: 'First Name' }),
    createTextInput({ name: 'lastName', label: 'Last Name' }),
  ],
}`,
    wireExample: `{
  "type": "GroupLayout",
  "label": "Contact Details",
  "elements": [
    { "type": "Control", "scope": "#/properties/firstName" },
    { "type": "Control", "scope": "#/properties/lastName" }
  ]
}`,
  },
  {
    controlName: 'SecondaryActionBarControl',
    displayName: 'Hyperlinks',
    category: 'display',
    description: 'Renders a list of clickable hyperlinks with labels. Used as a secondary action bar.',
    hasValue: false,
    commonlyUsed: false,
    icon: '🔗',
    factory: null,
    valueType: `// No value — display block only`,
    optionsType: `{
  links?: Array<{ label: string; url: string }>
}`,
    codeExample: `const block = createBlock('SecondaryActionBarControl', {
  name: 'links',
  options: {
    links: [
      { label: 'Privacy Policy', url: 'https://example.com/privacy' },
    ],
  },
})`,
    wireExample: `{
  "type": "SecondaryActionBarControl",
  "scope": "#/properties/links",
  "options": {
    "links": [{ "label": "Privacy Policy", "url": "https://…" }]
  }
}`,
  },

  // ── Navigation ────────────────────────────────────────────────
  {
    controlName: 'ActionBarControl',
    displayName: 'Action Bar',
    category: 'navigation',
    description:
      'Navigation bar with CTA button, optional back button, and up to 4 inline consent checkboxes. Use actionType "SubmitAndGoNext" on the final step.',
    hasValue: false,
    commonlyUsed: true,
    icon: '▶️',
    factory: 'createActionBar',
    valueType: `// No value — navigation block only`,
    optionsType: `{
  ctaButton: {
    actionType: 'GoNext' | 'SubmitAndGoNext'
    isVisible: boolean
    label: string
  }
  goBackButton: {
    actionType: 'GoBack'
    label: string
    isVisible: boolean
  }
  consents?: Array<{
    name: string
    isRequired: boolean
    isVisible: boolean
    text: string | null
  }>
}`,
    codeExample: `// Simple "Next" button
const next = createActionBar('Next', { label: 'Continue' })

// Submit with inline consent
const submit = createActionBar('Action bar', {
  label: 'Submit',
  actionType: 'SubmitAndGoNext',
  showBack: true,
  consents: [{
    name: 'first_consent',
    isRequired: true,
    isVisible: true,
    text: 'I agree to the [Privacy Policy](https://example.com)',
  }],
})`,
    wireExample: `{
  "type": "ActionBarControl",
  "scope": "#/properties/Action bar",
  "options": {
    "showPaper": false,
    "ctaButton": {
      "actionType": "SubmitAndGoNext",
      "isVisible": true,
      "label": "Submit"
    },
    "goBackButton": {
      "actionType": "GoBack",
      "label": "Back",
      "isVisible": true
    },
    "consents": [{
      "name": "first_consent",
      "isRequired": true,
      "isVisible": true,
      "text": "I agree to the [Privacy Policy](https://…)"
    }]
  }
}`,
  },
  {
    controlName: 'ConfirmationMessageControl',
    displayName: 'Success Message',
    category: 'navigation',
    description:
      'Success/thank-you message shown after submission. Configurable title, body text, icon, and optional close/CTA button. Always the last block on the last step.',
    hasValue: false,
    commonlyUsed: true,
    icon: '🎉',
    factory: 'createSuccessMessage',
    valueType: `// No value — navigation block only`,
    optionsType: `{
  title?: string
  text?: string
  icon?: string           // e.g. 'check-circle-fill'
  showCloseButton?: boolean
  closeButtonText?: string
}`,
    codeExample: `const block = createSuccessMessage('Thank you', {
  title: 'Thank you for your inquiry!',
  text: 'Our team will contact you within 24 hours.',
  icon: 'check-circle-fill',
  closeButtonText: 'Back to Homepage',
})`,
    wireExample: `{
  "type": "ConfirmationMessageControl",
  "scope": "#/properties/Thank you",
  "options": {
    "title": "Thank you!",
    "text": "Our team will contact you within 24 hours.",
    "icon": "check-circle-fill",
    "showCloseButton": true,
    "closeButtonText": "Back to Homepage"
  }
}`,
  },

  // ── Utility ───────────────────────────────────────────────────
  {
    controlName: 'AuthControl',
    displayName: 'Authentication',
    category: 'utility',
    description:
      'Sign-in / sign-up / skip authentication flow for portal users. Required for private journeys or when personalizing content based on the logged-in user.',
    hasValue: true,
    commonlyUsed: false,
    icon: '🔐',
    factory: null,
    valueType: `Record<string, unknown>  // auth session data`,
    optionsType: `{ required?: boolean; allowSkip?: boolean; redirectUrl?: string }`,
    codeExample: `const block = createBlock('AuthControl', {
  name: 'auth',
  options: { allowSkip: false },
})`,
    wireExample: `{
  "type": "AuthControl",
  "scope": "#/properties/auth",
  "options": { "allowSkip": false }
}`,
  },
  {
    controlName: 'PdfSummaryControl',
    displayName: 'PDF Generator',
    category: 'utility',
    description:
      'Generates a PDF from a DocX template with journey submission data and displays a download link. Configured with a template file ID.',
    hasValue: false,
    commonlyUsed: false,
    icon: '📑',
    factory: null,
    valueType: `// No value — utility block only`,
    optionsType: `{
  templateFileId?: string
  fileName?: string
}`,
    codeExample: `const block = createBlock('PdfSummaryControl', {
  name: 'contractPdf',
  options: {
    templateFileId: 'template-abc-123',
    fileName: 'Contract.pdf',
  },
})`,
    wireExample: `{
  "type": "PdfSummaryControl",
  "scope": "#/properties/contractPdf",
  "options": {
    "templateFileId": "template-abc-123",
    "fileName": "Contract.pdf"
  }
}`,
  },
  {
    controlName: 'PVRoofPlannerControl',
    displayName: 'PV Rooftop Planner',
    category: 'utility',
    description:
      'Solar panel roof planner. Captures roof coordinates, panel count, lifetime, CO2 savings, and sunshine hours via an interactive map.',
    hasValue: true,
    commonlyUsed: false,
    icon: '☀️',
    factory: 'createPVRoofPlanner',
    valueType: `interface PVRooftopValue {
  coordinates: string | undefined
  maxArrayAreaMeters2?: number
  maxSunshineHoursPerYear?: number
  solarPanelsUserCount?: number
  panelLifetimeYears?: number
  co2Savings?: number
  maxArrayPanelsCount?: number
}`,
    optionsType: `{ required?: boolean }`,
    codeExample: `const block = createPVRoofPlanner({
  name: 'roofPlanner',
  label: 'Plan Your Solar Installation',
  options: { panelLifetimeYears: 25 },
})`,
    wireExample: `{
  "type": "PVRoofPlannerControl",
  "scope": "#/properties/roofPlanner",
  "options": { "required": true }
}`,
  },
  {
    controlName: 'JourneyLauncherControl',
    displayName: 'Journey Launcher',
    category: 'utility',
    description:
      'Launches sub-journeys from within a parent journey. Used in launcher-type journeys to present multiple journey options.',
    hasValue: false,
    commonlyUsed: false,
    icon: '🚀',
    factory: null,
    valueType: `// No value — navigation block only`,
    optionsType: `{
  journeyIds?: string[]
  launchMode?: 'inline' | 'redirect'
}`,
    codeExample: `const block = createBlock('JourneyLauncherControl', {
  name: 'launcher',
  options: {
    journeyIds: ['journey-1', 'journey-2'],
    launchMode: 'inline',
  },
})`,
    wireExample: `{
  "type": "JourneyLauncherControl",
  "scope": "#/properties/launcher",
  "options": {
    "journeyIds": ["journey-1"],
    "launchMode": "inline"
  }
}`,
  },
  {
    controlName: 'DynamicMeterReadingControl',
    displayName: 'Dynamic Meter Reading',
    category: 'utility',
    description:
      'Enhanced meter reading with entity-updating capabilities. Dynamically fetches meter data from existing epilot entities.',
    hasValue: true,
    commonlyUsed: false,
    icon: '⚡',
    factory: null,
    valueType: `interface MeterReadingValue {
  maloId?: string
  meterId?: string
  meterType?: string
  readBy?: string
  readingDate?: Date | string | null
  readingValue?: number | null
  reason?: string
}`,
    optionsType: `{ required?: boolean; entitySlug?: string }`,
    codeExample: `const block = createBlock('DynamicMeterReadingControl', {
  name: 'meterReading',
  label: 'Meter Reading',
  required: true,
  options: { entitySlug: 'meter' },
})`,
    wireExample: `{
  "type": "DynamicMeterReadingControl",
  "scope": "#/properties/meterReading",
  "options": { "required": true, "entitySlug": "meter" }
}`,
  },

  // ── Third-party ───────────────────────────────────────────────
  {
    controlName: 'AppBlockControl',
    displayName: 'App Block',
    category: 'third-party',
    description:
      'Renders an installed epilot app inside the journey. Configured with appId, componentId, and arbitrary args. Replaces CustomBlock.',
    hasValue: true,
    commonlyUsed: false,
    icon: '📦',
    factory: null,
    valueType: `Record<string, unknown>  // app-defined value shape`,
    optionsType: `{
  appId?: string
  componentId?: string
  args?: Record<string, string>
}`,
    codeExample: `const block = createBlock('AppBlockControl', {
  name: 'calendly',
  options: {
    appId: 'calendly-app',
    componentId: 'booking-widget',
    args: { eventUrl: 'https://calendly.com/my-event' },
  },
})`,
    wireExample: `{
  "type": "AppBlockControl",
  "scope": "#/properties/calendly",
  "options": {
    "appId": "calendly-app",
    "componentId": "booking-widget",
    "args": { "eventUrl": "https://calendly.com/my-event" }
  }
}`,
  },
  {
    controlName: 'CustomBlockControl',
    displayName: 'Custom Block (Legacy)',
    category: 'third-party',
    description:
      'Custom web component rendered via tag name and bundle URL. Deprecated — use AppBlockControl for new integrations.',
    hasValue: true,
    commonlyUsed: false,
    deprecated: true,
    icon: '🔧',
    factory: null,
    valueType: `Record<string, unknown>`,
    optionsType: `{
  tagName?: string
  bundleUrl?: string
  args?: Record<string, string>
}`,
    codeExample: `const block = createBlock('CustomBlockControl', {
  name: 'customWidget',
  options: {
    tagName: 'my-custom-block',
    bundleUrl: 'https://cdn.example.com/block.js',
    args: { theme: 'dark' },
  },
})`,
    wireExample: `{
  "type": "CustomBlockControl",
  "scope": "#/properties/customWidget",
  "options": {
    "tagName": "my-custom-block",
    "bundleUrl": "https://cdn.example.com/block.js"
  }
}`,
  },
];

// ─── Derived helpers ──────────────────────────────────────────────

export const CATEGORIES: BlockCategory[] = [
  'input',
  'composite',
  'commerce',
  'display',
  'navigation',
  'utility',
  'third-party',
];

export const CATEGORY_LABELS: Record<BlockCategory, string> = {
  input: 'Input',
  composite: 'Composite',
  commerce: 'Commerce',
  display: 'Display',
  navigation: 'Navigation',
  utility: 'Utility',
  'third-party': 'Third-party',
};

export const CATEGORY_ICONS: Record<BlockCategory, string> = {
  input: '✏️',
  composite: '🧩',
  commerce: '💰',
  display: '👁️',
  navigation: '🧭',
  utility: '⚙️',
  'third-party': '🔌',
};

export const CATEGORY_COLORS: Record<BlockCategory, { bg: string; text: string; border: string }> = {
  input: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
  composite: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
  commerce: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' },
  display: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100' },
  navigation: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-100' },
  utility: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' },
  'third-party': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100' },
};
