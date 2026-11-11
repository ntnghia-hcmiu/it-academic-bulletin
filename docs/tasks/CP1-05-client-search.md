# Task: CP1-05 — Tìm kiếm & lọc thông báo phía client

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
- Parallel group: P2 (PD-001; worktree riêng)
- Owned paths: `src/lib/search.js`, `src/pages/search-index.json.njk`, `src/_includes/components/SearchBox.njk`, `src/assets/search.js` (script client), script mount trong `src/pages/thong-bao/index.njk`, `tests/search.test.mjs`; mở rộng bởi ORCHESTRATOR 2026-11-11: `eleventy.config.js` (chỉ passthrough `src/assets/` và `src/lib/search.js` → `assets/search-helpers.js`, để client dùng chung helper thuần — Codex BLOCKED vòng 1, ORCHESTRATOR chấp thuận), `src/pages/index.njk` (chỉ mount SearchBox trang chủ → `/thong-bao/?q=`, theo `docs/SITEMAP.md`)
- Dependencies: CP1-03
- Base commit / branch: `6f9ca0b` (HEAD CP1-04, stacked); branch `cp1/CP1-05-client-search`
- Human Lead approval: inherited from boundary IAB-001
- Implementation authorized: YES

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

- Main changes: `src/lib/search.js` (normalize NFD + bỏ dấu + đ→d, AND token trên title/summary/tên danh mục, `buildIndex`, `filterAndSort` newest/oldest, tie-break id); `/search-index.json` qua RenderPlugin (chỉ `bulletin.announcements` đã qua published gate của `content.js`, không body, URL có base path); `SearchBox` (form GET, label, danh mục, sắp xếp; trang chủ chỉ ô `q`); `src/assets/search.js` ẩn/hiện + sắp xếp lại card đã render, query string qua `history.replaceState`, EC-004 (aria-live + link `/danh-muc/`), fetch lỗi → giữ danh sách đầy đủ; passthrough `src/assets/` + `src/lib/search.js` → `assets/search-helpers.js`.
- Tests: `tests/search.test.mjs` 4 test (AC1 hai chiều, đ→d, nhiều token, lọc + sắp xếp; AC2 build fixture không có bài draft/body, cả hai base path; EC-007 HTML đầy đủ không JS; mô phỏng client: query string, empty state, fetch lỗi). ORCHESTRATOR chạy `npm run verify` ngoài sandbox 2026-11-11: PASS, test 29/29.
- Diff + / − (app, test): app +146/−0; test +154/−0.
- Helper mới (đã tìm, lý do không tái dùng): `normalize`, `matches`, `buildIndex`, `filterAndSort` — chưa có helper tìm kiếm; tái dùng published gate `content.js`, `emptyState`, RenderPlugin, `this.url`.
- Review: vòng 1 Codex BLOCKED đúng (client cần import `src/lib/search.js` bị Eleventy ignore) → ORCHESTRATOR chấp thuận passthrough (commit `1986099`). Review ORCHESTRATOR vòng 2: 0 blocking. Non-blocking: index render bằng `renderFile ... "11ty.js"` trên file thư viện (ít hiển nhiên nhưng giữ một nguồn helper); submit form luôn gửi `sort=newest` → khi bấm Tìm kiếm danh sách xếp theo ngày, bỏ nhóm "quan trọng trước" (đúng AC-003).
- Pilot evidence: Codex CLI 0.166.0, model `gpt-6.1-sol`, effort `high`, session `01a1ca5a-43d2-7351-b6f9-5cab2a09dc5e`; vòng 1 11:24→11:26 UTC BLOCKED (36,317 tokens), vòng 2 `resume` (tích lũy 71,706 tokens). Quota trước vòng 1: 5 giờ 7 % / tuần 82 %; trước vòng 2: 9 % / 82 %. Chạy song song CP2-02. Codex không commit, không sửa ngoài Owned paths.
- Important findings / decisions: Owned paths mở rộng (ORCHESTRATOR): `eleventy.config.js` (passthrough), `src/pages/index.njk` (SearchBox trang chủ theo SITEMAP).
- Known limitations: AC3 thủ công trình duyệt (360/1280, bàn phím, link chia sẻ) chưa chạy → chưa READY. Không có JS: `/thong-bao/?q=` hiện danh sách đầy đủ, không lọc (EC-007).
- PR:
