# Task: CP3-03 — Phát hành production (integration gate)

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
- Owned paths: không sửa source; chỉ Result
- Dependencies: tất cả task trên; HUMAN LEAD chấp thuận nội dung công khai
- Base commit / branch: chưa có commit gốc — xác định khi bắt đầu; branch `cp3/CP3-03-production-release`
- Human Lead approval: inherited from boundary IAB-001
- Implementation authorized: NO

Lifecycle: `boundary` mode = `DRAFT → IN_PROGRESS → READY`. DONE suy ra từ Git sau khi merge.

## Goal

Site công khai chạy ổn định, thư ký đã nghiệm thu, có rollback đã thử.

## Scope

- In scope: HUMAN LEAD push/merge `main`, bật Pages source = GitHub Actions; kiểm site, 404, base path; thử rollback.
- Out of scope: DNS/custom domain (task riêng khi có quyết định).

## Authority / key decisions

- REQ-001, ADR-001, ADR-002, IAB-001, PD-001, PD-002 (ACCEPTED 2026-11-11); `docs/CONTENT_MODEL.md`, `docs/ARCHITECTURE.md`, `docs/SITEMAP.md`.

## Implementation approach

- Toàn bộ bước do HUMAN LEAD thực hiện hoặc cho phép từng bước.

## Phải giữ nguyên

- —

## Code bị thay / xóa

- không có (thêm mới).

## Acceptance Criteria

1. Site truy cập được tại `https://ntnghia-hcmiu.github.io/it-academic-bulletin/`.
2. Definition of Done brief §9 đánh dấu đủ, có evidence.

## Required verification

- Kiểm site thật + log Actions — AC1
- Checklist bàn giao — AC2

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
