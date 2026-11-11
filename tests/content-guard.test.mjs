import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import yaml from 'js-yaml';
import { checkPaths } from '../scripts/content-guard.mjs';

const script = fileURLToPath(new URL('../scripts/content-guard.mjs', import.meta.url));
const human = { name: 'Fixture Editor', email: 'editor@example.invalid' };
const bot = { name: 'cms-bot', email: '123+cms-bot@users.noreply.github.com' };
const zero = '0'.repeat(40);

// Existing spawn helpers are coupled to verify-dist/check; these fixtures need an
// isolated Git repository and explicit author/committer identities instead.
function repository(t) {
  const cwd = mkdtempSync(join(tmpdir(), 'iab-content-guard-'));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  const env = { ...process.env, GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null' };
  for (const key of ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_COMMON_DIR']) delete env[key];
  function command(executable, args, extra = {}) {
    const result = spawnSync(executable, args, { cwd, encoding: 'utf8', timeout: 30000, env: { ...env, ...extra } });
    assert.ifError(result.error);
    return { status: result.status, log: result.stdout + result.stderr, stdout: result.stdout };
  }
  function git(...args) {
    const result = command('git', args);
    assert.equal(result.status, 0, result.log);
    return result.stdout.trim();
  }
  function write(path, contents = 'fixture\n') {
    mkdirSync(dirname(join(cwd, path)), { recursive: true });
    writeFileSync(join(cwd, path), contents);
  }
  function commit(author = human, committer = human) {
    git('add', '--all');
    const result = command('git', ['-c', 'core.hooksPath=/dev/null', 'commit', '--quiet', '--no-gpg-sign', '-m', 'fixture'], {
      GIT_AUTHOR_NAME: author.name, GIT_AUTHOR_EMAIL: author.email,
      GIT_COMMITTER_NAME: committer.name, GIT_COMMITTER_EMAIL: committer.email,
    });
    assert.equal(result.status, 0, result.log);
    return git('rev-parse', 'HEAD');
  }
  function guard(before, actors = 'cms-bot', head = git('rev-parse', 'HEAD')) {
    return command(process.execPath, [script], { BEFORE_SHA: before, GITHUB_SHA: head, CMS_BOT_ACTORS: actors });
  }
  git('init', '--quiet', '--initial-branch=main');
  git('config', 'user.name', human.name);
  git('config', 'user.email', human.email);
  return { git, write, commit, guard };
}

test('AC2: pure path checks normalize separators and reject traversal and sibling prefixes', () => {
  const allowed = [
    'src/content/a.md', 'src/content/announcements/2026/deep/a.md',
    'public/media/image.png', './src/content/settings/site.json',
    '.\\public\\media\\nested\\image.webp', '././src//content/./faq/a.md',
  ];
  const rejected = [
    '.pages.yml', '.github/workflows/x.yml', 'src/lib/x.js', 'package.json',
    'src/content-evil/x.md', 'src/content-x/a.md', 'public/media-evil/a.png',
    'src/content/../lib/x.js', 'src/content/../content/a.md',
    'src\\content\\..\\lib\\x.js', '../src/content/a.md',
    '/src/content/a.md', 'C:\\src\\content\\a.md', '//src/content/a.md',
    'src/content', 'public/media', '', 'src/content/a\0.md',
  ];
  assert.deepEqual(checkPaths(allowed), []);
  assert.deepEqual(checkPaths([...allowed, ...rejected]), rejected);
  assert.deepEqual(checkPaths(['./custom/a.md', 'custom-x/a.md'], ['custom/']), ['custom-x/a.md']);
  assert.deepEqual(checkPaths(['src/content/a.md'], []), ['src/content/a.md']);
});

test('AC2: CLI matches exact author/committer name, email or GitHub noreply login', async t => {
  const cases = [
    ['author name', { name: 'cms-bot', email: 'author@example.invalid' }, human, 'cms-bot', 1],
    ['committer name', human, { name: 'cms-bot', email: 'committer@example.invalid' }, 'cms-bot', 1],
    ['author email', { name: 'Other', email: 'bot@example.invalid' }, human, 'bot@example.invalid', 1],
    ['committer email', human, { name: 'Other', email: 'bot@example.invalid' }, 'bot@example.invalid', 1],
    ['numeric noreply login', { name: 'Other', email: bot.email }, human, 'cms-bot', 1],
    ['legacy noreply login', human, { name: 'Other', email: 'cms-bot@users.noreply.github.com' }, 'cms-bot', 1],
    ['comma-separated actors', bot, human, 'other, cms-bot, third', 1],
    ['human source commit', human, human, 'cms-bot', 0],
    ['substring does not match', { name: 'cms-bot-extra', email: 'cms-bot@example.invalid' }, human, 'cms-bot', 0],
    ['case does not match', bot, human, 'CMS-BOT', 0],
    ['empty actors', bot, bot, ' , ', 0],
  ];
  for (const [name, author, committer, actors, status] of cases) {
    await t.test(name, sub => {
      const repo = repository(sub);
      repo.write('src/content/a.md');
      const before = repo.commit();
      repo.write('package.json', '{}');
      repo.commit(author, committer);
      const result = repo.guard(before, actors);
      assert.equal(result.status, status, result.log);
      if (status) assert.match(result.log, /::error file=package.json::/);
      else if (!actors.split(',').some(actor => actor.trim())) assert.match(result.log, /::notice::CMS_BOT_ACTORS is empty/);
      else assert.match(result.log, /PASS \(0 matching/);
    });
  }
  await t.test('empty actors skip without needing valid SHAs or Git history', sub => {
    const repo = repository(sub);
    const result = repo.guard('invalid', '', 'invalid');
    assert.equal(result.status, 0, result.log);
    assert.match(result.log, /::notice::CMS_BOT_ACTORS is empty/);
  });
});

test('AC2: CLI inspects Git history, deletions, renames and force-push ranges', async t => {
  const scenarios = {
    'allowed additions, media rename and deletion pass'(repo) {
      repo.write('src/content/a.md');
      repo.write('public/media/a.png');
      const before = repo.commit();
      repo.git('mv', 'public/media/a.png', 'public/media/b.png');
      repo.git('rm', 'src/content/a.md');
      repo.write('src/content/deep/new.md');
      repo.commit(bot);
      return [repo.guard(before), 0, /PASS \(1 matching/];
    },
    'first push checks bot root commit even with human HEAD'(repo) {
      repo.write('.pages.yml');
      repo.commit(bot);
      repo.write('src/content/a.md');
      repo.commit();
      return [repo.guard(zero), 1, /::error file=.pages.yml::/];
    },
    'first push with allowed bot root commit passes'(repo) {
      repo.write('public/media/a.png');
      repo.commit(bot);
      return [repo.guard(zero), 0, /PASS \(1 matching/];
    },
    'manual dispatch without before checks reachable history'(repo) {
      repo.write('package.json');
      repo.commit(bot);
      return [repo.guard(''), 1, /::notice::No previous tip/];
    },
    'deleted forbidden path is checked'(repo) {
      repo.write('package.json');
      const before = repo.commit();
      repo.git('rm', 'package.json');
      repo.commit(bot);
      return [repo.guard(before), 1, /::error file=package.json::/];
    },
    'rename outside to inside checks old path'(repo) {
      repo.write('outside.md');
      repo.write('src/content/a.md', 'other\n');
      const before = repo.commit();
      repo.git('mv', 'outside.md', 'src/content/renamed.md');
      repo.commit(bot);
      return [repo.guard(before), 1, /::error file=outside.md::/];
    },
    'rename inside to outside checks new path'(repo) {
      repo.write('src/content/a.md');
      const before = repo.commit();
      repo.git('mv', 'src/content/a.md', 'outside.md');
      repo.commit(bot);
      return [repo.guard(before), 1, /::error file=outside.md::/];
    },
    'human revert cannot hide a bot violation within one push'(repo) {
      repo.write('src/content/a.md');
      const before = repo.commit();
      repo.write('package.json');
      repo.commit(bot);
      repo.git('rm', 'package.json');
      repo.commit();
      return [repo.guard(before), 1, /::error file=package.json::/];
    },
    'force-push excludes old-only bot commits and checks new ones'(repo) {
      repo.write('src/content/a.md');
      const base = repo.commit();
      repo.write('old-outside.md');
      const before = repo.commit(bot);
      repo.git('checkout', '--quiet', '-b', 'replacement', base);
      repo.write('public/media/new.png');
      repo.commit(bot);
      const passing = repo.guard(before);
      assert.equal(passing.status, 0, passing.log);
      repo.write('new-outside.md');
      repo.commit(bot);
      return [repo.guard(before), 1, /::error file=new-outside.md::/];
    },
    'missing force-push old tip falls back to reachable history'(repo) {
      repo.write('package.json');
      repo.commit(bot);
      const result = repo.guard('f'.repeat(40));
      assert.match(result.log, /::notice::BEFORE_SHA is unavailable/);
      return [result, 1, /::error file=package.json::/];
    },
    'bot merge checks all parents instead of hiding one-sided changes'(repo) {
      repo.write('src/content/a.md');
      const before = repo.commit();
      repo.git('checkout', '--quiet', '-b', 'feature');
      repo.write('package.json');
      repo.commit();
      repo.git('checkout', '--quiet', 'main');
      repo.write('src/content/b.md');
      repo.commit();
      repo.git('merge', '--quiet', '--no-ff', '--no-commit', 'feature');
      repo.commit(bot);
      return [repo.guard(before), 1, /::error file=package.json::/];
    },
    'NUL-delimited filenames stay intact and annotations escape controls'(repo) {
      repo.write('src/content/a.md');
      const before = repo.commit();
      repo.write('outside,:name%\n::notice::injected.md');
      repo.commit(bot);
      return [repo.guard(before), 1, /::error file=outside%2C%3Aname%25%0A%3A%3Anotice%3A%3Ainjected.md::/];
    },
    'unchanged tip checks no historical bot commits'(repo) {
      repo.write('package.json');
      const before = repo.commit(bot);
      return [repo.guard(before), 0, /PASS \(0 matching/];
    },
    'invalid SHA fails closed'(repo) {
      repo.write('src/content/a.md');
      repo.commit();
      return [repo.guard('--all'), 1, /::error::Content-path guard failed: Invalid/];
    },
  };
  for (const [name, scenario] of Object.entries(scenarios)) {
    await t.test(name, sub => {
      const [result, status, pattern] = scenario(repository(sub));
      assert.equal(result.status, status, result.log);
      assert.match(result.log, pattern);
    });
  }
});

test('AC1/AC3: workflow gates artifact/deploy on verification, with scoped permissions and no extra secrets', () => {
  const source = readFileSync(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8');
  const workflow = yaml.load(source);
  assert.deepEqual(workflow.on, { push: { branches: ['main'] }, workflow_dispatch: null });
  assert.deepEqual(workflow.permissions, {});
  assert.deepEqual(workflow.concurrency, { group: 'pages', 'cancel-in-progress': false });
  const { build, deploy } = workflow.jobs;
  assert.deepEqual(build.permissions, { contents: 'read', pages: 'read' });
  assert.deepEqual(deploy.permissions, { pages: 'write', 'id-token': 'write' });
  assert.equal(deploy.needs, 'build');
  assert.equal(deploy.environment.name, 'github-pages');
  assert.equal(deploy.environment.url, '${{ steps.deployment.outputs.page_url }}');
  const checkout = build.steps.find(step => step.uses?.startsWith('actions/checkout@'));
  const setup = build.steps.find(step => step.uses?.startsWith('actions/setup-node@'));
  assert.equal(checkout.with['fetch-depth'], 0);
  assert.equal(checkout.with['persist-credentials'], false);
  assert.deepEqual(setup.with, { 'node-version': '24', cache: 'npm' });
  const install = build.steps.findIndex(step => step.run === 'npm ci');
  const guard = build.steps.findIndex(step => step.run === 'node scripts/content-guard.mjs');
  const verify = build.steps.findIndex(step => step.run === 'npm run verify');
  const configure = build.steps.findIndex(step => step.uses?.startsWith('actions/configure-pages@'));
  const upload = build.steps.findIndex(step => step.uses?.startsWith('actions/upload-pages-artifact@'));
  assert.ok(install >= 0 && guard > install && verify > guard && configure > verify && upload > configure);
  assert.deepEqual(build.steps[guard].env, {
    CMS_BOT_ACTORS: '${{ vars.CMS_BOT_ACTORS }}', BEFORE_SHA: '${{ github.event.before }}',
  });
  assert.equal(build.steps[upload].with.path, 'dist');
  assert.equal(deploy.steps.length, 1);
  assert.equal(deploy.steps[0].id, 'deployment');
  assert.equal(deploy.steps[0].uses, 'actions/deploy-pages@v5');
  for (const step of [...build.steps, ...deploy.steps]) {
    assert.equal(step['continue-on-error'], undefined);
    assert.equal(step.if, undefined);
    if (step.uses) assert.match(step.uses, /^actions\/[\w-]+@v\d+$/);
    if (step.run) assert.doesNotMatch(step.run, /\$\{\{/);
  }
  assert.doesNotMatch(source, /\bsecrets\s*(?:\.|\[)/);
});
