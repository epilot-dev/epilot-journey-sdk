/**
 * Edge-case test journey — covers all untested block types and layouts.
 *
 * Steps:
 *   1. Inputs & Toggles     (MainLinearLayout) — NumberInput, DatePicker, BinaryInput, single choice radio
 *   2. Contact & Address    (MainLinearLayout) — Contact, Address
 *   3. Upload & Consents    (MainLinearLayout) — FileUpload, standalone Consents
 *   4. Product Selection    (MainContentCartLayout) — ProductSelection + ShoppingCart sidebar
 *   5. Review & Submit      (MainLinearLayout) — Image, Summary, ActionBar with submit + consents
 *   6. Confirmation         (MainLinearLayout) — SuccessMessage
 *
 * Usage:
 *   npx tsx examples/create-edge-case-journey.ts <API_TOKEN> <ORG_ID> [DESIGN_ID]
 */

import {
  createJourney,
  createStep,
  createTextInput,
  createNumberInput,
  createBinaryInput,
  createDatePicker,
  createSingleChoice,
  createContact,
  createAddress,
  createFileUpload,
  createConsents,
  createProductSelection,
  createShoppingCart,
  createImage,
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
  console.error('Usage: npx tsx examples/create-edge-case-journey.ts <API_TOKEN> <ORG_ID> [DESIGN_ID]')
  process.exit(1)
}

// ─── Journey Definition ──────────────────────────────────────────

const journey = createJourney({
  name: 'SDK Edge Case Test Journey',
  organizationId: ORG_ID,
  ...(DESIGN_ID && { designId: DESIGN_ID }),
  steps: [

    // ── Step 1: Inputs & Toggles ──────────────────────────────────
    createStep({
      name: 'Step 1 — Inputs',
      title: 'Various Input Types',
      showStepper: true,
      showStepperLabels: true,
      hideNextButton: true,
      blocks: [
        createParagraph('intro1', 'Testing NumberInput, DatePicker, BinaryInput and single-choice radio.'),

        createNumberInput({
          name: 'annualConsumption',
          label: 'Annual Energy Consumption',
          required: true,
          unit: { show: true, label: 'kWh' },
          range: { min: 0, max: 100000 },
        }),

        createDatePicker({
          name: 'startDate',
          label: 'Desired Start Date',
          required: true,
          disablePast: true,
        }),

        createBinaryInput({
          name: 'newsletter',
          label: 'Subscribe to newsletter',
        }),

        createSingleChoice({
          name: 'tariff',
          label: 'Billing preference',
          required: true,
          options: {
            uiType: 'radio',
            choices: [
              { label: 'Monthly', value: 'monthly' },
              { label: 'Quarterly', value: 'quarterly' },
              { label: 'Annually', value: 'annually' },
            ],
          },
        }),

        createActionBar('Next1', { label: 'Continue', showBack: false }),
      ],
    }),

    // ── Step 2: Contact & Address ─────────────────────────────────
    createStep({
      name: 'Step 2 — Contact',
      title: 'Contact & Address',
      showStepper: true,
      showStepperLabels: true,
      hideNextButton: true,
      blocks: [
        createParagraph('intro2', 'Testing Contact and Address blocks.'),

        createContact({
          name: 'contactInfo',
          label: 'Your Details',
          required: true,
          options: {
            purpose: ['customer'],
            title: 'Contact Information',
            fields: {
              firstName: { required: true },
              lastName: { required: true },
              email: { required: true },
              telephone: {},
            },
          },
        }),

        createAddress({
          name: 'deliveryAddress',
          label: 'Delivery Address',
          required: true,
          options: {
            title: 'Delivery Address',
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

        createActionBar('Next2', { label: 'Continue', showBack: true }),
      ],
    }),

    // ── Step 3: File Upload & Consents ────────────────────────────
    createStep({
      name: 'Step 3 — Upload',
      title: 'Documents & Consents',
      showStepper: true,
      showStepperLabels: true,
      hideNextButton: true,
      blocks: [
        createParagraph('intro3', 'Testing FileUpload and Consents blocks.'),

        createFileUpload({
          name: 'supportingDocs',
          label: 'Supporting Documents',
          options: {
            maxQuantity: 3,
            supportedTypes: ['PDF', 'Image'],
          },
        }),

        createConsents({
          name: 'legalConsents',
          label: 'Terms & Conditions',
          options: {
            items: {
              'consent-1': {
                required: true,
                topics: ['GTC'],
                text: 'I agree to the [Terms & Conditions](https://epilot.cloud/agb)',
                order: 0,
              },
              'consent-2': {
                required: false,
                topics: ['EMAIL_MARKETING'],
                text: 'I consent to receive marketing emails from epilot.',
                order: 1,
              },
            },
          },
        }),

        createActionBar('Next3', { label: 'Continue', showBack: true }),
      ],
    }),

    // ── Step 4: Product Selection + Cart Sidebar ──────────────────
    createStep({
      name: 'Step 4 — Products',
      title: 'Select a Product',
      layout: 'MainContentCartLayout',
      showStepper: true,
      showStepperLabels: true,
      hideNextButton: true,
      blocks: [
        createParagraph('intro4', 'Testing ProductSelection with a shopping cart sidebar.'),

        createProductSelection({
          name: 'selectedProduct',
          label: 'Choose your plan',
          required: true,
          options: {
            catalog: 'epilot',
            productsType: 'dynamic',
            selection: 'one',
          },
        }),

        createActionBar('Next4', { label: 'Continue', showBack: true }),
      ],
      sidebarBlocks: [
        createShoppingCart('cart', { cartTitle: 'Your Selection' }),
      ],
    }),

    // ── Step 5: Review & Submit ───────────────────────────────────
    createStep({
      name: 'Step 5 — Review',
      title: 'Review & Submit',
      showStepper: true,
      showStepperLabels: true,
      hideNextButton: true,
      blocks: [
        createImage('banner', 'https://go.epilot.cloud/elements-static/logo/epilot-logo.svg', {
          altText: 'epilot logo',
          width: '50%',
        }),

        createSummary('reviewSummary', { subTitle: 'Please review your order' }),

        createActionBar('SubmitBar', {
          label: 'Submit Order',
          actionType: 'SubmitAndGoNext',
          showBack: true,
          consents: [
            { name: 'first_consent', isRequired: true, isVisible: true, text: 'I agree to the [Privacy Policy](https://epilot.cloud/privacy).' },
            { name: 'second_consent', isRequired: false, isVisible: true, text: 'I would like to receive product updates.' },
            { name: 'third_consent', isRequired: false, isVisible: false, text: null },
            { name: 'fourth_consent', isRequired: false, isVisible: false, text: null },
          ],
        }),
      ],
    }),

    // ── Step 6: Confirmation ──────────────────────────────────────
    createStep({
      name: 'Confirmation',
      showStepper: false,
      showStepName: false,
      hideNextButton: true,
      blocks: [
        createSuccessMessage('thankYou', {
          title: 'Order submitted successfully!',
          text: 'Thank you for your order. We will process it and get back to you shortly.',
          closeButtonText: 'Back to Homepage',
        }),
      ],
    }),
  ],
})

// ─── Create via API ──────────────────────────────────────────────

async function main() {
  console.log('\n🧪 Creating SDK Edge Case Test Journey...\n')
  console.log(`  Steps: ${(journey.steps as any[]).length}`)
  console.log(`  Org:   ${ORG_ID}`)
  if (API_URL) console.log(`  API:   ${API_URL} (dev)\n`)
  // Dump payload for debugging
  if (process.env.DEBUG_PAYLOAD) {
    console.log(JSON.stringify(journey, null, 2))
    return
  }

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
