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

- Main changes: `docs/SECRETARY_GUIDE.md` (56 dòng, ~2 trang A4): 6 mục — địa chỉ/tài khoản, đăng & sửa thông báo, các nhóm còn lại (tên nhóm/nhãn field khớp `.pages.yml`), kiểm quyền link Drive, "Ẩn bài khác xóa bài", sau khi lưu & báo lỗi; cảnh báo kho CÔNG KHAI ở mục 1 và 5.
- Tests: không có test tự động trong contract; `node scripts/framework-check.mjs` PASS; Codex + ORCHESTRATOR đối chiếu nhãn field với `.pages.yml`.
- Diff + / − (app, test): docs +56/−0.
- Helper mới (đã tìm, lý do không tái dùng): không có.
- Review: ORCHESTRATOR review 0 blocking; sửa 2 cụm thuật ngữ nội bộ ("CP2-03", "agent") khỏi văn bản cho thư ký.
- Pilot evidence: Codex CLI 0.166.0, model `gpt-6.1-sol`, effort `medium`; chạy song song CP1-05.
- Important findings / decisions: placeholder `[chờ HUMAN LEAD cung cấp]` cho: địa chỉ trang công khai (D-05), địa chỉ CMS, tài khoản thư ký (D-03), đầu mối kỹ thuật nhận báo lỗi, thư mục Drive (D-06). Thời gian chờ deploy 2–10 phút là ước lượng, đo ở CP2-03.
- Known limitations: Required verification (review HUMAN LEAD + thư ký) chưa chạy → chưa READY. Slug từ tiêu đề tiếng Việt, deadline trống: xác nhận ở CP2-03. Chưa có ảnh màn hình.
- PR:
