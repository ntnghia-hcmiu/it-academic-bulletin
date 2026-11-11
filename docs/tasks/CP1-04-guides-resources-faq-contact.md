# Task: CP1-04 — Trang hướng dẫn, biểu mẫu/tài liệu, FAQ, liên hệ

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
- Parallel group: không — serialize sau CP1-03 (HUMAN LEAD 2026-11-11: tái dùng component CP1-03)
- Owned paths: `src/pages/huong-dan/**`, `src/pages/bieu-mau/**`, `src/pages/hoi-dap/**`, `src/pages/lien-he/**`, `src/_includes/components/{ContactCard,ResourceList,FaqList}.njk`, `src/styles/global.css` (chỉ thêm style), `tests/pages-secondary.test.mjs`, `tests/fixtures/pages/**` (chỉ thêm file), `src/pages/index.njk` + `src/pages/danh-muc/detail.njk` (chỉ thêm section theo SITEMAP §1–2: Hướng dẫn nhanh, Liên hệ trên trang chủ; hướng dẫn/tài liệu/FAQ liên quan trên trang danh mục — CP1-03 READY chỉ làm phần thông báo) — mở rộng bởi ORCHESTRATOR 2026-11-11
- Dependencies: CP1-02
- Base commit / branch: `0412797` (HEAD CP1-03 READY); branch `cp1/CP1-04-guides-resources-faq-contact`, worktree `../IAB-wt/CP1-04`
- Human Lead approval: inherited from boundary IAB-001
- Implementation authorized: YES

Lifecycle: `boundary` mode = `DRAFT → IN_PROGRESS → READY`. DONE suy ra từ Git sau khi merge.

## Goal

Bốn nhóm trang còn lại với empty state và chỉ hiển thị nội dung đã xuất bản.

## Scope

- In scope: Resources lọc theo danh mục/loại (không JS: hiển thị nhóm theo danh mục); FAQ theo danh mục (`<details>`), answer trống → "Chưa cập nhật câu trả lời" (D-10); không hiển thị link Drive danh mục (D-06 chưa chốt); liên hệ từ settings, trống → "đang được cập nhật".
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
