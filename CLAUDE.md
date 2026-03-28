# epilot Journey SDK – Agent Instructions

Agentic SDK for creating and managing epilot journeys programmatically. Use the factory functions – never construct raw JSON.

## Authentication

```bash
# Install the epilot CLI (if needed)
npm install -g @epilot/cli

# Login (opens browser)
epilot auth login

# Get a token for scripts
export EPILOT_TOKEN=$(epilot auth token)

# Or check current org
epilot auth status
```

## Quick Start

```ts
import {
  JourneyClient,
  createJourney, createStep,
  createPersonalInformation, createAddress,
  createActionBar, createSuccessMessage,
} from '@epilot/epilot-journey-sdk'

const client = new JourneyClient({ auth: process.env.EPILOT_TOKEN! })

const journey = createJourney({
  organizationId: '<ORG_ID>',
  name: 'Contact Form',
  settings: { runtimeEntities: ['ORDER'] },
  steps: [
    createStep({
      name: 'Your Details',
      blocks: [
        createPersonalInformation({ name: 'pi', required: true }),
        createAddress({ name: 'address', required: true }),
        createActionBar('Next', { label: 'Submit', actionType: 'SubmitAndGoNext' }),
      ],
    }),
    createStep({
      name: 'Confirmation',
      showStepper: false,
      hideNextButton: true,
      blocks: [createSuccessMessage('thanks', { title: 'Thank you!' })],
    }),
  ],
})

const created = await client.createJourney(journey)
```

## Factory Functions (always use these)

| Factory | Block Type | Notes |
|---------|-----------|-------|
| `createTextInput()` | Control | Plain text, multiline option |
| `createNumberInput()` | NumberInputControl | Unit, range, format nested under `fields.numberInput` |
| `createSingleChoice()` | Control | Pass `choices[]` – auto-converts to parallel arrays wire format |
| `createMultipleChoice()` | MultichoiceControl | Same `choices[]` conversion as single choice |
| `createBinaryInput()` | Control | Toggle/checkbox – uses `_binaryInput` marker |
| `createDatePicker()` | DatePickerControl | `disablePast`, `showTime` options |
| `createPersonalInformation()` | PersonalInformationControl | `customerType: 'PRIVATE' \| 'BUSINESS'`, field-level required |
| `createContact()` | ContactControl | Similar to PI but contact-specific fields |
| `createAddress()` | AddressControl | `countryAddressSettings` for autocomplete |
| `createProductSelection()` | ProductSelectionControl | `products[]` with productId/priceId pairs |
| `createShoppingCart()` | ShopCartControl | Always in `sidebarBlocks` with `MainContentCartLayout` |
| `createConsents()` | ConsentsControl | `items` keyed by consent ID with topics |
| `createFileUpload()` | UploadPanelControl | Array `supportedTypes` auto-joined to comma string |
| `createPaymentMethod()` | PaymentControl | SEPA + BankTransfer implementations |
| `createPVRoofPlanner()` | PVRoofPlannerControl | Solar panel roof planner |
| `createAvailabilityCheck()` | AvailabilityCheckControl | Postal code or address-based service check |
| `createParagraph()` | Label | Text auto-encoded as UTF-16LE base64. Top-level `text`, not in options |
| `createImage()` | ImageControl | URL, altText, width (100%/50%/30%) |
| `createActionBar()` | ActionBarControl | `GoNext` or `SubmitAndGoNext`. 4 consent slots |
| `createSuccessMessage()` | ConfirmationMessageControl | Title, text, optional close button |
| `createSummary()` | SummaryControl | Review block showing collected data |
| `createStep()` | — | Auto-generates schema from blocks, sets `variablePath` |
| `createJourney()` | — | Wraps steps with required v1 API fields |

## Critical Rules

1. **Every step needs an ActionBar** – or users can't proceed. Use `createActionBar()`.
2. **Last data step uses `SubmitAndGoNext`** – all others use default `GoNext`.
3. **Success message on its own final step** – with `showStepper: false`, `hideNextButton: true`.
4. **Block names must be unique within a step** – they map to JSON schema property keys.
5. **Shopping cart goes in `sidebarBlocks`** – use `layout: 'MainContentCartLayout'` on the step.
6. **Choices use parallel arrays** – `createSingleChoice`/`createMultipleChoice` handle this. Never construct raw `options[]`/`optionsLabels[]`.
7. **Paragraph text is base64 UTF-16LE** – `createParagraph()` handles encoding. Never set `text` manually.
8. **Set `runtimeEntities`** – `['ORDER']` for purchases, `['OPPORTUNITY']` for leads.

## JourneyClient API

```ts
const client = new JourneyClient({ auth: token })

// CRUD
await client.createJourney(payload)
await client.getJourney(journeyId)
await client.updateJourney(journey)
await client.patchJourney(journeyId, { name: 'New Name' })
await client.deleteJourney(journeyId)
await client.searchJourneys({ query: 'solar', size: 10 })

// Block-level operations (fetch + patch in one call)
await client.patchBlock(journeyId, { stepIndex: 0, blockName: '#/properties/email' }, { label: 'Work Email' })
await client.addBlock(journeyId, 0, newBlock)
await client.removeBlock(journeyId, { stepIndex: 0, blockName: '#/properties/fax' })

// Read-only helpers (no API call)
client.getBlocks(journey)         // all blocks across all steps
client.getStepBlocks(journey, 0)  // blocks in step 0
```

## Block Catalog

All 35+ block types are in `ControlName` and `BLOCK_CATALOG`. Use `ControlName.X` for type constants:

```ts
import { ControlName, BLOCK_CATALOG } from '@epilot/epilot-journey-sdk'
// ControlName.PersonalInformation → 'PersonalInformationControl'
// BLOCK_CATALOG has descriptions, categories, and hasValue flags
```

## Examples

See `examples/` for runnable scripts:
- `create-sales-inquiry.ts` – 4-step lead form with plan selection + GDPR consent
- `create-product-journey.ts` – 6-step solar journey with availability check, roof planner, cart sidebar
- `create-shopping-cart-journey.ts` – Product selection with MainContentCartLayout
- `create-edge-case-journey.ts` – All block types: NumberInput, DatePicker, BinaryInput, Contact, Address, FileUpload, Consents, ProductSelection

Run with: `npx tsx examples/<script>.ts`

## Project Structure

```
src/
  client/
    index.ts        – JourneyClient class
    factories.ts    – All factory functions (createStep, createJourney, createBlock, etc.)
    blockTypes.ts   – ControlName constants, value types, block catalog
    types.ts        – StepConfig, UISchemaElement, BlockRef, etc.
  utils/
    blocks.ts       – findBlock, getStepBlocks, updateBlock, addBlock, removeBlock
    parse.ts        – parseBlockValue, mergeBlockValue
  index.ts          – Public API exports
examples/           – Runnable journey creation scripts
demo/               – Interactive playground (Vite + React + Tailwind)
```
