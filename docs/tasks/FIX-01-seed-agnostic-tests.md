# Task: FIX-01 — Test không được giả định nội dung production rỗng

## Status / Approval

- Status: READY
- Type: BUG
- Change class: S1
- Owner: HUMAN LEAD (tech owner)
- Execution profile: dual-agent
- Orchestrator: claude-code
- Implementer: codex — `codex exec` (PD-002), ORCHESTRATOR Claude Code review
- Human Lead: tech owner
- Authorization mode: boundary
- Authorization source: HUMAN LEAD 2026-11-12 (chọn "Task BUG riêng" khi CONTENT-01 phát hiện lỗi); sửa test của CP1-02/CP1-04 thuộc IAB-001 §1
- Parallel group: —
- Owned paths: `tests/**`
- Dependencies: none; CONTENT-01 merge sau task này
- Base commit / branch: `c7243a6` (`main`); branch `fix/FIX-01-seed-agnostic-tests`
- Human Lead approval: accepted 2026-11-12
- Implementation authorized: YES

Lifecycle: `boundary` mode = `DRAFT → IN_PROGRESS → READY`. DONE suy ra từ Git sau khi merge.

## Goal

Thêm/sửa/ẩn nội dung hợp lệ schema trong `src/content/**` (qua CMS hoặc PR) không làm `npm run verify` fail, nên CI không chặn deploy.

## Bug

- Evidence: CONTENT-01 (branch `content/CONTENT-01-drive-sync`, `3e170a7`) thêm 1 guide + 3 resource hợp lệ → `npm run verify` fail ở `tests/content.test.mjs` ("production seed has exactly the nine approved categories…", assert `guides`/`resources` = `[]`) và `tests/pages-secondary.test.mjs` ("AC1: all secondary production pages render empty states…").
- Root cause: test kiểm trạng thái seed trên nội dung production thay vì trên fixture.

## Scope

- In scope: mọi test đọc nội dung production (`globalContent()`, build không đặt `CONTENT_DIR`) chỉ được assert điều đúng với **mọi** nội dung hợp lệ schema mà thư ký có thể tạo qua CMS (thêm/sửa/ẩn/xóa announcements, guides, resources, faq; sửa categories, settings). Assert trạng thái rỗng/empty-state/seed chuyển sang fixture (vd. fixture content rỗng chỉ có danh mục + settings rỗng) — giữ nguyên độ phủ hành vi.
- Out of scope: `src/**`, `scripts/**`, `src/content/**`, schema, `.pages.yml`, workflow.

## Authority / key decisions

- `docs/CONTENT_MODEL.md`, ADR-002 (thư ký publish không qua review), IAB-001, CP1-02, CP1-04.

## Implementation approach

- Seed 9 danh mục là dữ liệu ban đầu, không phải bất biến: thư ký được sửa mô tả, ẩn, thêm link Drive. Assert seed (tên, thứ tự, mô tả trung tính) đối chiếu với fixture hoặc bỏ; production chỉ kiểm hợp lệ schema (đã có `npm run check`) và build thành công.
- Không nới assert để che lỗi: mỗi assert bị bỏ khỏi production phải có assert tương đương trên fixture (ghi bảng cũ → mới trong READY report).

## Phải giữ nguyên

- Hành vi được kiểm: empty-state, ẩn quick guides rỗng, liên hệ "đang được cập nhật", không có `huong-dan/detail`.

## Code bị thay / xóa

- Assert seed-only trên production trong `tests/content.test.mjs`, `tests/pages-secondary.test.mjs` (và test khác nếu có).

## Acceptance Criteria

1. `npm run verify` PASS trên `main` (seed) và trên `main` + nội dung CONTENT-01.
2. Mọi assert empty-state/seed cũ có assert tương đương trên fixture.

## Required verification

- `npm run verify` trên branch này và trên merge thử với `content/CONTENT-01-drive-sync` (ORCHESTRATOR, ngoài sandbox) — AC1
- ORCHESTRATOR review bảng assert cũ → mới — AC2

Tất cả required verification phải chạy và PASS trước READY.

## Manual test checklist (Tech Lead)

Task không chạm security model / quyền bên thứ ba; manual test sau automated verification là điểm danh.

- [ ] Kiểm trên điện thoại thật hoặc DevTools 360px (nếu có UI).

## Result

- Main changes: fixture mới `tests/fixtures/empty-seed/` (9 danh mục + settings, giống hệt seed hiện tại — ORCHESTRATOR `diff -r` xác nhận); assert seed/empty-state chuyển sang fixture trong `tests/content.test.mjs`, `tests/pages.test.mjs`, `tests/pages-secondary.test.mjs`; thêm test production chỉ kiểm build + trang cố định tồn tại.
- Tests: `npm run verify` PASS (ORCHESTRATOR, ngoài sandbox, 2026-11-12): trên branch (seed) 103/103; trên merge thử với `content/CONTENT-01-drive-sync` 103/103 + verify-dist PASS — AC1. Codex trong sandbox: 3 file test sửa PASS; content-guard/verify-dist test không chạy được (EPERM spawn) — đã chạy ngoài sandbox.
- Diff + / − (app, test): test +98/−19 (gồm 10 file fixture); app 0.
- Helper mới (đã tìm, lý do không tái dùng): không có; tái dùng `buildSite`, `CONTENT_DIR`.
- Review: ORCHESTRATOR 0 blocking — AC2: bảng assert cũ → mới: content.test.mjs:75–100 → fixture; pages.test.mjs:115 (base lặp), :152–161 (trang rỗng) → fixture; pages-secondary.test.mjs:59–68 (empty-state), :173–178 (không email/điện thoại) → fixture. Không assert nào bị bỏ. Base path production vẫn do `verify-dist` kiểm.
- Pilot evidence: Codex CLI 0.166.0, `gpt-6.1-sol`, effort `medium`, session `01a1cf5a-db0c-7db0-87f1-11602f854ada`.
- Important findings / decisions: trước fix, mọi nội dung thật (kể cả commit CMS của thư ký) làm CI fail và chặn deploy.
- Known limitations: không có.
- PR:
