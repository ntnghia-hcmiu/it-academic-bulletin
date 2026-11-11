/**
 * Join a site base and local path without changing query strings or fragments.
 * @param {string} base
 * @param {string} path
 * @returns {string}
 */
export function joinBase(base, path) {
  if (/^(?:https?:|mailto:|#)/i.test(path)) return path;

  const suffixIndex = path.search(/[?#]/);
  const pathname = suffixIndex === -1 ? path : path.slice(0, suffixIndex);
  const suffix = suffixIndex === -1 ? '' : path.slice(suffixIndex);
  const normalizedBase = base.split('/').filter(Boolean).join('/');

  return `/${normalizedBase}/${pathname}`.replace(/\/+/g, '/') + suffix;
}

/**
 * Resolve a local page path to an absolute URL for canonical links.
 * @param {string} site Site origin, including its scheme.
 * @param {string} base Site base path.
 * @param {string} path Local page path without the site base.
 * @returns {string}
 */
export function absoluteUrl(site, base, path) {
  return new URL(joinBase(base, path), site).href;
}
