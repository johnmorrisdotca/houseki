import {test} from 'vitest';
import assert from 'node:assert/strict';
import ts from 'typescript';
import { readFileSync } from 'node:fs';
import { apiOf, apiPage } from '../scripts/api.mjs';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

test('namespace examples use the source-matched package export paths', async () => {
  const namespaces = apiOf()[0].exports.filter(item => item.kind === 'namespace');
  assert.equal(namespaces.length, 6);
  for (const item of namespaces) {
    const [rootImport, alternateImport] = item.signature.split('\n');
    const root = rootImport.match(/^import \{ (\w+) \} from "([^"]+)";$/);
    const alternate = alternateImport.match(/^import \* as (\w+) from "([^"]+)";$/);
    assert.ok(root, `${item.name} has a valid root import`);
    assert.ok(alternate, `${item.name} has a valid subpath import`);
    assert.equal(root[1], item.name);
    assert.equal(root[2], pkg.name);
    assert.notEqual(alternate[1], item.name);
    assert.ok(alternate[2].startsWith(`${pkg.name}/`));
    const exportKey = `./${alternate[2].slice(pkg.name.length + 1)}`;
    assert.ok(pkg.exports[exportKey], `${item.name} alternate path is in package exports`);
    const rootModule=await import(root[2]);const entryModule=await import(alternate[2]);assert.equal(rootModule[item.name],entryModule,`${item.name} imports execute and resolve to the same namespace`);
    assert.ok(item.doc.includes(alternate[2]), `${item.name} description names the actual entry`);

    const parsed = ts.createSourceFile('namespace-example.ts', item.signature, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    assert.deepEqual(parsed.parseDiagnostics, [], `${item.name} snippet parses as TypeScript`);
  }
});

test('API favicon data is escaped as one safe link attribute', () => {
  const icon = 'data:image/svg+xml,<svg viewBox="0 0 32 32"><text>◆</text></svg>';
  const html = apiPage({ id: 'kazu', name: 'Houseki', icon, api: { total: 0, html: '' } });
  const link = html.match(/<link rel="icon" href="([^"]*)" \/>/);
  assert.ok(link, 'favicon link is present');
  assert.ok(link[1].includes('&quot;'), 'quotes inside the URI are encoded');
  assert.ok(link[1].includes('&lt;svg') && link[1].includes('&lt;/svg&gt;'), 'SVG markup stays inside the attribute');
  assert.ok(!link[1].includes('"') && !link[1].includes('<'), 'URI cannot terminate or inject markup into the attribute');
  assert.match(html, /◆/u, 'the icon content remains intact');
});
