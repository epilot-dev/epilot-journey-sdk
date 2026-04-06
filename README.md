# epilot Journey SDK
[![npm version](https://badge.fury.io/js/@epilot%2Fepilot-journey-sdk.svg)](https://www.npmjs.com/package/@epilot/epilot-journey-sdk)

epilot Journey SDK is a tool that allows developers to create Custom Blocks for the epilot Journey Builder.

Be aware that some of the features are still experimental.

<details>
  <summary>Terminology</summary>
  <p>
    <strong>Journey Builder:</strong> is a tool for building flexible Journeys in the 360 epilot platform.
  </p>
  <p>
    <strong>The configuring user:</strong> is a user of epilot 360 that has access to the tool Journey Builder.
  </p>
</details>


## Topics in this SDK (v1)

* [Custom Block for epilot Journeys](custom-block.md): How to build your own blocks.

* [Journey Embed Script](embed-script.md): How to embed epilot Journey with advanced options such as data injection.


## v2 Alpha – Journey Toolkit

> **Branch:** [`v2-alpha`](https://github.com/epilot-dev/epilot-journey-sdk/tree/v2-alpha)
> **npm:** `@epilot/epilot-journey-sdk@2.0.0-alpha.1`
> **Playground:** [docs.epilot.io/journey-sdk-playground](https://docs.epilot.io/journey-sdk-playground)

The `v2-alpha` branch extends this SDK with a full **agentic toolkit** for programmatic journey creation, editing, and export. It lives on a separate branch because the bundle size difference is significant:

| | v1 (main) | v2 (alpha) |
|---|---|---|
| CJS | 2.79 KB | 56.21 KB |
| ESM | 1.67 KB | 53.54 KB |
| DTS | – | 64.23 KB |

v1 is lightweight – embedding and custom blocks only. v2 bundles the full journey-client, factory functions, block catalog, and utilities. We may split these into separate packages in the future (e.g. `@epilot/journey-embed-sdk` vs `@epilot/journey-toolkit`).

### What v2-alpha adds

- **Headless `JourneyClient`** – CRUD + block-level `patchBlock`, `addBlock`, `removeBlock` for surgical edits
- **20+ factory functions** – `createStep`, `createJourney`, `createPersonalInformation`, etc. producing valid v3 wire format
- **35-type block catalog** – `ControlName`, `BLOCK_CATALOG` with typed value and settings interfaces
- **Export journey to code** – `exportJourneyCode()` converts any journey's JSON into clean SDK factory calls
- **MCP server** – 11 tools for AI agents (create, edit, export journeys)
- **Wire format reference** – exhaustive mapping of every block type's settings to v3 API format
- **Interactive playground** – block catalog browser, factory docs, examples
- **70 tests** – block CRUD, factory correctness, value parsing

### Install v2-alpha

```bash
npm install @epilot/epilot-journey-sdk@2.0.0-alpha.1
```

### Quick start (v2)

```ts
import {
  JourneyClient, createJourney, createStep,
  createPersonalInformation, createActionBar, createSuccessMessage,
} from '@epilot/epilot-journey-sdk'

const client = new JourneyClient({ auth: token })

const journey = createJourney({
  organizationId: '<ORG_ID>',
  name: 'Contact Form',
  steps: [
    createStep({
      name: 'Contact',
      blocks: [
        createPersonalInformation({ name: 'pi', required: true }),
        createActionBar('submit', { label: 'Submit', actionType: 'SubmitAndGoNext' }),
      ],
    }),
    createStep({
      name: 'Thank You',
      showStepper: false,
      hideNextButton: true,
      blocks: [createSuccessMessage('thanks', { title: 'Thank you!' })],
    }),
  ],
})

await client.createJourney(journey)
```

See the [v2-alpha branch](https://github.com/epilot-dev/epilot-journey-sdk/tree/v2-alpha) for full documentation, MCP server setup, and examples.
