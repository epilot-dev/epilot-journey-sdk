import type { UISchemaElement, StepConfig, BlockRef } from '../client/types.js'

/**
 * Checks whether a UI schema element is a layout container (has child elements)
 * rather than a leaf block.
 */
function isLayoutElement(element: UISchemaElement): boolean {
  return Array.isArray(element.elements) && element.elements.length > 0
}

/**
 * Checks whether a UI schema element matches a block reference.
 * Matches against `scope` first, then `label` as a fallback.
 */
function matchesRef(element: UISchemaElement, blockName: string): boolean {
  return element.scope === blockName || element.label === blockName
}

/**
 * Recursively searches for a block within a UI schema element tree.
 */
function findInElement(
  element: UISchemaElement,
  blockName: string
): UISchemaElement | undefined {
  if (matchesRef(element, blockName)) {
    return element
  }
  if (element.elements) {
    for (const child of element.elements) {
      const found = findInElement(child, blockName)
      if (found) return found
    }
  }
  return undefined
}

/**
 * Finds a specific block within a journey's step by name or scope path.
 *
 * Searches recursively through the step's UI schema element tree.
 * Matches against `scope` (e.g., `'#/properties/email'`) first,
 * then falls back to `label` matching.
 *
 * @param steps - The journey's steps array
 * @param ref - Block reference specifying step index and block identifier
 * @returns The matching UI schema element, or `undefined` if not found
 *
 * @example
 * ```ts
 * const journey = await client.getJourney('journey-id')
 * const emailBlock = findBlock(journey.steps, {
 *   stepIndex: 0,
 *   blockName: '#/properties/email',
 * })
 * if (emailBlock) {
 *   console.log(emailBlock.label, emailBlock.options)
 * }
 * ```
 */
export function findBlock(
  steps: StepConfig[],
  ref: BlockRef
): UISchemaElement | undefined {
  const step = steps[ref.stepIndex]
  if (!step) return undefined
  return findInElement(step.uischema, ref.blockName)
}

/**
 * Collects all leaf blocks (non-layout elements) from a UI schema tree.
 */
function collectLeafBlocks(element: UISchemaElement): UISchemaElement[] {
  if (!isLayoutElement(element)) {
    return [element]
  }
  const blocks: UISchemaElement[] = []
  for (const child of element.elements!) {
    blocks.push(...collectLeafBlocks(child))
  }
  return blocks
}

/**
 * Gets all leaf blocks from a specific step.
 *
 * Returns a flat list of block elements, excluding layout containers
 * (VerticalLayout, HorizontalLayout, Group, etc.).
 *
 * @param step - The step to extract blocks from
 * @returns Flat array of leaf block elements
 *
 * @example
 * ```ts
 * const journey = await client.getJourney('journey-id')
 * const blocks = getStepBlocks(journey.steps[0])
 * blocks.forEach(block => {
 *   console.log(block.scope, block.label, block.type)
 * })
 * ```
 */
export function getStepBlocks(step: StepConfig): UISchemaElement[] {
  return collectLeafBlocks(step.uischema)
}

/**
 * Gets all blocks across all steps, tagged with their step index.
 *
 * Useful for getting a complete inventory of blocks in a journey.
 *
 * @param steps - The journey's steps array
 * @returns Array of objects with `stepIndex` and `block` properties
 *
 * @example
 * ```ts
 * const journey = await client.getJourney('journey-id')
 * const allBlocks = getAllBlocks(journey.steps)
 * allBlocks.forEach(({ stepIndex, block }) => {
 *   console.log(`Step ${stepIndex}: ${block.label} (${block.scope})`)
 * })
 * ```
 */
export function getAllBlocks(
  steps: StepConfig[]
): Array<{ stepIndex: number; block: UISchemaElement }> {
  const result: Array<{ stepIndex: number; block: UISchemaElement }> = []
  for (let i = 0; i < steps.length; i++) {
    const blocks = getStepBlocks(steps[i])
    for (const block of blocks) {
      result.push({ stepIndex: i, block })
    }
  }
  return result
}

/**
 * Recursively applies a patch to a matching element in the UI schema tree.
 * Returns a new tree (immutable).
 */
function patchInElement(
  element: UISchemaElement,
  blockName: string,
  patch: Partial<UISchemaElement>
): { element: UISchemaElement; found: boolean } {
  if (matchesRef(element, blockName)) {
    return {
      element: { ...element, ...patch },
      found: true,
    }
  }
  if (element.elements) {
    let found = false
    const newElements = element.elements.map((child) => {
      if (found) return child
      const result = patchInElement(child, blockName, patch)
      if (result.found) {
        found = true
        return result.element
      }
      return child
    })
    if (found) {
      return { element: { ...element, elements: newElements }, found: true }
    }
  }
  return { element, found: false }
}

/**
 * Updates a specific block's properties within the steps array (immutable).
 *
 * Returns a new steps array with the target block's properties shallow-merged.
 * Does not mutate the original array. Returns the original if the block is not found.
 *
 * @param steps - The journey's steps array
 * @param ref - Block reference specifying which block to update
 * @param patch - Properties to merge into the block element
 * @returns New steps array with the block updated
 *
 * @example
 * ```ts
 * const journey = await client.getJourney('journey-id')
 *
 * // Update a block's label and options
 * const updatedSteps = updateBlock(
 *   journey.steps,
 *   { stepIndex: 0, blockName: '#/properties/email' },
 *   { label: 'Work Email', options: { required: true, format: 'email' } }
 * )
 *
 * await client.updateJourney({ ...journey, steps: updatedSteps })
 * ```
 */
export function updateBlock(
  steps: StepConfig[],
  ref: BlockRef,
  patch: Partial<UISchemaElement>
): StepConfig[] {
  const step = steps[ref.stepIndex]
  if (!step) return steps

  const { element: newUischema, found } = patchInElement(
    step.uischema,
    ref.blockName,
    patch
  )
  if (!found) return steps

  const newSteps = [...steps]
  newSteps[ref.stepIndex] = { ...step, uischema: newUischema }
  return newSteps
}

/**
 * Adds a block element to a step at a given position (immutable).
 *
 * Inserts the block into the step's top-level `uischema.elements` array.
 * If no position is specified, appends to the end.
 *
 * @param steps - The journey's steps array
 * @param stepIndex - Zero-based index of the target step
 * @param block - The UI schema element to add
 * @param position - Insert position (defaults to end of elements array)
 * @returns New steps array with the block added
 *
 * @example
 * ```ts
 * const journey = await client.getJourney('journey-id')
 *
 * const newBlock: UISchemaElement = {
 *   type: 'Control',
 *   scope: '#/properties/phone',
 *   label: 'Phone Number',
 *   options: { format: 'tel' },
 * }
 *
 * const updatedSteps = addBlock(journey.steps, 0, newBlock)
 * await client.updateJourney({ ...journey, steps: updatedSteps })
 * ```
 */
export function addBlock(
  steps: StepConfig[],
  stepIndex: number,
  block: UISchemaElement,
  position?: number
): StepConfig[] {
  const step = steps[stepIndex]
  if (!step) return steps

  const elements = [...(step.uischema.elements || [])]
  const insertAt = position !== undefined ? position : elements.length
  elements.splice(insertAt, 0, block)

  const newSteps = [...steps]
  newSteps[stepIndex] = {
    ...step,
    uischema: { ...step.uischema, elements },
  }
  return newSteps
}

/**
 * Recursively removes an element matching the block name from the UI schema tree.
 * Returns a new tree (immutable).
 */
function removeFromElement(
  element: UISchemaElement,
  blockName: string
): { element: UISchemaElement; removed: boolean } {
  if (!element.elements) {
    return { element, removed: false }
  }

  let removed = false
  const newElements: UISchemaElement[] = []

  for (const child of element.elements) {
    if (!removed && matchesRef(child, blockName)) {
      removed = true
      continue
    }
    if (!removed) {
      const result = removeFromElement(child, blockName)
      if (result.removed) {
        removed = true
        newElements.push(result.element)
        continue
      }
    }
    newElements.push(child)
  }

  if (removed) {
    return { element: { ...element, elements: newElements }, removed: true }
  }
  return { element, removed: false }
}

/**
 * Removes a block from a journey's steps by reference (immutable).
 *
 * Returns a new steps array with the target block removed.
 * Returns the original if the block is not found.
 *
 * @param steps - The journey's steps array
 * @param ref - Block reference specifying which block to remove
 * @returns New steps array with the block removed
 *
 * @example
 * ```ts
 * const journey = await client.getJourney('journey-id')
 *
 * const updatedSteps = removeBlock(journey.steps, {
 *   stepIndex: 0,
 *   blockName: '#/properties/fax',
 * })
 *
 * await client.updateJourney({ ...journey, steps: updatedSteps })
 * ```
 */
export function removeBlock(
  steps: StepConfig[],
  ref: BlockRef
): StepConfig[] {
  const step = steps[ref.stepIndex]
  if (!step) return steps

  const { element: newUischema, removed } = removeFromElement(
    step.uischema,
    ref.blockName
  )
  if (!removed) return steps

  const newSteps = [...steps]
  newSteps[ref.stepIndex] = { ...step, uischema: newUischema }
  return newSteps
}
