# Task: CP2-01 — Cấu hình `.pages.yml` khớp content model

## Status / Approval

- Status: DRAFT
- Type: FEATURE
- Change class: S1
- Owner: HUMAN LEAD (tech owner)
- Execution profile: dual-agent
- Orchestrator: claude-code
- Implementer: codex — `codex exec` (PD-002), ORCHESTRATOR Claude Code review
- Human Lead: tech owner
- Authorization mode: boundary
- Authorization source: IAB-001 (ACCEPTED 2026-11-11)
- Parallel group: P1 (PD-001; worktree riêng)
- Owned paths: `.pages.yml`, `tests/cms-config.test.mjs`
- Dependencies: CP1-02
- Base commit / branch: chưa có commit gốc — xác định khi bắt đầu; branch `cp2/CP2-01-pages-cms-config`
- Human Lead approval: inherited from boundary IAB-001
- Implementation authorized: NO

Lifecycle: `boundary` mode = `DRAFT → IN_PROGRESS → READY`. DONE suy ra từ Git sau khi merge.

## Goal

Thư ký thấy 6 nhóm nội dung với nhãn/mô tả tiếng Việt, trường bắt buộc, không thấy cấu hình kỹ thuật.

## Scope

- In scope: Ánh xạ §2 CONTENT_MODEL; operations (rename false); media `public/media`; `settings.commit.identity` theo D-04; test so tên field `.pages.yml` ↔ schema.
- Out of scope: Cài GitHub App, mời collaborator (integration gate).

## Authority / key decisions

- REQ-001, ADR-001, ADR-002, IAB-001, PD-001, PD-002 (ACCEPTED 2026-11-11); `docs/CONTENT_MODEL.md`, `docs/ARCHITECTURE.md`, `docs/SITEMAP.md`.

## Implementation approach

- Parse `.pages.yml` bằng `js-yaml` (ADR-001 Amendment 2); không thêm parser khác.

## Phải giữ nguyên

- Schema CP1-02.

## Code bị thay / xóa

- không có (thêm mới).

## Acceptance Criteria

1. Mọi field schema (`src/lib/schema.js`) có trong `.pages.yml` và ngược lại.
2. Field bắt buộc khớp `required`.
3. Không có path ngoài `src/content/**`, `public/media/**`.
4. Mọi field `rich-text` có `options.format: markdown` và `options.switcher: false` (ADR-001 Amendment 2); media chỉ `categories: [image]`.
5. Ghi kết quả thử thật trên Pages CMS: dán từ Word/email, bảng, tiêu đề, gạch chân → Markdown sau khi lưu và hiển thị trên site.

## Required verification

- `npm test` (cms-config.test.mjs) — AC1–AC3
- Kiểm cú pháp trên Pages CMS thật ở CP2-03

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
