# Task: CP2-01 — Cấu hình `.pages.yml` khớp content model

## Status / Approval

- Status: READY
- Type: FEATURE
- Change class: S1
- Owner: HUMAN LEAD (tech owner)
- Execution profile: dual-agent
- Orchestrator: claude-code
- Implementer: codex — `codex exec` (PD-002), ORCHESTRATOR Claude Code review
- Human Lead: tech owner
- Authorization mode: boundary
- Authorization source: IAB-001 (ACCEPTED 2026-11-11)
- Parallel group: P1 = CP1-03 ‖ CP2-01 (PD-001; worktree riêng)
- Owned paths: `.pages.yml`, `tests/cms-config.test.mjs`
- Dependencies: CP1-02
- Base commit / branch: `258faa7` (HEAD CP1-02); branch `cp2/CP2-01-pages-cms-config`, worktree `../IAB-wt/CP2-01`
- Human Lead approval: inherited from boundary IAB-001
- Implementation authorized: YES

Lifecycle: `boundary` mode = `DRAFT → IN_PROGRESS → READY`. DONE suy ra từ Git sau khi merge.

## Goal

Thư ký thấy 6 nhóm nội dung với nhãn/mô tả tiếng Việt, trường bắt buộc, không thấy cấu hình kỹ thuật.

## Scope

- In scope: Ánh xạ §2 CONTENT_MODEL; operations (rename false); media `public/media`; không đặt `settings.commit.identity` (dùng mặc định Pages CMS) tới khi D-04 chốt — HUMAN LEAD 2026-11-11; test so tên field `.pages.yml` ↔ schema.
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
5. Không có key `commit.identity` (D-04 chưa chốt).

AC thử thật trên Pages CMS (dán Word/email, bảng, tiêu đề, gạch chân → Markdown) chuyển sang CP2-03 AC5 (HUMAN LEAD 2026-11-11).

## Required verification

- `npm test` (cms-config.test.mjs) — AC1–AC5
- `npm run verify` toàn bộ (ORCHESTRATOR, ngoài sandbox)

Tất cả required verification phải chạy và PASS trước READY.

## Manual test checklist (Tech Lead)

Task không chạm security model / quyền bên thứ ba; manual test sau automated verification là điểm danh.

- [x] Không có UI site (chỉ cấu hình CMS) — N/A; giao diện CMS thật kiểm ở CP2-03.

## Result

- Main changes: `.pages.yml` — 6 nhóm (Thông báo, Danh mục học vụ, Hướng dẫn, Biểu mẫu / Tài liệu, Câu hỏi thường gặp, Cài đặt trang & Liên hệ), nhãn/mô tả tiếng Việt, field 1-1 với `src/lib/schema.js` (kể cả object list lồng nhau), `rename: false`, settings dạng `file` không create/delete, media `public/media` → `/media` chỉ image, rich-text `format: markdown` + `switcher: false`, không có `commit.identity`.
- Tests: `tests/cms-config.test.mjs` 6 test (AC1–AC5 + storage/filename/operations theo CONTENT_MODEL). ORCHESTRATOR chạy `npm run verify` ngoài sandbox 2026-11-11: check PASS, `npm test` 16/16 PASS, build PASS, framework-check PASS.
- Diff + / − (app, test): app +0/−0; cấu hình `.pages.yml` +241/−0; test +119/−0.
- Helper mới (đã tìm, lý do không tái dùng): chỉ trong test — `fieldPairs`, `allFields`, `entries`; Codex grep `rg -n 'schema|yaml|fields|rich-text|reference|pattern|walk' src/lib src/_includes tests`, chưa có helper đối chiếu cấu hình CMS.
- Review: ORCHESTRATOR review vòng 1 — 0 blocking. Đối chiếu CONTENT_MODEL §A (`value: "{name}"`, `label: "{fields.name}"`), filename pattern, required/default. URL media `/media/...` trong HTML được `HtmlBasePlugin` thêm base path.
- Pilot evidence: Codex CLI 0.166.0, model `gpt-6.1-sol`, effort `high`, session `01a1ca26-8ce2-7a81-97bc-27e33580743a`, 10:28→10:31 UTC, 69,429 tokens. Quota trước khi giao: 5 giờ 19 %, tuần 79 %. Chạy song song với CP1-03 (worktree riêng). Codex không commit, không sửa ngoài Owned paths.
- Important findings / decisions: HUMAN LEAD 2026-11-11 — không đặt `commit.identity` tới khi D-04 chốt; AC thử dán rich-text chuyển sang CP2-03 AC5.
- Known limitations: chỉ kiểm được trên Pages CMS thật (CP2-03): (1) reference `value: "{name}"` lưu slug hay tên file kèm `.yml`; (2) `{primary}` slugify có bỏ dấu tiếng Việt không (CONTENT_MODEL dòng 27) — nếu không, thêm field `slug` cho announcements/guides/faq/resources; (3) hành vi `deadline` default `""` khi lưu.
- PR: chưa; branch đã push (HUMAN LEAD 2026-11-11).
