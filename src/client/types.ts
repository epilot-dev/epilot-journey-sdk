import type { Components } from '@epilot/journey-client'

/**
 * Raw journey type from the epilot Journey API.
 * Use this when you need the exact API shape.
 */
export type JourneyRaw = Components.Schemas.Journey

/**
 * A step within a journey, containing blocks arranged via a UI schema.
 *
 * @example
 * ```ts
 * const step: StepConfig = {
 *   name: 'Contact Info',
 *   stepId: 'step-1',
 *   schema: { type: 'object', properties: { email: { type: 'string' } } },
 *   uischema: { type: 'VerticalLayout', elements: [] },
 * }
 * ```
 */
export interface StepConfig {
  /** Human-readable step name displayed in the Journey Builder */
  name: string
  /** Unique step identifier (UUID). Auto-generated if not provided. */
  stepId?: string
  /** JSON Schema defining the data model for this step's blocks */
  schema: Record<string, unknown>
  /**
   * UI Schema defining the visual layout and block arrangement.
   * Follows JSON Forms uischema conventions.
   */
  uischema: UISchemaElement
  /** Step title displayed to end users (null to hide) */
  title?: string | null
  /** Step subtitle displayed below the title */
  subTitle?: string | null
  /** Whether to show the step name in the journey */
  showStepName?: boolean | null
  /** Whether to show the step subtitle */
  showStepSubtitle?: boolean | null
  /** Whether to show the stepper navigation bar */
  showStepper?: boolean | null
  /** Whether to show labels on stepper steps */
  showStepperLabels?: boolean | null
  /** Whether to hide the "Next" button on this step */
  hideNextButton?: boolean | null
  /** Maximum content width for this step */
  maxWidth?: 'small' | 'medium' | 'large' | 'extra large'
}

/**
 * A UI schema element representing a block or a layout container.
 *
 * Blocks are leaf elements (e.g., input fields, selections).
 * Layout containers (VerticalLayout, HorizontalLayout, Group) hold child elements.
 *
 * @example Input block
 * ```ts
 * const emailBlock: UISchemaElement = {
 *   type: 'Control',
 *   scope: '#/properties/email',
 *   label: 'Email Address',
 *   options: { format: 'email' },
 * }
 * ```
 *
 * @example Layout container with blocks
 * ```ts
 * const layout: UISchemaElement = {
 *   type: 'VerticalLayout',
 *   elements: [
 *     { type: 'Control', scope: '#/properties/firstName', label: 'First Name' },
 *     { type: 'Control', scope: '#/properties/lastName', label: 'Last Name' },
 *   ],
 * }
 * ```
 */
export interface UISchemaElement {
  /**
   * Element type. Common values:
   * - `'Control'` — a single block/input
   * - `'VerticalLayout'` — vertical arrangement of child elements
   * - `'HorizontalLayout'` — horizontal arrangement
   * - `'Group'` — labeled group container
   * - `'Categorization'` — tabbed layout
   *
   * Custom block types are also supported.
   */
  type: string
  /**
   * JSON Pointer to the data property this element binds to.
   * Only applicable for `Control` type elements.
   *
   * @example '#/properties/email'
   * @example '#/properties/personalInfo'
   */
  scope?: string
  /** Display label for the element */
  label?: string
  /** Child elements (for layout containers) */
  elements?: UISchemaElement[]
  /**
   * Block-specific configuration options.
   * Content varies by block type.
   *
   * @example
   * ```ts
   * // For a Personal Information block
   * options: {
   *   required: true,
   *   fields: ['firstName', 'lastName', 'email'],
   * }
   * ```
   */
  options?: Record<string, unknown>
  /** Allow additional properties for custom/vendor block types */
  [key: string]: unknown
}

/**
 * Reference to a specific block within a journey.
 * Used to locate blocks for read/update/delete operations.
 *
 * @example
 * ```ts
 * // Reference by scope path
 * const ref: BlockRef = { stepIndex: 0, blockName: '#/properties/email' }
 *
 * // Reference by label
 * const ref: BlockRef = { stepIndex: 0, blockName: 'Email Address' }
 * ```
 */
export interface BlockRef {
  /** Zero-based index of the step containing the block */
  stepIndex: number
  /**
   * Block identifier — matched against `scope` or `label` of UI schema elements.
   * Scope-based matching (e.g., `'#/properties/email'`) is preferred for precision.
   * Label-based matching (e.g., `'Email Address'`) is a fallback.
   */
  blockName: string
}

/**
 * Options for creating a headless journey client.
 *
 * @example
 * ```ts
 * const client = new JourneyClient({
 *   auth: 'your-api-token',
 * })
 * ```
 *
 * @example With dynamic auth
 * ```ts
 * const client = new JourneyClient({
 *   auth: () => getTokenFromSomewhere(),
 *   apiUrl: 'https://custom-api.example.com',
 * })
 * ```
 */
export interface JourneyClientOptions {
  /** API base URL. Defaults to `https://journey-config.sls.epilot.io` */
  apiUrl?: string
  /**
   * Authentication token or provider function.
   * - `string` — static Bearer token
   * - `() => string` — synchronous token provider
   * - `() => Promise<string>` — async token provider (e.g., for OAuth refresh)
   */
  auth: string | (() => string) | (() => Promise<string>)
}

/**
 * Options for searching journeys.
 *
 * @example
 * ```ts
 * const results = await client.searchJourneys({
 *   query: 'contact form',
 *   size: 10,
 * })
 * ```
 */
export interface SearchOptions {
  /** Search query (Lucene syntax). Defaults to `'*'` (match all). */
  query?: string
  /** Result offset for pagination. Defaults to `0`. */
  from?: number
  /** Maximum results to return. Defaults to `25`. */
  size?: number
  /** Sort expression (Lucene syntax). Defaults to `'_created_at:desc'`. */
  sort?: string
}
