# Task: UX-01 — Giảm phân cấp: 1 thủ tục = 1 trang

## Status / Approval

- Status: IN_PROGRESS
- Type: CHANGE
- Change class: S1
- Owner: HUMAN LEAD (tech owner)
- Execution profile: dual-agent
- Orchestrator: claude-code
- Implementer: codex — `codex exec` (PD-002), ORCHESTRATOR Claude Code review
- Human Lead: tech owner
- Authorization mode: boundary
- Authorization source: HUMAN LEAD 2026-11-16 (chọn "1 thủ tục = 1 trang", đổi SITEMAP); triển khai trong IAB-001 §1 CP1
- Parallel group: P3 (song song CONTENT-02; owned paths không giao nhau)
- Owned paths: `src/pages/**`, `src/_includes/**`, `src/styles/**`, `tests/**`, `docs/SITEMAP.md` (ORCHESTRATOR)
- Dependencies: none
- Base commit / branch: `b1f31c6` (`main`); branch `ux/UX-01-procedure-pages`
- Human Lead approval: accepted 2026-11-16
- Implementation authorized: YES

Lifecycle: `boundary` mode = `DRAFT → IN_PROGRESS → READY`. DONE suy ra từ Git sau khi merge.

## Goal

Sinh viên từ trang chủ bấm **1 lần** là tới trang thủ tục và thấy ngay các bước + biểu mẫu, không phải qua trang danh mục rồi trang hướng dẫn (tham khảo trang mẫu SOB, PROJECT_BRIEF §Trang mẫu).

## Scope

- In scope:
  1. Trang danh mục `/danh-muc/<slug>/` thành **trang thủ tục**: hiện **toàn văn** mọi hướng dẫn đã xuất bản của danh mục (tiêu đề h2, ngày cập nhật, body Markdown, đính kèm), theo `order`; sau đó Biểu mẫu, Thông báo liên quan, Hỏi đáp liên quan. Mỗi hướng dẫn có anchor `id="huong-dan-<id>"`.
  2. Trang chủ: Thông báo (quan trọng + mới); mục "Bạn cần làm gì?" liệt kê **thẳng** mọi danh mục đã xuất bản (tên + mô tả ngắn, link tới trang thủ tục); Liên hệ và Hỏi đáp rút gọn. Bỏ mục "Hướng dẫn nhanh".
  3. Menu chính: Trang chủ · Thông báo · Biểu mẫu · Hỏi đáp · Liên hệ — bỏ dropdown Danh mục.
  4. Mọi link tới một hướng dẫn trỏ tới `/danh-muc/<slug>/#huong-dan-<id>` khi danh mục tồn tại và đã xuất bản; danh mục ẩn/không tồn tại ("Khác") → giữ link trang chi tiết.
- Out of scope: schema, `src/lib/**`, `src/content/**`, `.pages.yml`, workflow, màu sắc/nhận diện.

## Authority / key decisions

- `docs/SITEMAP.md` (sửa theo task này), `docs/CONTENT_MODEL.md` §3 (một helper lọc published duy nhất — tái dùng), REQ-001, IAB-001.

## Implementation approach

- Giữ các route hiện có (`/huong-dan/`, `/huong-dan/<id>/`, `/danh-muc/`) để không gãy link đã chia sẻ; chỉ bỏ khỏi menu.
- Tái dùng component có sẵn (`AttachmentList`, `ResourceList`, `FaqList`, `AnnouncementCard`, `EmptyState`) và helper trong `src/lib/content.js`; cần đổi `src/lib` → dừng, báo ORCHESTRATOR.

## Phải giữ nguyên

- Lọc `published` qua helper duy nhất; base path; escape HTML; empty-state; search/filter; verify-dist (sitemap, link nội bộ, SEO).

## Code bị thay / xóa

- Mục "Hướng dẫn nhanh" trên trang chủ; dropdown Danh mục trong menu (`CategoryNav` nếu không còn dùng thì xóa).

## Acceptance Criteria

1. Từ trang chủ, 1 click tới trang thủ tục có toàn văn hướng dẫn + biểu mẫu của danh mục.
2. Menu không còn dropdown; có 5 mục nêu trên.
3. Link hướng dẫn trên site trỏ tới anchor trang thủ tục (trừ danh mục ẩn/thiếu).
4. `npm run verify` PASS; test mới phủ AC1–AC3 trên fixture.
5. Hiển thị tốt ở 360px.

## Required verification

- `npm run verify` (ORCHESTRATOR ngoài sandbox) — AC4
- Test fixture — AC1–AC3
- Xem trang thật ở 360px (HUMAN LEAD hoặc ORCHESTRATOR qua ảnh chụp) — AC5

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
