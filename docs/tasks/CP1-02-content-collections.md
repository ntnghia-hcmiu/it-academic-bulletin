# Task: CP1-02 — Content collections + helper lọc published + seed 9 danh mục

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
- Owned paths: `src/content.config.ts`, `src/lib/content.ts`, `src/content/categories/*.yml`, `src/content/settings/site.json`, `src/content/{announcements,guides,resources,faq}/.gitkeep`, `tests/content.test.mjs`, `tests/fixtures/**`
- Dependencies: CP1-01
- Base commit / branch: chưa có commit gốc — xác định khi bắt đầu; branch `cp1/CP1-02-content-collections`
- Human Lead approval: inherited from boundary IAB-001
- Implementation authorized: NO

Lifecycle: `boundary` mode = `DRAFT → IN_PROGRESS → READY`. DONE suy ra từ Git sau khi merge.

## Goal

Schema 6 collection theo `docs/CONTENT_MODEL.md`, một helper duy nhất lọc `published`, sắp xếp, resolve danh mục mềm; seed 9 danh mục trung tính và settings rỗng.

## Scope

- In scope: Zod schema; helper `getPublished*`, `resolveCategory` (fallback "Khác"), sort; seed đúng bảng §4 CONTENT_MODEL (drive_folder_url trống).
- Out of scope: Thông báo/hướng dẫn/FAQ/tài liệu thật hoặc giả; liên hệ; trang UI.

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

## Required verification

- `npm test` (content.test.mjs) — AC2
- `npm run build` — AC1
- Review diff `src/content/**` — AC3

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
