import assert from 'node:assert/strict';
import test from 'node:test';
import { absoluteUrl, joinBase } from '../src/lib/url.js';

const bases = ['/it-academic-bulletin', '/it-academic-bulletin/', '/'];

test('joins local paths and resolves canonical URLs for project and root hosting', () => {
  for (const base of bases) {
    const prefix = base === '/' ? '' : '/it-academic-bulletin';
    for (const [path, expected] of [
      ['', '/'],
      ['/', '/'],
      ['thong-bao/', '/thong-bao/'],
      ['/thong-bao/', '/thong-bao/'],
      ['/danh-muc//hoc-vu/', '/danh-muc/hoc-vu/'],
    ]) {
      assert.equal(joinBase(base, path), prefix + expected, `${base} + ${path}`);
    }
  }
  for (const [site, base, path, expected] of [
    ['https://ntnghia-hcmiu.github.io', '/it-academic-bulletin/', '/', 'https://ntnghia-hcmiu.github.io/it-academic-bulletin/'],
    ['https://example.org/', '/', '/', 'https://example.org/'],
    ['https://example.org', '/it-academic-bulletin', '/thong-bao/?q=a//b#main', 'https://example.org/it-academic-bulletin/thong-bao/?q=a//b#main'],
  ]) {
    assert.equal(absoluteUrl(site, base, path), expected);
  }
});

test('preserves query strings and fragments while joining paths', () => {
  for (const base of bases) {
    const prefix = base === '/' ? '' : '/it-academic-bulletin';
    for (const [path, expected] of [
      ['/thong-bao/?q=a//b&next=/hoi-dap/#moi', '/thong-bao/?q=a//b&next=/hoi-dap/#moi'],
      ['hoi-dap/#cau-hoi', '/hoi-dap/#cau-hoi'],
      ['?q=abc', '/?q=abc'],
    ]) {
      assert.equal(joinBase(base, path), prefix + expected, `${base} + ${path}`);
    }
  }
});

test('leaves absolute URLs, email links and fragment links unchanged', () => {
  for (const base of bases) {
    for (const path of [
      'https://example.org/a//b?q=/x/#y',
      'http://example.org/',
      'HTTPS://example.org/',
      'mailto:contact@example.org',
      '#main',
    ]) {
      assert.equal(joinBase(base, path), path, `${base} + ${path}`);
    }
  }
});

