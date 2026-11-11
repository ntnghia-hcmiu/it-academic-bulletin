# Task: CP1-03 — Trang chủ, danh sách & chi tiết thông báo, trang danh mục

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
- Parallel group: P1 = CP1-03 ‖ CP2-01 (PD-001; worktree riêng). CP1-04 serialize sau CP1-03 (HUMAN LEAD 2026-11-11: CP1-04 tái dùng component của task này)
- Owned paths: `src/pages/index.njk`, `src/pages/thong-bao/**`, `src/pages/danh-muc/**`, `src/_includes/components/{AnnouncementCard,CategoryNav,EmptyState,DeadlineBadge,AttachmentList}.njk`, `src/_data/bulletin.js` (chỉ thêm env `CONTENT_DIR` cho fixture build), `src/styles/global.css` (chỉ thêm style), `tests/pages.test.mjs`, `tests/fixtures/pages/**`, `src/_data/build.js` (chỉ export ngày build UTC cho DeadlineBadge; thêm sau BLOCKED vòng 1) — mở rộng bởi ORCHESTRATOR 2026-11-11 vì AC1 cần build với fixture; không giao với CP2-01
- Dependencies: CP1-02
- Base commit / branch: `258faa7` (HEAD CP1-02); branch `cp1/CP1-03-announcement-pages`, worktree `../IAB-wt/CP1-03`
- Human Lead approval: inherited from boundary IAB-001
- Implementation authorized: YES (IAB-001)

Lifecycle: `boundary` mode = `DRAFT → IN_PROGRESS → READY`. DONE suy ra từ Git sau khi merge.

## Goal

Trang chủ theo mockup `docs/SITEMAP.md`, `/thong-bao/` + chi tiết, `/danh-muc/` + từng danh mục với empty state.

## Scope

- In scope: Quan trọng/mới nhất, deadline badge + "Đã hết hạn", đính kèm (nhãn quyền truy cập), danh mục rỗng → "Nội dung đang được cập nhật".
- Out of scope: Tìm kiếm động (CP1-05), guides/resources/faq pages (CP1-04).

## Authority / key decisions

- REQ-001, ADR-001, ADR-002, IAB-001, PD-001, PD-002 (ACCEPTED 2026-11-11); `docs/CONTENT_MODEL.md`, `docs/ARCHITECTURE.md`, `docs/SITEMAP.md`.

## Implementation approach

- Dùng helper CP1-02; fixture cho kiểm thủ công đặt ngoài `src/content` (env `CONTENT_DIR` hoặc build test riêng) — không commit thông báo giả.

## Phải giữ nguyên

- Helper `src/lib/content.js` là nơi lọc duy nhất.

## Code bị thay / xóa

- không có (thêm mới).

## Acceptance Criteria

1. Bài `published=false` (fixture) không có trang trong `dist/`.
2. Danh mục rỗng hiển thị empty state.
3. Thông báo quan trọng lên đầu; danh sách theo ngày giảm dần.

## Required verification

- `npm run verify` với fixture — AC1–AC3
- Thủ công 360px/1280px + bàn phím

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
