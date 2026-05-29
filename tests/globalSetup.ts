/**
 * globalSetup.ts
 *
 * Runs once before the entire test suite starts.
 *
 * Credential strategy (priority order):
 *   1. Environment variables: TEST_USERNAME / TEST_PASSWORD
 *      → used in CI pipelines (Jenkins, GitHub Actions, Azure DevOps)
 *   2. .env file (loaded via dotenv)
 *      → used for local development without committing secrets
 *   3. test-data/credentials.json
 *      → fallback for developers who have not set up a .env file
 *
 * To use .env locally:
 *   cp .env.example .env
 *   Fill in your credentials in .env  (this file is gitignored)
 */

import * as fs   from 'fs';
import * as path from 'path';

export default async function globalSetup(): Promise<void> {

    // ── 1. Load .env if it exists (dotenv optional — silently skip if not present) ──
    try {
        const dotenvPath = path.join(process.cwd(), '.env');
        if (fs.existsSync(dotenvPath)) {
            // Dynamic require so dotenv is truly optional at runtime
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            require('dotenv').config({ path: dotenvPath });
            console.log('[globalSetup] Loaded credentials from .env file');
        }
    } catch {
        // dotenv not installed — rely on OS env vars or credentials.json
    }

    // ── 2. If env vars are set, write them into credentials.json at runtime ──
    const username = process.env.TEST_USERNAME;
    const password = process.env.TEST_PASSWORD;

    if (username && password) {
        const credPath = path.join(process.cwd(), 'test-data', 'credentials.json');
        const creds = {
            Credentials: {
                username,
                password,
            },
        };
        fs.writeFileSync(credPath, JSON.stringify(creds, null, 4), 'utf8');
        console.log(`[globalSetup] credentials.json updated from environment variables (user: ${username})`);
    } else {
        console.log('[globalSetup] Using existing test-data/credentials.json (no TEST_USERNAME/TEST_PASSWORD env vars found)');
    }
}
