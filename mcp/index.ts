#!/usr/bin/env npx tsx
/**
 * epilot Journey MCP Server
 *
 * Exposes journey creation and management as MCP tools.
 * Any Claude session (Claude Code, Claude Desktop, claude.ai) can use these.
 *
 * Setup:
 *   cd mcp && npm install
 *
 * Run:
 *   EPILOT_TOKEN=<token> npx tsx index.ts
 *
 * Add to Claude Code settings (~/.claude/settings.json):
 *   "mcpServers": {
 *     "epilot-journeys": {
 *       "command": "npx",
 *       "args": ["tsx", "/path/to/epilot-journey-sdk/mcp/index.ts"],
 *       "env": { "EPILOT_TOKEN": "<token>" }
 *     }
 *   }
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import {
  JourneyClient,
  createJourney, createStep,
  createTextInput, createNumberInput, createBinaryInput,
  createDatePicker, createSingleChoice, createMultipleChoice,
  createPersonalInformation, createContact, createAddress,
  createProductSelection, createShoppingCart,
  createAvailabilityCheck, createPVRoofPlanner,
  createFileUpload, createPaymentMethod, createConsents,
  createParagraph, createImage, createActionBar,
  createSuccessMessage, createSummary, createBlock,
  ControlName, BLOCK_CATALOG,
  exportJourneyCode,
} from '@epilot/epilot-journey-sdk'

// ─── Config ──────────────────────────────────────────────────────

const TOKEN = process.env.EPILOT_TOKEN
const API_URL = process.env.EPILOT_API_URL || 'https://journey-config.dev.sls.epilot.io'
const ORG_ID = process.env.EPILOT_ORG_ID || '739224'

if (!TOKEN) {
  console.error('EPILOT_TOKEN env var is required')
  process.exit(1)
}

const client = new JourneyClient({ auth: TOKEN, apiUrl: API_URL })

// ─── Factory registry ────────────────────────────────────────────

const BLOCK_FACTORIES: Record<string, (...args: any[]) => any> = {
  createTextInput,
  createNumberInput,
  createBinaryInput,
  createDatePicker,
  createSingleChoice,
  createMultipleChoice,
  createPersonalInformation,
  createContact,
  createAddress,
  createProductSelection,
  createShoppingCart,
  createAvailabilityCheck,
  createPVRoofPlanner,
  createFileUpload,
  createPaymentMethod,
  createConsents,
  createParagraph,
  createImage,
  createActionBar,
  createSuccessMessage,
  createSummary,
  createBlock,
}

// Positional-arg factories need special handling
const POSITIONAL_FACTORIES = new Set([
  'createParagraph',    // (name, text, label?)
  'createImage',        // (name, url, opts?)
  'createActionBar',    // (name, opts?)
  'createSuccessMessage', // (name, opts?)
  'createSummary',      // (name, opts?)
  'createShoppingCart',  // (name, opts?)
])

// ─── MCP Server ──────────────────────────────────────────────────

const server = new Server(
  { name: 'epilot-journeys', version: '0.1.0' },
  { capabilities: { tools: {}, resources: {} } }
)

// ─── Resources ───────────────────────────────────────────────────

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: 'epilot://docs/claude-md',
      name: 'CLAUDE.md',
      description: 'Agent instructions for the epilot Journey SDK – factories, rules, gotchas',
      mimeType: 'text/markdown',
    },
    {
      uri: 'epilot://docs/wire-format',
      name: 'Wire Format Reference',
      description: 'Exhaustive v3 block settings reference',
      mimeType: 'text/markdown',
    },
    {
      uri: 'epilot://blocks/catalog',
      name: 'Block Catalog',
      description: 'All block types with descriptions and categories',
      mimeType: 'application/json',
    },
  ],
}))

const __dirname = dirname(fileURLToPath(import.meta.url))

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params
  switch (uri) {
    case 'epilot://docs/claude-md':
      return {
        contents: [{
          uri,
          mimeType: 'text/markdown',
          text: readFileSync(resolve(__dirname, '..', 'CLAUDE.md'), 'utf-8'),
        }],
      }
    case 'epilot://docs/wire-format':
      return {
        contents: [{
          uri,
          mimeType: 'text/markdown',
          text: readFileSync(resolve(__dirname, '..', 'WIRE_FORMAT_REFERENCE.md'), 'utf-8'),
        }],
      }
    case 'epilot://blocks/catalog':
      return {
        contents: [{
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(BLOCK_CATALOG, null, 2),
        }],
      }
    default:
      throw new Error(`Unknown resource: ${uri}`)
  }
})

// ─── Tools ───────────────────────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'create_journey',
      description: 'Create a complete journey from a step/block specification. Each step has a name and an array of block definitions. Returns the journey ID and preview URL.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          name: { type: 'string', description: 'Journey name' },
          organizationId: { type: 'string', description: `Organization ID (default: ${ORG_ID})` },
          designId: { type: 'string', description: 'Design/theme ID (optional)' },
          runtimeEntities: {
            type: 'array',
            items: { type: 'string' },
            description: 'Entities to create on submission: ORDER, OPPORTUNITY',
          },
          steps: {
            type: 'array',
            description: 'Array of step definitions',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                blocks: {
                  type: 'array',
                  description: 'Array of block definitions. Each has a "factory" name and "args" (object or array for positional factories)',
                  items: {
                    type: 'object',
                    properties: {
                      factory: { type: 'string', description: 'Factory function name, e.g. createTextInput, createParagraph' },
                      args: { description: 'Arguments: object for opts-style factories, or array for positional factories like createParagraph' },
                    },
                    required: ['factory'],
                  },
                },
                sidebarBlocks: {
                  type: 'array',
                  description: 'Sidebar blocks (for MainContentCartLayout)',
                  items: {
                    type: 'object',
                    properties: {
                      factory: { type: 'string' },
                      args: {},
                    },
                    required: ['factory'],
                  },
                },
                layout: { type: 'string', description: 'Step layout: MainLinearLayout (default) or MainContentCartLayout' },
                showStepper: { type: 'boolean', default: true },
                hideNextButton: { type: 'boolean', default: true },
              },
              required: ['name', 'blocks'],
            },
          },
        },
        required: ['name', 'steps'],
      },
    },
    {
      name: 'get_journey',
      description: 'Get a journey by ID. Returns the full journey configuration.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          journeyId: { type: 'string', description: 'Journey UUID' },
        },
        required: ['journeyId'],
      },
    },
    {
      name: 'search_journeys',
      description: 'Search journeys by query. Returns matching journey names and IDs.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          query: { type: 'string', description: 'Search query (Lucene syntax, default: *)' },
          size: { type: 'number', description: 'Max results (default: 10)' },
        },
      },
    },
    {
      name: 'delete_journey',
      description: 'Delete a journey by ID.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          journeyId: { type: 'string', description: 'Journey UUID to delete' },
        },
        required: ['journeyId'],
      },
    },
    {
      name: 'list_block_types',
      description: 'List all available block types with descriptions, categories, and factory function names.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          category: { type: 'string', description: 'Filter by category: input, display, composite, navigation, commerce, utility, third-party' },
        },
      },
    },
    {
      name: 'get_blocks',
      description: 'List all blocks in a journey, grouped by step. Returns block type, scope, label, and step index for each block.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          journeyId: { type: 'string', description: 'Journey UUID' },
        },
        required: ['journeyId'],
      },
    },
    {
      name: 'patch_block',
      description: 'Update a specific block\'s properties on a live journey. Merges the patch into the existing block – only changed fields need to be provided.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          journeyId: { type: 'string', description: 'Journey UUID' },
          stepIndex: { type: 'number', description: 'Zero-based step index' },
          blockName: { type: 'string', description: 'Block scope (e.g. "#/properties/email") or label' },
          patch: {
            type: 'object',
            description: 'Properties to merge: label, options, etc. Only include fields you want to change.',
          },
        },
        required: ['journeyId', 'stepIndex', 'blockName', 'patch'],
      },
    },
    {
      name: 'add_block',
      description: 'Add a new block to a step on a live journey. Uses a factory definition to create the block.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          journeyId: { type: 'string', description: 'Journey UUID' },
          stepIndex: { type: 'number', description: 'Zero-based step index to add the block to' },
          position: { type: 'number', description: 'Insert position within the step (0 = first, omit = append to end)' },
          block: {
            type: 'object',
            description: 'Block definition with factory name and args',
            properties: {
              factory: { type: 'string', description: 'Factory function name' },
              args: { description: 'Factory arguments (object or array for positional)' },
            },
            required: ['factory'],
          },
        },
        required: ['journeyId', 'stepIndex', 'block'],
      },
    },
    {
      name: 'remove_block',
      description: 'Remove a block from a live journey by its scope or label.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          journeyId: { type: 'string', description: 'Journey UUID' },
          stepIndex: { type: 'number', description: 'Zero-based step index' },
          blockName: { type: 'string', description: 'Block scope (e.g. "#/properties/email") or label' },
        },
        required: ['journeyId', 'stepIndex', 'blockName'],
      },
    },
    {
      name: 'patch_journey',
      description: 'Partially update journey-level properties (name, settings, etc.) without touching blocks.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          journeyId: { type: 'string', description: 'Journey UUID' },
          patch: {
            type: 'object',
            description: 'Properties to update: name, settings, etc.',
          },
        },
        required: ['journeyId', 'patch'],
      },
    },
    {
      name: 'export_journey_code',
      description: 'Export a journey\'s wire format JSON into clean, readable SDK factory code. Converts the complex JSON blob into TypeScript using createJourney/createStep/create* factory calls. Perfect for understanding journey structure, creating templates, or version-controlling journeys as code.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          journeyId: { type: 'string', description: 'Journey UUID to export' },
        },
        required: ['journeyId'],
      },
    },
  ],
}))

// ─── Tool handlers ───────────────────────────────────────────────

function buildBlock(def: { factory: string; args?: any }): any {
  const fn = BLOCK_FACTORIES[def.factory]
  if (!fn) {
    throw new Error(`Unknown factory: ${def.factory}. Available: ${Object.keys(BLOCK_FACTORIES).join(', ')}`)
  }

  if (POSITIONAL_FACTORIES.has(def.factory)) {
    // Positional args: expect an array
    const args = Array.isArray(def.args) ? def.args : [def.args]
    return fn(...args)
  }

  // Options-style: single object arg
  return fn(def.args || {})
}

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  try {
    switch (name) {
      case 'create_journey': {
        const { name: journeyName, organizationId, designId, runtimeEntities, steps: stepDefs } = args as any

        const steps = stepDefs.map((stepDef: any) => {
          const blocks = (stepDef.blocks || []).map(buildBlock)
          const sidebarBlocks = (stepDef.sidebarBlocks || []).map(buildBlock)

          return createStep({
            name: stepDef.name,
            blocks,
            sidebarBlocks: sidebarBlocks.length ? sidebarBlocks : undefined,
            layout: stepDef.layout,
            showStepper: stepDef.showStepper ?? true,
            showStepperLabels: true,
            hideNextButton: stepDef.hideNextButton ?? true,
          })
        })

        const journey = createJourney({
          organizationId: organizationId || ORG_ID,
          name: journeyName,
          steps,
          settings: {
            designId: designId || '',
            runtimeEntities: runtimeEntities || ['OPPORTUNITY'],
          },
        })

        const created = await client.createJourney(journey) as any
        const id = created?.journeyId || created?.createdJourney?.journeyId || created?.id

        const portalBase = API_URL.includes('dev') ? 'portal.dev.epilot.cloud' : 'portal.epilot.cloud'

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              journeyId: id,
              builderUrl: `https://${portalBase}/app/journey-builder/journeys/${id}`,
              previewUrl: `https://${portalBase}/journey-app/?journeyId=${id}`,
            }, null, 2),
          }],
        }
      }

      case 'get_journey': {
        const journey = await client.getJourney((args as any).journeyId)
        return {
          content: [{
            type: 'text',
            text: (() => {
              const full = JSON.stringify(journey, null, 2)
              if (full.length > 50000) return full.slice(0, 50000) + '\n\n[TRUNCATED — full response is ' + full.length + ' chars. Use export_journey_code for a readable view.]'
              return full
            })(),
          }],
        }
      }

      case 'search_journeys': {
        const results = await client.searchJourneys({
          query: (args as any).query || '*',
          size: (args as any).size || 10,
        }) as any[]

        const simplified = results.map((r: any) => ({
          id: r._id,
          name: r.journey_name,
          createdAt: r._created_at,
          status: r.settings?.isActive ? 'active' : 'inactive',
        }))

        return {
          content: [{
            type: 'text',
            text: JSON.stringify(simplified, null, 2),
          }],
        }
      }

      case 'delete_journey': {
        await client.deleteJourney((args as any).journeyId)
        return {
          content: [{
            type: 'text',
            text: `Journey ${(args as any).journeyId} deleted.`,
          }],
        }
      }

      case 'list_block_types': {
        const category = (args as any)?.category
        const filtered = category
          ? BLOCK_CATALOG.filter((b) => b.category === category)
          : BLOCK_CATALOG

        const simplified = filtered.map((b) => ({
          controlName: b.controlName,
          displayName: b.displayName,
          category: b.category,
          description: b.description,
          hasValue: b.hasValue,
          commonlyUsed: b.commonlyUsed,
        }))

        return {
          content: [{
            type: 'text',
            text: JSON.stringify(simplified, null, 2),
          }],
        }
      }

      // ─── Block-level operations ──────────────────────────────

      case 'get_blocks': {
        const journey = await client.getJourney((args as any).journeyId) as any
        const allBlocks = client.getBlocks(journey)
        const simplified = allBlocks.map(({ stepIndex, block }) => ({
          stepIndex,
          type: block.type,
          scope: block.scope,
          label: block.label,
          id: block.id,
          hasOptions: !!block.options,
        }))

        return {
          content: [{
            type: 'text',
            text: JSON.stringify(simplified, null, 2),
          }],
        }
      }

      case 'patch_block': {
        const { journeyId, stepIndex, blockName, patch } = args as any
        const updated = await client.patchBlock(journeyId, { stepIndex, blockName }, patch)
        const portalBase = API_URL.includes('dev') ? 'portal.dev.epilot.cloud' : 'portal.epilot.cloud'

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `Block "${blockName}" in step ${stepIndex} updated.`,
              previewUrl: `https://${portalBase}/journey-app/?journeyId=${journeyId}`,
            }, null, 2),
          }],
        }
      }

      case 'add_block': {
        const { journeyId, stepIndex, position, block: blockDef } = args as any
        const newBlock = buildBlock(blockDef)
        const updated = await client.addBlock(journeyId, stepIndex, newBlock, position)
        const portalBase = API_URL.includes('dev') ? 'portal.dev.epilot.cloud' : 'portal.epilot.cloud'

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `Block added to step ${stepIndex}${position !== undefined ? ` at position ${position}` : ' at end'}.`,
              previewUrl: `https://${portalBase}/journey-app/?journeyId=${journeyId}`,
            }, null, 2),
          }],
        }
      }

      case 'remove_block': {
        const { journeyId, stepIndex, blockName } = args as any
        await client.removeBlock(journeyId, { stepIndex, blockName })
        const portalBase = API_URL.includes('dev') ? 'portal.dev.epilot.cloud' : 'portal.epilot.cloud'

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `Block "${blockName}" removed from step ${stepIndex}.`,
              previewUrl: `https://${portalBase}/journey-app/?journeyId=${journeyId}`,
            }, null, 2),
          }],
        }
      }

      case 'patch_journey': {
        const { journeyId, patch } = args as any
        const updated = await client.patchJourney(journeyId, patch)
        const portalBase = API_URL.includes('dev') ? 'portal.dev.epilot.cloud' : 'portal.epilot.cloud'

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `Journey ${journeyId} updated.`,
              previewUrl: `https://${portalBase}/journey-app/?journeyId=${journeyId}`,
            }, null, 2),
          }],
        }
      }

      case 'export_journey_code': {
        const journey = await client.getJourney((args as any).journeyId) as any
        const code = exportJourneyCode(journey)

        return {
          content: [{
            type: 'text',
            text: code,
          }],
        }
      }

      default:
        throw new Error(`Unknown tool: ${name}`)
    }
  } catch (error: any) {
    const message = error?.response?.data
      ? JSON.stringify(error.response.data)
      : error.message

    return {
      content: [{ type: 'text', text: `Error: ${message}` }],
      isError: true,
    }
  }
})

// ─── Start ───────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('epilot Journey MCP server running on stdio')
}

main().catch((err) => {
  console.error('Failed to start:', err)
  process.exit(1)
})
