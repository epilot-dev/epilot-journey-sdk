import { CodeBlock } from '../components/CodeBlock';

const TOOLS = [
  {
    name: 'create_journey',
    description: 'Create a complete journey from a step/block specification. Each step has a name and an array of block definitions using factory names.',
    params: 'name, steps[], organizationId?, designId?, runtimeEntities?',
    returns: '{ journeyId, builderUrl, previewUrl }',
  },
  {
    name: 'get_journey',
    description: 'Retrieve a journey\'s full configuration by ID. Returns all steps, blocks, schema, and settings.',
    params: 'journeyId',
    returns: 'Full journey JSON',
  },
  {
    name: 'search_journeys',
    description: 'Search for journeys by name or query. Returns matching journey names, IDs, and status.',
    params: 'query?, size?',
    returns: '[{ id, name, createdAt, status }]',
  },
  {
    name: 'delete_journey',
    description: 'Delete a journey by ID.',
    params: 'journeyId',
    returns: 'Confirmation message',
  },
  {
    name: 'list_block_types',
    description: 'List all available block types with descriptions, categories, and factory function names.',
    params: 'category?',
    returns: '[{ controlName, displayName, category, description }]',
  },
  {
    name: 'get_blocks',
    description: 'List all blocks in a journey grouped by step. Returns type, scope, label, and step index for each block.',
    params: 'journeyId',
    returns: '[{ stepIndex, type, scope, label, id }]',
  },
  {
    name: 'patch_block',
    description: 'Update a specific block\'s properties on a live journey. Only changed fields need to be provided – they\'re merged into the existing block.',
    params: 'journeyId, stepIndex, blockName, patch',
    returns: '{ success, message, previewUrl }',
  },
  {
    name: 'add_block',
    description: 'Add a new block to a step on a live journey using a factory definition. Optionally specify insert position.',
    params: 'journeyId, stepIndex, block, position?',
    returns: '{ success, message, previewUrl }',
  },
  {
    name: 'remove_block',
    description: 'Remove a block from a live journey by its scope path or label.',
    params: 'journeyId, stepIndex, blockName',
    returns: '{ success, message, previewUrl }',
  },
  {
    name: 'patch_journey',
    description: 'Partially update journey-level properties (name, settings, etc.) without touching blocks.',
    params: 'journeyId, patch',
    returns: '{ success, message, previewUrl }',
  },
  {
    name: 'export_journey_code',
    description: 'Export a journey\'s wire format JSON into clean, readable SDK factory code. Converts the complex JSON into TypeScript with createJourney/createStep/create* calls.',
    params: 'journeyId',
    returns: 'TypeScript source code string',
  },
];

const RESOURCES = [
  { uri: 'epilot://docs/claude-md', name: 'CLAUDE.md', description: 'Agent instructions – factories, rules, gotchas' },
  { uri: 'epilot://docs/wire-format', name: 'Wire Format Reference', description: 'Exhaustive v3 block settings reference for all 35+ block types' },
  { uri: 'epilot://blocks/catalog', name: 'Block Catalog', description: 'All block types as structured JSON' },
];

const SETUP_CODE = `// Add to ~/.claude/settings.json (Claude Code)
// or ~/Library/Application Support/Claude/claude_desktop_config.json (Claude Desktop)

{
  "mcpServers": {
    "epilot-journeys": {
      "command": "npx",
      "args": ["tsx", "/path/to/epilot-journey-sdk/mcp/index.ts"],
      "env": {
        "EPILOT_TOKEN": "<your-token>",
        "EPILOT_ORG_ID": "739224"
      }
    }
  }
}`;

const EXAMPLE_CALL = `// What the agent sends (MCP tool call):
{
  "name": "create_journey",
  "arguments": {
    "name": "Solar Inquiry",
    "runtimeEntities": ["OPPORTUNITY"],
    "steps": [
      {
        "name": "Your Interest",
        "blocks": [
          { "factory": "createParagraph", "args": ["intro", "Tell us about your solar project."] },
          { "factory": "createSingleChoice", "args": {
            "name": "interest",
            "label": "What are you looking for?",
            "required": true,
            "options": {
              "uiType": "button",
              "choices": [
                { "label": "Solar Panels", "value": "solar" },
                { "label": "Heat Pump", "value": "heatpump" },
                { "label": "Wallbox", "value": "wallbox" }
              ]
            }
          }},
          { "factory": "createActionBar", "args": ["Next", { "label": "Continue" }] }
        ]
      },
      {
        "name": "Contact",
        "blocks": [
          { "factory": "createPersonalInformation", "args": { "name": "pi", "required": true } },
          { "factory": "createActionBar", "args": ["submit", { "label": "Submit", "actionType": "SubmitAndGoNext" }] }
        ]
      },
      {
        "name": "Thank You",
        "showStepper": false,
        "blocks": [
          { "factory": "createSuccessMessage", "args": ["thanks", { "title": "Thank you!", "text": "We will contact you shortly." }] }
        ]
      }
    ]
  }
}`;

const EXAMPLE_RESPONSE = `// MCP tool response:
{
  "journeyId": "de134910-2a42-11f1-ad12-6f9fdec9a777",
  "builderUrl": "https://portal.dev.epilot.cloud/app/journey-builder/journeys/de134910-...",
  "previewUrl": "https://portal.dev.epilot.cloud/journey-app/?journeyId=de134910-..."
}`;

// ─── Granular block update examples ──────────────────────────────

const PATCH_BLOCK_EXAMPLE = `// patch_block — Change a block's label and make it required
{
  "name": "patch_block",
  "arguments": {
    "journeyId": "de134910-2a42-11f1-ad12-6f9fdec9a777",
    "stepIndex": 0,
    "blockName": "#/properties/email",
    "patch": {
      "label": "Work Email Address",
      "options": { "required": true, "placeholder": "you@company.com" }
    }
  }
}`;

const ADD_BLOCK_EXAMPLE = `// add_block — Insert a phone field at position 3 in step 0
{
  "name": "add_block",
  "arguments": {
    "journeyId": "de134910-2a42-11f1-ad12-6f9fdec9a777",
    "stepIndex": 0,
    "position": 3,
    "block": {
      "factory": "createTextInput",
      "args": {
        "name": "phone",
        "label": "Phone Number",
        "required": true
      }
    }
  }
}`;

const REMOVE_BLOCK_EXAMPLE = `// remove_block — Remove the fax field from step 1
{
  "name": "remove_block",
  "arguments": {
    "journeyId": "de134910-2a42-11f1-ad12-6f9fdec9a777",
    "stepIndex": 1,
    "blockName": "#/properties/fax"
  }
}`;

const GET_BLOCKS_EXAMPLE = `// get_blocks — Inspect all blocks in a journey
{
  "name": "get_blocks",
  "arguments": {
    "journeyId": "de134910-2a42-11f1-ad12-6f9fdec9a777"
  }
}

// Response:
[
  { "stepIndex": 0, "type": "Label", "scope": "#/properties/intro", "label": null },
  { "stepIndex": 0, "type": "Control", "scope": "#/properties/interest", "label": "What are you looking for?" },
  { "stepIndex": 0, "type": "Control", "scope": "#/properties/notes", "label": "Notes" },
  { "stepIndex": 0, "type": "ActionBarControl", "scope": "#/properties/Next1", "label": null },
  { "stepIndex": 1, "type": "PersonalInformationControl", "scope": "#/properties/pi", "label": null },
  { "stepIndex": 1, "type": "ActionBarControl", "scope": "#/properties/submit", "label": null },
  { "stepIndex": 2, "type": "ConfirmationMessageControl", "scope": "#/properties/thanks", "label": null }
]`;

// ─── Export example ──────────────────────────────────────────────

const EXPORT_EXAMPLE = `// export_journey_code — Convert JSON blob to clean SDK code
{
  "name": "export_journey_code",
  "arguments": {
    "journeyId": "de134910-2a42-11f1-ad12-6f9fdec9a777"
  }
}`;

const EXPORT_RESPONSE = `// Response — ready-to-run TypeScript:
import {
  createJourney, createStep, createParagraph,
  createSingleChoice, createTextInput, createActionBar,
  createPersonalInformation, createSuccessMessage,
  JourneyClient,
} from '@epilot/epilot-journey-sdk'

const client = new JourneyClient({
  auth: process.env.EPILOT_TOKEN!,
  apiUrl: 'https://journey-config.dev.sls.epilot.io',
})

const journey = createJourney({
  organizationId: "739224",
  name: "Solar Inquiry",
  settings: { designId: "e22481d9-...", runtimeEntities: ["OPPORTUNITY"] },
  steps: [
    createStep({
      name: "Your Interest",
      showStepper: true,
      hideNextButton: true,
      blocks: [
        createParagraph("intro", "Tell us about your solar project."),
        createSingleChoice({
          name: "interest",
          label: "What are you looking for?",
          required: true,
          options: {
            uiType: "button",
            choices: [
              { label: "Solar Panels", value: "solar" },
              { label: "Heat Pump", value: "heatpump" },
              { label: "Wallbox", value: "wallbox" },
            ],
          },
        }),
        createTextInput({ name: "notes", label: "Notes", options: { multiline: true } }),
        createActionBar("Next1", { label: "Continue" }),
      ],
    }),
    createStep({
      name: "Contact",
      blocks: [
        createPersonalInformation({ name: "pi", required: true }),
        createActionBar("submit", { label: "Submit", actionType: "SubmitAndGoNext" }),
      ],
    }),
    createStep({
      name: "Thank You",
      showStepper: false,
      hideNextButton: true,
      blocks: [
        createSuccessMessage("thanks", { title: "Thank you!", text: "We will contact you shortly." }),
      ],
    }),
  ],
})

const created = await client.createJourney(journey)
console.log('Journey created:', (created as any).journeyId)`;

const CONVERSATION_EXAMPLE = `User: "Create a contact form with name, email, phone and a newsletter checkbox"

Claude: [calls create_journey]
  Done! Preview: https://portal.dev.epilot.cloud/journey-app/?journeyId=abc123

User: "Change the email label to Work Email"

Claude: [calls patch_block(abc123, 0, "#/properties/email", { label: "Work Email" })]
  Block updated!

User: "Add an address field after the personal info"

Claude: [calls add_block(abc123, 0, { factory: "createAddress", args: { name: "address" } }, 2)]
  Address block added at position 2.

User: "Remove the newsletter checkbox"

Claude: [calls remove_block(abc123, 0, "#/properties/newsletter")]
  Block removed.

User: "Export this journey to code"

Claude: [calls export_journey_code(abc123)]
  Here's your journey as SDK code:

  import { createJourney, createStep, ... } from '@epilot/epilot-journey-sdk'
  const journey = createJourney({ ... })`;

export function McpServerSection() {
  return (
    <div>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          MCP Integration
        </div>
        <h1 className="section-title">MCP Server</h1>
        <p className="section-desc">
          Model Context Protocol server that exposes journey management as tools for AI agents.
          Works with Claude Code, Claude Desktop, and any MCP-compatible client.
        </p>
      </div>

      <div style={{ position: 'relative', paddingBottom: '57.81584582441114%', height: 0 }}>
        <iframe
          src="https://www.loom.com/embed/051f7e9baa074e9a9a1edf158369ac4d"
          frameBorder="0"
          webkitallowfullscreen
          mozallowfullscreen
          allowFullScreen
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        ></iframe>
      </div>

      <br />
      <br />

      {/* Tools */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Available Tools</h2>
      <div className="grid grid-cols-1 gap-3 mb-12">
        {TOOLS.map((tool) => (
          <div key={tool.name} className="card">
            <div className="flex items-start gap-3 mb-2">
              <span className="font-mono text-sm text-primary-700 font-bold">{tool.name}</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
            <div className="flex flex-wrap gap-4 text-xs">
              <div>
                <span className="font-bold text-gray-400 uppercase tracking-wider">Params: </span>
                <span className="font-mono text-gray-600">{tool.params}</span>
              </div>
              <div>
                <span className="font-bold text-gray-400 uppercase tracking-wider">Returns: </span>
                <span className="font-mono text-gray-600">{tool.returns}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resources */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Resources</h2>
      <p className="text-sm text-gray-400 mb-4">Documentation exposed as MCP resources that agents can read on demand.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-12">
        {RESOURCES.map((r) => (
          <div key={r.uri} className="card">
            <p className="font-bold text-sm text-gray-900 mb-1">{r.name}</p>
            <p className="text-xs text-gray-500 mb-2">{r.description}</p>
            <p className="font-mono text-[11px] text-primary-600 break-all">{r.uri}</p>
          </div>
        ))}
      </div>

      {/* Setup */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Setup</h2>
      <div className="mb-4">
        <div className="flex items-start gap-2 rounded-xl px-4 py-2.5 text-xs mb-4" style={{
          background: 'rgba(99, 102, 241, 0.05)',
          border: '1px solid rgba(99, 102, 241, 0.1)',
          color: '#4f46e5',
        }}>
          <span>1.</span>
          <span>Install: <code className="font-mono bg-white/50 px-1 rounded">cd mcp && npm install</code></span>
        </div>
        <div className="flex items-start gap-2 rounded-xl px-4 py-2.5 text-xs mb-4" style={{
          background: 'rgba(99, 102, 241, 0.05)',
          border: '1px solid rgba(99, 102, 241, 0.1)',
          color: '#4f46e5',
        }}>
          <span>2.</span>
          <span>Get a token: <code className="font-mono bg-white/50 px-1 rounded">epilot auth login && export EPILOT_TOKEN=$(epilot auth token)</code></span>
        </div>
        <div className="flex items-start gap-2 rounded-xl px-4 py-2.5 text-xs mb-4" style={{
          background: 'rgba(99, 102, 241, 0.05)',
          border: '1px solid rgba(99, 102, 241, 0.1)',
          color: '#4f46e5',
        }}>
          <span>3.</span>
          <span>Add to your Claude settings:</span>
        </div>
      </div>
      <CodeBlock code={SETUP_CODE} title="Claude Settings" language="json" />

      {/* Example: Create */}
      <h2 className="text-xl font-bold text-gray-900 mt-12 mb-4">Example: Creating a Journey</h2>
      <p className="text-sm text-gray-400 mb-4">The agent calls <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-primary-700">create_journey</code> with a step/block spec. Block definitions reference factory names and their arguments.</p>
      <div className="space-y-4 mb-12">
        <CodeBlock code={EXAMPLE_CALL} title="create_journey — Tool Call" language="json" />
        <CodeBlock code={EXAMPLE_RESPONSE} title="Response" language="json" />
      </div>

      {/* Example: Granular updates */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Example: Granular Block Updates</h2>
      <p className="text-sm text-gray-400 mb-4">
        Edit blocks on live journeys without rewriting the whole config. Inspect, patch, add, or remove individual blocks.
      </p>
      <div className="space-y-4 mb-12">
        <CodeBlock code={GET_BLOCKS_EXAMPLE} title="get_blocks — Inspect journey structure" language="json" />
        <CodeBlock code={PATCH_BLOCK_EXAMPLE} title="patch_block — Update a block's properties" language="json" />
        <CodeBlock code={ADD_BLOCK_EXAMPLE} title="add_block — Insert a new block" language="json" />
        <CodeBlock code={REMOVE_BLOCK_EXAMPLE} title="remove_block — Delete a block" language="json" />
      </div>

      {/* Example: Export */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Example: Export Journey to Code</h2>
      <p className="text-sm text-gray-400 mb-4">
        Convert any journey's complex wire format JSON into clean, readable SDK factory code.
        Perfect for version control, creating templates, or understanding journey structure.
      </p>
      <div className="space-y-4 mb-12">
        <CodeBlock code={EXPORT_EXAMPLE} title="export_journey_code — Tool Call" language="json" />
        <CodeBlock code={EXPORT_RESPONSE} title="Response — Clean TypeScript" language="typescript" />
      </div>

      {/* Conversation example */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Example Conversation</h2>
      <div className="card mb-12">
        <pre className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{CONVERSATION_EXAMPLE}</pre>
      </div>

      {/* Env vars */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Environment Variables</h2>
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-50">
              <th className="text-left px-4 py-2.5 font-bold text-gray-500 text-xs uppercase tracking-wider">Variable</th>
              <th className="text-left px-4 py-2.5 font-bold text-gray-500 text-xs uppercase tracking-wider">Required</th>
              <th className="text-left px-4 py-2.5 font-bold text-gray-500 text-xs uppercase tracking-wider">Default</th>
              <th className="text-left px-4 py-2.5 font-bold text-gray-500 text-xs uppercase tracking-wider">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-100">
              <td className="px-4 py-2.5 font-mono text-primary-700 font-semibold">EPILOT_TOKEN</td>
              <td className="px-4 py-2.5 text-red-600 font-semibold">Yes</td>
              <td className="px-4 py-2.5 text-gray-400">-</td>
              <td className="px-4 py-2.5 text-gray-600">Cognito ID token or API token</td>
            </tr>
            <tr className="border-t border-gray-100">
              <td className="px-4 py-2.5 font-mono text-primary-700 font-semibold">EPILOT_API_URL</td>
              <td className="px-4 py-2.5 text-gray-400">No</td>
              <td className="px-4 py-2.5 font-mono text-xs text-gray-500">journey-config.dev.sls.epilot.io</td>
              <td className="px-4 py-2.5 text-gray-600">Journey API base URL</td>
            </tr>
            <tr className="border-t border-gray-100">
              <td className="px-4 py-2.5 font-mono text-primary-700 font-semibold">EPILOT_ORG_ID</td>
              <td className="px-4 py-2.5 text-gray-400">No</td>
              <td className="px-4 py-2.5 font-mono text-xs text-gray-500">739224</td>
              <td className="px-4 py-2.5 text-gray-600">Default organization ID</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
