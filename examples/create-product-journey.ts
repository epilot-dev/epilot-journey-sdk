/**
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
} from '../src/index.js'

const API_TOKEN = process.argv[2]
const ORG_ID = process.argv[3] ?? '739224'
const DESIGN_ID = process.argv[4] ?? 'e22481d9-256e-4d35-806b-cfbbde824392'

const isDevToken = (() => { try { return JSON.parse(atob(API_TOKEN?.split('.')[1] || '')).iss?.includes('dev.') || JSON.parse(atob(API_TOKEN?.split('.')[1] || '')).iss?.includes('eu-central-1'); } catch { return false; } })()
const API_URL = isDevToken ? 'https://journey-config.dev.sls.epilot.io' : undefined

if (!API_TOKEN) {
  console.error('Usage: npx tsx examples/create-product-journey.ts <COGNITO_TOKEN> <ORG_ID> [DESIGN_ID]')
  console.error('  Use a Cognito user token (from browser session) for v1 API to create proper automation.')
  process.exit(1)
}

// Real products from org 739224 dev environment
const PRODUCTS = [
  { productId: '8e4d232b-b467-4a2b-8575-66e4b6e364cd', priceId: '2cbd6407-a316-418e-97a8-3d9e5b0a5957', isFeatured: true },   // Emerald Product — EUR 100/mo
  { productId: '38211828-88e1-44ba-9b9d-6ca2f0a39a43', priceId: 'b66e1ac3-e4c0-4159-9e52-032489f76a2d', isFeatured: false },  // Flat Fee Installation
  { productId: '9d402e77-4c88-49ab-8a07-4a81b9ba1861', priceId: '607687ac-52e8-4a3c-aa54-b78c171eb16a', isFeatured: false },  // Tiered pricing — EUR 10/mo
]

const journey = createJourney({
  name: 'Solar Product Journey — SDK Demo',
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
          options: {
            panelLifetimeYears: 25,
          },
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
          text: 'Thank you for choosing epilot Solar. Our team will review your rooftop assessment and contact you within 2 business days to schedule the installation.',
          closeButtonText: 'Back to Homepage',
        }),
      ],
    }),
  ],
})

async function main() {
  console.log('\n☀️ Creating Solar Product Journey...\n')
  console.log(`  Products: ${PRODUCTS.length}`)
  console.log(`  Org:      ${ORG_ID}`)
  if (API_URL) console.log(`  API:      ${API_URL} (dev)\n`)

  const client = new JourneyClient({ auth: API_TOKEN, ...(API_URL && { apiUrl: API_URL }) })

  try {
    const created = await client.createJourney(journey) as any
    const journeyId = created?.journeyId || created?.createdJourney?.journeyId || created?.id
    console.log('✅ Journey created!')
    console.log(`  Journey ID:  ${journeyId}`)
    console.log(`  automationId: ${created?.settings?.mappingsAutomationId ?? 'none'}`)
    if (journeyId) console.log(`  Builder URL: https://portal.dev.epilot.cloud/app/journey-builder/journeys/${journeyId}`)
  } catch (err: any) {
    const detail = err?.response?.data ?? err?.message ?? err
    console.error('❌ Failed:', JSON.stringify(detail, null, 2))
    process.exit(1)
  }
}

main()
