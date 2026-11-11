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
- Implementation authorized: YES

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

- Main changes: trang chủ (Quan trọng tối đa 3, Mới nhất 6, Thủ tục thường dùng + quick_links), `/thong-bao/` (quan trọng trước, rồi ngày giảm dần) + chi tiết (pagination, Markdown `html:false`), `/danh-muc/` + từng danh mục với empty state; 5 component macro (`emptyState(message?, detail?)`, `attachmentList(attachments)` cho CP1-04 tái dùng); `src/_data/bulletin.js` nhận `CONTENT_DIR`; `src/_data/build.js` ngày build; deadline "Đã hết hạn" lúc build + kiểm lại phía client (CONTENT_MODEL §4, ARCHITECTURE T6).
- Tests: `tests/pages.test.mjs` (AC1–AC3, build production rỗng có empty state, escaping Markdown, attachments, deadline). ORCHESTRATOR chạy `npm run verify` ngoài sandbox 2026-11-11: check PASS, test 16/16 PASS, build PASS, framework-check PASS. Build thủ công `CONTENT_DIR=tests/fixtures/content`: không có trang/chuỗi của bài `hidden` và danh mục ẩn. Kiểm 360px/1280px + bàn phím: **NOT RUN** — chờ HUMAN LEAD.
- Diff + / − (app, test): app +335/−3; test/fixture +200/−0.
- Helper mới (đã tìm, lý do không tái dùng): macro UI + `displayDate`; không thêm helper lọc/sắp xếp. Codex grep `rg -n 'date|deadline|markdown|attachments|sort|macro|EmptyState' src/lib src/_includes tests`.
- Review: vòng 1 Codex BLOCKED đúng (cần ngày build ngoài Owned paths) → ORCHESTRATOR thêm `src/_data/build.js` (commit `aff63e8`). Review ORCHESTRATOR: 0 blocking. Non-blocking: (1) tách quan trọng/còn lại bằng `selectattr`/`rejectattr` trong template lặp lại thứ tự của `getHomeAnnouncements` vì `getContent()` không expose nó (`src/lib` ngoài Owned paths) — thứ tự kết quả giống nhau; (2) layout chi tiết đặt ở `src/pages/thong-bao/detail-layout.njk` (`permalink: false`) thay vì `_includes/layouts` (ngoài Owned paths); (3) `rel="noopener noreferrer"` gắn cho mọi `<a ` trong body bằng `replace`, kể cả link nội bộ (vô hại).
- Pilot evidence: Codex CLI 0.166.0, model `gpt-6.1-sol`, effort `high`, session `01a1ca26-8cdb-7ae3-b078-893b13fcf74d`; vòng 1 10:28→10:31 UTC (BLOCKED), vòng 2 `resume` →10:42 UTC, tích lũy 106,045 tokens. Quota: trước vòng 1 5 giờ 19 % / tuần 79 %; trước vòng 2 24 % / 79 %. Song song với CP2-01 (worktree riêng). Codex không commit, không sửa ngoài Owned paths.
- Important findings / decisions: HUMAN LEAD 2026-11-11 — CP1-04 serialize sau task này.
- Known limitations: ngày "hết hạn" so theo UTC (build và client), chậm tối đa 7 giờ so với giờ Việt Nam (00:00–07:00); chưa có ô tìm kiếm trang chủ (CP1-05).
- PR: chưa (HUMAN LEAD quyết push).
