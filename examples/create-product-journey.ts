/**
 * Solar Product Journey – availability check, roof planner, products with cart sidebar.
 *
 * 6-step journey using real products from org 739224 dev environment.
 *
 * Usage:
 *   npx tsx examples/create-product-journey.ts
 *
 * Auth: uses `epilot auth token` from the epilot CLI.
 */

import { execSync } from 'child_process'
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

const API_TOKEN = process.env.EPILOT_TOKEN || execSync('epilot auth token', { encoding: 'utf-8' }).trim()
const ORG_ID = process.env.EPILOT_ORG_ID || '739224'

const client = new JourneyClient({ auth: API_TOKEN })

const PRODUCTS = [
  { productId: '8e4d232b-b467-4a2b-8575-66e4b6e364cd', priceId: '2cbd6407-a316-418e-97a8-3d9e5b0a5957', isFeatured: true },
  { productId: '38211828-88e1-44ba-9b9d-6ca2f0a39a43', priceId: 'b66e1ac3-e4c0-4159-9e52-032489f76a2d', isFeatured: false },
  { productId: '9d402e77-4c88-49ab-8a07-4a81b9ba1861', priceId: '607687ac-52e8-4a3c-aa54-b78c171eb16a', isFeatured: false },
]

const journey = createJourney({
  name: 'Solar Product Journey',
  organizationId: ORG_ID,
  settings: {
    runtimeEntities: ['ORDER'],
  },
  steps: [
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
            googleMapsIntegrationOptions: { isGoogleMapsEnabled: true, isRepositioningAllowed: true },
            fields: { zipCode: { required: true, label: 'Postal Code' } },
          },
        }),
        createActionBar('Next1', { label: 'Check & Continue' }),
      ],
    }),

    createStep({
      name: 'Roof Planner',
      title: 'Plan Your Solar Installation',
      showStepper: true,
      hideNextButton: true,
      blocks: [
        createParagraph('mapIntro', 'Use the map to mark your rooftop and calculate solar potential.'),
        createPVRoofPlanner({ name: 'RoofPlanner', label: 'Rooftop Solar Planner', options: { panelLifetimeYears: 25 } }),
        createActionBar('Next2', { label: 'Continue to Products', showBack: true }),
      ],
    }),

    createStep({
      name: 'Select Products',
      title: 'Choose Your Solar Package',
      layout: 'MainContentCartLayout',
      showStepper: true,
      hideNextButton: true,
      blocks: [
        createProductSelection({
          name: 'Products',
          label: 'Available Solar Packages',
          required: true,
          options: { catalog: 'epilot', selectionType: 'many', products: PRODUCTS },
        }),
        createActionBar('Next3', { label: 'Continue', showBack: true }),
      ],
      sidebarBlocks: [
        createShoppingCart('Cart', { cartTitle: 'Your Solar Package', cartFootnote: 'All prices include VAT (19%).' }),
      ],
    }),

    createStep({
      name: 'Your Details',
      title: 'Contact Information',
      layout: 'MainContentCartLayout',
      showStepper: true,
      hideNextButton: true,
      blocks: [
        createPersonalInformation({
          name: 'Contact Info',
          required: true,
          options: {
            customerType: 'PRIVATE',
            purposeLabels: ['customer'],
            fields: { firstName: { required: true }, lastName: { required: true }, email: { required: true }, telephone: { required: true } },
          },
        }),
        createAddress({
          name: 'Address',
          required: true,
          options: {
            title: 'Installation Address',
            countryAddressSettings: { countryCode: 'DE', enableAutoComplete: true, enableFreeText: false },
            fields: { zipCity: { required: true }, streetName: { required: true }, houseNumber: { required: true } },
          },
        }),
        createActionBar('Next4', { label: 'Review Order', showBack: true }),
      ],
      sidebarBlocks: [
        createShoppingCart('Cart2', { cartTitle: 'Your Solar Package' }),
      ],
    }),

    createStep({
      name: 'Review',
      title: 'Review & Place Order',
      layout: 'MainContentCartLayout',
      showStepper: true,
      hideNextButton: true,
      blocks: [
        createSummary('Summary', { subTitle: 'Please review your solar installation order' }),
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
      sidebarBlocks: [
        createShoppingCart('Cart3', { cartTitle: 'Your Solar Package' }),
      ],
    }),

    createStep({
      name: 'Confirmation',
      showStepper: false,
      hideNextButton: true,
      blocks: [
        createSuccessMessage('ThankYou', {
          title: 'Your solar order has been placed!',
          text: 'Our team will review your rooftop assessment and contact you within 2 business days.',
          closeButtonText: 'Back to Homepage',
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
