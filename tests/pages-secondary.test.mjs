import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { after, before, test } from 'node:test';
import Eleventy from '@11ty/eleventy';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const directory = mkdtempSync(join(tmpdir(), 'iab-secondary-'));
const contentRoot = join(directory, 'content');
const fixtureOutput = join(directory, 'fixture-output');
const emptySeedOutput = join(directory, 'empty-seed-output');
const routes = ['huong-dan', 'bieu-mau', 'hoi-dap', 'lien-he'];
const html = (output, path = 'index.html') => readFileSync(join(output, path), 'utf8');
const main = source => source.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
const guideIds = source => [...source.matchAll(/href="[^"]*\/huong-dan\/([^/]+)\/"/g)].map(match => match[1]);
const section = (source, id) => source.match(new RegExp(`<section\\b[^>]*aria-labelledby="${id}"[^>]*>([\\s\\S]*?)<\\/section>`))?.[1];
const htmlFiles = output => readdirSync(output, { recursive: true }).filter(file => file.endsWith('.html'));

// Same in-process Eleventy/CONTENT_DIR isolation as pages.test.mjs; no subprocess pipes.
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
  const settings = JSON.parse(readFileSync(join(contentRoot, 'settings/site.json'), 'utf8'));
  settings.contacts = [
    { role: 'Fixture contact role 1', name: 'Fixture name <b>escaped</b>', email: 'fixture@example.invalid', phone: '0000000000', office: 'Fixture office', hours: 'Fixture hours', responsibilities: 'Fixture responsibilities' },
    { role: 'Fixture contact role 2', email: 'fixture-two@example.invalid' },
    { role: 'Fixture contact role 3', phone: '0000000001' },
    { role: 'Fixture contact role 4' },
  ];
  settings.contact_note = 'Fixture **contact note** and [note link](https://example.org/secondary-note).\n\n<script>alert(1)</script>\n\n<b>x</b>';
  settings.drive_root_url = 'https://example.org/secondary-drive-root-must-stay-hidden';
  writeFileSync(join(contentRoot, 'settings/site.json'), JSON.stringify(settings));
  const category = JSON.parse(readFileSync(join(contentRoot, 'categories/beta.yml'), 'utf8'));
  category.drive_folder_url = 'https://example.org/secondary-drive-folder-must-stay-hidden';
  writeFileSync(join(contentRoot, 'categories/beta.yml'), JSON.stringify(category));
  await buildSite(contentRoot, fixtureOutput);
  await buildSite(join(projectRoot, 'tests/fixtures/empty-seed'), emptySeedOutput);
});

after(() => rmSync(directory, { recursive: true, force: true }));

test('AC1: all secondary empty-seed pages render empty states; empty quick guides are hidden', () => {
  for (const route of routes) {
    const page = main(html(emptySeedOutput, `${route}/index.html`));
    assert.match(page, /class="empty-state"/, route);
    assert.match(page, route === 'lien-he' ? /Thông tin liên hệ đang được cập nhật/ : /Nội dung đang được cập nhật/, route);
  }
  const home = main(html(emptySeedOutput));
  assert.equal(section(home, 'quick-guides-title'), undefined);
  assert.match(section(home, 'contact-title'), /Thông tin liên hệ đang được cập nhật/);
  assert.equal(existsSync(join(emptySeedOutput, 'huong-dan/detail')), false);
  assert.equal(existsSync(join(fixtureOutput, 'pages/huong-dan/detail-layout/index.html')), false);
});

test('AC1: unpublished/default entries never produce guide pages or leak into any output', () => {
  for (const id of ['hidden', 'default']) assert.equal(existsSync(join(fixtureOutput, `huong-dan/${id}/index.html`)), false);
  for (const file of htmlFiles(fixtureOutput)) {
    assert.doesNotMatch(html(fixtureOutput, file), /Fixture (?:title|question|category) (?:hidden|default)|\/huong-dan\/(?:hidden|default)\//, file);
  }
});

test('guides/resources/FAQ are grouped by resolved category with orphan/general entries under Khác', () => {
  const guides = main(html(fixtureOutput, 'huong-dan/index.html'));
  assert.deepEqual(guideIds(section(guides, 'guides-alpha')), ['a', 'b', 'later']);
  assert.deepEqual(guideIds(section(guides, 'guides-beta')), ['secondary-formatted']);
  assert.deepEqual(guideIds(section(guides, 'guides-khac')), ['secondary-orphan']);
  const resources = main(html(fixtureOutput, 'bieu-mau/index.html'));
  const beta = section(resources, 'resources-beta');
  assert.ok(beta.indexOf('secondary-resource-public') < beta.indexOf('secondary-resource-iu'));
  assert.match(beta, /PDF/);
  assert.match(beta, /Google Form/);
  assert.match(beta, /10\/11\/2026/);
  assert.match(section(resources, 'resources-khac'), /Fixture secondary orphan resource/);
  const faq = main(html(fixtureOutput, 'hoi-dap/index.html'));
  const other = section(faq, 'faq-khac');
  assert.match(other, /Fixture secondary general question/);
  assert.match(other, /Fixture secondary orphan question/);
  assert.ok(other.indexOf('general question') < other.indexOf('orphan question'), 'fallback group preserves content order');
  assert.equal((faq.match(/<h2[^>]*>Khác<\/h2>/g) || []).length, 1);
  assert.doesNotMatch(section(faq, 'faq-beta'), /Fixture secondary (general|orphan) question/);
  for (const file of htmlFiles(fixtureOutput)) assert.doesNotMatch(html(fixtureOutput, file), /secondary-drive-(root|folder)-must-stay-hidden/, file);
});

test('guide detail uses stable ids, Markdown, escaped raw HTML, dates and attachment access labels', () => {
  const page = main(html(fixtureOutput, 'huong-dan/secondary-formatted/index.html'));
  assert.match(page, /Fixture secondary guide &lt;b&gt;escaped&lt;\/b&gt;/);
  assert.match(page, /Fixture secondary summary &lt;img src=x&gt;/);
  assert.match(page, /<strong>guide bold<\/strong>/);
  assert.match(page, /<h2>Fixture guide heading<\/h2>/);
  assert.match(page, /<li>Fixture guide list<\/li>/);
  assert.match(page, /datetime="2026-11-10">10\/11\/2026/);
  assert.match(page, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(page, /&lt;b&gt;x&lt;\/b&gt;/);
  assert.match(page, /\{\{ fixture_expression_must_remain_literal \}\}/);
  assert.doesNotMatch(page, /<script>|<b>|<img src=x/);
  assert.match(page, /secondary-public\?first=1&amp;second=2/);
  for (const note of ['Công khai', 'Yêu cầu tài khoản IU']) assert.ok(page.includes(note));
  assert.match(page, /Fixture secondary unlabelled attachment/);
  assert.doesNotMatch(main(html(fixtureOutput, 'huong-dan/a/index.html')), /class="attachment-list"/);
  assert.match(main(html(fixtureOutput, 'huong-dan/secondary-orphan/index.html')), /<span>Khác<\/span>/);
});

test('FAQ Markdown through renderContent escapes script/b tags and preserves bold/links on both routes', () => {
  for (const path of ['hoi-dap/index.html', 'danh-muc/beta/index.html']) {
    const page = main(html(fixtureOutput, path));
    assert.match(page, /<summary>Fixture secondary question &lt;b&gt;escaped&lt;\/b&gt;<\/summary>/);
    assert.match(page, /<strong>answer bold<\/strong>/);
    assert.match(page, /<a rel="noopener noreferrer" href="https:\/\/example.org\/secondary-answer">answer link<\/a>/);
    assert.match(page, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
    assert.match(page, /&lt;b&gt;x&lt;\/b&gt;/);
    assert.match(page, /\{\{ fixture_expression_must_remain_literal \}\}/);
    assert.doesNotMatch(page, /<script>alert\(1\)<\/script>|<b>x<\/b>/);
  }
});

test('D-10: missing, empty and whitespace answers retain questions and show the exact fallback', () => {
  const page = main(html(fixtureOutput, 'hoi-dap/index.html'));
  for (const question of ['Fixture question a', 'Fixture secondary empty question', 'Fixture secondary whitespace question']) {
    const detail = [...page.matchAll(/<details class="faq-item">([\s\S]*?)<\/details>/g)].find(match => match[1].includes(question));
    assert.ok(detail, question);
    assert.match(detail[1], /Chưa cập nhật câu trả lời/);
  }
});

test('AC2: every external anchor has rel; resources and attachments keep their supplied access labels', () => {
  for (const file of htmlFiles(fixtureOutput)) {
    const page = html(fixtureOutput, file);
    for (const anchor of page.matchAll(/<a\b[^>]*href="https?:[^>]*>/g)) assert.match(anchor[0], /rel="noopener noreferrer"/, `${file}: ${anchor[0]}`);
    assert.doesNotMatch(page, /\/it-academic-bulletin\/it-academic-bulletin\//, file);
  }
  for (const path of ['bieu-mau/index.html', 'danh-muc/beta/index.html']) {
    const page = main(html(fixtureOutput, path));
    for (const [url, access] of [['secondary-resource-public', 'Công khai'], ['secondary-resource-iu', 'Yêu cầu tài khoản IU']]) {
      const item = [...page.matchAll(/<li>([\s\S]*?)<\/li>/g)].find(match => match[1].includes(url));
      assert.ok(item, url);
      assert.ok(item[1].includes(`class="access-label">${access}</span>`));
    }
  }
});

test('homepage shows recent guides and at most three contacts; category sections contain only related entries', () => {
  const home = main(html(fixtureOutput));
  assert.deepEqual(guideIds(section(home, 'quick-guides-title')), ['secondary-formatted', 'secondary-orphan', 'a', 'b', 'later']);
  const contacts = section(home, 'contact-title');
  assert.equal((contacts.match(/class="contact-card"/g) || []).length, 3);
  assert.doesNotMatch(contacts, /Fixture contact role 4/);
  assert.match(contacts, /href="[^\"]*\/lien-he\/"/);
  const beta = main(html(fixtureOutput, 'danh-muc/beta/index.html'));
  assert.deepEqual(guideIds(section(beta, 'guides-title')), ['secondary-formatted']);
  assert.doesNotMatch(section(beta, 'resources-title'), /Fixture title a|orphan resource/);
  assert.doesNotMatch(section(beta, 'faq-title'), /Fixture question a|general question|orphan question/);
  const first = main(html(fixtureOutput, 'danh-muc/first/index.html'));
  for (const id of ['guides-title', 'resources-title', 'faq-title']) assert.equal(section(first, id), undefined);
});

test('AC3: empty-seed settings yield no emails/phones anywhere; fixture contacts render from settings', () => {
  for (const file of htmlFiles(emptySeedOutput)) {
    const page = html(emptySeedOutput, file);
    assert.doesNotMatch(page, /[\w.+-]+@[\w-]+\.[\w.]+/, file);
    assert.doesNotMatch(page, /(\+84|0)\d{8,10}/, file);
    assert.doesNotMatch(page, /href="(?:mailto:|tel:)/, file);
  }
  const page = main(html(fixtureOutput, 'lien-he/index.html'));
  assert.equal((page.match(/class="contact-card"/g) || []).length, 4);
  for (const text of ['Fixture name &lt;b&gt;escaped&lt;/b&gt;', 'Fixture office', 'Fixture hours', 'Fixture responsibilities', '<strong>contact note</strong>']) assert.ok(page.includes(text), text);
  assert.match(page, /href="mailto:fixture@example.invalid"/);
  assert.match(page, /href="tel:0000000000"/);
  assert.equal((page.match(/href="mailto:/g) || []).length, 2);
  assert.equal((page.match(/href="tel:/g) || []).length, 2);
  assert.doesNotMatch(page, /href="(?:mailto:|tel:)"|<script>|<b>x<\/b>/);
  assert.match(page, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
});
