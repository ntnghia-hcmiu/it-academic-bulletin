import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import yaml from 'js-yaml';
import { schemas } from '../src/lib/schema.js';

const config = yaml.load(readFileSync(new URL('../.pages.yml', import.meta.url), 'utf8'));
const widgets = {
  string: 'string', text: 'text', reference: 'reference', boolean: 'boolean',
  date: 'date', object: 'object', 'rich-text': 'rich-text', number: 'number', select: 'select',
};

// Compare names before descending so missing, extra and duplicate fields cannot be skipped.
function* fieldPairs(expected, fields, prefix) {
  assert.ok(Array.isArray(fields), `${prefix}: fields must be an array`);
  assert.deepEqual(fields.map(field => field.name).sort(), Object.keys(expected).sort(), `${prefix}: field names`);
  for (const field of fields) {
    const schema = expected[field.name];
    const path = `${prefix}.${field.name}`;
    yield { field, schema, path };
    if (schema.fields) yield* fieldPairs(schema.fields, field.fields, path);
    else assert.equal(field.fields, undefined, `${path}: unexpected nested fields`);
  }
}

function* allFields() {
  for (const content of config.content) yield* fieldPairs(schemas[content.name], content.fields, content.name);
}

// Includes nested media/path overrides, rather than checking only top-level collections.
function* entries(value, prefix = '') {
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    yield { key, value: child, path };
    yield* entries(child, path);
  }
}

test('AC1: six content groups match schema fields and widgets in both directions, including object lists', () => {
  assert.ok(Array.isArray(config.content));
  assert.deepEqual(config.content.map(content => content.name).sort(), Object.keys(schemas).sort());
  for (const { field, schema, path } of allFields()) {
    assert.ok(Object.hasOwn(widgets, schema.type), `${path}: unmapped schema type ${schema.type}`);
    assert.equal(field.type, widgets[schema.type], `${path}: widget`);
    assert.equal(field.list ?? false, schema.list ?? false, `${path}: list`);
    assert.ok(field.label?.trim(), `${path}: label`);
    assert.notEqual(field.hidden, true, `${path}: content field must be editable`);
    assert.equal(field.default, schema.default, `${path}: default`);
    for (const option of ['maxlength', 'min', 'format']) {
      if (schema[option] !== undefined) assert.equal(field.options?.[option], schema[option], `${path}: ${option}`);
    }
    if (schema.pattern) {
      assert.equal(field.pattern?.regex, schema.pattern, `${path}: pattern`);
      assert.ok(field.pattern.message?.trim(), `${path}: validation message`);
    }
    if (schema.options) assert.deepEqual(field.options?.values, schema.options, `${path}: select values`);
    if (schema.type === 'reference') {
      assert.equal(field.options?.collection, schema.collection, `${path}: reference collection`);
      assert.equal(field.options.value, '{name}', `${path}: store filename slug`);
      assert.equal(field.options.label, '{fields.name}', `${path}: show category name`);
    }
  }
});

test('AC2: required flags match the schema at every depth', () => {
  for (const { field, schema, path } of allFields()) {
    assert.equal(field.required ?? false, schema.required ?? false, `${path}: required`);
  }
});

test('AC3: every repository path stays inside content or media, without traversal', () => {
  let count = 0;
  for (const { key, value, path } of entries(config)) {
    if (key !== 'path' && key !== 'input') continue;
    count++;
    assert.equal(typeof value, 'string', path);
    assert.match(value, /^(?:src\/content|public\/media)(?:\/|$)/, path);
    assert.ok(!value.includes('\\') && !value.split('/').some(part => part === '..' || part === '.' || part === ''), path);
  }
  assert.ok(count >= config.content.length + 1, 'content and media paths were checked');
  assert.equal(config.media.input, 'public/media');
  assert.equal(config.media.output, '/media');
});

test('AC4: every rich-text widget writes Markdown with no source switcher; media accepts only images', () => {
  for (const { field, path } of allFields()) {
    if (field.type !== 'rich-text') continue;
    assert.equal(field.options?.format, 'markdown', `${path}: format`);
    assert.equal(field.options?.switcher, false, `${path}: switcher`);
  }
  assert.deepEqual(config.media.categories, ['image']);
});

test('AC5: commit identity is left unset until D-04 is decided', () => {
  for (const { path } of entries(config)) {
    assert.ok(!/(?:^|\.)commit\.identity(?:\.|$)/.test(path), path);
  }
});

test('content storage, filenames and operations follow CONTENT_MODEL with Vietnamese editor labels', () => {
  const storage = {
    announcements: ['collection', 'src/content/announcements', 'yaml-frontmatter', '{year}-{month}-{day}-{primary}.md', 'title'],
    categories: ['collection', 'src/content/categories', 'yaml', '{fields.slug}.yml', 'name'],
    guides: ['collection', 'src/content/guides', 'yaml-frontmatter', '{primary}.md', 'title'],
    resources: ['collection', 'src/content/resources', 'yaml', '{year}{month}{day}-{primary}.yml', 'title'],
    faq: ['collection', 'src/content/faq', 'yaml-frontmatter', '{primary}.md', 'question'],
    settings: ['file', 'src/content/settings/site.json', 'json', undefined, undefined],
  };
  for (const content of config.content) {
    assert.deepEqual([content.type, content.path, content.format, content.filename, content.view?.primary], storage[content.name], content.name);
    assert.match(content.label, /[À-ỹ]/u, `${content.name}: Vietnamese label`);
    assert.match(content.description, /[À-ỹ]/u, `${content.name}: Vietnamese description`);
    assert.equal(content.operations?.rename, false, `${content.name}: stable filenames`);
    assert.equal(content.operations?.delete, content.type !== 'file', `${content.name}: delete`);
    assert.equal(content.operations?.create, content.type !== 'file', `${content.name}: create`);
  }
  assert.equal(config.media.rename, 'safe');
});
