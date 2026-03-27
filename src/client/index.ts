import { getClient } from '@epilot/journey-client'
import type { Client } from '@epilot/journey-client'

import {
  findBlock,
  getAllBlocks,
  getStepBlocks,
  updateBlock as updateBlockUtil,
  addBlock as addBlockUtil,
  removeBlock as removeBlockUtil,
} from '../utils/blocks.js'
import type {
  JourneyClientOptions,
  JourneyRaw,
  StepConfig,
  UISchemaElement,
  BlockRef,
  SearchOptions,
} from './types.js'

/**
 * Headless client for programmatic journey and block configuration.
 *
 * Wraps the epilot Journey API with block-level operations,
 * making it easy for AI assistants and scripts to configure journeys.
 *
 * @example Basic usage
 * ```ts
 * import { JourneyClient } from '@epilot/epilot-journey-sdk'
 *
 * const client = new JourneyClient({ auth: 'your-api-token' })
 *
 * // Get a journey and inspect its blocks
 * const journey = await client.getJourney('journey-id')
 * const blocks = client.getBlocks(journey)
 * console.log(blocks.map(b => `${b.block.label} (step ${b.stepIndex})`))
 *
 * // Partially update a single block
 * const updated = await client.patchBlock('journey-id', {
 *   stepIndex: 0,
 *   blockName: '#/properties/email',
 * }, { label: 'Work Email' })
 * ```
 */
export class JourneyClient {
  private apiClient: Client

  constructor(options: JourneyClientOptions) {
    this.apiClient = getClient()

    if (options.apiUrl) {
      this.apiClient.defaults.baseURL = options.apiUrl
    }

    const { auth } = options
    if (typeof auth === 'string') {
      this.apiClient.defaults.headers.common['Authorization'] = `Bearer ${auth}`
    } else {
      this.apiClient.interceptors.request.use(async (config) => {
        const token = await auth()
        const headers = (config.headers || {}) as Record<string, string>
        headers['Authorization'] = `Bearer ${token}`
        config.headers = headers as typeof config.headers
        return config
      })
    }
  }

  // ─── Journey-level operations ──────────────────────────────────

  /**
   * Get a journey by ID.
   *
   * @param journeyId - The journey's UUID
   * @returns The full journey configuration
   *
   * @example
   * ```ts
   * const journey = await client.getJourney('509cdffe-424f-457a-95c2-9708c304ce77')
   * console.log(journey.name, journey.steps.length)
   * ```
   */
  async getJourney(journeyId: string): Promise<JourneyRaw> {
    const res = await this.apiClient.getJourney({ id: journeyId })
    return res.data as JourneyRaw
  }

  /**
   * Search journeys by query.
   *
   * @param options - Search parameters (query, pagination, sorting)
   * @returns Array of matching journeys
   *
   * @example
   * ```ts
   * const results = await client.searchJourneys({ query: 'contact', size: 5 })
   * results.forEach(j => console.log(j.journey_name))
   * ```
   */
  async searchJourneys(options?: SearchOptions): Promise<unknown[]> {
    const res = await this.apiClient.searchJourneys(null, {
      q: options?.query ?? '*',
      from: options?.from ?? 0,
      size: options?.size ?? 25,
      sort: options?.sort ?? '_created_at:desc',
    })
    const data = res.data as { results?: unknown[] }
    return data.results ?? []
  }

  /**
   * Create a new journey.
   *
   * @param journey - Journey configuration (without journeyId)
   * @returns The created journey with its assigned ID
   *
   * @example
   * ```ts
   * const created = await client.createJourney({
   *   organizationId: 'org-123',
   *   name: 'Contact Form',
   *   steps: [{
   *     name: 'Info',
   *     schema: { type: 'object', properties: {} },
   *     uischema: { type: 'VerticalLayout', elements: [] },
   *   }],
   * })
   * console.log(created.journeyId)
   * ```
   */
  async createJourney(journey: Record<string, unknown>): Promise<JourneyRaw> {
    // v1 creates the automation mapping properly (required for builder to load).
    // v2 creates the journey but with a broken automation — only used as fallback.
    try {
      const res = await this.apiClient.createJourney(null, journey as never)
      const data = res.data as any
      return (data?.createdJourney ?? data) as JourneyRaw
    } catch (v1Err: any) {
      if (v1Err?.response?.status === 500) {
        // v1 fails with API tokens — fall back to v2
        const res = await this.apiClient.createJourneyV2(null, journey as never)
        const data = res.data as any
        return (data?.createdJourney ?? data) as JourneyRaw
      }
      throw v1Err
    }
  }

  /**
   * Fully replace a journey's configuration.
   *
   * @param journey - Complete journey configuration including journeyId
   *
   * @example
   * ```ts
   * const journey = await client.getJourney('journey-id')
   * journey.name = 'Updated Name'
   * await client.updateJourney(journey)
   * ```
   */
  async updateJourney(journey: JourneyRaw): Promise<void> {
    await this.apiClient.updateJourney(null, journey as never)
  }

  /**
   * Partially update a journey using the patch endpoint.
   *
   * Supports nested property paths (e.g., `steps[0].uischema.elements[0].label`).
   *
   * @param journeyId - Journey UUID
   * @param patch - Object with properties to update
   * @returns Updated journey configuration
   *
   * @example
   * ```ts
   * // Update just the journey name
   * await client.patchJourney('journey-id', { name: 'New Name' })
   *
   * // Update a nested property
   * await client.patchJourney('journey-id', {
   *   'steps[0].uischema.elements[0].label': 'New Label',
   * })
   * ```
   */
  async patchJourney(
    journeyId: string,
    patch: Record<string, unknown>
  ): Promise<JourneyRaw> {
    const res = await this.apiClient.patchUpdateJourney(null, {
      journeyId,
      ...patch,
    } as never)
    const data = res.data as { createdJourney?: JourneyRaw }
    return data.createdJourney as JourneyRaw
  }

  /**
   * Delete a journey.
   *
   * @param journeyId - Journey UUID to delete
   */
  async deleteJourney(journeyId: string): Promise<void> {
    await this.apiClient.removeJourney({ id: journeyId })
  }

  // ─── Block-level operations ────────────────────────────────────

  /**
   * Get a specific block from a journey.
   *
   * Fetches the journey and searches for the block by scope or label.
   *
   * @param journeyId - Journey UUID
   * @param ref - Block reference (step index + block name/scope)
   * @returns The block element, or `undefined` if not found
   *
   * @example
   * ```ts
   * const block = await client.getBlock('journey-id', {
   *   stepIndex: 0,
   *   blockName: '#/properties/email',
   * })
   * if (block) {
   *   console.log(block.label, block.options)
   * }
   * ```
   */
  async getBlock(
    journeyId: string,
    ref: BlockRef
  ): Promise<UISchemaElement | undefined> {
    const journey = await this.getJourney(journeyId)
    return findBlock(journey.steps as StepConfig[], ref)
  }

  /**
   * Get all blocks from a journey, tagged with their step index.
   *
   * @param journey - Journey configuration (avoids a redundant API call if you already have it)
   * @returns Array of `{ stepIndex, block }` objects
   *
   * @example
   * ```ts
   * const journey = await client.getJourney('journey-id')
   * const blocks = client.getBlocks(journey)
   * blocks.forEach(({ stepIndex, block }) => {
   *   console.log(`Step ${stepIndex}: ${block.label}`)
   * })
   * ```
   */
  getBlocks(
    journey: JourneyRaw
  ): Array<{ stepIndex: number; block: UISchemaElement }> {
    return getAllBlocks(journey.steps as StepConfig[])
  }

  /**
   * Get all blocks from a specific step.
   *
   * @param journey - Journey configuration
   * @param stepIndex - Zero-based step index
   * @returns Array of block elements in the step
   *
   * @example
   * ```ts
   * const journey = await client.getJourney('journey-id')
   * const step0Blocks = client.getStepBlocks(journey, 0)
   * ```
   */
  getStepBlocks(journey: JourneyRaw, stepIndex: number): UISchemaElement[] {
    const step = journey.steps[stepIndex] as StepConfig | undefined
    if (!step) return []
    return getStepBlocks(step)
  }

  /**
   * Partially update a specific block and save via the patch API.
   *
   * Fetches the journey, locates the block, merges the patch,
   * and sends only the changed step back via the patch endpoint.
   *
   * @param journeyId - Journey UUID
   * @param ref - Block reference
   * @param patch - Properties to merge into the block
   * @returns Updated journey configuration
   *
   * @example
   * ```ts
   * // Change a block's label and make it required
   * await client.patchBlock('journey-id', {
   *   stepIndex: 0,
   *   blockName: '#/properties/email',
   * }, {
   *   label: 'Work Email',
   *   options: { required: true },
   * })
   * ```
   */
  async patchBlock(
    journeyId: string,
    ref: BlockRef,
    patch: Partial<UISchemaElement>
  ): Promise<JourneyRaw> {
    const journey = await this.getJourney(journeyId)
    const updatedSteps = updateBlockUtil(
      journey.steps as StepConfig[],
      ref,
      patch
    )

    if (updatedSteps === journey.steps) {
      return journey // block not found, nothing to update
    }

    return this.patchJourney(journeyId, {
      [`steps[${ref.stepIndex}].uischema`]:
        updatedSteps[ref.stepIndex].uischema,
    })
  }

  /**
   * Add a block to a step and save via the patch API.
   *
   * @param journeyId - Journey UUID
   * @param stepIndex - Target step index
   * @param block - Block element to add
   * @param position - Insert position (defaults to end)
   * @returns Updated journey configuration
   *
   * @example
   * ```ts
   * await client.addBlock('journey-id', 0, {
   *   type: 'Control',
   *   scope: '#/properties/phone',
   *   label: 'Phone Number',
   * })
   * ```
   */
  async addBlock(
    journeyId: string,
    stepIndex: number,
    block: UISchemaElement,
    position?: number
  ): Promise<JourneyRaw> {
    const journey = await this.getJourney(journeyId)
    const updatedSteps = addBlockUtil(
      journey.steps as StepConfig[],
      stepIndex,
      block,
      position
    )

    return this.patchJourney(journeyId, {
      [`steps[${stepIndex}].uischema`]: updatedSteps[stepIndex].uischema,
    })
  }

  /**
   * Remove a block from a journey and save via the patch API.
   *
   * @param journeyId - Journey UUID
   * @param ref - Block reference to remove
   * @returns Updated journey configuration
   *
   * @example
   * ```ts
   * await client.removeBlock('journey-id', {
   *   stepIndex: 0,
   *   blockName: '#/properties/fax',
   * })
   * ```
   */
  async removeBlock(
    journeyId: string,
    ref: BlockRef
  ): Promise<JourneyRaw> {
    const journey = await this.getJourney(journeyId)
    const updatedSteps = removeBlockUtil(
      journey.steps as StepConfig[],
      ref
    )

    if (updatedSteps === journey.steps) {
      return journey // block not found, nothing to remove
    }

    return this.patchJourney(journeyId, {
      [`steps[${ref.stepIndex}].uischema`]:
        updatedSteps[ref.stepIndex].uischema,
    })
  }

  // ─── Step-level operations ─────────────────────────────────────

  /**
   * Get all steps from a journey.
   *
   * @param journeyId - Journey UUID
   * @returns Array of step configurations
   */
  async getSteps(journeyId: string): Promise<StepConfig[]> {
    const journey = await this.getJourney(journeyId)
    return journey.steps as StepConfig[]
  }

  /**
   * Get a specific step from a journey.
   *
   * @param journeyId - Journey UUID
   * @param stepIndex - Zero-based step index
   * @returns Step configuration, or `undefined` if index is out of bounds
   */
  async getStep(
    journeyId: string,
    stepIndex: number
  ): Promise<StepConfig | undefined> {
    const journey = await this.getJourney(journeyId)
    return journey.steps[stepIndex] as StepConfig | undefined
  }
}
