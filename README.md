# 🧰 epilot Journeys Toolkit

[![npm version](https://badge.fury.io/js/@epilot%2Fepilot-journey-sdk.svg)](https://www.npmjs.com/package/@epilot/epilot-journey-sdk)

Type-safe SDK for creating, inspecting, custom blocks, data injection and modifying [epilot journeys](https://docs.epilot.io/docs/journeys/journey-builder) programmatically. Built for AI agents and developers.

**[Interactive Playground](https://docs.epilot.io/journey-sdk-playground/index.html)** – browse block catalog, factory functions, client API, and runnable examples.

## Install

```bash
npm install @epilot/epilot-journey-sdk
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

## Authentication

```bash
# Install epilot CLI
npm install -g @epilot/cli

# Login (opens browser)
epilot auth login

# Export token for scripts
export EPILOT_TOKEN=$(epilot auth token)
```

Or pass a token directly:

```ts
const client = new JourneyClient({ auth: 'your-bearer-token' })
```

## Features

### Headless JourneyClient

Full CRUD operations at journey, step, and block level.

```ts
const client = new JourneyClient({ auth: token })

// Journey CRUD
await client.createJourney(payload)
await client.getJourney(journeyId)
await client.updateJourney(journey)
await client.patchJourney(journeyId, { name: 'New Name' })
await client.deleteJourney(journeyId)
await client.searchJourneys({ query: 'solar', size: 10 })

// Block-level operations
await client.patchBlock(journeyId, { stepIndex: 0, blockName: '#/properties/email' }, { label: 'Work Email' })
await client.addBlock(journeyId, 0, newBlock)
await client.removeBlock(journeyId, { stepIndex: 0, blockName: '#/properties/fax' })
```

### 20+ Factory Functions

Type-safe factories that produce valid v3 API wire format. Handles parallel-array choices, UTF-16LE base64 paragraph encoding, nested NumberInput fields, and schema generation.

```ts
createTextInput({ name: 'notes', label: 'Notes', options: { multiline: true } })
createSingleChoice({ name: 'plan', options: { choices: [{ label: 'Basic', value: 'basic' }] } })
createPersonalInformation({ name: 'pi', required: true, options: { customerType: 'BUSINESS' } })
createProductSelection({ name: 'products', options: { products: [...] } })
createStep({ name: 'Info', blocks: [...], sidebarBlocks: [createShoppingCart('cart')] })
createJourney({ organizationId, name, steps: [...] })
```

See the [Playground – Factory Functions](https://docs.epilot.io/journey-sdk-playground/index.html) for the full list with signatures and examples.

### 35+ Block Types

Complete block catalog with typed value interfaces (`BlockValueMap`) and settings types (`BlockOptionsMap`).

```ts
import { ControlName, BLOCK_CATALOG } from '@epilot/epilot-journey-sdk'

ControlName.PersonalInformation  // 'PersonalInformationControl'
ControlName.ProductSelection     // 'ProductSelectionControl'
ControlName.ActionBar            // 'ActionBarControl'
```

### Block Utilities

Immutable helpers for finding, updating, adding, and removing blocks in journey step arrays.

```ts
import { findBlock, updateBlock, addBlock, removeBlock } from '@epilot/epilot-journey-sdk'

const block = findBlock(steps, { stepIndex: 0, blockName: '#/properties/email' })
const updated = updateBlock(steps, ref, { label: 'New Label' })
```

### Export Journey to SDK Code

Convert any journey's wire format JSON into clean, readable factory code:

```ts
import { JourneyClient, exportJourneyCode } from '@epilot/epilot-journey-sdk'

const client = new JourneyClient({ auth: token })
const journey = await client.getJourney('journey-id')
const code = exportJourneyCode(journey)
console.log(code) // → clean TypeScript with createJourney/createStep/create* calls
```

Or via CLI:
```bash
npx tsx examples/export-journey.ts <JOURNEY_ID>
```

## Examples

Runnable scripts in `examples/`:

| Script | Description |
|--------|-------------|
| `create-sales-inquiry.ts` | 4-step lead form with plan selection + GDPR consent |
| `create-product-journey.ts` | 6-step solar journey with availability check, roof planner, cart sidebar |
| `create-shopping-cart-journey.ts` | Product selection with `MainContentCartLayout` |
| `create-edge-case-journey.ts` | All block types: NumberInput, DatePicker, BinaryInput, Contact, Address, FileUpload, Consents, Products |
| `export-journey.ts` | Export any journey's JSON to readable SDK factory code |

```bash
# Authenticate first
epilot auth login

# Run any example
npx tsx examples/create-sales-inquiry.ts
```

## MCP Server (AI Agents)

The `mcp/` directory contains an MCP server that exposes journey management as tools for AI agents. Works with Claude Code, Claude Desktop, and any MCP-compatible client.

```bash
cd mcp && npm install
```

Add to Claude Code settings (`~/.claude/settings.json`):

```json
{
  "mcpServers": {
    "epilot-journeys": {
      "command": "npx",
      "args": ["tsx", "/path/to/epilot-journey-sdk/mcp/index.ts"],
      "env": { "EPILOT_TOKEN": "<token>" }
    }
  }
}
```

**Available tools:** `create_journey`, `get_journey`, `search_journeys`, `delete_journey`, `list_block_types`

See [mcp/README.md](mcp/README.md) for full documentation.

## Other Topics

- [Custom Blocks](custom-block.md) – build your own blocks for the Journey Builder
- [Journey Embed Script](embed-script.md) – embed epilot journeys with data injection

## Project Structure

```
src/
  client/
    index.ts        – JourneyClient class
    factories.ts    – Factory functions (createStep, createJourney, etc.)
    blockTypes.ts   – ControlName constants, value types, block catalog
    types.ts        – StepConfig, UISchemaElement, BlockRef, etc.
  utils/
    blocks.ts       – findBlock, updateBlock, addBlock, removeBlock
    parse.ts        – parseBlockValue, mergeBlockValue
examples/           – Runnable journey creation scripts
demo/               – Interactive playground (Vite + React + Tailwind)
mcp/                – MCP server for AI agent integration
```
