# Task: CP2-03 — Acceptance CMS end-to-end với tài khoản thư ký thật

## Status / Approval

- Status: DRAFT
- Type: CHANGE
- Change class: S2
- Owner: HUMAN LEAD (tech owner)
- Execution profile: dual-agent
- Orchestrator: claude-code
- Implementer: codex — `codex exec` (PD-002), ORCHESTRATOR Claude Code review
- Human Lead: tech owner
- Authorization mode: boundary
- Authorization source: IAB-001 (ACCEPTED 2026-11-11)
- Parallel group: —
- Owned paths: `docs/tasks/CP2-03-cms-e2e-acceptance.md` (Result), `docs/SECRETARY_GUIDE.md` (ảnh)
- Dependencies: CP2-01, CP2-02, CP3-01, integration gate (push, Pages, App, ruleset)
- Base commit / branch: chưa có commit gốc — xác định khi bắt đầu; branch `cp2/CP2-03-cms-e2e-acceptance`
- Human Lead approval: inherited from boundary IAB-001
- Implementation authorized: NO

Lifecycle: `boundary` mode = `DRAFT → IN_PROGRESS → READY`. DONE suy ra từ Git sau khi merge.

## Goal

Chứng minh AC-005/AC-006 của REQ-001 bằng thao tác thật của thư ký.

## Scope

- In scope: Admin repo cài Pages CMS App chỉ cho repo này; ruleset + bypass (ADR-002); mời thư ký; thư ký tạo bài test vô hại → publish → thấy trên site → ẩn → xóa; sửa 1 link tài liệu/FAQ/liên hệ test rồi hoàn tác.
- Out of scope: Nội dung chính thức.

## Authority / key decisions

- REQ-001, ADR-001, ADR-002, IAB-001, PD-001, PD-002 (ACCEPTED 2026-11-11); `docs/CONTENT_MODEL.md`, `docs/ARCHITECTURE.md`, `docs/SITEMAP.md`.

## Implementation approach

- S2 vì chạm quyền bên thứ ba và security model; mỗi bước cần HUMAN LEAD/admin thực hiện.

## Phải giữ nguyên

- Không đổi code; chỉ ghi evidence.

## Code bị thay / xóa

- không có (thêm mới).

## Acceptance Criteria

1. Thư ký đăng nhập không cần GitHub/CLI (hoặc theo D-03).
2. Bài test hiện rồi mất trên site công khai.
3. Commit CMS chỉ chạm `src/content/**`; guard CI PASS.
4. Ghi rõ branch CMS ghi vào và hành vi với ruleset.

## Required verification

- Evidence: commit SHA của CMS, log Actions, ảnh chụp site — AC1–AC4
- Không mô phỏng; chưa chạy → NOT RUN

Tất cả required verification phải chạy và PASS trước READY.

## Manual test checklist (Tech Lead)

Task CÓ chạm security model / quyền bên thứ ba; manual test là gate trước integration.

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
