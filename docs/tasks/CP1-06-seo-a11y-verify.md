# Task: CP1-06 — SEO, sitemap, a11y pass, script verify-dist

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
- Owned paths: `scripts/verify-dist.mjs`, `src/pages/sitemap.xml.njk`, `public/robots.txt`, `package.json` (script verify), sửa a11y nhỏ trong `src/_includes/**`
- Dependencies: CP1-03, CP1-04, CP1-05
- Base commit / branch: chưa có commit gốc — xác định khi bắt đầu; branch `cp1/CP1-06-seo-a11y-verify`
- Human Lead approval: inherited from boundary IAB-001
- Implementation authorized: NO

Lifecycle: `boundary` mode = `DRAFT → IN_PROGRESS → READY`. DONE suy ra từ Git sau khi merge.

## Goal

Tự động chứng minh: không lộ bài ẩn, link nội bộ không gãy, base path đúng; sitemap/canonical; a11y cơ bản.

## Scope

- In scope: verify-dist: quét `dist/**/*.html|json|xml` cho id/tiêu đề fixture ẩn, link nội bộ tồn tại, mọi link có base; sitemap template Eleventy chỉ từ dữ liệu đã lọc (không dependency).
- Out of scope: Lighthouse CI, Playwright.

## Authority / key decisions

- REQ-001, ADR-001, ADR-002, IAB-001, PD-001, PD-002 (ACCEPTED 2026-11-11); `docs/CONTENT_MODEL.md`, `docs/ARCHITECTURE.md`, `docs/SITEMAP.md`.

## Implementation approach

- Node stdlib.

## Phải giữ nguyên

- Hành vi CP1-01…05.

## Code bị thay / xóa

- không có (thêm mới).

## Acceptance Criteria

1. `npm run verify` FAIL khi cố ý đưa bài ẩn vào output (test âm).
2. 0 link nội bộ gãy.
3. Mỗi trang có title, description, canonical; sitemap không chứa trang ẩn.

## Required verification

- `npm run verify` — AC1–AC3
- Test âm cho verify-dist — AC1

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
