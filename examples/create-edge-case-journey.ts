/**
 * Edge-case test journey – covers all block types and layouts.
 *
 * Steps:
 *   1. Inputs & Toggles     – NumberInput, DatePicker, BinaryInput, radio choice
 *   2. Contact & Address    – Contact, Address
 *   3. Upload & Consents    – FileUpload, standalone Consents
 *   4. Product Selection    – ProductSelection + ShoppingCart sidebar
 *   5. Review & Submit      – Image, Summary, ActionBar with submit
 *   6. Confirmation         – SuccessMessage
 *
 * Usage:
 *   npx tsx examples/create-edge-case-journey.ts
 *
 * Auth: uses `epilot auth token` from the epilot CLI.
 */

import { execSync } from 'child_process'
import {
  createJourney,
  createStep,
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
} from '../src/index.js' // Use '@epilot/epilot-journey-sdk' when running as a standalone script outside this repo

const API_TOKEN = process.env.EPILOT_TOKEN || execSync('epilot auth token', { encoding: 'utf-8' }).trim()
const ORG_ID = process.env.EPILOT_ORG_ID || '739224'

const client = new JourneyClient({ auth: API_TOKEN })

const journey = createJourney({
  name: 'SDK Edge Case Test Journey',
  organizationId: ORG_ID,
  steps: [

    // ── Step 1: Inputs & Toggles ──────────────────────────────
    createStep({
      name: 'Inputs',
      title: 'Various Input Types',
      showStepper: true,
      hideNextButton: true,
      blocks: [
        createParagraph('intro1', 'NumberInput, DatePicker, BinaryInput and radio.'),
        createNumberInput({
          name: 'annualConsumption',
          label: 'Annual Energy Consumption',
          required: true,
          unit: { show: true, label: 'kWh' },
          range: { min: 0, max: 100000 },
        }),
        createDatePicker({ name: 'startDate', label: 'Desired Start Date', required: true, disablePast: true }),
        createBinaryInput({ name: 'newsletter', label: 'Subscribe to newsletter' }),
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
        createActionBar('Next1', { label: 'Continue' }),
      ],
    }),

    // ── Step 2: Contact & Address ─────────────────────────────
    createStep({
      name: 'Contact',
      title: 'Contact & Address',
      showStepper: true,
      hideNextButton: true,
      blocks: [
        createContact({
          name: 'contactInfo',
          required: true,
          options: {
            purpose: ['customer'],
            fields: { firstName: { required: true }, lastName: { required: true }, email: { required: true } },
          },
        }),
        createAddress({
          name: 'deliveryAddress',
          required: true,
          options: {
            title: 'Delivery Address',
            countryAddressSettings: { countryCode: 'DE', enableAutoComplete: true, enableFreeText: false },
            fields: { zipCity: { required: true }, streetName: { required: true }, houseNumber: { required: true } },
          },
        }),
        createActionBar('Next2', { label: 'Continue', showBack: true }),
      ],
    }),

    // ── Step 3: File Upload & Consents ────────────────────────
    createStep({
      name: 'Upload',
      title: 'Documents & Consents',
      showStepper: true,
      hideNextButton: true,
      blocks: [
        createFileUpload({ name: 'supportingDocs', label: 'Supporting Documents', options: { maxQuantity: 3, supportedTypes: ['PDF', 'Image'] } }),
        createConsents({
          name: 'legalConsents',
          label: 'Terms & Conditions',
          options: {
            items: {
              'consent-1': { required: true, topics: ['GTC'], text: 'I agree to the [Terms](https://epilot.cloud/agb)', order: 0 },
              'consent-2': { required: false, topics: ['EMAIL_MARKETING'], text: 'I consent to receive marketing emails.', order: 1 },
            },
          },
        }),
        createActionBar('Next3', { label: 'Continue', showBack: true }),
      ],
    }),

    // ── Step 4: Product Selection + Cart Sidebar ──────────────
    createStep({
      name: 'Products',
      title: 'Select a Product',
      layout: 'MainContentCartLayout',
      showStepper: true,
      hideNextButton: true,
      blocks: [
        createProductSelection({
          name: 'selectedProduct',
          label: 'Choose your plan',
          required: true,
          options: { catalog: 'epilot', productsType: 'dynamic', selection: 'one' },
        }),
        createActionBar('Next4', { label: 'Continue', showBack: true }),
      ],
      sidebarBlocks: [
        createShoppingCart('cart', { cartTitle: 'Your Selection' }),
      ],
    }),

    // ── Step 5: Review & Submit ───────────────────────────────
    createStep({
      name: 'Review',
      title: 'Review & Submit',
      showStepper: true,
      hideNextButton: true,
      blocks: [
        createImage('banner', 'https://go.epilot.cloud/elements-static/logo/epilot-logo.svg', { altText: 'epilot logo', width: '50%' }),
        createSummary('reviewSummary', { subTitle: 'Please review your order' }),
        createActionBar('SubmitBar', {
          label: 'Submit Order',
          actionType: 'SubmitAndGoNext',
          showBack: true,
          consents: [
            { name: 'first_consent', isRequired: true, isVisible: true, text: 'I agree to the [Privacy Policy](https://epilot.cloud/privacy).' },
            { name: 'second_consent', isRequired: false, isVisible: false, text: null },
            { name: 'third_consent', isRequired: false, isVisible: false, text: null },
            { name: 'fourth_consent', isRequired: false, isVisible: false, text: null },
          ],
        }),
      ],
    }),

    // ── Step 6: Confirmation ──────────────────────────────────
    createStep({
      name: 'Confirmation',
      showStepper: false,
      hideNextButton: true,
      blocks: [
        createSuccessMessage('thankYou', {
          title: 'Order submitted!',
          text: 'Thank you for your order. We will get back to you shortly.',
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
