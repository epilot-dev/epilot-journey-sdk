/**
 * epilot Sales Inquiry Journey
 *
 * 4-step lead generation: plan selection -> business info -> contact + submit -> confirmation.
 * Creates an OPPORTUNITY entity on submission.
 *
 * Usage:
 *   npx tsx examples/create-sales-inquiry.ts
 *
 * Auth: uses `epilot auth token` from the epilot CLI.
 *   Run `epilot auth login` first if you haven't already.
 */

import { execSync } from 'child_process'
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

const API_TOKEN = process.env.EPILOT_TOKEN || execSync('epilot auth token', { encoding: 'utf-8' }).trim()
const ORG_ID = process.env.EPILOT_ORG_ID || '739224'

const client = new JourneyClient({ auth: API_TOKEN })

const journey = createJourney({
  organizationId: ORG_ID,
  name: 'epilot Sales Inquiry',
  settings: {
    description: 'Sales inquiry form – prospects pick a plan, describe their needs, and request a callback.',
    embedOptions: { mode: 'full-screen', width: '100%', topBar: true },
    runtimeEntities: ['OPPORTUNITY'],
  },
  steps: [

    // ── Step 1: Pick your plan ────────────────────────────────
    createStep({
      name: 'Choose Your Plan',
      showStepper: true,
      showStepperLabels: true,
      blocks: [
        createParagraph('intro', 'Select the plan that best fits your business.'),

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

    // ── Step 2: Business info ─────────────────────────────────
    createStep({
      name: 'About Your Business',
      showStepper: true,
      showStepperLabels: true,
      blocks: [
        createParagraph('businessIntro', 'Help us understand your business.'),

        createTextInput({
          name: 'businessDescription',
          label: 'What does your business do?',
          required: true,
          options: { multiline: true },
        }),

        createMultipleChoice({
          name: 'Interested Modules',
          label: 'Which epilot modules interest you?',
          options: {
            uiType: 'checkbox',
            choices: [
              { label: 'Journey Builder', value: 'journey-builder' },
              { label: 'Entity Management (360)', value: 'entity-management' },
              { label: 'Workflow Automation', value: 'workflow-automation' },
              { label: 'Customer Portal', value: 'customer-portal' },
              { label: 'Product & Pricing', value: 'product-pricing' },
            ],
          },
        }),

        createActionBar('Next', { label: 'Continue' }),
      ],
    }),

    // ── Step 3: Contact + submit ──────────────────────────────
    createStep({
      name: 'Your Contact Details',
      showStepper: true,
      showStepperLabels: true,
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
          consents: [
            { name: 'first_consent', isRequired: true, isVisible: true, text: 'I agree to the [Privacy Policy](https://epilot.cloud/privacy).' },
            { name: 'second_consent', isRequired: false, isVisible: false, text: null },
            { name: 'third_consent', isRequired: false, isVisible: false, text: null },
            { name: 'fourth_consent', isRequired: false, isVisible: false, text: null },
          ],
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
          title: 'Thank you for your interest!',
          text: 'Our sales team will contact you within 24 hours.',
          closeButtonText: 'Back to Playground',
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
