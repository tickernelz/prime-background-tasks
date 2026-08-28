import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const root = new URL('../../', import.meta.url);

function text(path: string): string {
  return readFileSync(new URL(path, root), 'utf8');
}

void describe('docs package integration contract', () => {
  void it('declares docs scripts, prepack gates, and packaged docs payload', () => {
    const pkg = JSON.parse(text('package.json')) as {
      files: string[];
      scripts: Record<string, string>;
      pi?: { image?: string };
    };
    assert.ok(pkg.files.includes('docs/'));
    assert.ok(pkg.files.includes('BACKGROUND-TASKS-INSTRUCTIONS.md'));
    assert.ok(pkg.files.includes('logo.png'));
    assert.equal(
      pkg.pi?.image,
      'https://raw.githubusercontent.com/tickernelz/prime-background-tasks/main/logo.png',
    );
    assert.equal(pkg.scripts['docs:generate'], 'node scripts/docs/generate.mjs');
    assert.equal(pkg.scripts['docs:verify'], 'node scripts/docs/verify.mjs');
    assert.equal(
      pkg.scripts['docs:verify:attestations'],
      'node scripts/docs/verify.mjs --require-attestations',
    );
    assert.equal(pkg.scripts['docs:attest/record'], 'node scripts/docs/attest.mjs');
    assert.equal(
      pkg.scripts['test:docs'],
      'tsx --test tests/unit/docs-gate.test.ts tests/package/docs-contract.test.ts',
    );
    assert.equal(pkg.scripts['payload:check'], 'node scripts/check-package-payload.mjs');
    assert.equal(pkg.scripts['release:check-version'], 'node scripts/check-release-version.mjs');
    assert.match(pkg.scripts['prepack'] ?? '', /docs:verify/);
    assert.match(pkg.scripts['prepack'] ?? '', /payload:check/);
    for (const path of [
      'docs/INDEX.md',
      'docs/read-before-edit.md',
      'docs/manifest.json',
      'docs/attestations.json',
      'docs/subsystems/docs-freshness-gate.md',
    ]) {
      assert.ok(existsSync(new URL(path, root)), `${path} must exist`);
    }
  });

});
