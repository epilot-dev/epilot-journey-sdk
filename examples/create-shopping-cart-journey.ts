/**
 * Shopping Cart Journey – ProductSelection with MainContentCartLayout sidebar.
 *
 * Usage:
 *   npx tsx examples/create-shopping-cart-journey.ts
 *
 * Auth: uses `epilot auth token` from the epilot CLI.
 */

import { execSync } from 'child_process'
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
} from '../src/index.js' // Use '@epilot/epilot-journey-sdk' when running as a standalone script outside this repo

const API_TOKEN = process.env.EPILOT_TOKEN || execSync('epilot auth token', { encoding: 'utf-8' }).trim()
const ORG_ID = process.env.EPILOT_ORG_ID || '739224'

const client = new JourneyClient({ auth: API_TOKEN })

const PRODUCTS = [
  { productId: '8e4d232b-b467-4a2b-8575-66e4b6e364cd', priceId: '2cbd6407-a316-418e-97a8-3d9e5b0a5957', isFeatured: true },
  { productId: '38211828-88e1-44ba-9b9d-6ca2f0a39a43', priceId: 'b66e1ac3-e4c0-4159-9e52-032489f76a2d', isFeatured: false },
  { productId: '368e3b38-0bd9-408b-ad00-9f49e3a90974', priceId: '5cf6c586-694f-4031-8ba9-7cb9735bcc35', isFeatured: false },
]

const journey = createJourney({
  name: 'Shopping Cart Demo',
  organizationId: ORG_ID,
  steps: [
    createStep({
      name: 'Select Products',
      title: 'Choose Your Products',
      layout: 'MainContentCartLayout',
      showStepper: true,
      hideNextButton: true,
      blocks: [
        createParagraph('intro', 'Browse our catalog and add products to your cart.'),
        createProductSelection({
          name: 'selectedProducts',
          label: 'Available Products',
          required: true,
          options: { catalog: 'epilot', selectionType: 'many', products: PRODUCTS },
        }),
        createActionBar('Next1', { label: 'Continue to Checkout' }),
      ],
      sidebarBlocks: [
        createShoppingCart('cart', { cartTitle: 'Your Cart', cartFootnote: 'Prices include VAT where applicable.' }),
      ],
    }),

    createStep({
      name: 'Your Details',
      title: 'Contact Information',
      showStepper: true,
      hideNextButton: true,
      blocks: [
        createPersonalInformation({
          name: 'Contact',
          required: true,
          options: {
            customerType: 'BUSINESS',
            purposeLabels: ['customer'],
            fields: { firstName: { required: true }, lastName: { required: true }, email: { required: true }, companyName: { required: true } },
          },
        }),
        createActionBar('Next2', { label: 'Review Order', showBack: true }),
      ],
    }),

    createStep({
      name: 'Review',
      title: 'Review Your Order',
      showStepper: true,
      hideNextButton: true,
      blocks: [
        createSummary('orderSummary', { subTitle: 'Please review your order details' }),
        createActionBar('Submit', {
          label: 'Place Order',
          actionType: 'SubmitAndGoNext',
          showBack: true,
          consents: [
            { name: 'first_consent', isRequired: true, isVisible: true, text: 'I accept the [Terms](https://epilot.cloud/agb) and [Privacy Policy](https://epilot.cloud/privacy).' },
            { name: 'second_consent', isRequired: false, isVisible: false, text: null },
            { name: 'third_consent', isRequired: false, isVisible: false, text: null },
            { name: 'fourth_consent', isRequired: false, isVisible: false, text: null },
          ],
        }),
      ],
    }),

    createStep({
      name: 'Confirmation',
      showStepper: false,
      hideNextButton: true,
      blocks: [
        createSuccessMessage('thankYou', {
          title: 'Order Placed!',
          text: 'We will process your order and send a confirmation email shortly.',
          closeButtonText: 'Back to Shop',
        }),
      ],
    }),
  ],
})

async function main() {
  console.log(`Creating journey "${journey.name}" in org ${ORG_ID}...`)
  const created = await client.createJourney(journey) as any
  const id = created?.journeyId || created?.createdJourney?.journeyId
  console.log(`Done! Journey ID: ${id}`)
}

main().catch((err) => {
  console.error('Failed:', err?.response?.data ?? err.message)
  process.exit(1)
})
