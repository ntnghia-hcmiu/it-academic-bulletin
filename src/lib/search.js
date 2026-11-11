/** Fold Vietnamese text for accent-insensitive, whitespace-separated searching. */
export function normalize(text = '') {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/\s+/g, ' ').trim();
}

export function matches(entry, query) {
  const text = normalize(`${entry.title} ${entry.summary ?? ''} ${entry.category.name}`);
  return normalize(query).split(' ').every(token => text.includes(token));
}

/** Input is bulletin.announcements: content.js owns the publication gate. */
export function buildIndex(announcements) {
  return announcements.map(entry => ({
    id: entry.id,
    url: `/thong-bao/${entry.id}/`,
    title: entry.title,
    summary: entry.summary ?? '',
    category: { slug: entry.resolvedCategory.slug, name: entry.resolvedCategory.name },
    published_date: entry.published_date,
    important: entry.important === true,
  }));
}

export function filterAndSort(entries, { q = '', category = '', sort = 'newest' } = {}) {
  const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
  return entries.filter(entry => (!category || entry.category.slug === category) && matches(entry, q))
    .sort((a, b) => (sort === 'oldest' ? 1 : -1) * compare(a.published_date, b.published_date)
      || compare(a.id, b.id));
}

// Existing RenderPlugin invokes this with its URL helper; no I/O or imports needed.
export default function renderIndex({ announcements }) {
  return JSON.stringify(buildIndex(announcements).map(entry => ({ ...entry, url: this.url(entry.url) })));
}
