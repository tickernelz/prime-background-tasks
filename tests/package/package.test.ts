import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, } from 'node:fs';
import { readFile, readdir, } from 'node:fs/promises';
import { } from 'node:child_process';
import { join } from 'node:path';
import { } from 'node:os';
import { fileURLToPath } from 'node:url';
import { parseJsonText } from '../../src/core/common.js';

// npm ships as npm.cmd on Windows, and spawnSync with shell:false does not
// consult PATHEXT, so spawning the bare name yields status null with no child.
// Resolving npm's own JavaScript entry and running it through the current Node
// executable avoids the shim without introducing shell:true, mirroring how
// production resolves the Pi bin.




interface SourceViolation {
  file: string;
  rule: string;
  excerpt: string;
}

const root = new URL('../../', import.meta.url);

function isObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null;
}

function field(value: object, key: string): unknown {
  const property: unknown = Reflect.get(value, key);
  return property;
}

function parseJsonValue(text: string): unknown {
  return parseJsonText(text);
}






async function text(file: string): Promise<string> {
  return readFile(new URL(file, root), 'utf8');
}

async function walkSourceTree(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walkSourceTree(path)));
    else if (/\.ts$/.test(entry.name)) files.push(path);
  }
  return files;
}


function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
}

function compactExcerpt(source: string): string {
  return source.replace(/\s+/g, ' ').trim().slice(0, 180);
}

function isPathLikeParameter(name: string): boolean {
  const lower = name.toLowerCase();
  return lower === 'path' || lower === 'file' || lower.endsWith('path');
}

function isPathSyncHelperName(name: string): boolean {
  const lower = name.toLowerCase();
  if (lower.startsWith('write') || lower.startsWith('replace')) return false;
  if (
    lower === 'fsync' ||
    lower === 'sync' ||
    lower === 'fsyncfile' ||
    lower === 'fsyncpath' ||
    lower === 'syncfile' ||
    lower === 'syncpath'
  )
    return true;
  if (lower.includes('fsync') && (lower.includes('file') || lower.includes('path'))) return true;
  return lower.startsWith('sync') && (lower.includes('file') || lower.includes('path'));
}

function addPatternViolations(
  violations: SourceViolation[],
  file: string,
  rule: string,
  source: string,
  pattern: RegExp,
): void {
  for (const match of source.matchAll(pattern)) {
    violations.push({ file, rule, excerpt: compactExcerpt(match[0] ?? '') });
  }
}

function addExportedPathSyncViolations(
  violations: SourceViolation[],
  file: string,
  source: string,
): void {
  const exportedFunction =
    /\bexport\s+(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(\s*([A-Za-z_$][\w$]*)\b/g;
  for (const match of source.matchAll(exportedFunction)) {
    const name = match[1];
    const parameter = match[2];
    if (
      name !== undefined &&
      parameter !== undefined &&
      isPathSyncHelperName(name) &&
      isPathLikeParameter(parameter)
    ) {
      violations.push({
        file,
        rule: 'exported path sync helper',
        excerpt: compactExcerpt(match[0]),
      });
    }
  }

  const exportedConst =
    /\bexport\s+const\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?\(?\s*([A-Za-z_$][\w$]*)\b/g;
  for (const match of source.matchAll(exportedConst)) {
    const name = match[1];
    const parameter = match[2];
    if (
      name !== undefined &&
      parameter !== undefined &&
      isPathSyncHelperName(name) &&
      isPathLikeParameter(parameter)
    ) {
      violations.push({
        file,
        rule: 'exported path sync helper',
        excerpt: compactExcerpt(match[0]),
      });
    }
  }

  const exportedList = /\bexport\s*\{([^}]*)\}/g;
  for (const match of source.matchAll(exportedList)) {
    const names = match[1];
    if (names !== undefined && names.split(',').some((name) => isPathSyncHelperName(name.trim()))) {
      violations.push({
        file,
        rule: 'exported path sync helper',
        excerpt: compactExcerpt(match[0]),
      });
    }
  }
}

function addSwallowedSyncViolations(
  violations: SourceViolation[],
  file: string,
  source: string,
): void {
  const syncTryCatch =
    /try\s*\{(?:(?!\}\s*catch)[\s\S])*?\.sync\s*\([^)]*\)[\s\S]*?\}\s*catch\s*(?:\([^)]*\))?\s*\{([\s\S]*?)\}/g;
  for (const match of source.matchAll(syncTryCatch)) {
    const body = match[1] ?? '';
    const trimmed = body.trim();
    const recordsFailure =
      /failure\(\s*['"]sync_(?:file|directory)['"]/.test(body) || /throwDurable\b/.test(body);
    const throwsImmediately = /^throw\b/.test(trimmed);
    if (
      trimmed.length === 0 ||
      /\breturn\b/.test(body) ||
      (!recordsFailure && !throwsImmediately)
    ) {
      violations.push({ file, rule: 'silent sync catch', excerpt: compactExcerpt(match[0] ?? '') });
    }
  }
}

function formatSourceViolations(violations: readonly SourceViolation[]): string {
  return violations
    .map((violation) => `${violation.file} ${violation.rule}: ${violation.excerpt}`)
    .join('\n');
}






void describe('package', () => {


















  void it('keeps production durable syncing handle-scoped and loud', async () => {
    const files = await walkSourceTree(fileURLToPath(new URL('src/', root)));
    const violations: SourceViolation[] = [];
    for (const file of files) {
      const source = stripComments(await readFile(file, 'utf8'));
      // file is a native path from walkSourceTree, so the prefix must be native
      // too. Comparing against a URL pathname silently never matches on Windows.
      const rootPath = fileURLToPath(root);
      const label = file.startsWith(rootPath) ? file.slice(rootPath.length) : file;
      addPatternViolations(
        violations,
        label,
        'read-open sync',
        source,
        /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:await\s+)?(?:nodeOpen|open|fs(?:Promises)?\.open|[A-Za-z_$][\w$]*\.openWritable)\s*\([^;]*,\s*(['"])r\+?\2[^;]*\)\s*;?[\s\S]*?\b\1\s*\.\s*sync\s*\(/g,
      );
      addPatternViolations(
        violations,
        label,
        'read-open sync',
        source,
        /\b([A-Za-z_$][\w$]*)\s*=\s*(?:await\s+)?(?:nodeOpen|open|fs(?:Promises)?\.open|[A-Za-z_$][\w$]*\.openWritable)\s*\([^;]*,\s*(['"])r\+?\2[^;]*\)\s*;?[\s\S]*?\b\1\s*\.\s*sync\s*\(/g,
      );
      addPatternViolations(
        violations,
        label,
        'fsyncFile function',
        source,
        /\b(?:async\s+)?function\s+fsyncFile\b|\b(?:const|let|var)\s+fsyncFile\s*=/g,
      );
      addExportedPathSyncViolations(violations, label, source);
      addSwallowedSyncViolations(violations, label, source);
    }
    assert.equal(violations.length, 0, formatSourceViolations(violations));
  });

  void it('converts file URLs to native paths instead of using URL.pathname', async () => {
    // On Windows `new URL(...).pathname` yields `/D:/a/repo/`, and joining that
    // produces `D:\D:\a\repo\...`, which fails with ENOENT. CI proved this.
    // `fileURLToPath` is the only correct conversion.
    const roots = ['src', 'extensions', 'scripts', 'tests'];
    const offenders: string[] = [];
    for (const rootDir of roots) {
      const dir = fileURLToPath(new URL(`${rootDir}/`, root));
      if (!existsSync(dir)) continue;
      for (const file of await walkSourceTree(dir)) {
        const source = await readFile(file, 'utf8');
        const stripped = source
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .split('\n')
          .filter((line) => !line.trim().startsWith('//'))
          .join('\n');
        // Matches both the inline form new URL(...).pathname and the indirect
        // form where the URL is bound to a variable and read later. The indirect
        // form previously escaped this guard and reached Windows CI.
        const inlinePathname = /new URL\([^)]*\)\s*\.pathname/.test(stripped);
        const urlBindings = [...stripped.matchAll(/\b(\w+)\s*=\s*new URL\(/g)].map(
          (match) => match[1],
        );
        const indirectPathname = urlBindings.some(
          (binding) =>
            binding !== undefined && new RegExp(`\\b${binding}\\s*\\.pathname\\b`).test(stripped),
        );
        if (inlinePathname || indirectPathname) offenders.push(file);
      }
    }
    assert.deepEqual(
      offenders,
      [],
      'use fileURLToPath(new URL(...)) so Windows paths resolve correctly',
    );
  });

  void it('typechecks standalone with the full monorepo strictness vendored locally', async () => {
    // The package is published both from this monorepo and as a standalone git
    // repo. A parent `../../tsconfig.base.json` does not exist in the standalone
    // checkout, so `extends` must point at a locally vendored copy. CI proved
    // that a missing base silently drops `skipLibCheck` and makes `tsc` walk
    // node_modules type definitions.
    const tsconfig = parseJsonValue(await text('tsconfig.json'));
    assert.ok(isObject(tsconfig));
    assert.equal(
      field(tsconfig, 'extends'),
      './tsconfig.base.json',
      'tsconfig must extend a locally vendored base so standalone checkouts typecheck',
    );

    const localBase = parseJsonValue(await text('tsconfig.base.json'));
    assert.ok(isObject(localBase));
    const localOptions = field(localBase, 'compilerOptions');
    assert.ok(isObject(localOptions));

    // Every strictness flag from the monorepo base must be present and equal.
    // Weakening the standalone config to make a build pass is not acceptable.
    const required: Record<string, boolean> = {
      strict: true,
      exactOptionalPropertyTypes: true,
      noUncheckedIndexedAccess: true,
      noImplicitOverride: true,
      noImplicitReturns: true,
      noPropertyAccessFromIndexSignature: true,
      noFallthroughCasesInSwitch: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      useUnknownInCatchVariables: true,
      verbatimModuleSyntax: true,
      isolatedModules: true,
      allowUnreachableCode: false,
      allowUnusedLabels: false,
      skipLibCheck: true,
    };
    for (const [flag, expected] of Object.entries(required)) {
      assert.equal(
        field(localOptions, flag),
        expected,
        `vendored tsconfig.base.json must keep ${flag}=${String(expected)}`,
      );
    }
  });


});
