# Task: CP1-02 — Content collections + helper lọc published + seed 9 danh mục

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
- Owned paths: `src/lib/schema.js`, `src/lib/content.js`, `src/_data/bulletin.js` (global `bulletin` — `content` là key Eleventy giữ riêng, phát hiện khi implement 2026-11-11), `src/content/categories/*.yml`, `src/content/settings/site.json`, `src/content/{announcements,guides,resources,faq}/.gitkeep`, `tests/content.test.mjs`, `tests/markdown.test.mjs`, `tests/fixtures/**`, `scripts/check.mjs` (mới), `package.json` (chỉ `scripts`)
- Dependencies: CP1-01
- Base commit / branch: `263434e` (stacked trên `cp1/CP1-01-scaffold`, chưa merge `main` — HUMAN LEAD 2026-11-11); branch `cp1/CP1-02-content-collections`
- Human Lead approval: inherited from boundary IAB-001
- Implementation authorized: YES

Lifecycle: `boundary` mode = `DRAFT → IN_PROGRESS → READY`. DONE suy ra từ Git sau khi merge.

## Goal

Schema 6 collection theo `docs/CONTENT_MODEL.md`, một helper duy nhất lọc `published`, sắp xếp, resolve danh mục mềm; seed 9 danh mục trung tính và settings rỗng.

## Scope

- In scope: validator schema thuần JS (`src/lib/schema.js`, không Zod — ADR-001 Amendment 2), đọc file bằng `js-yaml`; helper `getPublished*`, `resolveCategory` (fallback "Khác"), sort; seed đúng bảng §4 CONTENT_MODEL (drive_folder_url trống).
- In scope (non-blocking note CP1-01, HUMAN LEAD 2026-11-11): (a) tách script `check` one-liner thành `scripts/check.mjs` = `node --check` mọi `.js` của project + validate `src/content/**` bằng `src/lib/schema.js`; (b) `dev` watch cả Tailwind nếu gọn, không thêm dependency; (c) test Markdown `html: false` (HTML thô bị escape).
- Out of scope: Thông báo/hướng dẫn/FAQ/tài liệu thật hoặc giả; liên hệ; trang UI; dependency mới.

## Authority / key decisions

- REQ-001, ADR-001, ADR-002, IAB-001, PD-001, PD-002 (ACCEPTED 2026-11-11); `docs/CONTENT_MODEL.md`, `docs/ARCHITECTURE.md`, `docs/SITEMAP.md`.

## Implementation approach

- Fixture test (thư mục `tests/fixtures`) chứa entry giả *chỉ dùng cho test*, không nằm trong `src/content`.

## Phải giữ nguyên

- Kết quả CP1-01.

## Code bị thay / xóa

- không có (thêm mới).

## Acceptance Criteria

1. Build PASS với 9 danh mục seed, 0 thông báo.
2. Helper loại entry `published=false`; danh mục ẩn/không tồn tại → "Khác" + cảnh báo build, không fail.
3. Không có nội dung học vụ ngoài tên + mô tả trung tính 1 câu.
4. `npm run check` fail (exit ≠ 0) khi entry trong `src/content` sai schema (field bắt buộc thiếu, `slug`/URL sai pattern); Markdown chứa HTML thô được escape.

## Required verification

- `npm test` (content.test.mjs) — AC2
- `npm run build` — AC1
- Review diff `src/content/**` — AC3
- `npm run check` (+ fixture sai schema qua test) — AC4; `npm run verify` toàn bộ

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
