import { readFileSync } from 'node:fs';

/**
 * Prints the CLI package version to stdout.
 *
 * @returns {void}
 */
export function printVersion() {
  const pkgPath = new URL('../../package.json', import.meta.url);
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  console.log(pkg.version);
}
