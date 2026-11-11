import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { after, before, test } from 'node:test';
import Eleventy from '@11ty/eleventy';
import site from '../src/_data/site.js';
import { readEntries } from '../src/lib/content.js';
import { schemas } from '../src/lib/schema.js';
import { absoluteUrl } from '../src/lib/url.js';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const directory = mkdtempSync(join(tmpdir(), 'iab-verify-'));
const content = join(directory, 'content');
const outputs = new Map();
const escapedTitle = 'Fixture draft <special> & "quoted" \'title\'';
const read = (output, file) => readFileSync(join(output, file), 'utf8');

function verify(output, base, useEnv = false) {
  const result = spawnSync(process.execPath, ['scripts/verify-dist.mjs', ...(useEnv ? [] : [output])], {
    cwd: projectRoot, encoding: 'utf8', timeout: 30000,
    env: { ...process.env, CONTENT_DIR: content, DIST_DIR: output, BASE_PATH: base, SITE_URL: site.url },
  });
  assert.ifError(result.error);
  return { status: result.status, log: result.stdout + result.stderr };
}

// Fixture builders in pages/search tests are file-local. Use the same Eleventy API;
// run the existing CSS build too so asset existence is checked against a real build.
before(async () => {
  cpSync(join(projectRoot, 'tests/fixtures/content'), content, { recursive: true });
  cpSync(join(projectRoot, 'tests/fixtures/pages'), content, { recursive: true });
  const hiddenFile = join(content, 'announcements/hidden.md');
  writeFileSync(hiddenFile, readFileSync(hiddenFile, 'utf8').replace('Fixture announcement hidden', escapedTitle.replaceAll('"', '\\"')));
  const publishedGuide = readEntries('guides', content).find(entry => entry.data?.published === true).data;
  writeFileSync(join(content, 'guides/shared-label.md'), `---\n${JSON.stringify({ ...publishedGuide, published: false })}\n---\n`);
  const originalContent = process.env.CONTENT_DIR;
  const originalBase = site.basePath;
  try {
    process.env.CONTENT_DIR = relative(projectRoot, content);
    for (const base of ['/it-academic-bulletin/', '/']) {
      site.basePath = base;
      const output = join(directory, base === '/' ? 'root' : 'project');
      const eleventy = new Eleventy('src', output, {
        source: 'cli', configPath: './eleventy.config.js', quietMode: true, pathPrefix: base,
      });
      await eleventy.write();
      const css = spawnSync(join(projectRoot, 'node_modules/.bin/tailwindcss'), [
        '-i', 'src/styles/global.css', '-o', join(output, 'assets/site.css'), '--minify',
      ], { cwd: projectRoot, encoding: 'utf8', timeout: 60000 });
      assert.ifError(css.error);
      assert.equal(css.status, 0, css.stdout + css.stderr);
      outputs.set(base, output);
    }
  } finally {
    site.basePath = originalBase;
    if (originalContent === undefined) delete process.env.CONTENT_DIR;
    else process.env.CONTENT_DIR = originalContent;
  }
});
after(() => rmSync(directory, { recursive: true, force: true }));

function mutatedOutput(change) {
  const output = join(directory, 'mutated');
  rmSync(output, { recursive: true, force: true });
  cpSync(outputs.get('/it-academic-bulletin/'), output, { recursive: true });
  change(output);
  return output;
}
const append = (output, file, text) => writeFileSync(join(output, file), read(output, file) + text);
const replaceHome = (output, pattern, replacement) => writeFileSync(join(output, 'index.html'), read(output, 'index.html').replace(pattern, replacement));

test('AC1–AC3: complete fixture builds pass for project/root bases, with matching robots, sitemap and current nav', () => {
  for (const [base, output] of outputs) {
    const result = verify(output, base, base === '/');
    assert.equal(result.status, 0, result.log);
    assert.match(result.log, /verify-dist PASS/);
    assert.match(result.log, /Bỏ dò 1 tiêu đề/);
    const sitemap = read(output, 'sitemap.xml');
    const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
    assert.equal(new Set(locations).size, locations.length);
    assert.doesNotMatch(sitemap, /404|search-index|hidden|default|shared-label/);
    for (const [collection, route, key] of [
      ['announcements', 'thong-bao', 'id'], ['categories', 'danh-muc', 'slug'], ['guides', 'huong-dan', 'id'],
    ]) {
      for (const { data } of readEntries(collection, content)) {
        if (!(data.published ?? schemas[collection].published.default)) continue;
        assert.ok(locations.includes(absoluteUrl(site.url, base, `/${route}/${data[key]}/`)), `${collection}/${data[key]}`);
      }
    }
    assert.equal(read(output, 'robots.txt').trim(), `User-agent: *\nAllow: /\nSitemap: ${absoluteUrl(site.url, base, '/sitemap.xml')}`);
    const home = read(output, 'index.html');
    assert.ok(home.includes(`href="${base}" aria-current="page"`));
    assert.match(home, /class="skip-link" href="#main"/);
    assert.match(home, /<main id="main"[^>]*tabindex="-1"/);
  }
});

test('AC1: injected hidden labels, routes and HTML pages fail, including escaped data and every publish gate', async t => {
  const cases = [
    ['raw HTML title', 'leak.html', escapedTitle, /lộ tiêu đề/],
    ['escaped HTML title', 'leak.html', 'Fixture draft &lt;special&gt; &amp; &quot;quoted&quot; &#39;title&#39;', /lộ tiêu đề/],
    ['JSON title', 'leak.json', JSON.stringify({ title: escapedTitle }), /lộ tiêu đề/],
    ['JS data title', 'leak.js', `const data = ${JSON.stringify(escapedTitle)};`, /lộ tiêu đề/],
    ['XML title', 'leak.xml', 'Fixture draft &lt;special&gt; &amp; &quot;quoted&quot; &apos;title&apos;', /lộ tiêu đề/],
    ['default false', 'leak.json', 'Fixture announcement default', /lộ tiêu đề/],
    ['guide', 'leak.json', 'Fixture title hidden', /guides\/hidden/],
    ['resource', 'leak.json', 'Fixture title hidden', /resources\/hidden/],
    ['FAQ', 'leak.json', 'Fixture question hidden', /faq\/hidden/],
    ['category', 'leak.json', 'Fixture category hidden', /categories\/hidden/],
    ['route only', 'leak.json', '{"url":"/it-academic-bulletin/thong-bao/hidden/"}', /tham chiếu route bài ẩn/],
    ['escaped route', 'leak.json', '{"url":"\\/thong-bao\\/hidden\\/"}', /tham chiếu route bài ẩn/],
    ['hidden HTML page', 'thong-bao/hidden/index.html', '', /trang bài ẩn tồn tại/],
    ['shared title still checks route', 'huong-dan/shared-label/index.html', '', /trang bài ẩn tồn tại/],
  ];
  for (const [name, file, text, expected] of cases) await t.test(name, () => {
    const output = mutatedOutput(output => {
      mkdirSync(dirname(join(output, file)), { recursive: true });
      writeFileSync(join(output, file), text);
    });
    const result = verify(output, '/it-academic-bulletin/');
    assert.equal(result.status, 1, result.log);
    assert.match(result.log, expected);
  });
});

test('AC2: broken href/src, missing or sibling base, and same-site absolute links fail; suffixes and external links pass', async t => {
  const cases = [
    ['broken href', '<a href="/it-academic-bulletin/missing/?q=1#part">x</a>', /file không tồn tại/],
    ['broken src', '<img src="/it-academic-bulletin/missing.png">', /file không tồn tại/],
    ['missing base', '<a href="/thong-bao/">x</a>', /thiếu base path/],
    ['relative path', '<a href="thong-bao/">x</a>', /thiếu base path/],
    ['sibling base', '<a href="/it-academic-bulletin-other/">x</a>', /thiếu base path/],
    ['same site absolute', `<a href="${site.url}/missing/">x</a>`, /thiếu base path/],
  ];
  for (const [name, text, expected] of cases) await t.test(name, () => {
    const result = verify(mutatedOutput(output => append(output, 'index.html', text)), '/it-academic-bulletin/');
    assert.equal(result.status, 1, result.log);
    assert.match(result.log, expected);
  });
  const output = mutatedOutput(output => append(output, 'index.html', `
    <a href='/it-academic-bulletin/thong-bao/?first=1&amp;second=2#heading'>existing</a>
    <a href="${site.url}/it-academic-bulletin/">same site</a>
    <a href="https://example.invalid/external">external</a><a href="http://example.invalid/">external</a>
    <a href="//example.invalid/">external</a><a href="mailto:fixture@example.invalid">mail</a>
    <a href="tel:0000000000">phone</a><a href="#main">fragment</a>
    <!-- <img src="/comment-is-not-a-link"> -->
    <script>const sample = '<a href="/js-string-is-not-a-link">';</script>`));
  const result = verify(output, '/it-academic-bulletin/');
  assert.equal(result.status, 0, result.log);
});

test('AC3: missing/empty SEO, incorrect canonical and invalid sitemap entries fail; 404 noindex is excluded', async t => {
  const cases = [
    ['missing title', output => replaceHome(output, /<title>.*?<\/title>/, ''), /title thiếu/],
    ['empty title', output => replaceHome(output, /<title>.*?<\/title>/, '<title> </title>'), /title thiếu/],
    ['missing description', output => replaceHome(output, /<meta name="description"[^>]*>/, ''), /description thiếu/],
    ['empty description', output => replaceHome(output, /<meta name="description"[^>]*>/, '<meta name="description" content="">'), /description thiếu/],
    ['missing canonical', output => replaceHome(output, /<link rel="canonical"[^>]*>/, ''), /canonical cần/],
    ['incorrect canonical', output => replaceHome(output, /<link rel="canonical"[^>]*>/, '<link rel="canonical" href="https://example.invalid/">'), /canonical cần/],
    ['missing sitemap', output => rmSync(join(output, 'sitemap.xml')), /thiếu sitemap/],
    ['hidden sitemap URL', output => append(output, 'sitemap.xml', `<loc>${site.url}/it-academic-bulletin/thong-bao/hidden/</loc>`), /route bài ẩn/],
    ['noindex sitemap URL', output => append(output, 'sitemap.xml', `<loc>${site.url}/it-academic-bulletin/404.html</loc>`), /trang noindex/],
    ['relative sitemap URL', output => append(output, 'sitemap.xml', '<loc>/it-academic-bulletin/</loc>'), /cần URL tuyệt đối/],
    ['external sitemap URL', output => append(output, 'sitemap.xml', '<loc>https://example.invalid/</loc>'), /sai site.url/],
    ['broken sitemap URL', output => append(output, 'sitemap.xml', `<loc>${site.url}/it-academic-bulletin/missing/</loc>`), /file không tồn tại/],
    ['non-HTML sitemap URL', output => append(output, 'sitemap.xml', `<loc>${site.url}/it-academic-bulletin/search-index.json</loc>`), /không phải trang HTML/],
  ];
  for (const [name, change, expected] of cases) await t.test(name, () => {
    const result = verify(mutatedOutput(change), '/it-academic-bulletin/');
    assert.equal(result.status, 1, result.log);
    assert.match(result.log, expected);
  });
});
