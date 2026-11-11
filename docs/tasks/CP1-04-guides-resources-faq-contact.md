# Task: CP1-04 — Trang hướng dẫn, biểu mẫu/tài liệu, FAQ, liên hệ

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
- Owned paths: `src/pages/huong-dan/**`, `src/pages/bieu-mau/**`, `src/pages/hoi-dap/**`, `src/pages/lien-he/**`, `src/_includes/components/{ContactCard,ResourceList,FaqList}.njk`
- Dependencies: CP1-02
- Base commit / branch: chưa có commit gốc — xác định khi bắt đầu; branch `cp1/CP1-04-guides-resources-faq-contact`
- Human Lead approval: inherited from boundary IAB-001
- Implementation authorized: NO

Lifecycle: `boundary` mode = `DRAFT → IN_PROGRESS → READY`. DONE suy ra từ Git sau khi merge.

## Goal

Bốn nhóm trang còn lại với empty state và chỉ hiển thị nội dung đã xuất bản.

## Scope

- In scope: Resources lọc theo danh mục/loại (không JS: hiển thị nhóm theo danh mục); FAQ theo danh mục (`<details>`); liên hệ từ settings, trống → "đang được cập nhật".
- Out of scope: Nội dung thật.

## Authority / key decisions

- REQ-001, ADR-001, ADR-002, IAB-001, PD-001, PD-002 (ACCEPTED 2026-11-11); `docs/CONTENT_MODEL.md`, `docs/ARCHITECTURE.md`, `docs/SITEMAP.md`.

## Implementation approach

- Tái dùng component CP1-03 (EmptyState, AttachmentList).

## Phải giữ nguyên

- Component CP1-03.

## Code bị thay / xóa

- không có (thêm mới).

## Acceptance Criteria

1. Mọi trang render với dữ liệu rỗng không lỗi và có empty state.
2. Link ngoài có `rel="noopener noreferrer"` và nhãn quyền truy cập.
3. Không có liên hệ hardcode.

## Required verification

- `npm run verify` — AC1–AC2
- grep `dist/` không có email/số điện thoại khi settings rỗng — AC3

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
