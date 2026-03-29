// ─── JourneyClient API Reference ─────────────────────────────────

export interface ApiMethod {
  name: string;
  signature: string;
  description: string;
  returns: string;
  example: string;
  group: 'journey' | 'block' | 'step' | 'factory';
  alpha?: boolean;
}

export const CLIENT_API_METHODS: ApiMethod[] = [
  // ── Constructor ──────────────────────────────────────────────
  {
    name: 'new JourneyClient',
    group: 'journey',
    alpha: true,
    signature: 'new JourneyClient({ auth, apiUrl? })',
    description:
      'Creates a headless client. Pass a static token string or an async getter function for token refresh.',
    returns: 'JourneyClient instance',
    example: `import { JourneyClient } from '@epilot/epilot-journey-sdk'

// Static token
const client = new JourneyClient({ auth: 'your-api-token' })

// Async token getter (for token refresh)
const client = new JourneyClient({
  auth: async () => getAccessToken(),
  apiUrl: 'https://journey-config.dev.sls.epilot.io',
})`,
  },

  // ── Journey CRUD ─────────────────────────────────────────────
  {
    name: 'getJourney',
    group: 'journey',
    signature: 'client.getJourney(id: string): Promise<JourneyRaw>',
    description: 'Fetch the full configuration of a journey by UUID. Returns the complete JourneyRaw object with steps, schema, and uischema.',
    returns: 'Promise<JourneyRaw>',
    example: `const journey = await client.getJourney('509cdffe-424f-457a-95c2-9708c304ce77')
console.log(journey.name)          // 'Energy Contract Signup'
console.log(journey.steps.length)  // 4`,
  },
  {
    name: 'searchJourneys',
    group: 'journey',
    signature: 'client.searchJourneys(options?: { query, from, size, sort }): Promise<unknown[]>',
    description:
      'Search journeys by name with pagination. Defaults to wildcard query (*), 25 results, sorted by creation date descending.',
    returns: 'Promise<unknown[]>',
    example: `const results = await client.searchJourneys({ query: 'contact', size: 5 })
results.forEach((j: any) => console.log(j.journey_name))`,
  },
  {
    name: 'createJourney',
    group: 'journey',
    signature: 'client.createJourney(payload: Record<string, unknown>): Promise<JourneyRaw>',
    description:
      'Create a new journey from a payload. Best used together with the createJourney() factory function which builds a valid payload from steps.',
    returns: 'Promise<JourneyRaw> — includes the assigned journeyId',
    example: `const payload = createJourney({
  organizationId: 'org-123',
  name: 'Energy Contract Signup',
  steps: [ /* createStep() results */ ],
})

const created = await client.createJourney(payload)
console.log(created.journeyId)`,
  },
  {
    name: 'updateJourney',
    group: 'journey',
    signature: 'client.updateJourney(journey: JourneyRaw): Promise<void>',
    description: 'Fully replace a journey\'s configuration (PUT semantics). Typically used after fetching, modifying, and re-saving.',
    returns: 'Promise<void>',
    example: `const journey = await client.getJourney('journey-id')
journey.name = 'Updated Name'
await client.updateJourney(journey)`,
  },
  {
    name: 'patchJourney',
    group: 'journey',
    signature: 'client.patchJourney(id: string, patch: Record<string, unknown>): Promise<JourneyRaw>',
    description:
      'Partially update a journey. Supports nested property paths in the patch keys, e.g. steps[0].uischema. More efficient than a full update.',
    returns: 'Promise<JourneyRaw>',
    example: `// Update just the journey name
await client.patchJourney('journey-id', { name: 'New Name' })

// Update a nested step uischema
await client.patchJourney('journey-id', {
  'steps[0].uischema': newUischema,
})`,
  },
  {
    name: 'deleteJourney',
    group: 'journey',
    signature: 'client.deleteJourney(id: string): Promise<void>',
    description: 'Delete a journey by UUID.',
    returns: 'Promise<void>',
    example: `await client.deleteJourney('journey-id')`,
  },

  // ── Block operations ─────────────────────────────────────────
  {
    name: 'getBlocks',
    group: 'block',
    alpha: true,
    signature: 'client.getBlocks(journey: JourneyRaw): Array<{ stepIndex: number; block: UISchemaElement }>',
    description:
      'Returns all blocks across all steps, each tagged with its stepIndex. Does not make an API call — pass an already-fetched journey.',
    returns: 'Array<{ stepIndex: number; block: UISchemaElement }>',
    example: `const journey = await client.getJourney('journey-id')
const blocks = client.getBlocks(journey)

blocks.forEach(({ stepIndex, block }) => {
  console.log(\`Step \${stepIndex}: \${block.type} — \${block.label}\`)
})`,
  },
  {
    name: 'getStepBlocks',
    group: 'block',
    alpha: true,
    signature: 'client.getStepBlocks(journey: JourneyRaw, stepIndex: number): UISchemaElement[]',
    description: 'Returns all blocks from a specific step by zero-based index. Does not make an API call.',
    returns: 'UISchemaElement[]',
    example: `const journey = await client.getJourney('journey-id')
const step0Blocks = client.getStepBlocks(journey, 0)
console.log(step0Blocks.map(b => b.type))`,
  },
  {
    name: 'getBlock',
    group: 'block',
    alpha: true,
    signature: 'client.getBlock(id: string, ref: BlockRef): Promise<UISchemaElement | undefined>',
    description:
      'Fetch a journey and locate a specific block by step index and block name (scope path). Returns undefined if not found.',
    returns: 'Promise<UISchemaElement | undefined>',
    example: `const block = await client.getBlock('journey-id', {
  stepIndex: 0,
  blockName: '#/properties/email',
})
if (block) {
  console.log(block.label, block.options)
}`,
  },
  {
    name: 'patchBlock',
    group: 'block',
    alpha: true,
    signature: 'client.patchBlock(id: string, ref: BlockRef, patch: Partial<UISchemaElement>): Promise<JourneyRaw>',
    description:
      'Fetch the journey, locate the block, merge the patch into it, and save via the patch API. Only the affected step\'s uischema is sent.',
    returns: 'Promise<JourneyRaw>',
    example: `await client.patchBlock('journey-id', {
  stepIndex: 0,
  blockName: '#/properties/email',
}, {
  label: 'Work Email',
  options: { required: true },
})`,
  },
  {
    name: 'addBlock',
    group: 'block',
    alpha: true,
    signature: 'client.addBlock(id: string, stepIndex: number, block: UISchemaElement, position?: number): Promise<JourneyRaw>',
    description: 'Add a block to a step at the given position (or at the end if omitted) and persist via the patch API.',
    returns: 'Promise<JourneyRaw>',
    example: `await client.addBlock('journey-id', 0,
  createTextInput({ name: 'phone', label: 'Phone Number' }),
)`,
  },
  {
    name: 'removeBlock',
    group: 'block',
    alpha: true,
    signature: 'client.removeBlock(id: string, ref: BlockRef): Promise<JourneyRaw>',
    description: 'Remove a block from a journey step and persist via the patch API. Returns the journey unchanged if the block is not found.',
    returns: 'Promise<JourneyRaw>',
    example: `await client.removeBlock('journey-id', {
  stepIndex: 0,
  blockName: '#/properties/fax',
})`,
  },

  // ── Step operations ───────────────────────────────────────────
  {
    name: 'getSteps',
    group: 'step',
    alpha: true,
    signature: 'client.getSteps(id: string): Promise<StepConfig[]>',
    description: 'Fetch all steps from a journey.',
    returns: 'Promise<StepConfig[]>',
    example: `const steps = await client.getSteps('journey-id')
steps.forEach((step, i) => console.log(\`Step \${i}: \${step.name}\`))`,
  },
  {
    name: 'getStep',
    group: 'step',
    alpha: true,
    signature: 'client.getStep(id: string, stepIndex: number): Promise<StepConfig | undefined>',
    description: 'Fetch a specific step by zero-based index.',
    returns: 'Promise<StepConfig | undefined>',
    example: `const step = await client.getStep('journey-id', 2)
console.log(step?.name, step?.title)`,
  },
];

// ─── Factory Functions Reference ──────────────────────────────────

export interface FactoryEntry {
  name: string;
  producesType: string;
  description: string;
  signature: string;
  example: string;
  note?: string;
  alpha?: boolean;
}

export const FACTORY_FUNCTIONS: FactoryEntry[] = [
  {
    name: 'createBlock',
    alpha: true,
    producesType: 'Any block',
    description: 'Low-level factory that creates any block type by control name. Use typed factories when available.',
    signature: 'createBlock(type: ControlNameValue, opts: CreateBlockOptions): UISchemaElement',
    example: `const block = createBlock('AccountControl', {
  name: 'company',
  label: 'Company Details',
  required: true,
  showPaper: true,
})`,
  },
  {
    name: 'createTextInput',
    alpha: true,
    producesType: 'Control (text)',
    description: 'Creates a free-form text input block.',
    signature: 'createTextInput(opts: CreateBlockOptions): UISchemaElement',
    example: `const block = createTextInput({
  name: 'notes',
  label: 'Additional Notes',
  options: { multiline: true, placeholder: 'Enter notes…' },
})`,
  },
  {
    name: 'createSingleChoice',
    alpha: true,
    producesType: 'Control (single choice)',
    description:
      'Creates a single-choice selector. Accepts a friendly choices[] array and auto-converts to parallel arrays (v3 format).',
    signature: 'createSingleChoice(opts: CreateBlockOptions & { options?: { choices?: Choice[] } }): UISchemaElement',
    example: `const block = createSingleChoice({
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
    note: 'Choices array is converted to parallel options/optionsLabels/optionsIcons arrays in the wire format.',
  },
  {
    name: 'createMultipleChoice',
    alpha: true,
    producesType: 'MultichoiceControl',
    description:
      'Creates a multi-select block. Accepts a friendly choices[] array and auto-converts to parallel arrays (v3 format).',
    signature: 'createMultipleChoice(opts: CreateBlockOptions & { options?: { choices?: Choice[] } }): UISchemaElement',
    example: `const block = createMultipleChoice({
  name: 'interests',
  options: {
    uiType: 'checkbox',
    choices: [
      { label: 'Solar', value: 'solar' },
      { label: 'Wind', value: 'wind' },
    ],
  },
})`,
    note: 'Choices array is converted to parallel options/optionsLabels/optionsIcons arrays in the wire format.',
  },
  {
    name: 'createBinaryInput',
    alpha: true,
    producesType: 'BooleanControl',
    description: 'Creates a yes/no toggle (switch or checkbox).',
    signature: 'createBinaryInput(opts: CreateBlockOptions): UISchemaElement',
    example: `const block = createBinaryInput({
  name: 'newsletter',
  label: 'Subscribe to newsletter',
})`,
  },
  {
    name: 'createNumberInput',
    alpha: true,
    producesType: 'NumberInputControl',
    description:
      'Creates a numeric input. Options for unit, range, and format are nested under fields.numberInput as required by the renderer.',
    signature: 'createNumberInput(opts: CreateBlockOptions & { unit?, range?, format?, suggestions? }): UISchemaElement',
    example: `const block = createNumberInput({
  name: 'Consumption',
  label: 'Annual Consumption',
  unit: { show: true, label: 'kWh' },
  range: { min: 0, max: 100000 },
})`,
    note: 'Unit/range/format options are automatically nested under fields.numberInput in the wire format.',
  },
  {
    name: 'createDatePicker',
    alpha: true,
    producesType: 'DatePickerControl',
    description: 'Creates a date or date-range picker.',
    signature: 'createDatePicker(opts: CreateBlockOptions): UISchemaElement',
    example: `const block = createDatePicker({
  name: 'moveDate',
  label: 'Moving Date',
  required: true,
  options: { showTime: false, disableDays: [0, 6] },
})`,
  },
  {
    name: 'createPersonalInformation',
    alpha: true,
    producesType: 'PersonalInformationControl',
    description: 'Creates a personal info block. Defaults showPaper to true.',
    signature: 'createPersonalInformation(opts: CreateBlockOptions): UISchemaElement',
    example: `const block = createPersonalInformation({
  name: 'Contact Info',
  required: true,
  options: {
    customerType: 'PRIVATE',
    fields: {
      firstName: { required: true },
      email: { required: true },
    },
  },
})`,
  },
  {
    name: 'createContact',
    alpha: true,
    producesType: 'ContactControl',
    description: 'Creates a contact block. Defaults showPaper to true.',
    signature: 'createContact(opts: CreateBlockOptions): UISchemaElement',
    example: `const block = createContact({
  name: 'Contact',
  required: true,
  options: {
    purpose: ['customer'],
    fields: { firstName: { required: true }, email: { required: true } },
  },
})`,
  },
  {
    name: 'createAddress',
    alpha: true,
    producesType: 'AddressControl',
    description: 'Creates an address block. Defaults showPaper to true.',
    signature: 'createAddress(opts: CreateBlockOptions): UISchemaElement',
    example: `const block = createAddress({
  name: 'Address',
  required: true,
  options: {
    countryAddressSettings: { countryCode: 'DE', enableAutoComplete: true },
    fields: { zipCity: { required: true }, streetName: { required: true } },
  },
})`,
  },
  {
    name: 'createProductSelection',
    alpha: true,
    producesType: 'ProductSelectionControl',
    description: 'Creates a product selection block.',
    signature: 'createProductSelection(opts: CreateBlockOptions): UISchemaElement',
    example: `const block = createProductSelection({
  name: 'products',
  label: 'Choose your plan',
  required: true,
  options: {
    catalog: 'epilot',
    productsType: 'static',
    selection: 'one',
    products: [{ productId: 'prod-1', priceId: 'price-1' }],
  },
})`,
  },
  {
    name: 'createConsents',
    alpha: true,
    producesType: 'ConsentsControl',
    description: 'Creates a GDPR consent block.',
    signature: 'createConsents(opts: CreateBlockOptions): UISchemaElement',
    example: `const block = createConsents({
  name: 'consents',
  required: true,
  options: {
    items: {
      'gtc': { required: true, topics: ['GTC'], text: 'I agree…', order: 0 },
    },
  },
})`,
  },
  {
    name: 'createFileUpload',
    alpha: true,
    producesType: 'UploadPanelControl',
    description: 'Creates a file upload block.',
    signature: 'createFileUpload(opts: CreateBlockOptions): UISchemaElement',
    example: `const block = createFileUpload({
  name: 'documents',
  options: { maxQuantity: 5, supportedTypes: ['PDF', 'Image'] },
})`,
  },
  {
    name: 'createPaymentMethod',
    alpha: true,
    producesType: 'PaymentControl',
    description: 'Creates a payment method selector. Defaults showPaper to true.',
    signature: 'createPaymentMethod(opts: CreateBlockOptions): UISchemaElement',
    example: `const block = createPaymentMethod({
  name: 'payment',
  required: true,
  options: {
    implementations: [
      { type: 'SEPA', label: 'SEPA Direct Debit', show: true },
      { type: 'BankTransfer', label: 'Invoice', show: true },
    ],
  },
})`,
  },
  {
    name: 'createParagraph',
    alpha: true,
    producesType: 'Label',
    description:
      'Creates a rich text paragraph. Text is automatically UTF-16LE base64-encoded. Do not pass HTML — the builder WYSIWYG renders raw tags as text.',
    signature: 'createParagraph(name: string, text: string, label?: string): UISchemaElement',
    example: `const block = createParagraph(
  'intro',
  'Welcome! Please fill out the form below to get started.',
)`,
    note: 'The resulting "text" field is placed at the top level of the element, not inside options. This is a v3 format requirement.',
  },
  {
    name: 'createImage',
    alpha: true,
    producesType: 'ImageControl',
    description: 'Creates an image display block.',
    signature: 'createImage(name: string, url: string, opts?: { altText?, width? }): UISchemaElement',
    example: `const block = createImage('banner', 'https://cdn.example.com/banner.png', {
  altText: 'Company banner',
  width: '100%',
})`,
  },
  {
    name: 'createActionBar',
    alpha: true,
    producesType: 'ActionBarControl',
    description:
      'Creates a navigation bar with CTA and back buttons. Consents array defaults to 4 hidden items (required by the renderer).',
    signature: 'createActionBar(name: string, opts?: { label?, actionType?, showBack?, consents? }): UISchemaElement',
    example: `// Next button
const next = createActionBar('Next', { label: 'Continue' })

// Submit + back
const submit = createActionBar('Action bar', {
  label: 'Submit',
  actionType: 'SubmitAndGoNext',
  showBack: true,
})`,
  },
  {
    name: 'createSuccessMessage',
    alpha: true,
    producesType: 'ConfirmationMessageControl',
    description: 'Creates a success/thank-you message block.',
    signature: 'createSuccessMessage(name: string, opts?: { title?, text?, icon?, closeButtonText? }): UISchemaElement',
    example: `const block = createSuccessMessage('Thank you', {
  title: 'Thank you!',
  text: 'We will be in touch soon.',
  closeButtonText: 'Back to Homepage',
})`,
  },
  {
    name: 'createSummary',
    alpha: true,
    producesType: 'SummaryControl',
    description: 'Creates a summary/review block.',
    signature: 'createSummary(name: string, opts?: { subTitle? }): UISchemaElement',
    example: `const block = createSummary('Summary', {
  subTitle: 'Review your order before submitting',
})`,
  },
  {
    name: 'createShoppingCart',
    alpha: true,
    producesType: 'ShopCartControl',
    description: 'Creates a shopping cart display block.',
    signature: 'createShoppingCart(name: string, opts?: { cartTitle?, cartFootnote? }): UISchemaElement',
    example: `const block = createShoppingCart('cart', {
  cartTitle: 'Your Order',
  cartFootnote: '* Prices include VAT',
})`,
  },
  {
    name: 'createStep',
    alpha: true,
    producesType: 'StepConfig',
    description:
      'Creates a complete step config with auto-generated schema and uischema. Extracts property names from block scopes and infers schema types. Assigns variablePath to stateful blocks.',
    signature: 'createStep(opts: CreateStepOptions): StepConfig',
    example: `const step = createStep({
  name: 'Personal Details',
  showStepper: true,
  blocks: [
    createPersonalInformation({ name: 'personalInfo', required: true }),
    createAddress({ name: 'address', required: true }),
    createActionBar('Next', { label: 'Continue' }),
  ],
})`,
    note: 'Use sidebarBlocks with layout: "MainContentCartLayout" to show a shopping cart in a sidebar column.',
  },
  {
    name: 'createJourney',
    alpha: true,
    producesType: 'Record<string, unknown>',
    description: 'Builds a full journey payload ready for client.createJourney().',
    signature: 'createJourney(opts: CreateJourneyOptions): Record<string, unknown>',
    example: `const payload = createJourney({
  organizationId: 'org-123',
  name: 'Energy Contract Signup',
  settings: {
    designId: 'design-abc',
    language: 'de',
    runtimeEntities: ['ORDER'],
    embedOptions: { mode: 'full-screen', topBar: true },
  },
  steps: [
    createStep({ name: 'Step 1', blocks: [/* … */] }),
    createStep({ name: 'Confirmation', blocks: [/* … */] }),
  ],
})

const created = await client.createJourney(payload)`,
  },
];
