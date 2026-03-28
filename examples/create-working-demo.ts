/**
 * Clean working demo journey – simple 3-step flow.
 * Verifies the SDK produces journeys that render correctly.
 *
 * Usage:
 *   npx tsx examples/create-working-demo.ts
 */
import { execSync } from 'child_process'
import {
  createJourney, createStep,
  createTextInput, createSingleChoice,
  createPersonalInformation, createAddress,
  createConsents, createSummary,
  createParagraph, createActionBar, createSuccessMessage,
  JourneyClient,
} from '../src/index.js'

const API_TOKEN = process.env.EPILOT_TOKEN || execSync('epilot auth token', { encoding: 'utf-8' }).trim()
const ORG_ID = process.env.EPILOT_ORG_ID || '739224'
const API_URL = 'https://journey-config.dev.sls.epilot.io'

const client = new JourneyClient({ auth: API_TOKEN, apiUrl: API_URL })

const journey = createJourney({
  organizationId: ORG_ID,
  name: 'SDK Working Demo – Contact Form',
  settings: {
    designId: 'e22481d9-256e-4d35-806b-cfbbde824392',
    description: 'Simple 3-step contact form created by the Journey SDK.',
    runtimeEntities: ['OPPORTUNITY'],
  },
  steps: [

    // ── Step 1: What do you need? ─────────────────────────────
    createStep({
      name: 'Your Interest',
      showStepper: true,
      showStepperLabels: true,
      hideNextButton: true,
      blocks: [
        createParagraph('intro', 'Tell us what you are interested in.'),

        createSingleChoice({
          name: 'interest',
          label: 'What are you looking for?',
          required: true,
          options: {
            uiType: 'button',
            choices: [
              { label: 'Solar Panels', value: 'solar' },
              { label: 'Heat Pump', value: 'heatpump' },
              { label: 'Wallbox', value: 'wallbox' },
            ],
          },
        }),

        createTextInput({
          name: 'notes',
          label: 'Anything else we should know?',
          options: { multiline: true },
        }),

        createActionBar('Next1', { label: 'Continue' }),
      ],
    }),

    // ── Step 2: Contact details + submit ───────────────────────
    createStep({
      name: 'Your Details',
      showStepper: true,
      showStepperLabels: true,
      hideNextButton: true,
      blocks: [
        createPersonalInformation({
          name: 'personalInfo',
          required: true,
          showPaper: true,
          options: {
            customerType: 'PRIVATE',
            purposeLabels: ['customer'],
            title: 'Contact Information',
            fields: {
              salutation: {},
              firstName: { required: true },
              lastName: { required: true },
              email: { required: true },
              telephone: {},
            },
          },
        }),

        createAddress({
          name: 'address',
          required: true,
          showPaper: true,
          options: {
            title: 'Your Address',
            countryAddressSettings: {
              countryCode: 'DE',
              enableAutoComplete: true,
              enableFreeText: false,
            },
            fields: {
              zipCity: { required: true },
              streetName: { required: true },
              houseNumber: { required: true },
            },
          },
        }),

        createSummary('summary', { subTitle: 'Review your request' }),

        createActionBar('submitBar', {
          label: 'Submit Request',
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

    // ── Step 3: Confirmation ──────────────────────────────────
    createStep({
      name: 'Thank You',
      showStepper: false,
      showStepName: false,
      hideNextButton: true,
      blocks: [
        createSuccessMessage('thankYou', {
          title: 'Request received!',
          text: 'Thank you for your interest. Our team will contact you within 24 hours.',
          closeButtonText: 'Back to Homepage',
        }),
      ],
    }),
  ],
})

async function main() {
  console.log(`Creating journey "${journey.name}" in org ${ORG_ID}...`)
  const created = await client.createJourney(journey) as any
  const id = created?.journeyId || created?.createdJourney?.journeyId || created?.id
  console.log(`Journey ID: ${id}`)
  console.log(`Builder:  https://portal.dev.epilot.cloud/app/journey-builder/journeys/${id}`)
  console.log(`Preview:  https://portal.dev.epilot.cloud/journey-app/?journeyId=${id}`)
}

main().catch(err => {
  console.error('Failed:', err?.response?.data ?? err.message)
  process.exit(1)
})
