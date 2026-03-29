// ─── Example Journey Scripts ─────────────────────────────────────
// Source code for all example journeys, displayed as documentation
// in the playground. Each example includes metadata for the UI.

export interface ExampleEntry {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  highlights: string[];
  steps: Array<{
    name: string;
    icon: string;
    color: string;
    blocks: Array<{ fn: string; note: string }>;
  }>;
  source: string;
}

export const EXAMPLES: ExampleEntry[] = [
  {
    id: 'sales-inquiry',
    name: 'Sales Inquiry',
    icon: '💼',
    tagline: 'Lead capture with plan selection',
    description:
      'A 4-step lead generation journey: plan selection → business info → contact capture + GDPR consent → confirmation. Creates an OPPORTUNITY entity on submission.',
    highlights: [
      'Single-choice with icon buttons for plan selection',
      'Multiple-choice checkbox for module interests',
      'GDPR consent inline on the ActionBar',
      'Summary block before submit for user review',
      'runtimeEntities: OPPORTUNITY for CRM integration',
    ],
    steps: [
      {
        name: 'Choose Your Plan',
        icon: '📋',
        color: 'bg-blue-50 text-blue-700 border-blue-100',
        blocks: [
          { fn: 'createParagraph()', note: 'Intro text (auto-encoded)' },
          { fn: 'createSingleChoice()', note: 'Plan selection with icon buttons' },
          { fn: 'createSingleChoice()', note: 'Team size selection' },
          { fn: 'createActionBar()', note: 'GoNext → step 2' },
        ],
      },
      {
        name: 'About Your Business',
        icon: '🏢',
        color: 'bg-amber-50 text-amber-700 border-amber-100',
        blocks: [
          { fn: 'createParagraph()', note: 'Context text' },
          { fn: 'createTextInput()', note: 'Multiline business description' },
          { fn: 'createTextInput()', note: 'Use case description' },
          { fn: 'createMultipleChoice()', note: 'Module interest (checkbox)' },
          { fn: 'createActionBar()', note: 'GoNext → step 3' },
        ],
      },
      {
        name: 'Contact Details',
        icon: '👤',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        blocks: [
          { fn: 'createParagraph()', note: 'Contact intro' },
          { fn: 'createPersonalInformation()', note: 'Business mode, required fields' },
          { fn: 'createTextInput()', note: 'Additional notes (optional)' },
          { fn: 'createSummary()', note: 'Review all collected data' },
          { fn: 'createActionBar()', note: 'SubmitAndGoNext with GDPR consent' },
        ],
      },
      {
        name: 'Confirmation',
        icon: '🎉',
        color: 'bg-purple-50 text-purple-700 border-purple-100',
        blocks: [
          { fn: 'createSuccessMessage()', note: 'Thank-you with close button' },
        ],
      },
    ],
    source: `/**
 * epilot Sales Inquiry Journey – Pricing Engine Playground PoC
 *
 * Creates a journey that lets users:
 * 1. Pick their plan (Business / Professional / Enterprise)
 * 2. Tell us about their business and what they need epilot for
 * 3. Leave their contact info so sales can call them back
 * 4. Accept terms and submit
 *
 * Usage:
 *   npx tsx examples/create-sales-inquiry.ts <API_TOKEN> <ORG_ID> [DESIGN_ID]
 */

import {
  createJourney,
  createStep,
  createTextInput,
  createPersonalInformation,
  createSingleChoice,
  createMultipleChoice,
  createActionBar,
  createSuccessMessage,
  createParagraph,
  createSummary,
  JourneyClient,
} from '@epilot/epilot-journey-sdk'

const API_TOKEN = process.argv[2]
const ORG_ID = process.argv[3]
const DESIGN_ID = process.argv[4] || undefined

const client = new JourneyClient({ auth: API_TOKEN })

const journey = createJourney({
  organizationId: ORG_ID,
  name: 'epilot Sales Inquiry – Pricing Engine Playground',
  settings: {
    designId: DESIGN_ID || '',
    description: 'Sales inquiry form for the epilot Pricing Engine Playground.',
    embedOptions: { mode: 'full-screen', width: '100%', topBar: true },
    runtimeEntities: ['OPPORTUNITY'],
  },
  steps: [

    // ── Step 1: Pick your plan ────────────────────────────────
    createStep({
      name: 'Choose Your Plan',
      showStepName: true,
      showStepper: true,
      showStepperLabels: true,
      blocks: [
        createParagraph('intro',
          'Interested in epilot? Select the plan that best fits your business.'),

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

    // ── Step 2: Tell us about your business ───────────────────
    createStep({
      name: 'About Your Business',
      showStepName: true,
      showStepper: true,
      showStepperLabels: true,
      blocks: [
        createParagraph('businessIntro',
          'Help us understand your business so we can tailor the conversation.'),

        createTextInput({
          name: 'businessDescription',
          label: 'What does your business do?',
          required: true,
          options: { multiline: true },
        }),

        createTextInput({
          name: 'epilotUseCase',
          label: 'What would you like to use epilot for?',
          required: true,
          options: { multiline: true },
        }),

        createMultipleChoice({
          name: 'Interested Modules',
          label: 'Which epilot modules are you most interested in?',
          options: {
            uiType: 'checkbox',
            maxSelection: 99,
            choices: [
              { label: 'Journey Builder', value: 'journey-builder' },
              { label: 'Entity Management (360)', value: 'entity-management' },
              { label: 'Workflow Automation', value: 'workflow-automation' },
              { label: 'Customer Portal', value: 'customer-portal' },
              { label: 'Product & Pricing', value: 'product-pricing' },
              { label: 'Document Generation', value: 'document-generation' },
              { label: 'Email & Messaging', value: 'email-messaging' },
              { label: 'Integrations / API', value: 'integrations-api' },
            ],
          },
        }),

        createActionBar('Next', { label: 'Continue' }),
      ],
    }),

    // ── Step 3: Contact info + submit ─────────────────────────
    createStep({
      name: 'Your Contact Details',
      showStepName: true,
      showStepper: true,
      showStepperLabels: true,
      blocks: [
        createParagraph('contactIntro',
          'Leave your contact details and our sales team will reach out within 24 hours.'),

        createPersonalInformation({
          name: 'Contact Info',
          label: 'Contact Information',
          required: true,
          options: {
            customerType: 'BUSINESS',
            purposeLabels: ['customer'],
            title: 'Contact Information',
            fields: {
              salutation: {},
              firstName: { required: true },
              lastName: { required: true },
              email: { required: true },
              telephone: { required: true },
              companyName: { required: true },
            },
          },
        }),

        createTextInput({
          name: 'additionalNotes',
          label: 'Anything else you\\'d like us to know?',
          options: { multiline: true },
        }),

        createSummary('Summary', { subTitle: 'Review your inquiry' }),

        createActionBar('Action bar', {
          label: 'Submit Inquiry',
          actionType: 'SubmitAndGoNext',
          consents: [
            { name: 'first_consent', isRequired: true, isVisible: true, text: 'I agree to the [Privacy Policy](https://epilot.cloud/privacy).' },
            { name: 'second_consent', isRequired: false, isVisible: true, text: 'I would like to receive product updates from epilot.' },
            { name: 'third_consent', isRequired: false, isVisible: false, text: null },
            { name: 'fourth_consent', isRequired: false, isVisible: false, text: null },
          ],
        }),
      ],
    }),

    // ── Step 4: Confirmation ──────────────────────────────────
    createStep({
      name: 'Confirmation',
      showStepName: false,
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
console.log('Journey created:', created.journeyId)`,
  },

  {
    id: 'product-journey',
    name: 'Solar Product Journey',
    icon: '☀️',
    tagline: 'Availability check + roof planner + products',
    description:
      'A 6-step solar installation journey: availability check → PV roof planner → product selection with cart sidebar → contact + address → review → confirmation. Uses real product IDs.',
    highlights: [
      'AvailabilityCheck with Google Maps integration',
      'PVRoofPlanner for solar panel placement',
      'ProductSelection with pre-configured product/price IDs',
      'MainContentCartLayout for cart sidebar on 3 steps',
      'ShoppingCart block repeated across steps',
    ],
    steps: [
      {
        name: 'Check Availability',
        icon: '📍',
        color: 'bg-blue-50 text-blue-700 border-blue-100',
        blocks: [
          { fn: 'createParagraph()', note: 'Intro text' },
          { fn: 'createAvailabilityCheck()', note: 'Postal code + Google Maps' },
          { fn: 'createActionBar()', note: 'Check & Continue' },
        ],
      },
      {
        name: 'Roof Planner',
        icon: '🏠',
        color: 'bg-amber-50 text-amber-700 border-amber-100',
        blocks: [
          { fn: 'createParagraph()', note: 'Map intro' },
          { fn: 'createPVRoofPlanner()', note: 'Interactive rooftop planner' },
          { fn: 'createActionBar()', note: 'Continue to Products' },
        ],
      },
      {
        name: 'Select Products',
        icon: '📦',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        blocks: [
          { fn: 'createProductSelection()', note: '3 products with pricing' },
          { fn: 'createActionBar()', note: 'Continue' },
          { fn: 'createShoppingCart()', note: 'Sidebar: Your Solar Package' },
        ],
      },
      {
        name: 'Your Details',
        icon: '👤',
        color: 'bg-violet-50 text-violet-700 border-violet-100',
        blocks: [
          { fn: 'createPersonalInformation()', note: 'Private customer mode' },
          { fn: 'createAddress()', note: 'Installation address (DE)' },
          { fn: 'createActionBar()', note: 'Review Order' },
          { fn: 'createShoppingCart()', note: 'Sidebar: cart persists' },
        ],
      },
      {
        name: 'Review',
        icon: '📋',
        color: 'bg-rose-50 text-rose-700 border-rose-100',
        blocks: [
          { fn: 'createSummary()', note: 'Full order review' },
          { fn: 'createActionBar()', note: 'SubmitAndGoNext + 2 consents' },
          { fn: 'createShoppingCart()', note: 'Sidebar: final cart view' },
        ],
      },
      {
        name: 'Confirmation',
        icon: '🎉',
        color: 'bg-purple-50 text-purple-700 border-purple-100',
        blocks: [
          { fn: 'createSuccessMessage()', note: 'Order placed + CTA' },
        ],
      },
    ],
    source: `/**
 * Product Journey with Shopping Cart, Availability Check, and Map block.
 *
 * Uses real products/prices from org 739224 dev environment.
 * Creates via v1 with Cognito token for proper automation setup.
 *
 * Usage:
 *   npx tsx examples/create-product-journey.ts <COGNITO_TOKEN> <ORG_ID> [DESIGN_ID]
 */

import {
  createJourney,
  createStep,
  createAvailabilityCheck,
  createPVRoofPlanner,
  createProductSelection,
  createShoppingCart,
  createPersonalInformation,
  createAddress,
  createSummary,
  createParagraph,
  createActionBar,
  createSuccessMessage,
  JourneyClient,
} from '@epilot/epilot-journey-sdk'

const API_TOKEN = process.argv[2]
const ORG_ID = process.argv[3] ?? '739224'
const DESIGN_ID = process.argv[4] ?? 'e22481d9-256e-4d35-806b-cfbbde824392'

const client = new JourneyClient({ auth: API_TOKEN })

// Real products from org 739224 dev environment
const PRODUCTS = [
  { productId: '8e4d232b-b467-4a2b-8575-66e4b6e364cd', priceId: '2cbd6407-a316-418e-97a8-3d9e5b0a5957', isFeatured: true },
  { productId: '38211828-88e1-44ba-9b9d-6ca2f0a39a43', priceId: 'b66e1ac3-e4c0-4159-9e52-032489f76a2d', isFeatured: false },
  { productId: '9d402e77-4c88-49ab-8a07-4a81b9ba1861', priceId: '607687ac-52e8-4a3c-aa54-b78c171eb16a', isFeatured: false },
]

const journey = createJourney({
  name: 'Solar Product Journey – SDK Demo',
  organizationId: ORG_ID,
  settings: {
    designId: DESIGN_ID,
    templateId: '5aab47d0-205b-11ec-a39c-8975e6f9bf0e',
    runtimeEntities: ['ORDER'],
    safeModeAutomation: false,
  },
  steps: [

    // ── Step 1: Availability Check with Google Maps ───────────────
    createStep({
      name: 'Check Availability',
      title: 'Check Service Availability',
      showStepper: true,
      showStepperLabels: true,
      hideNextButton: true,
      blocks: [
        createParagraph('intro', 'Enter your address to check if our solar services are available in your area.'),

        createAvailabilityCheck({
          name: 'AvailabilityCheck',
          label: 'Service Availability',
          required: true,
          options: {
            countryCode: 'DE',
            availabilityMode: 'postalCode',
            enableAutoComplete: true,
            enableFreeText: false,
            googleMapsIntegrationOptions: {
              isGoogleMapsEnabled: true,
              isRepositioningAllowed: true,
            },
            fields: {
              zipCode: { required: true, label: 'Postal Code' },
            },
            postalCodeAvailabilityFields: {
              zipCity: { required: true },
              streetName: { required: true },
              houseNumber: { required: true },
            },
          },
        }),

        createActionBar('Next1', { label: 'Check & Continue' }),
      ],
    }),

    // ── Step 2: Roof Planner (Map Block) ─────────────────────────
    createStep({
      name: 'Roof Planner',
      title: 'Plan Your Solar Installation',
      showStepper: true,
      showStepperLabels: true,
      hideNextButton: true,
      blocks: [
        createParagraph('mapIntro', 'Use the map to mark your rooftop and calculate solar potential.'),

        createPVRoofPlanner({
          name: 'RoofPlanner',
          label: 'Rooftop Solar Planner',
          options: { panelLifetimeYears: 25 },
        }),

        createActionBar('Next2', { label: 'Continue to Products', showBack: true }),
      ],
    }),

    // ── Step 3: Product Selection + Cart Sidebar ─────────────────
    createStep({
      name: 'Select Products',
      title: 'Choose Your Solar Package',
      layout: 'MainContentCartLayout',
      showStepper: true,
      showStepperLabels: true,
      hideNextButton: true,
      blocks: [
        createProductSelection({
          name: 'Products',
          label: 'Available Solar Packages',
          required: true,
          options: {
            catalog: 'epilot',
            productSelectionConfiguratorType: 'product_selector',
            selectionType: 'many',
            showQuantity: false,
            showImages: true,
            displayPriceComponents: true,
            products: PRODUCTS,
          },
        }),

        createActionBar('Next3', { label: 'Continue', showBack: true }),
      ],
      sidebarBlocks: [
        createShoppingCart('Cart', {
          cartTitle: 'Your Solar Package',
          cartFootnote: 'All prices include VAT (19%).',
        }),
      ],
    }),

    // ── Step 4: Contact & Address ────────────────────────────────
    createStep({
      name: 'Your Details',
      title: 'Contact Information',
      layout: 'MainContentCartLayout',
      showStepper: true,
      showStepperLabels: true,
      hideNextButton: true,
      blocks: [
        createPersonalInformation({
          name: 'Contact Info',
          required: true,
          options: {
            customerType: 'PRIVATE',
            purposeLabels: ['customer'],
            title: 'Your Contact Details',
            fields: {
              salutation: {},
              firstName: { required: true },
              lastName: { required: true },
              email: { required: true },
              telephone: { required: true },
            },
          },
        }),

        createAddress({
          name: 'Address',
          required: true,
          options: {
            title: 'Installation Address',
            countryAddressSettings: {
              countryCode: 'DE',
              enableAutoComplete: true,
              enableFreeText: false,
            },
            fields: {
              zipCity: { required: true },
              streetName: { required: true },
              houseNumber: { required: true },
              extention: {},
            },
          },
        }),

        createActionBar('Next4', { label: 'Review Order', showBack: true }),
      ],
      sidebarBlocks: [
        createShoppingCart('Cart2', {
          cartTitle: 'Your Solar Package',
          cartFootnote: 'All prices include VAT (19%).',
        }),
      ],
    }),

    // ── Step 5: Summary & Submit ─────────────────────────────────
    createStep({
      name: 'Review',
      title: 'Review & Place Order',
      layout: 'MainContentCartLayout',
      showStepper: true,
      showStepperLabels: true,
      hideNextButton: true,
      blocks: [
        createSummary('Summary', { subTitle: 'Please review your solar installation order' }),

        createActionBar('Submit', {
          label: 'Place Order',
          actionType: 'SubmitAndGoNext',
          showBack: true,
          consents: [
            { name: 'first_consent', isRequired: true, isVisible: true, text: 'I accept the [Terms and Conditions](https://epilot.cloud/agb) and [Privacy Policy](https://epilot.cloud/privacy).' },
            { name: 'second_consent', isRequired: false, isVisible: true, text: 'I agree to receive updates about my solar installation via email.' },
            { name: 'third_consent', isRequired: false, isVisible: false, text: null },
            { name: 'fourth_consent', isRequired: false, isVisible: false, text: null },
          ],
        }),
      ],
      sidebarBlocks: [
        createShoppingCart('Cart3', {
          cartTitle: 'Your Solar Package',
          cartFootnote: 'All prices include VAT (19%).',
        }),
      ],
    }),

    // ── Step 6: Confirmation ─────────────────────────────────────
    createStep({
      name: 'Confirmation',
      showStepper: false,
      showStepName: false,
      hideNextButton: true,
      blocks: [
        createSuccessMessage('ThankYou', {
          title: 'Your solar order has been placed!',
          text: 'Thank you for choosing epilot Solar. Our team will review your rooftop assessment and contact you within 2 business days.',
          closeButtonText: 'Back to Homepage',
        }),
      ],
    }),
  ],
})

const created = await client.createJourney(journey)
console.log('Journey created:', created.journeyId)`,
  },

  {
    id: 'shopping-cart',
    name: 'Shopping Cart',
    icon: '🛒',
    tagline: 'Product selection with cart sidebar',
    description:
      'A 4-step commerce journey: product selection with cart sidebar → contact details → review + submit → confirmation. Demonstrates the MainContentCartLayout pattern.',
    highlights: [
      'MainContentCartLayout for sidebar cart',
      'ProductSelection with 3 products (multi-select)',
      'Business customer type on PersonalInformation',
      'ShoppingCart with custom title and footnote',
    ],
    steps: [
      {
        name: 'Select Products',
        icon: '📦',
        color: 'bg-blue-50 text-blue-700 border-blue-100',
        blocks: [
          { fn: 'createParagraph()', note: 'Catalog intro' },
          { fn: 'createProductSelection()', note: '3 products, multi-select' },
          { fn: 'createActionBar()', note: 'Continue to Checkout' },
          { fn: 'createShoppingCart()', note: 'Sidebar: Your Cart' },
        ],
      },
      {
        name: 'Your Details',
        icon: '👤',
        color: 'bg-amber-50 text-amber-700 border-amber-100',
        blocks: [
          { fn: 'createPersonalInformation()', note: 'Business mode + company name' },
          { fn: 'createActionBar()', note: 'Review Order' },
        ],
      },
      {
        name: 'Review',
        icon: '📋',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        blocks: [
          { fn: 'createSummary()', note: 'Order details review' },
          { fn: 'createActionBar()', note: 'SubmitAndGoNext + terms consent' },
        ],
      },
      {
        name: 'Confirmation',
        icon: '🎉',
        color: 'bg-purple-50 text-purple-700 border-purple-100',
        blocks: [
          { fn: 'createSuccessMessage()', note: 'Order placed + CTA' },
        ],
      },
    ],
    source: `/**
 * Shopping Cart Journey – demonstrates ProductSelection + ShoppingCart sidebar.
 *
 * Uses real products from org 739224 dev environment.
 *
 * Usage:
 *   npx tsx examples/create-shopping-cart-journey.ts <API_TOKEN> <ORG_ID> [DESIGN_ID]
 */

import {
  createJourney,
  createStep,
  createProductSelection,
  createShoppingCart,
  createPersonalInformation,
  createSummary,
  createParagraph,
  createActionBar,
  createSuccessMessage,
  JourneyClient,
} from '@epilot/epilot-journey-sdk'

const API_TOKEN = process.argv[2]
const ORG_ID = process.argv[3] ?? '739224'

const client = new JourneyClient({ auth: API_TOKEN })

// Real products from org 739224 dev environment
const PRODUCTS = [
  { productId: '8e4d232b-b467-4a2b-8575-66e4b6e364cd', priceId: '2cbd6407-a316-418e-97a8-3d9e5b0a5957', isFeatured: true },
  { productId: '38211828-88e1-44ba-9b9d-6ca2f0a39a43', priceId: 'b66e1ac3-e4c0-4159-9e52-032489f76a2d', isFeatured: false },
  { productId: '368e3b38-0bd9-408b-ad00-9f49e3a90974', priceId: '5cf6c586-694f-4031-8ba9-7cb9735bcc35', isFeatured: false },
]

const journey = createJourney({
  name: 'Shopping Cart Demo',
  organizationId: ORG_ID,
  steps: [

    // ── Step 1: Product Selection with Cart Sidebar ───────────────
    createStep({
      name: 'Select Products',
      title: 'Choose Your Products',
      layout: 'MainContentCartLayout',
      showStepper: true,
      showStepperLabels: true,
      hideNextButton: true,
      blocks: [
        createParagraph('intro', 'Browse our catalog and add products to your cart.'),

        createProductSelection({
          name: 'selectedProducts',
          label: 'Available Products',
          required: true,
          options: {
            catalog: 'epilot',
            productSelectionConfiguratorType: 'product_selector',
            selectionType: 'many',
            showQuantity: false,
            products: PRODUCTS,
          },
        }),

        createActionBar('Next1', { label: 'Continue to Checkout' }),
      ],
      sidebarBlocks: [
        createShoppingCart('cart', {
          cartTitle: 'Your Cart',
          cartFootnote: 'Prices include VAT where applicable.',
        }),
      ],
    }),

    // ── Step 2: Contact Details ───────────────────────────────────
    createStep({
      name: 'Your Details',
      title: 'Contact Information',
      showStepper: true,
      showStepperLabels: true,
      hideNextButton: true,
      blocks: [
        createPersonalInformation({
          name: 'Contact',
          required: true,
          options: {
            customerType: 'BUSINESS',
            purposeLabels: ['customer'],
            title: 'Your Details',
            fields: {
              firstName: { required: true },
              lastName: { required: true },
              email: { required: true },
              telephone: {},
              companyName: { required: true },
            },
          },
        }),

        createActionBar('Next2', {
          label: 'Review Order',
          showBack: true,
        }),
      ],
    }),

    // ── Step 3: Review & Submit ───────────────────────────────────
    createStep({
      name: 'Review',
      title: 'Review Your Order',
      showStepper: true,
      showStepperLabels: true,
      hideNextButton: true,
      blocks: [
        createSummary('orderSummary', { subTitle: 'Please review your order details' }),

        createActionBar('Submit', {
          label: 'Place Order',
          actionType: 'SubmitAndGoNext',
          showBack: true,
          consents: [
            { name: 'first_consent', isRequired: true, isVisible: true, text: 'I accept the [Terms and Conditions](https://epilot.cloud/agb) and [Privacy Policy](https://epilot.cloud/privacy).' },
            { name: 'second_consent', isRequired: false, isVisible: false, text: null },
            { name: 'third_consent', isRequired: false, isVisible: false, text: null },
            { name: 'fourth_consent', isRequired: false, isVisible: false, text: null },
          ],
        }),
      ],
    }),

    // ── Step 4: Confirmation ─────────────────────────────────────
    createStep({
      name: 'Confirmation',
      showStepper: false,
      showStepName: false,
      hideNextButton: true,
      blocks: [
        createSuccessMessage('thankYou', {
          title: 'Order Placed!',
          text: 'Thank you for your order. We will process it and send you a confirmation email shortly.',
          closeButtonText: 'Back to Shop',
        }),
      ],
    }),
  ],
})

const created = await client.createJourney(journey)
console.log('Journey created:', created.journeyId)`,
  },
];
