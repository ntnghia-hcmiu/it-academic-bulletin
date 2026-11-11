# Task: CP1-05 — Tìm kiếm & lọc thông báo phía client

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
- Parallel group: P2 (PD-001; worktree riêng)
- Owned paths: `src/lib/search.ts`, `src/pages/search-index.json.ts`, `src/components/SearchBox.astro`, script client trong `src/pages/thong-bao/index.astro`, `tests/search.test.mjs`
- Dependencies: CP1-03
- Base commit / branch: chưa có commit gốc — xác định khi bắt đầu; branch `cp1/CP1-05-client-search`
- Human Lead approval: inherited from boundary IAB-001
- Implementation authorized: NO

Lifecycle: `boundary` mode = `DRAFT → IN_PROGRESS → READY`. DONE suy ra từ Git sau khi merge.

## Goal

Tìm theo từ khóa không dấu/có dấu, lọc danh mục, sắp xếp; trạng thái lưu ở query string.

## Scope

- In scope: Chỉ mục JSON chỉ chứa bài published; chuẩn hóa NFD + bỏ dấu + đ→d; EC-004 không có kết quả.
- Out of scope: Full-text body search, thư viện tìm kiếm.

## Authority / key decisions

- REQ-001, ADR-001, ADR-002, IAB-001, PD-001, PD-002 (ACCEPTED 2026-11-11); `docs/CONTENT_MODEL.md`, `docs/ARCHITECTURE.md`, `docs/SITEMAP.md`.

## Implementation approach

- Không thêm dependency (ADR-001).

## Phải giữ nguyên

- Danh sách không JS vẫn đầy đủ.

## Code bị thay / xóa

- không có (thêm mới).

## Acceptance Criteria

1. "dang ky" khớp "Đăng ký".
2. Index không chứa bài `published=false`.
3. Lọc + query string chia sẻ được; không JS vẫn xem danh sách.

## Required verification

- `node --test tests/search.test.mjs` — AC1
- `npm run verify` — AC2
- Thủ công trình duyệt — AC3

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
