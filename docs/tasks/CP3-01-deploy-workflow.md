# Task: CP3-01 — GitHub Actions build + content-path guard + deploy Pages

## Status / Approval

- Status: DRAFT
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
- Base commit / branch: chưa có commit gốc — xác định khi bắt đầu; branch `cp3/CP3-01-deploy-workflow`
- Human Lead approval: inherited from boundary IAB-001
- Implementation authorized: NO

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

- Main changes:
- Tests:
- Diff + / − (app, test):
- Helper mới (đã tìm, lý do không tái dùng):
- Review:
- Important findings / decisions:
- Known limitations:
- PR:
