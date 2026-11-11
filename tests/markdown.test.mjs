import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import Eleventy from '@11ty/eleventy';

test('project Markdown configuration escapes raw script/b tags while rendering Markdown', async () => {
  const output = mkdtempSync(join(tmpdir(), 'iab-markdown-'));
  try {
    const eleventy = new Eleventy('tests/fixtures/markdown', output, {
      // Give explicit fixture paths the same precedence as CLI --input/--output.
      source: 'cli', configPath: './eleventy.config.js', quietMode: true,
    });
    const pages = await eleventy.toJSON();
    const page = pages.find(entry => entry.url.endsWith('/raw-html/'));
    assert.ok(page, 'fixture was rendered by Eleventy');
    assert.match(page.content, /&lt;script&gt;alert\(/);
    assert.match(page.content, /&lt;\/script&gt;/);
    assert.match(page.content, /&lt;b&gt;fixture&lt;\/b&gt;/);
    assert.doesNotMatch(page.content, /<script\b|<\/?b>/i);
    assert.match(page.content, /<strong>Markdown bold<\/strong>/);
  } finally { rmSync(output, { recursive: true, force: true }); }
});
