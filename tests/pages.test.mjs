import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { after, before, test } from 'node:test';
import Eleventy from '@11ty/eleventy';
import buildDate from '../src/_data/build.js';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const directory = mkdtempSync(join(tmpdir(), 'iab-pages-'));
const contentRoot = join(directory, 'content');
const fixtureOutput = join(directory, 'fixture-output');
const productionOutput = join(directory, 'production-output');
const today = buildDate();
const html = (output, path = 'index.html') => readFileSync(join(output, path), 'utf8');
const main = source => source.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
const announcementIds = source => [...source.matchAll(/<h[23]><a href="[^\"]*\/thong-bao\/([^/]+)\/"/g)].map(match => match[1]);

async function buildSite(content, output) {
  const original = process.env.CONTENT_DIR;
  try {
    if (content) process.env.CONTENT_DIR = relative(projectRoot, content);
    else delete process.env.CONTENT_DIR;
    const eleventy = new Eleventy('src', output, {
      source: 'cli', configPath: './eleventy.config.js', quietMode: true,
    });
    await eleventy.write();
  } finally {
    if (original === undefined) delete process.env.CONTENT_DIR;
    else process.env.CONTENT_DIR = original;
  }
}

before(async () => {
  cpSync(join(projectRoot, 'tests/fixtures/content'), contentRoot, { recursive: true });
  cpSync(join(projectRoot, 'tests/fixtures/pages'), contentRoot, { recursive: true });
  // Extra published fixtures exercise the homepage limits and the deadline boundary.
  for (const [id, important, published_date] of [
    ['priority-a', true, '2023-01-01'], ['priority-b', true, '2023-01-01'],
    ['today', false, '2026-01-01'],
  ]) {
    writeFileSync(join(contentRoot, 'announcements', `${id}.md`), `---\n${JSON.stringify({
      title: `Fixture announcement ${id}`, category: 'alpha', published: true,
      important, published_date, ...(id === 'today' ? { deadline: today } : {}),
    })}\n---\nFixture body.\n`);
  }
  await buildSite(contentRoot, fixtureOutput);
  await buildSite(undefined, productionOutput);
});

after(() => rmSync(directory, { recursive: true, force: true }));

test('AC1: unpublished entries have no output files or references anywhere in the build', () => {
  for (const id of ['hidden', 'default']) {
    assert.equal(existsSync(join(fixtureOutput, `thong-bao/${id}/index.html`)), false);
  }
  assert.equal(existsSync(join(fixtureOutput, 'danh-muc/hidden/index.html')), false);
  assert.equal(existsSync(join(fixtureOutput, 'pages/thong-bao/detail-layout/index.html')), false);
  for (const file of readdirSync(fixtureOutput, { recursive: true }).filter(file => file.endsWith('.html'))) {
    assert.doesNotMatch(html(fixtureOutput, file), /Fixture announcement (hidden|default)|Fixture category hidden|\/thong-bao\/(hidden|default)\/|\/danh-muc\/hidden\//, file);
  }
  assert.match(main(html(fixtureOutput, 'thong-bao/a/index.html')), /<span>Khác<\/span>/);
  assert.doesNotMatch(main(html(fixtureOutput, 'thong-bao/a/index.html')), /\/danh-muc\/khac\//);
});

test('AC2: empty categories show the update message and populated categories contain only their announcements', () => {
  for (const slug of ['first', 'beta']) {
    const page = main(html(fixtureOutput, `danh-muc/${slug}/index.html`));
    assert.match(page, /Nội dung đang được cập nhật/);
    assert.deepEqual(announcementIds(page), []);
    assert.match(page, new RegExp(`/danh-muc/${slug}/" aria-current="page"`));
  }
  const alpha = main(html(fixtureOutput, 'danh-muc/alpha/index.html'));
  assert.deepEqual(announcementIds(alpha), ['formatted', 'b', 'priority-new', 'today', 'older', 'pinned', 'priority-a', 'priority-b']);
  assert.doesNotMatch(alpha, /Nội dung đang được cập nhật/);
  const categories = main(html(fixtureOutput, 'danh-muc/index.html'));
  const links = [...categories.matchAll(/href="[^\"]*\/danh-muc\/([^/]+)\/"/g)].map(match => match[1]);
  assert.deepEqual(links, ['first', 'alpha', 'beta']);
});

test('AC3: important announcements precede date/id ordered entries; homepage caps important/latest at 3/6', () => {
  assert.deepEqual(announcementIds(main(html(fixtureOutput, 'thong-bao/index.html'))), [
    'priority-new', 'pinned', 'priority-a', 'priority-b', 'formatted', 'a', 'b', 'today', 'older',
  ]);
  const home = main(html(fixtureOutput));
  const sections = [...home.matchAll(/<section\b[^>]*aria-labelledby="(important|latest)-title"[^>]*>([\s\S]*?)<\/section>/g)];
  assert.equal(sections.length, 2);
  assert.deepEqual(announcementIds(sections[0][2]), ['priority-new', 'pinned', 'priority-a']);
  assert.deepEqual(announcementIds(sections[1][2]), ['formatted', 'a', 'b', 'priority-new', 'today', 'older']);
});

test('detail pages preserve filename URLs, escape raw HTML and render Markdown/attachments with access labels', () => {
  const page = html(fixtureOutput, 'thong-bao/formatted/index.html');
  assert.match(page, /<h1>Fixture renamed title &lt;b&gt;plain text&lt;\/b&gt;<\/h1>/);
  assert.match(page, /Fixture summary &lt;img src=x onerror=alert\(1\)&gt;/);
  assert.match(page, /<strong>Markdown bold<\/strong>/);
  assert.match(page, /<a rel="noopener noreferrer" href="https:\/\/example.org\/fixture-body">fixture link<\/a>/);
  assert.match(page, /<h2>Fixture subheading<\/h2>/);
  assert.match(page, /<li>Fixture list item<\/li>/);
  assert.match(page, /&lt;script&gt;alert\('fixture-raw-html'\)&lt;\/script&gt;/);
  assert.match(page, /&lt;b&gt;Fixture raw HTML&lt;\/b&gt;/);
  assert.match(page, /\{\{ fixture_expression_must_remain_literal \}\}/);
  assert.doesNotMatch(page, /<script>alert|<b>|<img src=x/);
  assert.match(page, /rel="canonical" href="https:\/\/ntnghia-hcmiu.github.io\/it-academic-bulletin\/thong-bao\/formatted\/"/);
  assert.doesNotMatch(page, /name="robots" content="noindex"/);
  for (const [url, note] of [['fixture-public?first=1&amp;second=2', 'Công khai'], ['fixture-iu', 'Yêu cầu tài khoản IU']]) {
    assert.ok(page.includes(`href="https://example.org/${url}" rel="noopener noreferrer"`));
    assert.ok(page.includes(note));
  }
  assert.match(page, /Fixture public &lt;b&gt;attachment&lt;\/b&gt;/);
  assert.match(page, /Fixture attachment without access note/);
  assert.doesNotMatch(html(fixtureOutput, 'thong-bao/b/index.html'), /class="attachment-list"/);
  for (const output of [fixtureOutput, productionOutput]) {
    for (const file of readdirSync(output, { recursive: true }).filter(file => file.endsWith('.html'))) {
      assert.doesNotMatch(html(output, file), /\/it-academic-bulletin\/it-academic-bulletin\//, file);
    }
  }
});

test('deadlines are formatted and expired only after their UTC day, then refreshed client-side', () => {
  for (const [id, date, formatted, expired] of [
    ['formatted', '2000-01-01', '01/01/2000', true],
    ['priority-new', '2099-12-31', '31/12/2099', false],
    ['today', today, today.split('-').reverse().join('/'), false],
  ]) {
    const page = html(fixtureOutput, `thong-bao/${id}/index.html`);
    const badge = page.match(/<span class="deadline-badge"[\s\S]*?<\/time><span class="deadline-status">([^<]*)<\/span>/);
    assert.ok(badge, id);
    assert.ok(badge[0].includes(`<time datetime="${date}">${formatted}</time>`));
    assert.equal(badge[1].includes('Đã hết hạn'), expired, id);
  }
  assert.doesNotMatch(main(html(fixtureOutput, 'thong-bao/b/index.html')).split('<script>')[0], /data-deadline/);
  const source = html(fixtureOutput, 'thong-bao/priority-new/index.html').match(/<script>([\s\S]*?)<\/script>/)[1];
  const statuses = [{ textContent: '' }, { textContent: ' — Đã hết hạn' }, { textContent: '' }];
  const badges = ['2099-12-31', '2100-01-01', '2100-01-02'].map((deadline, i) => ({
    dataset: { deadline }, querySelector: () => statuses[i],
  }));
  let onPageShow;
  runInNewContext(source, {
    Date: class extends Date { constructor() { super('2100-01-01T12:00:00Z'); } },
    document: { querySelectorAll: () => badges },
    window: { addEventListener: (event, callback) => { assert.equal(event, 'pageshow'); onPageShow = callback; } },
  });
  assert.deepEqual(statuses.map(status => status.textContent), [' — Đã hết hạn', '', '']);
  statuses[0].textContent = '';
  onPageShow();
  assert.equal(statuses[0].textContent, ' — Đã hết hạn');
});

test('production with no announcements builds the homepage and all nine empty category pages', () => {
  const home = main(html(productionOutput));
  assert.match(home, /Chưa có thông báo/);
  assert.match(home, /Nội dung đang được cập nhật/);
  assert.deepEqual(announcementIds(home), []);
  assert.match(main(html(productionOutput, 'thong-bao/index.html')), /Chưa có thông báo/);
  const categoryFiles = readdirSync(join(productionOutput, 'danh-muc'), { recursive: true }).filter(file => file.endsWith('/index.html'));
  assert.equal(categoryFiles.length, 9);
  for (const file of categoryFiles) assert.match(main(html(productionOutput, `danh-muc/${file}`)), /Nội dung đang được cập nhật/);
  assert.equal(existsSync(join(productionOutput, 'thong-bao/detail')), false);
});
