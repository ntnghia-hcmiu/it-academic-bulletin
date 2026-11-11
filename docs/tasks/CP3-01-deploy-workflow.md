# Task: CP3-01 — GitHub Actions build + content-path guard + deploy Pages

## Status / Approval

- Status: IN_PROGRESS
- Type: FEATURE
- Change class: S1
- Owner: HUMAN LEAD (tech owner)
- Execution profile: dual-agent
- Orchestrator: claude-code
- Implementer: codex — `codex exec` (PD-002), ORCHESTRATOR Claude Code review
- Human Lead: tech owner
- Authorization mode: boundary
- Authorization source: IAB-001 (ACCEPTED 2026-11-11)
- Parallel group: —
- Owned paths: `.github/workflows/deploy.yml`, `scripts/content-guard.mjs`, `tests/content-guard.test.mjs`
- Dependencies: CP1-06
- Base commit / branch: `574cc77` (`main` sau merge CP1-06); branch `cp3/CP3-01-deploy-workflow`
- Human Lead approval: inherited from boundary IAB-001
- Implementation authorized: YES

Lifecycle: `boundary` mode = `DRAFT → IN_PROGRESS → READY`. DONE suy ra từ Git sau khi merge.

## Goal

Mỗi push vào `main` build, verify và deploy GitHub Pages; commit bot CMS chạm ngoài vùng nội dung → fail.

## Scope

- In scope: build tay (`actions/setup-node`, `npm ci`, `npm run verify`) + `actions/upload-pages-artifact` + `actions/deploy-pages@v5`; permissions `contents: read, pages: write, id-token: write`; concurrency; guard.
- Out of scope: Bật Pages/ruleset (integration gate), custom domain.

## Authority / key decisions

- REQ-001, ADR-001, ADR-002, IAB-001, PD-001, PD-002 (ACCEPTED 2026-11-11); `docs/CONTENT_MODEL.md`, `docs/ARCHITECTURE.md`, `docs/SITEMAP.md`.

## Implementation approach

- Pin action theo major tag; xác minh tên bot CMS ở CP2-03.
- Tên actor bot CMS chưa xác minh → đọc từ repository variable `CMS_BOT_ACTORS` (không phải secret); rỗng → guard ghi notice và bỏ qua (ORCHESTRATOR 2026-11-11).
- Merge vào `main` sẽ kích hoạt workflow deploy → coi là integration gate (IAB-001 §6): mở PR, chờ HUMAN LEAD trước khi merge.

## Phải giữ nguyên

- `requirement-to-task.yml` (theo D-08).

## Code bị thay / xóa

- không có (thêm mới).

## Acceptance Criteria

1. Workflow hợp lệ (kiểm bằng `actionlint` nếu có sẵn, không bắt buộc cài) và chạy `npm run verify` trước deploy.
2. Guard: test đơn vị với danh sách file ví dụ PASS/FAIL đúng.
3. Không dùng secret ngoài `GITHUB_TOKEN`.

## Required verification

- `node --test tests/content-guard.test.mjs` — AC2
- Review YAML — AC1, AC3
- Chạy thật sau khi HUMAN LEAD push (integration gate)

Tất cả required verification phải chạy và PASS trước READY.

## Manual test checklist (Tech Lead)

Task không chạm security model / quyền bên thứ ba; manual test sau automated verification là điểm danh.

- [ ] Kiểm trên điện thoại thật hoặc DevTools 360px (nếu có UI).

## Result

- Main changes: `.github/workflows/deploy.yml` (push `main` + `workflow_dispatch`; `permissions: {}` toàn cục, job build `contents: read` + `pages: read`, job deploy `pages: write` + `id-token: write`; concurrency `pages`; checkout `fetch-depth: 0`, `persist-credentials: false` → setup-node 24 → `npm ci` → content guard → `npm run verify` → configure-pages → upload `dist` → deploy-pages); `scripts/content-guard.mjs` (`checkPaths` thuần, allowlist `src/content/`, `public/media/`, chặn traversal; CLI lọc commit theo author/committer khớp `CMS_BOT_ACTORS`, xử lý rename/delete/merge, push đầu tiên `000…0`, force-push; biến rỗng → notice, exit 0).
- Tests: `tests/content-guard.test.mjs` 30 test (paths PASS/FAIL, actor, notice, repo git tạm: rename/delete/first push/force-push; parse YAML: trigger, concurrency, permissions, verify trước upload/deploy, không secret ngoài token ngầm định). ORCHESTRATOR chạy `npm run verify` ngoài sandbox 2026-11-11: PASS 102/102, verify-dist PASS. `actionlint` không có sẵn, không cài. Tag action đã kiểm tồn tại qua GitHub API: checkout@v7, setup-node@v7, configure-pages@v6, upload-pages-artifact@v5, deploy-pages@v5.
- Diff + / − (app, test): workflow +59/−0; script +118/−0; test +269/−0.
- Helper mới (đã tìm, lý do không tái dùng): `normalizePath`, `checkPaths`, `git`, `matchesActor`, `changedPaths`, `runGuard`, `escapeAnnotation` — chưa có helper git/guard.
- Review: ORCHESTRATOR vòng 1: 0 blocking. Lệch nhỏ có chủ đích: build job dùng `pages: read` (configure-pages đọc cấu hình) — vẫn trong tập quyền IAB-001, tối thiểu hơn.
- Pilot evidence: Codex CLI 0.166.0, model `gpt-6.1-sol`, effort `high`, 11:47→11:53 UTC, 66,064 tokens. Quota trước khi giao: 5 giờ 17 % / tuần 83 %.
- Important findings / decisions: tên bot CMS đọc từ repository variable `CMS_BOT_ACTORS` (đặt sau khi xác minh ở CP2-03); merge PR = kích hoạt deploy → integration gate.
- Known limitations: Required verification "chạy thật trên GitHub" NOT RUN — cần HUMAN LEAD bật Pages (Source: GitHub Actions) rồi merge → chưa READY. Guard chỉ phát hiện, không ngăn commit (ADR-002).
- PR:
