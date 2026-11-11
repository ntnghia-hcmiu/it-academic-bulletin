import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

function normalizePath(file) {
  const path = file.replaceAll('\\', '/');
  if (!path || path.includes('\0') || path.startsWith('/') || /^[a-z]:/i.test(path)) return null;
  const parts = path.split('/');
  // Reject traversal before normalization, even if it would stay inside the allowlist.
  if (parts.includes('..')) return null;
  return parts.filter(part => part && part !== '.').join('/');
}

export function checkPaths(files, allow = ['src/content/', 'public/media/']) {
  const prefixes = allow.map(normalizePath).filter(Boolean).map(path => `${path}/`);
  return files.filter(file => {
    const path = normalizePath(file);
    return !path || !prefixes.some(prefix => path.startsWith(prefix));
  });
}

function git(...args) {
  return execFileSync('git', args, {
    encoding: 'utf8', timeout: 30000, maxBuffer: 32 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function matchesActor(identities, actors) {
  return identities.some(identity => {
    // Git has no separate login field; GitHub noreply addresses encode the login.
    const login = identity.match(/^(?:\d+\+)?([^@]+)@users\.noreply\.github\.com$/)?.[1];
    return actors.has(identity) || (login !== undefined && actors.has(login));
  });
}

function changedPaths(output) {
  const fields = output.split('\0');
  fields.pop(); // --name-status -z terminates every field, including the last path.
  const files = [];
  for (let i = 0; i < fields.length;) {
    const status = fields[i++];
    const count = /^[RC]/.test(status) ? 2 : 1;
    if (!/^[ACDMRTUXB](?:\d+)?$/.test(status) || i + count > fields.length) {
      throw new Error('Invalid git --name-status output');
    }
    files.push(...fields.slice(i, i + count));
    i += count;
  }
  return files;
}

function escapeAnnotation(value, property = false) {
  let escaped = value.replaceAll('%', '%25').replaceAll('\r', '%0D').replaceAll('\n', '%0A');
  if (property) escaped = escaped.replaceAll(':', '%3A').replaceAll(',', '%2C');
  return escaped;
}

function runGuard() {
  const actors = new Set((process.env.CMS_BOT_ACTORS ?? '').split(',').map(actor => actor.trim()).filter(Boolean));
  if (!actors.size) {
    console.log('::notice::CMS_BOT_ACTORS is empty; content-path guard skipped.');
    return 0;
  }

  const head = process.env.GITHUB_SHA;
  const before = process.env.BEFORE_SHA ?? '';
  const isSha = value => /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/i.test(value);
  if (!head || !isSha(head) || (before && !isSha(before))) throw new Error('Invalid GITHUB_SHA or BEFORE_SHA');
  git('cat-file', '-e', `${head}^{commit}`);

  let revision = head;
  if (!before || /^0+$/.test(before)) {
    // A new branch has no old tip; workflow_dispatch also has no event.before.
    console.log('::notice::No previous tip; checking all commits reachable from GITHUB_SHA.');
  } else {
    try {
      git('cat-file', '-e', `${before}^{commit}`);
      // Set difference also handles a force-push whose old tip is not an ancestor.
      revision = `${before}..${head}`;
    } catch {
      // checkout fetch-depth: 0 may still lack an unreachable old force-push tip.
      console.log('::notice::BEFORE_SHA is unavailable; checking all commits reachable from GITHUB_SHA.');
    }
  }

  const commits = git('rev-list', '--reverse', revision, '--').trim().split('\n').filter(Boolean);
  const violations = new Set();
  let checked = 0;
  for (const commit of commits) {
    const metadata = git('log', '-1', '--format=%an%x00%ae%x00%cn%x00%ce%x00%P', commit, '--').replace(/\n$/, '').split('\0');
    if (!matchesActor(metadata.slice(0, 4), actors)) continue;
    checked++;
    const parents = metadata[4].split(' ').filter(Boolean);
    // Check each parent for bot merges; default combined diffs can hide paths.
    const diffs = parents.length
      ? parents.map(parent => git('diff', '--no-ext-diff', '--no-textconv', '--name-status', '-z', '-M', parent, commit, '--'))
      : [git('diff-tree', '--root', '--no-commit-id', '--name-status', '-r', '-z', '-M', commit, '--')];
    for (const diff of diffs) {
      for (const file of checkPaths(changedPaths(diff))) violations.add(file);
    }
  }
  for (const file of violations) {
    console.log(`::error file=${escapeAnnotation(file, true)}::CMS bot changed a path outside the content/media allowlist.`);
  }
  if (violations.size) return 1;
  console.log(`Content-path guard PASS (${checked} matching CMS commit(s)).`);
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    process.exitCode = runGuard();
  } catch (error) {
    console.error(`::error::Content-path guard failed: ${escapeAnnotation(error.message)}`);
    process.exitCode = 1;
  }
}
