/**
 * epilot Sales Inquiry Journey — Pricing Engine Playground PoC
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
} from '../src/index.js'

const API_TOKEN = process.argv[2]
const ORG_ID = process.argv[3]
const DESIGN_ID = process.argv[4] || undefined

// Auto-detect dev environment from token issuer
const isDevToken = API_TOKEN?.includes('dev.sls.epilot.io') ||
  (() => { try { return JSON.parse(atob(API_TOKEN?.split('.')[1] || '')).iss?.includes('dev.'); } catch { return false; } })()
const API_URL = isDevToken ? 'https://journey-config.dev.sls.epilot.io' : undefined

if (!API_TOKEN || !ORG_ID) {
  console.error('Usage: npx tsx examples/create-sales-inquiry.ts <API_TOKEN> <ORG_ID> [DESIGN_ID]')
  process.exit(1)
}

// ─── Build the journey ───────────────────────────────────────────

const journey = createJourney({
  organizationId: ORG_ID,
  name: 'epilot Sales Inquiry — Pricing Engine Playground',
  settings: {
    designId: DESIGN_ID || '',
    description: 'Sales inquiry form for the epilot Pricing Engine Playground. Lets prospects pick a plan, describe their needs, and request a callback.',
    embedOptions: {
      mode: 'full-screen',
      width: '100%',
      topBar: true,
    },
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
        createParagraph(
          'intro',
          'Interested in epilot? Select the plan that best fits your business, tell us a bit about yourself, and our sales team will get in touch.',
        ),

        // Single choice — plan selection
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

        // Team size
        createSingleChoice({
          name: 'Team Size',
          label: 'How large is your team?',
          options: {
            uiType: 'button',
            choices: [
              { label: '1-10', value: '1-10' },
              { label: '11-50', value: '11-50' },
              { label: '51-200', value: '51-200' },
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
        createParagraph(
          'businessIntro',
          'Help us understand your business so we can tailor the conversation to your needs.',
        ),

        createTextInput({
          name: 'businessDescription',
          label: 'What does your business do?',
          required: true,
          options: {
            multiline: true,
            placeholder: 'e.g. We are an energy utility serving 50,000 residential customers in Northern Germany...',
          },
        }),

        createTextInput({
          name: 'epilotUseCase',
          label: 'What would you like to use epilot for?',
          required: true,
          options: {
            multiline: true,
            placeholder: 'e.g. We want to digitize our customer onboarding journeys, automate contract generation, and integrate with our SAP billing system...',
          },
        }),

        createMultipleChoice({
          name: 'Interested Modules',
          label: 'Which epilot modules are you most interested in?',
          required: false,
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
        createParagraph(
          'contactIntro',
          'Leave your contact details and our sales team will reach out within 24 hours.',
        ),

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
          label: 'Anything else you\'d like us to know?',
          required: false,
          options: {
            multiline: true,
            placeholder: 'e.g. Best time to call, specific questions, budget range...',
          },
        }),

        createSummary('Summary', { subTitle: 'Review your inquiry' }),

        createActionBar('Action bar', {
          label: 'Submit Inquiry',
          actionType: 'SubmitAndGoNext',
          consents: [
            { name: 'first_consent', isRequired: true, isVisible: true, text: 'I agree to the [Privacy Policy](https://epilot.cloud/privacy) and consent to epilot processing my data to respond to my inquiry.' },
            { name: 'second_consent', isRequired: false, isVisible: true, text: 'I would like to receive product updates and tips from epilot via email.' },
            { name: 'third_consent', isRequired: false, isVisible: false, text: null },
            { name: 'fourth_consent', isRequired: false, isVisible: false, text: null },
          ],
        }),
      ],
    }),

    // ── Step 4: Confirmation ──────────────────────────────────
    createStep({
      name: 'Confirmation',
      layout: 'MainLinearLayout',
      showStepName: false,
      showStepper: false,
      hideNextButton: true,
      blocks: [
        createSuccessMessage('Thank you', {
          title: 'Thank you for your interest in epilot!',
          text: 'Our sales team has received your inquiry and will contact you within 24 hours. In the meantime, feel free to explore our Pricing Engine Playground.',
          closeButtonText: 'Back to Playground',
        }),
      ],
    }),
  ],
})

// ─── Create via API ──────────────────────────────────────────────

async function main() {
  console.log('\n🚀 Creating epilot Sales Inquiry Journey...\n')
  console.log('Journey config:')
  console.log(`  Name: ${journey.name}`)
  console.log(`  Org:  ${ORG_ID}`)
  console.log(`  Steps: ${(journey.steps as any[]).length}`)
  console.log()

  const client = new JourneyClient({ auth: API_TOKEN, ...(API_URL && { apiUrl: API_URL }) })
  if (API_URL) console.log(`  API:  ${API_URL} (dev detected)\n`)

  try {
    const created = await client.createJourney(journey) as any
    const journeyId = created?.journeyId || created?.createdJourney?.journeyId || created?.id
    const portalBase = isDevToken ? 'https://portal.epilot.cloud' : 'https://portal.epilot.cloud'
    console.log('✅ Journey created successfully!')
    console.log(`  Journey ID: ${journeyId}`)
    if (journeyId) console.log(`  Builder URL: ${portalBase}/app/journeys/${journeyId}`)
    console.log()
    console.log('Response keys:', Object.keys(created || {}))
    console.log('Full response (first 1000 chars):')
    console.log(JSON.stringify(created, null, 2).slice(0, 1000))
  } catch (err: any) {
    console.error('❌ Failed to create journey:')
    if (err.response) {
      console.error(`  Status: ${err.response.status}`)
      console.error(`  Body:`, JSON.stringify(err.response.data, null, 2))
    } else {
      console.error(err.message || err)
    }
    process.exit(1)
  }
}

main()
