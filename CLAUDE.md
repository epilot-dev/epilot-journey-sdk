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

**Two signature patterns:**
- **Options object** – `createTextInput({ name, label?, required?, options? })` – name goes inside the object
- **Positional** – `createParagraph(name, text)`, `createActionBar(name, opts?)`, `createSuccessMessage(name, opts?)`, `createImage(name, url, opts?)`, `createSummary(name, opts?)`, `createShoppingCart(name, opts?)`

**Choices go inside `options.choices`**, not top-level:
```ts
createSingleChoice({ name: 'x', options: { choices: [{ label: 'A', value: 'a' }] } })
```

| Factory | Signature | Notes |
|---------|----------|-------|
| `createTextInput(opts)` | `{ name, label?, options?: { multiline?, placeholder? } }` | Plain text or textarea |
| `createNumberInput(opts)` | `{ name, label?, unit?, range?, suggestions? }` | Unit/range at top level, nested auto |
| `createSingleChoice(opts)` | `{ name, label?, options: { uiType?, choices[] } }` | uiType: `'button'`/`'radio'`/`'dropdown'` |
| `createMultipleChoice(opts)` | `{ name, label?, options: { uiType?, choices[], maxSelection? } }` | uiType: `'checkbox'`/`'button'` |
| `createBinaryInput(opts)` | `{ name, label?, toggle?: boolean }` | toggle=true → switch, false → checkbox |
| `createDatePicker(opts)` | `{ name, label?, showTime?, disablePast? }` | Time/past at top level |
| `createPersonalInformation(opts)` | `{ name, options?: { customerType?, fields? } }` | **Defaults fields** if omitted |
| `createContact(opts)` | `{ name, options?: { purpose?, fields? } }` | Contact-specific fields |
| `createAddress(opts)` | `{ name, options?: { fields?, countryAddressSettings? } }` | **Defaults fields + DE autocomplete** |
| `createProductSelection(opts)` | `{ name, options: { products[], catalog?, selectionType? } }` | productId/priceId pairs |
| `createShoppingCart(name, opts?)` | Positional name | Always in `sidebarBlocks` |
| `createConsents(opts)` | `{ name, options: { items: { [id]: { required, topics[], text, order } } } }` | Items keyed by ID |
| `createFileUpload(opts)` | `{ name, options?: { maxQuantity?, supportedTypes? } }` | Array supportedTypes auto-joined |
| `createPaymentMethod(opts)` | `{ name, options: { implementations[] } }` | SEPA componentProps auto-filled |
| `createPVRoofPlanner(opts)` | `{ name, options?: { panelLifetimeYears? } }` | Solar roof planner |
| `createAvailabilityCheck(opts)` | `{ name, options: { countryCode, fields } }` | Postal code or address check |
| `createParagraph(name, text)` | **Positional**: name, text string | Auto base64 UTF-16LE encoded |
| `createImage(name, url, opts?)` | **Positional**: name, url, `{ altText?, width? }` | width: `'100%'`/`'50%'`/`'30%'` |
| `createActionBar(name, opts?)` | **Positional**: name, `{ label?, actionType?, consents? }` | `'GoNext'` or `'SubmitAndGoNext'` |
| `createSuccessMessage(name, opts?)` | **Positional**: name, `{ title?, text?, closeButtonText? }` | On its own final step |
| `createSummary(name, opts?)` | **Positional**: name, `{ subTitle? }` | Review block |
| `createStep(opts)` | `{ name, blocks[], sidebarBlocks?, layout? }` | Auto-generates schema |
| `createJourney(opts)` | `{ organizationId, name, steps[], settings? }` | **Defaults `designId: ''`** if omitted |

## Critical Rules

1. **Every step needs an ActionBar** – or users can't proceed. Use `createActionBar()`.
2. **Last data step uses `SubmitAndGoNext`** – all others use default `GoNext`.
3. **Success message on its own final step** – with `showStepper: false`, `hideNextButton: true`.
4. **Block names must be unique within a step** – they map to JSON schema property keys.
5. **Shopping cart goes in `sidebarBlocks`** – use `layout: 'MainContentCartLayout'` on the step.
6. **Choices use parallel arrays** – `createSingleChoice`/`createMultipleChoice` handle this. Never construct raw `options[]`/`optionsLabels[]`.
7. **Paragraph text is base64 UTF-16LE** – `createParagraph()` handles encoding. Never set `text` manually.
8. **Set `runtimeEntities`** – `['ORDER']` for purchases, `['OPPORTUNITY']` for leads.
9. **SEPA payment `componentProps` auto-filled** – the `createPaymentMethod` factory auto-adds `componentProps.apiBaseUrl` for SEPA implementations. Override if you need a custom IBAN validation endpoint.
10. **Dev API URL** – for org 739224 (dev), use `apiUrl: 'https://journey-config.dev.sls.epilot.io'`. Cognito tokens from dev portal won't work against prod API.

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

## Wire Format Reference

See `WIRE_FORMAT_REFERENCE.md` for exhaustive documentation of every block type's settings and their exact wire format representation. Derived from the journey-builder's transform handlers in `journey-logic-commons`.

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
mcp/                – MCP server for AI agent integration (see mcp/README.md)
```

## MCP Server

The `mcp/` directory provides an MCP server with tools for AI agents:

Journey-level: `create_journey`, `get_journey`, `search_journeys`, `delete_journey`, `patch_journey`
Block-level: `get_blocks`, `patch_block`, `add_block`, `remove_block`, `list_block_types`
Export: `export_journey_code` – converts journey JSON into clean SDK factory code

Resources: `epilot://docs/claude-md`, `epilot://docs/wire-format`, `epilot://blocks/catalog`

Setup: add to `~/.claude/settings.json` under `mcpServers` with `EPILOT_TOKEN` env var.

## Exporting Journeys to SDK Code

Convert any journey's wire format JSON into readable factory code:

```ts
import { JourneyClient, exportJourneyCode } from '@epilot/epilot-journey-sdk'

const client = new JourneyClient({ auth: token, apiUrl: 'https://journey-config.dev.sls.epilot.io' })
const journey = await client.getJourney('journey-id')
const code = exportJourneyCode(journey)
// → clean TypeScript with createJourney/createStep/create* calls
```

Or via CLI: `npx tsx examples/export-journey.ts <JOURNEY_ID>`
Or via MCP: agent calls `export_journey_code(journeyId)`
