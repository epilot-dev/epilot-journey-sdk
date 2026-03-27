/**
 * Shopping Cart Journey — demonstrates ProductSelection + ShoppingCart sidebar.
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
} from '../src/index.js'

const API_TOKEN = process.argv[2]
const ORG_ID = process.argv[3] ?? '739224'
const DESIGN_ID = process.argv[4]

const isDevToken = API_TOKEN?.includes('dev.sls.epilot.io') ||
  (() => { try { return JSON.parse(atob(API_TOKEN?.split('.')[1] || '')).iss?.includes('dev.'); } catch { return false; } })()
const API_URL = isDevToken ? 'https://journey-config.dev.sls.epilot.io' : undefined

if (!API_TOKEN) {
  console.error('Usage: npx tsx examples/create-shopping-cart-journey.ts <API_TOKEN> <ORG_ID> [DESIGN_ID]')
  process.exit(1)
}

// Real products from org 739224 dev environment
const PRODUCTS = [
  { productId: '8e4d232b-b467-4a2b-8575-66e4b6e364cd', priceId: '2cbd6407-a316-418e-97a8-3d9e5b0a5957', isFeatured: true },
  { productId: '38211828-88e1-44ba-9b9d-6ca2f0a39a43', priceId: 'b66e1ac3-e4c0-4159-9e52-032489f76a2d', isFeatured: false },
  { productId: '368e3b38-0bd9-408b-ad00-9f49e3a90974', priceId: '5cf6c586-694f-4031-8ba9-7cb9735bcc35', isFeatured: false },
]

const journey = createJourney({
  name: 'Shopping Cart Demo',
  organizationId: ORG_ID,
  ...(DESIGN_ID && { designId: DESIGN_ID }),
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

async function main() {
  console.log('\n🛒 Creating Shopping Cart Journey...\n')
  console.log(`  Products: ${PRODUCTS.length}`)
  console.log(`  Org:      ${ORG_ID}`)
  if (API_URL) console.log(`  API:      ${API_URL} (dev)\n`)

  const client = new JourneyClient({ auth: API_TOKEN, ...(API_URL && { apiUrl: API_URL }) })

  try {
    const created = await client.createJourney(journey) as any
    const journeyId = created?.journeyId || created?.createdJourney?.journeyId || created?.id
    console.log('✅ Journey created!')
    console.log(`  Journey ID:  ${journeyId}`)
    if (journeyId) console.log(`  Builder URL: https://portal.dev.epilot.cloud/app/journey-builder/journeys/${journeyId}`)
  } catch (err: any) {
    const detail = err?.response?.data ?? err?.message ?? err
    console.error('❌ Failed:', JSON.stringify(detail, null, 2))
    process.exit(1)
  }
}

main()
