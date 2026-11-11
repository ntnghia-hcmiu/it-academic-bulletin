import { filterAndSort } from './search-helpers.js';

const form = document.querySelector('.search-box');
const list = document.querySelector('.announcement-list');
const status = document.querySelector('[data-search-status]');
const empty = document.querySelector('[data-search-empty]');
const originalCards = [...list.querySelectorAll('.announcement-card')];
const cards = new Map(originalCards.map(card => [
  new URL(card.querySelector('h2 a').href).pathname, card,
]));
const controls = form.elements;
let index;

function restoreForm() {
  const params = new URLSearchParams(location.search);
  controls.q.value = params.get('q') ?? '';
  controls.category.value = params.get('category') ?? '';
  controls.sort.value = params.get('sort') === 'oldest' ? 'oldest' : 'newest';
}

function apply() {
  if (!index) return;
  const params = new URLSearchParams(location.search);
  const active = ['q', 'category', 'sort'].some(key => params.has(key));
  const results = active ? filterAndSort(index, {
    q: params.get('q') ?? '', category: params.get('category') ?? '', sort: params.get('sort') ?? 'newest',
  }) : index;
  const visible = new Set(results.map(entry => new URL(entry.url, location.href).pathname));
  for (const [path, card] of cards) card.hidden = !visible.has(path);
  if (active) {
    for (const entry of results) {
      const card = cards.get(new URL(entry.url, location.href).pathname);
      if (card) list.append(card);
    }
  } else {
    for (const card of originalCards) list.append(card);
  }
  empty.hidden = !active || results.length > 0;
  status.textContent = active ? (results.length ? `${results.length} thông báo phù hợp.` : 'Không tìm thấy thông báo phù hợp.') : '';
}

function update(event) {
  event.preventDefault();
  const url = new URL(location.href);
  for (const key of ['q', 'category', 'sort']) {
    const value = controls[key].value.trim();
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  history.replaceState(null, '', url);
  apply();
}

restoreForm();
try {
  const response = await fetch(new URL('../search-index.json', import.meta.url));
  if (!response.ok) throw new Error('Không tải được chỉ mục tìm kiếm');
  index = await response.json();
  apply();
  form.addEventListener('submit', update);
  form.addEventListener('change', update);
  window.addEventListener('popstate', () => { restoreForm(); apply(); });
} catch {
  for (const card of originalCards) { card.hidden = false; list.append(card); }
  empty.hidden = true;
  status.textContent = 'Chưa tải được tìm kiếm. Tất cả thông báo vẫn hiển thị; vui lòng thử lại sau.';
}
