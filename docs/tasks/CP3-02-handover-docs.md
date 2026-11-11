# Task: CP3-02 — README, DEPLOYMENT, rollback, checklist bàn giao

## Status / Approval

- Status: DRAFT
- Type: DOC
- Change class: S1
- Owner: HUMAN LEAD (tech owner)
- Execution profile: dual-agent
- Orchestrator: claude-code
- Implementer: codex — `codex exec` (PD-002), ORCHESTRATOR Claude Code review
- Human Lead: tech owner
- Authorization mode: boundary
- Authorization source: IAB-001 (ACCEPTED 2026-11-11)
- Parallel group: —
- Owned paths: `README.md`, `docs/DEPLOYMENT.md`, `docs/HANDOVER_CHECKLIST.md`
- Dependencies: CP3-01, CP2-02
- Base commit / branch: chưa có commit gốc — xác định khi bắt đầu; branch `cp3/CP3-02-handover-docs`
- Human Lead approval: inherited from boundary IAB-001
- Implementation authorized: NO

Lifecycle: `boundary` mode = `DRAFT → IN_PROGRESS → READY`. DONE suy ra từ Git sau khi merge.

## Goal

Tech owner kế nhiệm vận hành được: build local, deploy, rollback, custom domain, quyền CMS, xử lý build lỗi.

## Scope

- In scope: Rollback bằng `git revert`; chuyển domain (`public/CNAME`, `site`, `base`); danh sách tài khoản/quyền cần bàn giao; không ghi secret.
- Out of scope: Đổi DNS.

## Authority / key decisions

- REQ-001, ADR-001, ADR-002, IAB-001, PD-001, PD-002 (ACCEPTED 2026-11-11); `docs/CONTENT_MODEL.md`, `docs/ARCHITECTURE.md`, `docs/SITEMAP.md`.

## Implementation approach

- —

## Phải giữ nguyên

- —

## Code bị thay / xóa

- không có (thêm mới).

## Acceptance Criteria

1. Có quy trình rollback từng bước.
2. Phân biệt rõ URL site công khai và URL CMS.
3. Checklist bàn giao khớp Definition of Done brief §9.

## Required verification

- Review HUMAN LEAD — AC1–AC3
- Rollback thử trên repo thật trong CP3-03

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
