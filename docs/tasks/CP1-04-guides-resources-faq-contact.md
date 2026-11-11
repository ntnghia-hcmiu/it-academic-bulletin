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
- Owned paths: `src/pages/huong-dan/**`, `src/pages/bieu-mau/**`, `src/pages/hoi-dap/**`, `src/pages/lien-he/**`, `src/_includes/components/{ContactCard,ResourceList,FaqList}.njk`, `src/styles/global.css` (chỉ thêm style), `tests/pages-secondary.test.mjs`, `tests/fixtures/pages/**` (chỉ thêm file), `src/pages/index.njk` + `src/pages/danh-muc/detail.njk` (chỉ thêm section theo SITEMAP §1–2: Hướng dẫn nhanh, Liên hệ trên trang chủ; hướng dẫn/tài liệu/FAQ liên quan trên trang danh mục — CP1-03 READY chỉ làm phần thông báo), `eleventy.config.js` (chỉ thêm `RenderPlugin` built-in của Eleventy cho Markdown FAQ answer, giữ `html:false`; thêm sau BLOCKED vòng 1) — mở rộng bởi ORCHESTRATOR 2026-11-11
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

- Main changes: `/huong-dan/` + chi tiết, `/bieu-mau/` (nhóm theo danh mục, không JS), `/hoi-dap/` (`<details>`, answer trống → "Chưa cập nhật câu trả lời" theo D-10), `/lien-he/` (chỉ từ settings, trống → "Thông tin liên hệ đang được cập nhật"); components `ContactCard`, `ResourceList`, `FaqList`; trang chủ thêm "Hướng dẫn nhanh" + "Liên hệ"; trang danh mục thêm hướng dẫn/tài liệu/FAQ liên quan; `RenderPlugin` cho Markdown của FAQ answer và `contact_note`. Không hiển thị link Drive (D-06).
- Tests: `tests/pages-secondary.test.mjs` 9 test (AC1–AC3, D-10, escape `<script>`/`<b>` trong answer, Markdown đậm/link). ORCHESTRATOR chạy `npm run verify` ngoài sandbox 2026-11-11: PASS, test 25/25; grep `dist/**/*.html` (settings rỗng) không có email/số điện thoại — AC3 PASS. Probe ORCHESTRATOR: cú pháp `{{ }}`/`{% %}` trong FAQ answer, body thông báo, body hướng dẫn được xuất nguyên văn (không chạy template). Kiểm 360px/1280px + bàn phím: **NOT RUN** — chờ HUMAN LEAD.
- Diff + / − (app, test): app +257/−1; test/fixture +285/−0.
- Helper mới (đã tìm, lý do không tái dùng): 3 component theo contract; test helper `section`, `guideIds`, `htmlFiles`. Codex grep `src/lib`, `src/_includes`, `tests`; tái dùng `emptyState`, `attachmentList`, `displayDate`, cách build fixture của `tests/pages.test.mjs`.
- Review: vòng 1 Codex BLOCKED đúng (cần `RenderPlugin` trong `eleventy.config.js` ngoài Owned paths) → ORCHESTRATOR chấp thuận, chỉ thêm plugin (commit `3146479`) và yêu cầu test escape. Review ORCHESTRATOR: 0 blocking. Non-blocking: thứ tự "Hướng dẫn nhanh" sắp lại theo `updated_date` trong template; nhóm "Khác" tạo bằng literal trong template; layout chi tiết ở `src/pages/huong-dan/detail-layout.njk` (như CP1-03).
- Pilot evidence: Codex CLI 0.166.0, model `gpt-6.1-sol`, effort `high`, session `01a1ca4a-f9df-7032-8993-e2e02d7cadbf`; vòng 1 11:07→11:09 UTC (BLOCKED, 45,169 tokens), vòng 2 `resume` →11:17 UTC, tích lũy 86,234 tokens. Quota: trước vòng 1 5 giờ 31 % / tuần 81 %; trước vòng 2 2 % / 81 %. Codex không commit, không sửa ngoài Owned paths.
- Important findings / decisions: HUMAN LEAD 2026-11-11 — D-10: hiện câu hỏi với "Chưa cập nhật câu trả lời" (ghi trong `docs/CONTENT_MODEL.md`). ORCHESTRATOR mở rộng Owned paths sang `src/pages/index.njk`, `src/pages/danh-muc/detail.njk` (khoảng trống SITEMAP giữa CP1-03/CP1-04) và `eleventy.config.js` (RenderPlugin).
- Known limitations: footer (`footer_text`, link web khoa) chưa làm — layout base ngoài scope; link Drive danh mục chờ D-06.
- PR: chưa (HUMAN LEAD quyết push).
