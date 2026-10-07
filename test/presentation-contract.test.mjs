// Release presentation rules run as part of pnpm check, including CI.
import { test } from 'vitest';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
const read = path => readFileSync(path, 'utf8');
test('public package metadata declares its license, source and game keywords', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.license, 'MIT'); assert.match(read('LICENSE'), /MIT License/);
  assert.equal(pkg.repository.url, 'git+https://github.com/johnmorrisdotca/houseki.git');
  for (const keyword of ['puzzle', 'gem-swap', 'typescript']) assert.ok(pkg.keywords.includes(keyword));
});
test('release documentation contains no machine-specific user paths', () => {
  const files = ['README.md', 'CHANGELOG.md', ...readdirSync('docs/design').filter(file => file.endsWith('.md')).map(file => `docs/design/${file}`)];
  for (const file of files) assert.doesNotMatch(read(file), /\/Users\/|\/home\/[^/\s]+\/|[A-Za-z]:\\Users\\/, file);
});
