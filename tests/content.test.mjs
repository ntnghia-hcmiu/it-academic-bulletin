import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { closeSync, mkdtempSync, openSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import {
  getContent, getHomeAnnouncements, getPublishedAnnouncements, getPublishedCategories,
  getPublishedFaq, getPublishedGuides, getPublishedResources, readEntries, resolveCategory,
} from '../src/lib/content.js';
import { schemas, validateEntry } from '../src/lib/schema.js';
import globalContent from '../src/_data/bulletin.js';

const root = fileURLToPath(new URL('./fixtures/content/', import.meta.url));
const invalidRoot = fileURLToPath(new URL('./fixtures/invalid/', import.meta.url));
const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const loaders = [getPublishedAnnouncements, getPublishedCategories, getPublishedGuides, getPublishedResources, getPublishedFaq];

function captureWarnings(run) {
  const warnings = [];
  const original = console.warn;
  console.warn = message => warnings.push(message);
  try { return { result: run(), warnings }; }
  finally { console.warn = original; }
}

test('publication gate loads all formats, preserves filename ids/body and applies collection defaults', () => {
  for (const load of loaders) {
    const entries = load(root);
    assert.ok(!entries.some(entry => entry.id === 'hidden'));
    assert.ok(!entries.some(entry => entry.id === 'default'));
  }
  const announcements = getPublishedAnnouncements(root);
  assert.equal(announcements[0].id, 'a');
  assert.equal(announcements[0].published_date, '2026-01-02');
  assert.equal(announcements[0].body, 'Fixture **Markdown** body.\n');
  assert.equal(getPublishedCategories(root).find(entry => entry.id === 'alpha').published, undefined);
  const empty = mkdtempSync(join(tmpdir(), 'iab-content-'));
  try {
    for (const load of loaders) assert.deepEqual(load(empty), []);
    assert.deepEqual(getContent(empty).settings, {});
  } finally { rmSync(empty, { recursive: true, force: true }); }
});

test('sorts each public collection with deterministic ties and pins home announcements', () => {
  for (const [load, expected] of [
    [getPublishedAnnouncements, ['a', 'b', 'older', 'pinned']],
    [getPublishedCategories, ['first', 'alpha', 'beta']],
    [getPublishedGuides, ['a', 'b', 'later']],
    [getPublishedResources, ['a', 'b', 'later']],
    [getPublishedFaq, ['a', 'b', 'later']],
    [getHomeAnnouncements, ['pinned', 'a', 'b', 'older']],
  ]) assert.deepEqual(load(root).map(entry => entry.id), expected);
});

test('soft category resolution warns for hidden/missing references and build skips invalid entries', () => {
  const categories = readEntries('categories', root).map(entry => entry.data);
  const { result, warnings } = captureWarnings(() => ['hidden', 'missing', 'alpha'].map(slug => resolveCategory(slug, categories)));
  assert.deepEqual(result.slice(0, 2), [{ slug: 'khac', name: 'Khác' }, { slug: 'khac', name: 'Khác' }]);
  assert.equal(result[2].slug, 'alpha');
  assert.equal(warnings.length, 2);
  assert.match(warnings[0], /hidden/);
  assert.match(warnings[1], /missing/);
  const build = captureWarnings(() => getContent(root));
  assert.equal(build.result.announcements[0].resolvedCategory.name, 'Khác');
  assert.equal(build.result.announcements.length, 4);
  assert.equal(build.warnings.length, 1);
  const invalid = captureWarnings(() => getContent(invalidRoot));
  for (const name of ['announcements', 'categories', 'guides', 'resources', 'faq']) assert.deepEqual(invalid.result[name], []);
  assert.deepEqual(invalid.result.settings, {});
  assert.equal(invalid.warnings.length, 6);
});

test('production seed has exactly the nine approved categories, neutral descriptions and empty settings', () => {
  const content = globalContent();
  const expected = [
    ['thong-bao-hoc-vu', 'Thông báo học vụ'],
    ['chuong-trinh-dao-tao', 'Chương trình đào tạo'],
    ['dang-ky-mon-hoc', 'Đăng ký môn học / Add-Drop'],
    ['dang-ky-chuyen-nganh', 'Đăng ký chuyên ngành'],
    ['chuyen-nganh-chuong-trinh', 'Chuyển ngành / Chuyển chương trình'],
    ['internship', 'Internship / Thực tập'],
    ['giay-gioi-thieu-thuc-tap', 'Giấy giới thiệu thực tập'],
    ['tot-nghiep', 'Tốt nghiệp'],
    ['tam-dung-thoi-hoc-gia-han', 'Tạm dừng / Thôi học / Gia hạn'],
  ];
  assert.deepEqual(content.categories.map(({ slug, name }) => [slug, name]), expected);
  content.categories.forEach((entry, index) => {
    assert.equal(entry.id, entry.slug);
    assert.equal(entry.order, index + 1);
    assert.equal(entry.published, true);
    assert.match(entry.description, /^Thông tin liên quan đến [^.]+\.$/);
    assert.equal(entry.drive_folder_url || '', '');
  });
  for (const name of ['announcements', 'guides', 'resources', 'faq']) assert.deepEqual(content[name], []);
  const { id, site_title, ...settings } = content.settings;
  assert.equal(id, 'site');
  assert.equal(site_title, 'Thông tin học vụ — Khoa Công nghệ Thông tin');
  for (const value of Object.values(settings)) assert.ok(value === '' || (Array.isArray(value) && value.length === 0));
});

test('schema metadata validates required fields, types, dates, patterns, selects and nested lists', () => {
  const valid = {
    announcements: { title: 'Fixture', category: 'alpha', published_date: '2026-01-02' },
    categories: { name: 'Fixture', slug: 'alpha', order: 0 },
    guides: { title: 'Fixture', category: 'alpha', updated_date: new Date('2026-01-02') },
    resources: { title: 'Fixture', category: 'alpha', updated_date: '2026-01-02', external_url: 'https://example.org/' },
    faq: { question: 'Fixture?' },
    settings: { site_title: 'Fixture' },
  };
  assert.equal(Object.keys(schemas).length, 6);
  for (const [collection, fields] of Object.entries(schemas)) {
    assert.deepEqual(validateEntry(collection, { ...valid[collection], future_field: 'allowed' }), []);
    for (const [name, field] of Object.entries(fields)) {
      if (field.required) {
        const entry = { ...valid[collection] };
        delete entry[name];
        assert.ok(validateEntry(collection, entry).some(error => error.startsWith(name + ':')), `${collection}.${name}`);
        assert.ok(validateEntry(collection, { ...valid[collection], [name]: '' }).length);
        assert.deepEqual(validateEntry(collection, { ...valid[collection], [name]: null }), [`${name}: bắt buộc`]);
      } else {
        for (const value of ['', null]) assert.deepEqual(validateEntry(collection, { ...valid[collection], [name]: value }), []);
      }
    }
  }
  for (const [collection, changes, expected] of [
    ['announcements', { deadline: null, summary: null, attachments: [{ label: 'Fixture', url: 'https://example.org/', note: null }] }, []],
    ['settings', { quick_links: [{ label: null, url: null }], contacts: [{ role: 'Fixture', name: null }] }, []],
    ['announcements', { attachments: [{ label: null, url: 'https://example.org/' }] }, ['attachments[0].label: bắt buộc']],
    ['settings', { contacts: [{ role: null }] }, ['contacts[0].role: bắt buộc']],
  ]) assert.deepEqual(validateEntry(collection, { ...valid[collection], ...changes }), expected);
  for (const [collection, changes, field] of [
    ['announcements', { title: 'a'.repeat(201) }, 'title'],
    ['announcements', { summary: 'a'.repeat(301) }, 'summary'],
    ['announcements', { published: 'true' }, 'published'],
    ['announcements', { important: 1 }, 'important'],
    ['announcements', { published_date: '2026-02-30' }, 'published_date'],
    ['announcements', { published_date: '2026-1-02' }, 'published_date'],
    ['announcements', { deadline: new Date('invalid') }, 'deadline'],
    ['announcements', { attachments: [{ label: '', url: 'http://example.org/' }] }, 'attachments[0]'],
    ['announcements', { attachments: [{ label: 'Fixture', url: 'https://example.org/', note: 'invalid' }] }, 'attachments[0].note'],
    ['categories', { slug: 'Bad slug' }, 'slug'],
    ['categories', { order: -1 }, 'order'],
    ['categories', { order: '1' }, 'order'],
    ['categories', { order: Infinity }, 'order'],
    ['categories', { drive_folder_url: 'http://example.org/' }, 'drive_folder_url'],
    ['categories', { drive_access: 'invalid' }, 'drive_access'],
    ['guides', { order: false }, 'order'],
    ['resources', { external_url: '/local' }, 'external_url'],
    ['resources', { file_type: 'invalid', access: 'invalid' }, 'file_type'],
    ['faq', { question: 42 }, 'question'],
    ['settings', { quick_links: [{ url: 'http://example.org/' }] }, 'quick_links[0].url'],
    ['settings', { contacts: [{}] }, 'contacts[0].role'],
    ['settings', { contacts: [null] }, 'contacts[0]'],
    ['settings', { quick_links: {} }, 'quick_links'],
    ['settings', { faculty_website_url: 'http://example.org/' }, 'faculty_website_url'],
    ['settings', { drive_root_url: 'http://example.org/' }, 'drive_root_url'],
  ]) assert.ok(validateEntry(collection, { ...valid[collection], ...changes }).some(error => error.startsWith(field)), `${collection}.${field}`);
  assert.deepEqual(validateEntry('announcements', { ...valid.announcements, attachments: [{ label: 'Fixture', url: 'https://example.org/', note: 'Công khai' }] }), []);
  assert.deepEqual(validateEntry('settings', { site_title: 'Fixture', quick_links: [{ label: 'Fixture', url: 'https://example.org/' }], contacts: [{ role: 'Fixture' }] }), []);
  assert.ok(validateEntry('faq', null).length);
  assert.ok(validateEntry('missing', {}).length);
});

test('check script fails with file/field diagnostics for invalid fixtures and passes production content', () => {
  const run = (args, env = {}) => {
    // File descriptors avoid pipe/socket creation denied by restricted sandboxes.
    const directory = mkdtempSync(join(tmpdir(), 'iab-check-'));
    const stderrPath = join(directory, 'stderr');
    const stderr = openSync(stderrPath, 'w');
    try {
      const result = spawnSync(process.execPath, ['scripts/check.mjs', ...args], {
        cwd: projectRoot, env: { ...process.env, ...env }, stdio: ['ignore', 'ignore', stderr],
      });
      assert.ifError(result.error);
      return { status: result.status, stderr: readFileSync(stderrPath, 'utf8') };
    } finally {
      closeSync(stderr);
      rmSync(directory, { recursive: true, force: true });
    }
  };
  const invalid = run([invalidRoot]);
  assert.equal(invalid.status, 1, invalid.stderr);
  for (const pattern of [/missing\.md: title:/, /bad\.yml: slug:/, /bad-url\.yml: external_url:/, /broken\.md:/, /no-frontmatter\.md:/, /site\.json:/]) assert.match(invalid.stderr, pattern);
  assert.equal(run([], { CONTENT_ROOT: invalidRoot }).status, 1);
  const production = run([]);
  assert.equal(production.status, 0, production.stderr);
});
