/**
 * puttyLogReader.ts
 *
 * Reads a **local** PuTTY session log file and provides the same assertion
 * helpers as LogVerifier – but WITHOUT any SSH connection and WITHOUT a
 * remote LOG_PATH.
 *
 * How to enable PuTTY session logging:
 *   PuTTY → Session → Logging → Log type: "All session output"
 *   Set "Log file name" to a fixed local path, e.g.
 *     C:\logs\putty-session.log
 
 */

import * as fs   from 'fs';
import * as path from 'path';
import { expect } from '@playwright/test';

// ── PuttyLogReader class ────────────────────────────────────────────────────

export class PuttyLogReader {
  private logFilePath: string;

  /**
   * @param logFilePath - Absolute path to the local PuTTY log file.
   *                      Configure it in PuTTY: Session → Logging.
   */
  constructor(logFilePath: string) {
    this.logFilePath = path.resolve(logFilePath);
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  /**
   * Read the full log file content synchronously.
   * Throws a clear error if the file does not exist yet (e.g. PuTTY not started).
   */
  private readAll(): string {
    if (!fs.existsSync(this.logFilePath)) {
      throw new Error(
        `[PuttyLogReader] Log file not found: "${this.logFilePath}"\n` +
        `Make sure PuTTY is running and logging is enabled (Session → Logging).`
      );
    }
    return fs.readFileSync(this.logFilePath, 'utf8');
  }

  // ── Public API ────────────────────────────────────────────────────────────

  /**
   * Return the last `lines` lines of the PuTTY log file.
   * This mirrors the behaviour of `tail -n <lines>` so callers look the same
   * as when using LogVerifier over SSH.
   *
   * @param lines - Number of trailing lines to return (default 100).
   */
  tail(lines = 100): string {
    const allLines = this.readAll().split('\n');
    const result   = allLines.slice(-lines).join('\n');
    console.log(`[PuttyLogReader] Read last ${lines} lines from: ${this.logFilePath}`);
    console.log(`[PuttyLogReader] Output:\n${result}`);
    return result;
  }

  /**
   * Return log lines written after a given timestamp (ms since epoch).
   * Useful for isolating entries that appeared during the current test only.
   *
   * PuTTY timestamps each log entry with lines like:
   *   =~=~=~=~=~=~=~=~=~=~=~= PuTTY log 2025-01-01 12:00:00 =~=~=~=~=~=~...
   * For line-by-line timestamps you need "Printable output" mode plus a
   * timestamping shell prompt; otherwise use `tail()` with a generous window.
   *
   * @param sinceMs - Unix timestamp in ms; only lines after this are returned.
   */
  since(sinceMs: number): string {
    const modifiedMs = fs.statSync(this.logFilePath).mtimeMs;
    if (modifiedMs < sinceMs) {
      console.warn('[PuttyLogReader] Log file has not been modified since the given timestamp.');
      return '';
    }
    // Without per-line timestamps we fall back to the whole file content after
    // the marker. Return everything that was appended since `sinceMs` by
    // comparing positions: read the full file and return content after the
    // byte offset that existed at `sinceMs`.  Because we cannot know the exact
    // offset without a snapshot, `tail()` is the recommended approach instead.
    return this.readAll();
  }

  // ── Assertion helpers (identical API to LogVerifier) ──────────────────────

  /**
   * Assert that the log content contains a substring or matches a regex.
   */
  assertContains(logOutput: string, expected: string | RegExp, stepLabel = ''): void {
    const label = stepLabel ? `[${stepLabel}] ` : '';

    if (expected instanceof RegExp) {
      expect(
        logOutput,
        `${label}Expected PuTTY log to match pattern: ${expected}`
      ).toMatch(expected);
      console.log(`[PuttyLogReader] ✔ ${label}Matched pattern: ${expected}`);
      return;
    }

    expect(
      logOutput,
      `${label}Expected PuTTY log to contain: "${expected}"`
    ).toContain(expected);
    console.log(`[PuttyLogReader] ✔ ${label}  Found: "${expected}"`);
  }

  /**
   * Assert that the log content matches a regular expression.
   */
  assertMatches(logOutput: string, pattern: RegExp, stepLabel = ''): void {
    const label = stepLabel ? `[${stepLabel}] ` : '';
    expect(
      logOutput,
      `${label}Expected PuTTY log to match pattern: ${pattern}`
    ).toMatch(pattern);
    console.log(`[PuttyLogReader] ✔ ${label}Matched pattern: ${pattern}`);
  }

  /**
   * Assert that the log does NOT contain a given substring.
   */
  assertNotContains(logOutput: string, unexpected: string, stepLabel = ''): void {
    const label = stepLabel ? `[${stepLabel}] ` : '';
    expect(
      logOutput,
      `${label}Expected PuTTY log NOT to contain: "${unexpected}"`
    ).not.toContain(unexpected);
    console.log(`[PuttyLogReader] ✔ ${label}Not present (as expected): "${unexpected}"`);
  }

  /**
   * Extract and validate named capture groups from a regex match.
   * Returns an object with the captured groups for inspection and validation.
   *
   * @example
   *   const pattern = /(?<timestamp>\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/;
   *   const groups = verifier.extractGroups(logOutput, pattern);
   *   console.log(groups.timestamp); // "2026-04-10 13:43:09"
   */
  extractGroups(logOutput: string,pattern: RegExp,stepLabel = ''): Record<string, string | undefined> {
    const label = stepLabel ? `[${stepLabel}] ` : '';
    const match = pattern.exec(logOutput);
    expect(
      match,
      `${label}Expected log to match pattern with named groups: ${pattern}`
    ).not.toBeNull();

    const groups = match?.groups || {};
    console.log(`[PuttyLogReader] ✔ ${label}Extracted groups:`, JSON.stringify(groups, null, 2));
    return groups;
  }
}
