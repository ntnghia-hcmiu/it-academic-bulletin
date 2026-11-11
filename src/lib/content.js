import { readdirSync, readFileSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { schemas, validateEntry } from './schema.js';

export const defaultContentRoot = fileURLToPath(new URL('../content/', import.meta.url));

function filesIn(directory) {
  let files;
  try {
    files = readdirSync(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
  return files.filter(file => !file.name.startsWith('.')).sort((a, b) => a.name.localeCompare(b.name))
    .flatMap(file => file.isDirectory() ? filesIn(join(directory, file.name))
      : file.isFile() ? [join(directory, file.name)] : []);
}

function parseFile(file) {
  const source = readFileSync(file, 'utf8');
  if (extname(file) === '.json') return JSON.parse(source);
  if (extname(file) === '.yml') return yaml.load(source);
  // Require a complete front matter block; retain the Markdown body verbatim.
  const match = source.match(/^\uFEFF?---\r?\n([\s\S]*?)^---[ \t]*(?:\r?\n|$)/m);
  if (!match || match.index !== 0) throw new Error('thiếu front matter ---');
  const data = yaml.load(match[1]);
  if (!data || typeof data !== 'object' || Array.isArray(data) || data instanceof Date) {
    throw new Error('front matter phải là object');
  }
  return { ...data, body: source.slice(match[0].length) };
}

/** Read and validate without filtering; checker consumes errors, build warns and skips. */
export function readEntries(collection, root = defaultContentRoot) {
  if (!Object.hasOwn(schemas, collection)) throw new Error(`collection không hợp lệ: ${collection}`);
  return filesIn(join(root, collection)).filter(file => ['.yml', '.md', '.json'].includes(extname(file)))
    .map(file => {
      try {
        const data = parseFile(file);
        const errors = validateEntry(collection, data);
        if (errors.length) return { file, errors };
        const entry = { ...data, id: basename(file, extname(file)) };
        for (const [name, field] of Object.entries(schemas[collection])) {
          if (field.type === 'date' && entry[name] instanceof Date) entry[name] = entry[name].toISOString().slice(0, 10);
        }
        return { file, data: entry, errors: [] };
      } catch (error) {
        return { file, errors: [error.message] };
      }
    });
}

function validEntries(collection, root) {
  return readEntries(collection, root).flatMap(({ file, data, errors }) => {
    if (errors.length) {
      console.warn(`${file}: ${errors.join('; ')}`);
      return [];
    }
    return [data];
  });
}

const byText = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const byId = (a, b) => byText(a.id, b.id);
const byOrder = (a, b) => (a.order || 0) - (b.order || 0);
const byDate = field => (a, b) => byText(b[field], a[field]) || byId(a, b);

// All public collections use this one publication gate, including category defaults.
function publishedEntries(collection, root, compare) {
  return validEntries(collection, root)
    .filter(entry => (entry.published ?? schemas[collection].published.default) === true)
    .sort(compare);
}

export const getPublishedAnnouncements = root => publishedEntries('announcements', root, byDate('published_date'));
export const getPublishedCategories = root => publishedEntries('categories', root, (a, b) => byOrder(a, b) || byText(a.slug, b.slug));
export const getPublishedGuides = root => publishedEntries('guides', root, (a, b) => byOrder(a, b) || byId(a, b));
export const getPublishedResources = root => publishedEntries('resources', root, byDate('updated_date'));
export const getPublishedFaq = root => publishedEntries('faq', root, (a, b) => byOrder(a, b) || byId(a, b));
export const getSettings = root => validEntries('settings', root).find(entry => entry.id === 'site') ?? {};

/** Preserve date/id order within each importance group on the home page. */
export function getHomeAnnouncements(root) {
  return getPublishedAnnouncements(root).sort((a, b) => Number(b.important === true) - Number(a.important === true));
}

export function resolveCategory(slug, categories) {
  const category = categories.find(entry => entry.slug === slug && (entry.published ?? true) === true);
  if (category) return category;
  console.warn(`Danh mục "${slug}" bị ẩn hoặc không tồn tại; dùng "Khác".`);
  return { slug: 'khac', name: 'Khác' };
}

/** Eleventy global data; references are soft and never remove published entries. */
export function getContent(root) {
  const categories = getPublishedCategories(root);
  const withCategories = entries => entries.map(entry => ({
    ...entry,
    ...(entry.category ? { resolvedCategory: resolveCategory(entry.category, categories) } : {}),
  }));
  return {
    categories,
    announcements: withCategories(getPublishedAnnouncements(root)),
    guides: withCategories(getPublishedGuides(root)),
    resources: withCategories(getPublishedResources(root)),
    faq: withCategories(getPublishedFaq(root)),
    settings: getSettings(root),
  };
}
