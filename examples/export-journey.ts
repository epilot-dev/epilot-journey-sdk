/**
 * Export a journey's JSON into readable SDK factory code.
 *
 * Takes the complex wire format JSON and produces clean TypeScript
 * that recreates the journey using createJourney/createStep/create* factories.
 *
 * Usage:
 *   npx tsx examples/export-journey.ts <JOURNEY_ID>
 *
 * Auth: uses EPILOT_TOKEN env var or `epilot auth token`.
 */
import { execSync } from 'child_process'
import { JourneyClient, exportJourneyCode } from '../src/index.js' // Use '@epilot/epilot-journey-sdk' when running as a standalone script outside this repo

const JOURNEY_ID = process.argv[2]
if (!JOURNEY_ID) {
  console.error('Usage: npx tsx examples/export-journey.ts <JOURNEY_ID>')
  process.exit(1)
}

const TOKEN = process.env.EPILOT_TOKEN || execSync('epilot auth token', { encoding: 'utf-8' }).trim()
const API_URL = process.env.EPILOT_API_URL || 'https://journey-config.dev.sls.epilot.io'

const client = new JourneyClient({ auth: TOKEN, apiUrl: API_URL })

async function main() {
  console.error(`Fetching journey ${JOURNEY_ID}...`)
  const journey = await client.getJourney(JOURNEY_ID) as any

  console.error(`Exporting "${journey.name}" (${(journey.steps || []).length} steps)...\n`)

  const code = exportJourneyCode(journey)
  console.log(code)
}

main().catch(err => {
  console.error('Failed:', err?.response?.data ?? err.message)
  process.exit(1)
})
