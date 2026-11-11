# Task: CP1-03 — Trang chủ, danh sách & chi tiết thông báo, trang danh mục

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
- Parallel group: P1 (PD-001; worktree riêng)
- Owned paths: `src/pages/index.astro`, `src/pages/thong-bao/**`, `src/pages/danh-muc/**`, `src/components/{AnnouncementCard,CategoryNav,EmptyState,DeadlineBadge,AttachmentList}.astro`
- Dependencies: CP1-02
- Base commit / branch: chưa có commit gốc — xác định khi bắt đầu; branch `cp1/CP1-03-announcement-pages`
- Human Lead approval: inherited from boundary IAB-001
- Implementation authorized: NO

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

- Helper `src/lib/content.ts` là nơi lọc duy nhất.

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
