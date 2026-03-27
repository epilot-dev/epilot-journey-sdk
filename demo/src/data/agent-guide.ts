// ─── Agent Guide Data ────────────────────────────────────────────
// Documentation specifically for AI agents creating journeys.

export interface AgentRule {
  title: string;
  explanation: string;
  bad?: string;
  good?: string;
}

export const AGENT_RULES: AgentRule[] = [
  {
    title: 'Always use factory functions',
    explanation:
      'Factory functions produce valid v3 wire format automatically. Avoid constructing raw UISchemaElement objects unless no factory exists for the block type.',
    bad: `// Don't: raw object — easy to get wrong
{
  type: 'Control',
  scope: '#/properties/email',
  options: {
    choices: [{ label: 'A', value: 'a' }],  // WRONG
  }
}`,
    good: `// Do: factory handles wire format details
createSingleChoice({
  name: 'email',
  options: {
    choices: [{ label: 'A', value: 'a' }],
  },
})`,
  },
  {
    title: 'Choices use parallel arrays, not objects',
    explanation:
      'The v3 wire format stores single/multiple choice options as three parallel arrays: options[] (values), optionsLabels[] (display), optionsIcons[] (optional). The createSingleChoice() and createMultipleChoice() factories auto-convert from the friendlier choices[] format.',
    bad: `// Don't: choices array does NOT exist in wire format
{
  "type": "Control",
  "options": {
    "choices": [{ "label": "Basic", "value": "basic" }]
  }
}`,
    good: `// Do: parallel arrays (createSingleChoice handles this)
{
  "type": "Control",
  "options": {
    "options": ["basic"],
    "optionsLabels": ["Basic"]
  }
}`,
  },
  {
    title: 'Paragraph text is base64-encoded UTF-16LE',
    explanation:
      'The Label (Paragraph) block stores its text as base64-encoded UTF-16LE at the top-level text field — NOT inside options. Always use createParagraph() which handles encoding and placement automatically.',
    bad: `// Don't: plain text in options
{
  "type": "Label",
  "scope": "#/properties/intro",
  "options": { "text": "Welcome!" }  // WRONG placement
}`,
    good: `// Do: use createParagraph()
createParagraph('intro', 'Welcome!')
// → { "type": "Label", "scope": "...", "text": "VwBlAGwAYwBvAG0AZQA=" }`,
  },
  {
    title: 'Each step needs an ActionBar or hideNextButton',
    explanation:
      'Every step must have navigation. Either include a createActionBar() block (recommended) or set hideNextButton: false in createStep(). Without navigation, users cannot proceed.',
    bad: `// Don't: step with no navigation
createStep({
  name: 'Info',
  blocks: [
    createPersonalInformation({ name: 'pi' }),
    // No action bar!
  ],
})`,
    good: `// Do: include an action bar
createStep({
  name: 'Info',
  blocks: [
    createPersonalInformation({ name: 'pi' }),
    createActionBar('Next', { label: 'Continue' }),
  ],
})`,
  },
  {
    title: 'Last step uses SubmitAndGoNext, not GoNext',
    explanation:
      'The final step\'s ActionBar must use actionType: "SubmitAndGoNext" to trigger form submission. All other steps use the default "GoNext".',
    bad: `// Don't: GoNext on the last step won't submit
createActionBar('Submit', {
  label: 'Submit',
  actionType: 'GoNext',  // WRONG — won't submit
})`,
    good: `// Do: SubmitAndGoNext on the last data step
createActionBar('Action bar', {
  label: 'Submit',
  actionType: 'SubmitAndGoNext',
})`,
  },
  {
    title: 'Success message on a separate final step',
    explanation:
      'The ConfirmationMessageControl should be on its own final step with showStepper: false and hideNextButton: true. It is not combined with data blocks.',
    bad: `// Don't: success message mixed with data blocks
createStep({
  name: 'Submit',
  blocks: [
    createSummary('summary'),
    createSuccessMessage('thanks'),  // WRONG — on same step
  ],
})`,
    good: `// Do: success message on its own final step
createStep({
  name: 'Confirmation',
  showStepper: false,
  hideNextButton: true,
  blocks: [createSuccessMessage('thanks', { title: 'Thank you!' })],
})`,
  },
  {
    title: 'Block names must be unique within a step',
    explanation:
      'Block names map to property keys in the step\'s JSON schema. Duplicate names in the same step will overwrite each other. Names can repeat across different steps.',
    bad: `// Don't: duplicate names in same step
createStep({
  name: 'Info',
  blocks: [
    createTextInput({ name: 'address' }),
    createAddress({ name: 'address' }),  // COLLISION
  ],
})`,
    good: `// Do: unique names per step
createStep({
  name: 'Info',
  blocks: [
    createTextInput({ name: 'deliveryNotes' }),
    createAddress({ name: 'deliveryAddress' }),
  ],
})`,
  },
  {
    title: 'Use MainContentCartLayout when showing a shopping cart',
    explanation:
      'If a step contains a ShoppingCart block alongside other content, use layout: "MainContentCartLayout" and put the cart in sidebarBlocks. This renders a two-column layout with the cart on the right.',
    bad: `// Don't: cart in main blocks with linear layout
createStep({
  name: 'Products',
  blocks: [createProductSelection({ name: 'products' }), createShoppingCart('cart')],
})`,
    good: `// Do: cart in sidebar with cart layout
createStep({
  name: 'Products',
  layout: 'MainContentCartLayout',
  blocks: [createProductSelection({ name: 'products' })],
  sidebarBlocks: [createShoppingCart('cart')],
})`,
  },
  {
    title: 'Set runtimeEntities in journey settings',
    explanation:
      'For journeys that create epilot entities on submission, set runtimeEntities in the journey settings. Common values: ["ORDER"] for purchase flows, ["OPPORTUNITY"] for sales leads.',
    good: `createJourney({
  organizationId: 'org-123',
  name: 'Energy Signup',
  settings: {
    runtimeEntities: ['ORDER'],  // creates an Order on submit
    designId: 'design-abc',
    language: 'de',
  },
  steps: [ /* … */ ],
})`,
  },
];

export const WIRE_FORMAT_NOTES = [
  {
    field: 'scope',
    note: 'Always "#/properties/{blockName}". The blockName is the key in the step\'s JSON schema properties.',
  },
  {
    field: 'options.showPaper',
    note: 'Defaults to false. Set to true for composite blocks (PI, Address, Contact, Payment) that need a card background.',
  },
  {
    field: 'options.variablePath',
    note: 'Auto-generated by createStep() for stateful blocks. Format: "{stepName}_{blockName}" with non-alphanumeric chars replaced by "_".',
  },
  {
    field: 'options.required',
    note: 'Set on individual block options AND propagated to the step\'s JSON schema required[] array by createStep().',
  },
  {
    field: 'id',
    note: 'UUID auto-generated by createBlock(). Required by the renderer for element identity.',
  },
];

export const SALES_INQUIRY_EXAMPLE = `/**
 * epilot Sales Inquiry Journey — Full Example
 *
 * Usage:
 *   npx tsx examples/create-sales-inquiry.ts <API_TOKEN> <ORG_ID> [DESIGN_ID]
 */

import {
  createJourney, createStep,
  createTextInput, createPersonalInformation,
  createSingleChoice, createMultipleChoice,
  createActionBar, createSuccessMessage,
  createParagraph, createSummary,
  JourneyClient,
} from '@epilot/epilot-journey-sdk'

const client = new JourneyClient({ auth: process.env.API_TOKEN! })

const journey = createJourney({
  organizationId: 'org-123',
  name: 'epilot Sales Inquiry — Pricing Engine Playground',
  settings: {
    designId: 'design-abc',
    description: 'Sales inquiry form for prospects to request a callback.',
    embedOptions: { mode: 'full-screen', width: '100%', topBar: true },
    runtimeEntities: ['OPPORTUNITY'],
  },
  steps: [

    // ── Step 1: Plan selection ────────────────────────────────
    createStep({
      name: 'Choose Your Plan',
      showStepper: true,
      showStepperLabels: true,
      blocks: [
        createParagraph('intro',
          'Select the plan that best fits your business.'),

        createSingleChoice({
          name: 'plan',
          label: 'Which plan are you interested in?',
          required: true,
          options: {
            uiType: 'button',
            choices: [
              { label: 'Business', value: 'business', icon: 'briefcase' },
              { label: 'Professional', value: 'professional', icon: 'rocket' },
              { label: 'Enterprise', value: 'enterprise', icon: 'building' },
            ],
          },
        }),

        createSingleChoice({
          name: 'Team Size',
          label: 'How large is your team?',
          options: {
            uiType: 'button',
            choices: [
              { label: '1–10', value: '1-10' },
              { label: '11–50', value: '11-50' },
              { label: '51–200', value: '51-200' },
              { label: '200+', value: '200+' },
            ],
          },
        }),

        createActionBar('Next', { label: 'Continue' }),
      ],
    }),

    // ── Step 2: Business info ─────────────────────────────────
    createStep({
      name: 'About Your Business',
      showStepper: true,
      blocks: [
        createParagraph('businessIntro',
          'Help us understand your needs.'),

        createTextInput({
          name: 'businessDescription',
          label: 'What does your business do?',
          required: true,
          options: { multiline: true },
        }),

        createMultipleChoice({
          name: 'Interested Modules',
          label: 'Which epilot modules are you most interested in?',
          options: {
            uiType: 'checkbox',
            choices: [
              { label: 'Journey Builder', value: 'journey-builder' },
              { label: 'Entity Management', value: 'entity-management' },
              { label: 'Workflow Automation', value: 'workflow-automation' },
            ],
          },
        }),

        createActionBar('Next', { label: 'Continue' }),
      ],
    }),

    // ── Step 3: Contact details + submit ──────────────────────
    createStep({
      name: 'Your Contact Details',
      showStepper: true,
      blocks: [
        createPersonalInformation({
          name: 'Contact Info',
          required: true,
          options: {
            customerType: 'BUSINESS',
            purposeLabels: ['customer'],
            fields: {
              firstName: { required: true },
              lastName: { required: true },
              email: { required: true },
              telephone: { required: true },
              companyName: { required: true },
            },
          },
        }),

        createSummary('Summary', { subTitle: 'Review your inquiry' }),

        createActionBar('Action bar', {
          label: 'Submit Inquiry',
          actionType: 'SubmitAndGoNext',
          showBack: true,
          consents: [{
            name: 'first_consent',
            isRequired: true,
            isVisible: true,
            text: 'I agree to the [Privacy Policy](https://epilot.cloud/privacy)',
          }],
        }),
      ],
    }),

    // ── Step 4: Confirmation ──────────────────────────────────
    createStep({
      name: 'Confirmation',
      showStepper: false,
      hideNextButton: true,
      blocks: [
        createSuccessMessage('Thank you', {
          title: 'Thank you for your interest in epilot!',
          text: 'Our sales team will contact you within 24 hours.',
          closeButtonText: 'Back to Playground',
        }),
      ],
    }),
  ],
})

const created = await client.createJourney(journey)
console.log('Journey created:', created.journeyId)`;
