// Field metadata follows CONTENT_MODEL §2; CP2-01 can compare it with .pages.yml.
const access = ['Công khai', 'Yêu cầu tài khoản IU'];
const attachments = {
  type: 'object', list: true,
  fields: {
    label: { type: 'string', required: true },
    url: { type: 'string', required: true, pattern: '^https://' },
    note: { type: 'select', options: access },
  },
};

export const schemas = {
  announcements: {
    title: { type: 'string', required: true, maxlength: 200 },
    summary: { type: 'text', maxlength: 300 },
    category: { type: 'reference', required: true, collection: 'categories' },
    published: { type: 'boolean', default: false },
    important: { type: 'boolean', default: false },
    published_date: { type: 'date', required: true, format: 'yyyy-MM-dd' },
    deadline: { type: 'date', default: '', format: 'yyyy-MM-dd' },
    attachments,
    body: { type: 'rich-text' },
  },
  categories: {
    name: { type: 'string', required: true },
    slug: { type: 'string', required: true, pattern: '^[a-z0-9-]+$' },
    description: { type: 'text' },
    order: { type: 'number', required: true, min: 0 },
    published: { type: 'boolean', default: true },
    drive_folder_url: { type: 'string', pattern: '^https://' },
    drive_access: { type: 'select', options: access },
  },
  guides: {
    title: { type: 'string', required: true },
    category: { type: 'reference', required: true, collection: 'categories' },
    summary: { type: 'text' },
    body: { type: 'rich-text' },
    attachments,
    updated_date: { type: 'date', required: true, format: 'yyyy-MM-dd' },
    published: { type: 'boolean', default: false },
    order: { type: 'number' },
  },
  resources: {
    title: { type: 'string', required: true },
    description: { type: 'text' },
    category: { type: 'reference', required: true, collection: 'categories' },
    external_url: { type: 'string', required: true, pattern: '^https://' },
    file_type: { type: 'select', options: ['PDF', 'Word', 'Excel', 'Google Form', 'Google Docs', 'Thư mục', 'Khác'] },
    access: { type: 'select', options: access },
    updated_date: { type: 'date', required: true, format: 'yyyy-MM-dd' },
    published: { type: 'boolean', default: false },
  },
  faq: {
    question: { type: 'string', required: true },
    answer: { type: 'rich-text' },
    category: { type: 'reference', collection: 'categories' },
    order: { type: 'number' },
    published: { type: 'boolean', default: false },
  },
  settings: {
    site_title: { type: 'string', required: true },
    site_tagline: { type: 'string' },
    intro: { type: 'text' },
    quick_links: {
      type: 'object', list: true,
      fields: { label: { type: 'string' }, url: { type: 'string', pattern: '^https://' } },
    },
    contacts: {
      type: 'object', list: true,
      fields: Object.fromEntries(['role', 'name', 'email', 'phone', 'office', 'hours', 'responsibilities']
        .map(name => [name, { type: 'string', ...(name === 'role' ? { required: true } : {}) }])),
    },
    contact_note: { type: 'rich-text' },
    footer_text: { type: 'string' },
    faculty_website_url: { type: 'string', pattern: '^https://' },
    drive_root_url: { type: 'string', pattern: '^https://' },
  },
};

function isDate(value) {
  if (value instanceof Date) return Number.isFinite(value.getTime());
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function validateFields(fields, data, prefix, errors) {
  if (!data || typeof data !== 'object' || Array.isArray(data) || data instanceof Date) {
    errors.push(`${prefix || 'entry'}: phải là object`);
    return;
  }
  for (const [name, field] of Object.entries(fields)) {
    const path = prefix ? `${prefix}.${name}` : name;
    const value = data[name];
    if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
      if (field.required) errors.push(`${path}: bắt buộc`);
      continue;
    }
    if (field.list) {
      if (!Array.isArray(value)) errors.push(`${path}: phải là danh sách object`);
      else value.forEach((item, index) => validateFields(field.fields, item, `${path}[${index}]`, errors));
      continue;
    }
    const validType = field.type === 'date' ? isDate(value)
      : field.type === 'number' ? typeof value === 'number' && Number.isFinite(value)
      : field.type === 'boolean' ? typeof value === 'boolean' : typeof value === 'string';
    if (!validType) {
      errors.push(`${path}: sai kiểu ${field.type}${field.format ? ` (${field.format})` : ''}`);
      continue;
    }
    if (field.pattern && !new RegExp(field.pattern).test(value)) errors.push(`${path}: phải khớp ${field.pattern}`);
    if (field.maxlength !== undefined && value.length > field.maxlength) errors.push(`${path}: tối đa ${field.maxlength} ký tự`);
    if (field.min !== undefined && value < field.min) errors.push(`${path}: tối thiểu ${field.min}`);
    if (field.options && !field.options.includes(value)) errors.push(`${path}: giá trị không thuộc danh sách cho phép`);
  }
}

/** Return field errors; unknown fields are allowed for forward-compatible CMS edits. */
export function validateEntry(collection, data) {
  if (!Object.hasOwn(schemas, collection)) return [`collection không hợp lệ: ${collection}`];
  const errors = [];
  validateFields(schemas[collection], data, '', errors);
  return errors;
}
