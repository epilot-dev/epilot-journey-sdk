# epilot Journey MCP Server

MCP (Model Context Protocol) server that exposes epilot journey creation and management as tools for AI agents. Works with Claude Code, Claude Desktop, and any MCP-compatible client.

## Setup

```bash
cd mcp
npm install
```

## Configuration

The server is configured via environment variables:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `EPILOT_TOKEN` | Yes | – | Cognito ID token or API token for authentication |
| `EPILOT_API_URL` | No | `https://journey-config.dev.sls.epilot.io` | Journey API base URL |
| `EPILOT_ORG_ID` | No | `739224` | Default organization ID for new journeys |

### Getting a token

```bash
# Via epilot CLI (recommended)
epilot auth login
export EPILOT_TOKEN=$(epilot auth token)

# Or use a Cognito token from the dev portal
# Open portal.dev.epilot.cloud → browser console → getToken()
```

## Running

```bash
EPILOT_TOKEN=<token> npx tsx index.ts
```

The server communicates over stdio using the MCP protocol.

## Integration with Claude Code

Add to your Claude Code settings (`~/.claude/settings.json`):

```json
{
  "mcpServers": {
    "epilot-journeys": {
      "command": "npx",
      "args": ["tsx", "/absolute/path/to/epilot-journey-sdk/mcp/index.ts"],
      "env": {
        "EPILOT_TOKEN": "<your-token>",
        "EPILOT_ORG_ID": "739224"
      }
    }
  }
}
```

## Integration with Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "epilot-journeys": {
      "command": "npx",
      "args": ["tsx", "/absolute/path/to/epilot-journey-sdk/mcp/index.ts"],
      "env": {
        "EPILOT_TOKEN": "<your-token>"
      }
    }
  }
}
```

## Available Tools

### `create_journey`

Create a complete journey from a step/block specification.

**Parameters:**
- `name` (string, required) – Journey name
- `steps` (array, required) – Step definitions (see below)
- `organizationId` (string) – Org ID, defaults to env var
- `designId` (string) – Design/theme ID
- `runtimeEntities` (string[]) – Entities to create on submission: `ORDER`, `OPPORTUNITY`

**Step definition:**
```json
{
  "name": "Contact Details",
  "layout": "MainLinearLayout",
  "showStepper": true,
  "hideNextButton": true,
  "blocks": [
    { "factory": "createPersonalInformation", "args": { "name": "pi", "required": true } },
    { "factory": "createAddress", "args": { "name": "address", "required": true } },
    { "factory": "createActionBar", "args": ["Next", { "label": "Continue" }] }
  ],
  "sidebarBlocks": []
}
```

**Block definitions** use factory names and args:
- **Options-style factories** – `args` is an object: `{ "factory": "createTextInput", "args": { "name": "notes", "label": "Notes" } }`
- **Positional factories** – `args` is an array: `{ "factory": "createParagraph", "args": ["intro", "Welcome!"] }`

Positional factories: `createParagraph`, `createImage`, `createActionBar`, `createSuccessMessage`, `createSummary`, `createShoppingCart`

**Returns:**
```json
{
  "journeyId": "de134910-2a42-11f1-ad12-6f9fdec9a777",
  "builderUrl": "https://portal.dev.epilot.cloud/app/journey-builder/journeys/de134910-...",
  "previewUrl": "https://portal.dev.epilot.cloud/journey-app/?journeyId=de134910-..."
}
```

**Example prompt:**
> "Create a 3-step solar inquiry journey: availability check → contact details with address → confirmation"

### `get_journey`

Retrieve a journey's full configuration by ID.

**Parameters:**
- `journeyId` (string, required) – Journey UUID

**Returns:** Full journey JSON (steps, blocks, schema, settings)

### `search_journeys`

Search for journeys by name or query.

**Parameters:**
- `query` (string) – Lucene search query, defaults to `*`
- `size` (number) – Max results, defaults to 10

**Returns:**
```json
[
  { "id": "de134910-...", "name": "Solar Inquiry", "createdAt": "2026-03-28T...", "status": "inactive" }
]
```

### `delete_journey`

Delete a journey by ID.

**Parameters:**
- `journeyId` (string, required) – Journey UUID to delete

### `list_block_types`

List all available block types with descriptions and factory names.

**Parameters:**
- `category` (string, optional) – Filter by category: `input`, `display`, `composite`, `navigation`, `commerce`, `utility`, `third-party`

**Returns:** Array of block type entries with `controlName`, `displayName`, `category`, `description`, `hasValue`, `commonlyUsed`

### `get_blocks`

List all blocks in a journey, grouped by step. Useful for understanding a journey's structure before making edits.

**Parameters:**
- `journeyId` (string, required) – Journey UUID

**Returns:**
```json
[
  { "stepIndex": 0, "type": "Control", "scope": "#/properties/email", "label": "Email", "id": "abc-123" },
  { "stepIndex": 0, "type": "PersonalInformationControl", "scope": "#/properties/pi", "label": "Your Details", "id": "def-456" }
]
```

### `patch_block`

Update a specific block's properties on a live journey. Only send the fields you want to change – they're merged into the existing block.

**Parameters:**
- `journeyId` (string, required) – Journey UUID
- `stepIndex` (number, required) – Zero-based step index
- `blockName` (string, required) – Block scope (e.g. `#/properties/email`) or label
- `patch` (object, required) – Properties to merge (label, options, etc.)

**Example:**
```json
{
  "journeyId": "de134910-...",
  "stepIndex": 0,
  "blockName": "#/properties/email",
  "patch": { "label": "Work Email", "options": { "required": true } }
}
```

### `add_block`

Add a new block to a step on a live journey. Uses a factory definition to create the block.

**Parameters:**
- `journeyId` (string, required) – Journey UUID
- `stepIndex` (number, required) – Step to add the block to
- `block` (object, required) – Factory name + args
- `position` (number, optional) – Insert position (0 = first, omit = append)

**Example:**
```json
{
  "journeyId": "de134910-...",
  "stepIndex": 0,
  "position": 2,
  "block": { "factory": "createTextInput", "args": { "name": "phone", "label": "Phone Number" } }
}
```

### `remove_block`

Remove a block from a live journey.

**Parameters:**
- `journeyId` (string, required) – Journey UUID
- `stepIndex` (number, required) – Step containing the block
- `blockName` (string, required) – Block scope or label

### `patch_journey`

Update journey-level properties without touching blocks.

**Parameters:**
- `journeyId` (string, required) – Journey UUID
- `patch` (object, required) – Properties to update (name, settings, etc.)

**Example:**
```json
{
  "journeyId": "de134910-...",
  "patch": { "name": "Updated Journey Name" }
}
```

### `export_journey_code`

Export a journey's wire format JSON into clean, readable SDK factory code. Converts the complex JSON blob into TypeScript using `createJourney`/`createStep`/`create*` factory calls.

**Parameters:**
- `journeyId` (string, required) – Journey UUID to export

**Returns:** TypeScript source code string with all factory calls, ready to run.

**Example prompt:**
> "Export journey abc123 to SDK code so I can version-control it"

**Example output:**
```ts
import {
  createJourney, createStep, createParagraph,
  createSingleChoice, createActionBar, createSuccessMessage,
} from '@epilot/epilot-journey-sdk'

const journey = createJourney({
  organizationId: "739224",
  name: "Solar Inquiry",
  settings: { designId: "e22481d9-...", runtimeEntities: ["OPPORTUNITY"] },
  steps: [
    createStep({
      name: "Your Interest",
      blocks: [
        createParagraph("intro", "What are you looking for?"),
        createSingleChoice({ name: "plan", label: "Select plan", options: { uiType: "button", choices: [...] } }),
        createActionBar("Next", { label: "Continue" }),
      ],
    }),
    // ...
  ],
})
```

## Available Resources

The server also exposes documentation as MCP resources that agents can read:

| URI | Description |
|-----|-------------|
| `epilot://docs/claude-md` | Agent instructions – factories, rules, gotchas |
| `epilot://docs/wire-format` | Exhaustive v3 block settings reference |
| `epilot://blocks/catalog` | All block types as JSON |

## Example Conversations

### Creating a journey from scratch
```
User: Create a 3-step solar inquiry: interest form → contact details → confirmation

Claude: [calls create_journey with 3 steps using createSingleChoice, createPersonalInformation, etc.]
→ Journey created!
  - Preview: https://portal.dev.epilot.cloud/journey-app/?journeyId=abc123
```

### Editing blocks on a live journey
```
User: Change the email label to "Work Email" on step 1 of journey abc123

Claude: [calls patch_block(abc123, 0, "#/properties/email", { label: "Work Email" })]
→ Block updated. Preview: https://...

User: Add a phone number field after the email

Claude: [calls add_block(abc123, 0, { factory: "createTextInput", args: { name: "phone", label: "Phone" } }, 3)]
→ Block added at position 3. Preview: https://...

User: Remove the fax field from step 2

Claude: [calls remove_block(abc123, 1, "#/properties/fax")]
→ Block removed. Preview: https://...
```

### Inspecting and exporting
```
User: What blocks are in journey abc123?

Claude: [calls get_blocks(abc123)]
→ Step 0: PersonalInformation (#/properties/pi), Address (#/properties/address), ActionBar
  Step 1: Summary, ActionBar (SubmitAndGoNext)
  Step 2: SuccessMessage

User: Export that journey to SDK code

Claude: [calls export_journey_code(abc123)]
→ import { createJourney, createStep, createPersonalInformation, ... } from '@epilot/epilot-journey-sdk'
  const journey = createJourney({ ... })

User: What block types support file uploads?

Claude: [calls list_block_types(category: "input")]
→ FileUpload (UploadPanelControl) – File upload with type restrictions, max quantity, and tagging.
```

## Available Block Factories

| Factory | Signature | Use Case |
|---------|----------|----------|
| `createTextInput` | `{ name, label?, options? }` | Free text or multiline input |
| `createNumberInput` | `{ name, label?, unit?, range? }` | Numeric input with unit |
| `createSingleChoice` | `{ name, options: { uiType, choices[] } }` | Button/radio/dropdown selection |
| `createMultipleChoice` | `{ name, options: { uiType, choices[] } }` | Checkbox/button multi-select |
| `createBinaryInput` | `{ name, label?, toggle? }` | Switch or checkbox toggle |
| `createDatePicker` | `{ name, label?, showTime?, disablePast? }` | Date or datetime picker |
| `createPersonalInformation` | `{ name, options? }` | Name, email, phone (defaults fields) |
| `createContact` | `{ name, options? }` | Contact-specific fields |
| `createAddress` | `{ name, options? }` | Address with autocomplete (defaults DE) |
| `createProductSelection` | `{ name, options: { products[] } }` | Product tiles with pricing |
| `createShoppingCart` | `[name, opts?]` | Cart sidebar (positional) |
| `createConsents` | `{ name, options: { items } }` | GDPR/terms checkboxes |
| `createFileUpload` | `{ name, options? }` | File upload dropzone |
| `createPaymentMethod` | `{ name, options: { implementations[] } }` | SEPA + Bank Transfer |
| `createAvailabilityCheck` | `{ name, options }` | Service coverage check |
| `createPVRoofPlanner` | `{ name, options? }` | Solar roof planner |
| `createParagraph` | `[name, text]` | Rich text (positional) |
| `createImage` | `[name, url, opts?]` | Image display (positional) |
| `createActionBar` | `[name, opts?]` | Navigation buttons (positional) |
| `createSuccessMessage` | `[name, opts?]` | Confirmation message (positional) |
| `createSummary` | `[name, opts?]` | Review block (positional) |
