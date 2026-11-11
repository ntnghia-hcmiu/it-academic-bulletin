import { readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { schemas } from '../src/lib/schema.js';
import { defaultContentRoot, readEntries } from '../src/lib/content.js';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const contentRoot = resolve(process.argv[2] ?? process.env.CONTENT_ROOT ?? defaultContentRoot);
const syntaxFiles = ['eleventy.config.js', 'scripts/check.mjs',
  ...readdirSync(join(projectRoot, 'src'), { recursive: true })
    .filter(file => file.endsWith('.js')).map(file => join('src', file))];
let failed = false;
for (const file of syntaxFiles) {
  const result = spawnSync(process.execPath, ['--check', join(projectRoot, file)], { stdio: 'inherit' });
  if (result.status !== 0) {
    console.error(`${file}: kiểm tra cú pháp thất bại${result.error ? `: ${result.error.message}` : ''}`);
    failed = true;
  }
}
for (const collection of Object.keys(schemas)) {
  for (const { file, errors } of readEntries(collection, contentRoot)) {
    for (const error of errors) {
      console.error(`${file}: ${error}`);
      failed = true;
    }
  }
}
if (failed) process.exitCode = 1;
else console.log('Syntax và schema nội dung hợp lệ.');
