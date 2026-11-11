import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative, resolve, sep } from 'node:path';
import site from '../src/_data/site.js';
import { defaultContentRoot, readEntries } from '../src/lib/content.js';
import { schemas } from '../src/lib/schema.js';
import { absoluteUrl, joinBase } from '../src/lib/url.js';

// Usage: CONTENT_DIR=... BASE_PATH=... SITE_URL=... node scripts/verify-dist.mjs [dist]
// DIST_DIR is an alternative to the positional output directory.
const output = resolve(process.argv[2] ?? process.env.DIST_DIR ?? 'dist');
const contentRoot = resolve(process.env.CONTENT_DIR ?? defaultContentRoot);
const errors = [];
const fail = (file, message) => errors.push(`${file}: ${message}`);
const base = joinBase(site.basePath, '');
const origin = new URL(site.url).origin;

function filesIn(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = join(directory, entry.name);
    return entry.isDirectory() ? filesIn(file) : entry.isFile() ? [file] : [];
  });
}

// Decode entities used by Nunjucks/XML, plus numeric references in rendered content.
function decodeEntities(text) {
  const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  return text.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (match, entity) => {
    if (!entity.startsWith('#')) return entities[entity.toLowerCase()];
    const point = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : Number(entity.slice(1));
    return point <= 0x10ffff ? String.fromCodePoint(point) : match;
  });
}

// Tokenize generated HTML tags without treating escaped markup, comments or JS as tags.
function tagsIn(source) {
  const markup = source.replace(/<!--[\s\S]*?-->/g, '')
    .replace(/(<(?:script|style)\b[^>]*>)[\s\S]*?<\/(?:script|style)\s*>/gi, '$1');
  return [...markup.matchAll(/<([a-z][\w:-]*)\b((?:[^>"']|"[^"]*"|'[^']*')*)>/gi)].map(match => {
    const attrs = {};
    for (const attr of match[2].matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
      attrs[attr[1].toLowerCase()] = decodeEntities(attr[2] ?? attr[3] ?? attr[4] ?? '');
    }
    return { name: match[1].toLowerCase(), attrs };
  });
}

function localTarget(value, file, { absolute = false } = {}) {
  let url;
  try {
    if (absolute && !/^https?:\/\//i.test(value)) throw new Error('cần URL tuyệt đối');
    url = new URL(value, origin);
    if (!['http:', 'https:'].includes(url.protocol) || url.origin !== origin) throw new Error('sai site.url');
    if (!url.pathname.startsWith(base)) throw new Error(`thiếu base path ${base}`);
    const local = decodeURIComponent(url.pathname.slice(base.length));
    let target = resolve(output, local);
    if (target !== output && !target.startsWith(output + sep)) throw new Error('đường dẫn ngoài dist');
    if (statSync(target).isDirectory()) target = join(target, 'index.html');
    if (!statSync(target).isFile()) throw new Error('không phải file');
    return target;
  } catch (error) {
    fail(file, `link ${value}: ${error.code === 'ENOENT' ? 'file không tồn tại' : error.message}`);
  }
}

function verify() {
  const files = filesIn(output);
  const sources = new Map(files.filter(file => ['.html', '.json', '.xml', '.js'].includes(extname(file)))
    .map(file => [file, readFileSync(file, 'utf8')]));
  const gated = Object.keys(schemas).filter(collection => schemas[collection].published);
  const entries = gated.flatMap(collection => readEntries(collection, contentRoot)
    .filter(entry => entry.errors.length === 0)
    .map(({ data }) => ({ collection, ...data, published: data.published ?? schemas[collection].published.default })));
  const label = entry => entry.title ?? entry.question ?? entry.name;
  const publicLabels = new Set(entries.filter(entry => entry.published).map(label));
  const routes = { announcements: 'thong-bao', categories: 'danh-muc', guides: 'huong-dan', resources: 'bieu-mau', faq: 'hoi-dap' };
  const hiddenRoutes = [];
  let sharedLabels = 0;
  for (const entry of entries.filter(entry => !entry.published)) {
    const route = `/${routes[entry.collection]}/${entry.collection === 'categories' ? entry.slug : entry.id}/`;
    hiddenRoutes.push(route);
    if (files.some(file => '/' + relative(output, file).split(sep).join('/') === `${route}index.html`
      || '/' + relative(output, file).split(sep).join('/') === `${route.slice(0, -1)}.html`)) {
      fail(route, 'trang bài ẩn tồn tại');
    }
    // Exact public label collisions are ambiguous; still enforce the hidden route independently.
    const title = label(entry);
    const checkTitle = title && !publicLabels.has(title);
    if (title && !checkTitle) sharedLabels++;
    for (const [file, source] of sources) {
      // Decode HTML/XML and JSON/JS string escapes to cover raw and escaped labels/URLs.
      const decoded = decodeEntities(source.replace(/\\u([\da-f]{4})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
        .replace(/\\([/"\\])/g, '$1'));
      if (decoded.includes(route)) fail(relative(output, file), `tham chiếu route bài ẩn ${route}`);
      if (checkTitle && (source.includes(title) || decoded.includes(title)
        || source.includes(JSON.stringify(title).slice(1, -1)))) {
        fail(relative(output, file), `lộ tiêu đề/câu hỏi bài ẩn ${entry.collection}/${entry.id}: ${title}`);
      }
    }
  }

  const pages = new Map();
  for (const [file, source] of sources) {
    if (extname(file) !== '.html') continue;
    const name = relative(output, file);
    const tags = tagsIn(source);
    const noindex = tags.some(tag => tag.name === 'meta' && tag.attrs.name?.toLowerCase() === 'robots'
      && /(?:^|[\s,])noindex(?:$|[\s,])/i.test(tag.attrs.content ?? ''));
    pages.set(file, { noindex });
    for (const { attrs } of tags) {
      for (const attr of ['href', 'src']) {
        if (!Object.hasOwn(attrs, attr)) continue;
        const value = attrs[attr].trim();
        if (/^(?:#|mailto:|tel:)/i.test(value)) continue;
        if (/^(?:https?:)?\/\//i.test(value)) {
          try { if (new URL(value, origin).origin !== origin) continue; } catch { /* report below */ }
        }
        if (!value.startsWith('/') && !/^https?:\/\//i.test(value)) {
          fail(name, `${attr} ${value}: thiếu base path ${base}`);
          continue;
        }
        localTarget(value, name);
      }
    }
    if (noindex) continue;
    const titles = [...source.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/gi)];
    if (titles.length !== 1 || !decodeEntities(titles[0][1]).trim()) fail(name, 'title thiếu hoặc rỗng');
    const descriptions = tags.filter(tag => tag.name === 'meta' && tag.attrs.name?.toLowerCase() === 'description');
    if (descriptions.length !== 1 || !descriptions[0].attrs.content?.trim()) fail(name, 'description thiếu hoặc rỗng');
    const canonicals = tags.filter(tag => tag.name === 'link' && /(?:^|\s)canonical(?:$|\s)/i.test(tag.attrs.rel ?? ''));
    const route = '/' + name.split(sep).join('/').replace(/(?:^|\/)index\.html$/, '/').replace(/^\//, '');
    const expected = absoluteUrl(site.url, site.basePath, route);
    if (canonicals.length !== 1 || canonicals[0].attrs.href !== expected) fail(name, `canonical cần ${expected}`);
  }
  if (pages.size === 0) fail('dist', 'không có trang HTML');

  const sitemapFile = join(output, 'sitemap.xml');
  const sitemap = sources.get(sitemapFile);
  if (sitemap === undefined) fail('sitemap.xml', 'thiếu sitemap');
  else {
    const locations = [...sitemap.matchAll(/<loc\b[^>]*>([\s\S]*?)<\/loc\s*>/gi)].map(match => decodeEntities(match[1].trim()));
    if (!locations.length) fail('sitemap.xml', 'không có loc');
    for (const location of locations) {
      const target = localTarget(location, 'sitemap.xml', { absolute: true });
      if (!target) continue;
      if (!pages.has(target)) fail('sitemap.xml', `${location}: không phải trang HTML`);
      if (pages.get(target)?.noindex) fail('sitemap.xml', `${location}: trang noindex`);
      if (hiddenRoutes.some(route => new URL(location).pathname === joinBase(site.basePath, route))) {
        fail('sitemap.xml', `${location}: bài ẩn`);
      }
    }
  }
  if (sharedLabels) console.log(`Bỏ dò ${sharedLabels} tiêu đề ẩn trùng chính xác tiêu đề đã xuất bản; vẫn kiểm route.`);
}

try { verify(); } catch (error) { fail(output, error.message); }
if (errors.length) {
  console.error(`verify-dist FAIL (${errors.length} lỗi):\n${errors.map(error => `- ${error}`).join('\n')}`);
  process.exitCode = 1;
} else console.log(`verify-dist PASS: ${output}`);
