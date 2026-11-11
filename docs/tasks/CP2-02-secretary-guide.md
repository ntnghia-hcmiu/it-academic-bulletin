# Task: CP2-02 — Hướng dẫn thư ký `docs/SECRETARY_GUIDE.md`

## Status / Approval

- Status: IN_PROGRESS
- Type: DOC
- Change class: S1
- Owner: HUMAN LEAD (tech owner)
- Execution profile: dual-agent
- Orchestrator: claude-code
- Implementer: codex — `codex exec` (PD-002), ORCHESTRATOR Claude Code review
- Human Lead: tech owner
- Authorization mode: boundary
- Authorization source: IAB-001 (ACCEPTED 2026-11-11)
- Parallel group: P2 (PD-001; worktree riêng)
- Owned paths: `docs/SECRETARY_GUIDE.md`, `docs/images/secretary/**`
- Dependencies: CP2-01
- Base commit / branch: `cb0f54c` (HEAD CP2-01); branch `cp2/CP2-02-secretary-guide`
- Human Lead approval: inherited from boundary IAB-001
- Implementation authorized: YES

Lifecycle: `boundary` mode = `DRAFT → IN_PROGRESS → READY`. DONE suy ra từ Git sau khi merge.

## Goal

Thư ký tự đăng/sửa/ẩn/xóa, sửa link Drive, FAQ, liên hệ chỉ bằng hướng dẫn ≤ ~2 trang.

## Scope

- In scope: Địa chỉ trang công khai vs địa chỉ CMS; từng thao tác; cách ẩn bài; kiểm quyền link Drive; cảnh báo không đưa dữ liệu cá nhân; thời gian chờ deploy; báo lỗi cho ai.
- Out of scope: Hướng dẫn kỹ thuật.

## Authority / key decisions

- REQ-001, ADR-001, ADR-002, IAB-001, PD-001, PD-002 (ACCEPTED 2026-11-11); `docs/CONTENT_MODEL.md`, `docs/ARCHITECTURE.md`, `docs/SITEMAP.md`.

## Implementation approach

- Ảnh màn hình chụp trong CP2-03 nếu được.
- Thông tin chưa chốt (domain D-05, tài khoản thư ký D-03, link Drive D-06, người nhận báo lỗi) để placeholder ghi rõ "chờ HUMAN LEAD cung cấp", không bịa (ORCHESTRATOR 2026-11-11).

## Phải giữ nguyên

- —

## Code bị thay / xóa

- không có (thêm mới).

## Acceptance Criteria

1. ≤ ~2 trang thao tác chính, tiếng Việt.
2. Có mục "Ẩn bài khác xóa bài" và cảnh báo repo công khai.

## Required verification

- Review bởi HUMAN LEAD + thư ký — AC1–AC2

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
