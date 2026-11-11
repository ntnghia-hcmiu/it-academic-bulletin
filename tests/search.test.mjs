import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import test from 'node:test';
import Eleventy from '@11ty/eleventy';
import site from '../src/_data/site.js';
import { getContent } from '../src/lib/content.js';
import { normalize, matches, buildIndex, filterAndSort } from '../src/lib/search.js';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const fixtureRoot = join(projectRoot, 'tests/fixtures/content');

test('AC1: Vietnamese accents, đ and whitespace fold both ways; every query token must match', () => {
  assert.equal(normalize('  ĐĂNG\t ký\n  Đ/đ  '), 'dang ky d/d');
  for (const [title, query] of [['Đăng ký', 'dang ky'], ['Dang ky', 'đăng ký'], ['Đăng ky', 'ĐĂNG KÝ']]) {
    assert.equal(matches({ title, category: { name: 'Khác' } }, query), true);
  }
  const entry = { title: 'Đăng ký', summary: 'Hướng dẫn', category: { name: 'Môn học' } };
  for (const query of ['  ', 'huong DAN', 'mon hoc', 'hoc dang huong']) assert.equal(matches(entry, query), true, query);
  assert.equal(matches(entry, 'dang khongkhop'), false);
});

test('AC1/AC3: category and query combine; date sorting is deterministic with id ties and no mutation', () => {
  const index = buildIndex(getContent(fixtureRoot).announcements);
  const original = index.map(entry => entry.id);
  assert.deepEqual(filterAndSort(index, { category: 'alpha', q: 'fixture' }).map(entry => entry.id), ['b', 'older', 'pinned']);
  assert.deepEqual(filterAndSort(index, { category: 'alpha', sort: 'oldest' }).map(entry => entry.id), ['pinned', 'older', 'b']);
  assert.deepEqual(filterAndSort(index).slice(0, 2).map(entry => entry.id), ['a', 'b']);
  const ties = [index.find(entry => entry.id === 'b'), index.find(entry => entry.id === 'a')];
  for (const sort of ['newest', 'oldest']) assert.deepEqual(filterAndSort(ties, { sort }).map(entry => entry.id), ['a', 'b']);
  assert.equal(filterAndSort(index, { category: 'missing' }).length, 0);
  assert.deepEqual(index.map(entry => entry.id), original);
});

test('AC2/AC3: built index excludes drafts/body; HTML keeps every card and base-aware forms/modules without JS', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'iab-search-'));
  const content = join(directory, 'content');
  const original = process.env.CONTENT_DIR;
  const originalBase = site.basePath;
  try {
    cpSync(fixtureRoot, content, { recursive: true });
    cpSync(join(projectRoot, 'tests/fixtures/pages'), content, { recursive: true });
    process.env.CONTENT_DIR = relative(projectRoot, content);
    // pages.test.mjs has no exported build helper; use the same Eleventy API directly.
    for (const base of ['/it-academic-bulletin/', '/']) {
      // Eleventy ignores '/' as an API pathPrefix override; config reads this value.
      site.basePath = base;
      const output = join(directory, base === '/' ? 'root' : 'prefixed');
      const eleventy = new Eleventy('src', output, {
        source: 'cli', configPath: './eleventy.config.js', quietMode: true, pathPrefix: base,
      });
      await eleventy.write();
      const source = readFileSync(join(output, 'search-index.json'), 'utf8');
      const index = JSON.parse(source);
      assert.doesNotMatch(source, /Fixture announcement (hidden|default)|"(?:hidden|default)"|Fixture.*body|"body"/);
      assert.deepEqual(index, buildIndex(getContent(content).announcements).map(entry => ({
        ...entry, url: `${base}thong-bao/${entry.id}/`,
      })));
      assert.ok(index.some(entry => entry.id === 'formatted'));
      const page = readFileSync(join(output, 'thong-bao/index.html'), 'utf8');
      assert.ok(page.includes(`method="get" action="${base}thong-bao/"`));
      assert.ok(page.includes(`<script type="module" src="${base}assets/search.js"></script>`));
      for (const name of ['q', 'category', 'sort']) assert.ok(page.includes(`name="${name}"`));
      assert.match(page, /<label for="search-q">/);
      assert.match(page, /value="alpha"/);
      assert.doesNotMatch(page, /value="hidden"/);
      assert.match(page, /aria-live="polite"/);
      assert.match(page, /<div data-search-empty(?:="")? hidden(?:="")?>/);
      assert.ok(page.includes(`href="${base}danh-muc/">Xem các danh mục`));
      const cards = [...page.matchAll(/<h2><a href="[^\"]*\/thong-bao\/([^/]+)\/"/g)].map(match => match[1]);
      assert.deepEqual(cards, ['priority-new', 'pinned', 'formatted', 'a', 'b', 'older']);
      assert.doesNotMatch(page, /class="announcement-card"[^>]*hidden/);
      const home = readFileSync(join(output, 'index.html'), 'utf8');
      assert.ok(home.includes(`method="get" action="${base}thong-bao/"`));
      assert.match(home, /name="q"/);
      assert.doesNotMatch(home, /name="category"|name="sort"/);
      assert.equal(readFileSync(join(output, 'assets/search-helpers.js'), 'utf8'), readFileSync(join(projectRoot, 'src/lib/search.js'), 'utf8'));
      assert.equal(readFileSync(join(output, 'assets/search.js'), 'utf8'), readFileSync(join(projectRoot, 'src/assets/search.js'), 'utf8'));
    }
  } finally {
    site.basePath = originalBase;
    if (original === undefined) delete process.env.CONTENT_DIR;
    else process.env.CONTENT_DIR = original;
    rmSync(directory, { recursive: true, force: true });
  }
});

test('AC3/EC-004: client preserves default order, filters/reorders existing cards, shares URL and keeps cards on fetch failure', async () => {
  const source = readFileSync(join(projectRoot, 'src/assets/search.js'), 'utf8')
    .replace(/^import[^\n]+\n/, '').replaceAll('import.meta.url', 'moduleUrl');
  const index = buildIndex(getContent(fixtureRoot).announcements).map(entry => ({ ...entry, url: `/base${entry.url}` }));
  for (const [query, failure] of [['', false], ['?q=fixture&category=alpha&sort=oldest', false], ['?q=fixture', true]]) {
    const location = new URL(`https://example.org/base/thong-bao/${query}`);
    const events = {};
    const controls = Object.fromEntries(['q', 'category', 'sort'].map(key => [key, { value: '' }]));
    const form = { elements: controls, addEventListener: (event, handler) => { events[event] = handler; } };
    const status = { textContent: '' };
    const empty = { hidden: true };
    const original = [...index].sort((a, b) => Number(b.important) - Number(a.important));
    const cards = original.map(entry => ({
      id: entry.id, hidden: false,
      querySelector: () => ({ href: new URL(entry.url, location).href }),
    }));
    const list = {
      querySelectorAll: () => [...cards],
      append(card) { cards.splice(cards.indexOf(card), 1); cards.push(card); },
    };
    const nodes = { '.search-box': form, '.announcement-list': list, '[data-search-status]': status, '[data-search-empty]': empty };
    await runInNewContext(`(async () => { ${source} })()`, {
      filterAndSort, URL, URLSearchParams, location, moduleUrl: 'https://example.org/base/assets/search.js',
      document: { querySelector: selector => nodes[selector] },
      window: { addEventListener: (event, handler) => { events[event] = handler; } },
      history: { replaceState: (_state, _unused, url) => { location.href = url.href; } },
      fetch: async url => {
        assert.equal(url.href, 'https://example.org/base/search-index.json');
        if (failure) throw new Error('offline');
        return { ok: true, json: async () => index };
      },
    });
    if (failure || !query) {
      assert.deepEqual(cards.map(card => card.id), original.map(entry => entry.id));
      assert.ok(cards.every(card => !card.hidden));
    } else {
      assert.deepEqual(cards.filter(card => !card.hidden).map(card => card.id), ['pinned', 'older', 'b']);
      assert.equal(controls.q.value, 'fixture');
      assert.equal(controls.category.value, 'alpha');
      assert.equal(controls.sort.value, 'oldest');
    }
    if (failure) { assert.match(status.textContent, /Tất cả thông báo vẫn hiển thị/); continue; }
    const submit = { preventDefault() {} };
    controls.q.value = 'fixture';
    controls.category.value = 'alpha';
    controls.sort.value = 'oldest';
    events.submit(submit);
    assert.deepEqual(cards.filter(card => !card.hidden).map(card => card.id), ['pinned', 'older', 'b']);
    assert.equal(location.searchParams.get('q'), 'fixture');
    assert.equal(location.searchParams.get('category'), 'alpha');
    assert.equal(location.searchParams.get('sort'), 'oldest');
    controls.q.value = 'no-such-result';
    events.change(submit);
    assert.ok(cards.every(card => card.hidden));
    assert.equal(empty.hidden, false);
    assert.match(status.textContent, /Không tìm thấy/);
    location.search = '';
    events.popstate();
    assert.equal(controls.q.value, '');
    assert.deepEqual(cards.map(card => card.id), original.map(entry => entry.id));
    assert.ok(cards.every(card => !card.hidden));
    assert.equal(empty.hidden, true);
  }
});
