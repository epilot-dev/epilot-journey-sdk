// ─── Single source of truth for dynamic counts ──────────────────
// Derived from the actual data, never hardcoded.

import { BLOCK_CATALOG } from './blocks';
import { FACTORY_FUNCTIONS } from './client-api';

export const SDK_VERSION = '2.0.0-alpha.1';
export const SDK_BRANCH = 'v2-alpha';
export const SDK_NPM = `@epilot/epilot-journey-sdk@${SDK_VERSION}`;
export const FACTORY_COUNT = FACTORY_FUNCTIONS.length;
export const BLOCK_COUNT = BLOCK_CATALOG.length;
