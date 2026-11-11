# Task: CP1-02 — Content collections + helper lọc published + seed 9 danh mục

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
- Parallel group: —
- Owned paths: `src/lib/schema.js`, `src/lib/content.js`, `src/_data/bulletin.js` (global `bulletin` — `content` là key Eleventy giữ riêng, phát hiện khi implement 2026-11-11), `src/content/categories/*.yml`, `src/content/settings/site.json`, `src/content/{announcements,guides,resources,faq}/.gitkeep`, `tests/content.test.mjs`, `tests/markdown.test.mjs`, `tests/fixtures/**`, `scripts/check.mjs` (mới), `package.json` (chỉ `scripts`)
- Dependencies: CP1-01
- Base commit / branch: `263434e` (stacked trên `cp1/CP1-01-scaffold`, chưa merge `main` — HUMAN LEAD 2026-11-11); branch `cp1/CP1-02-content-collections`
- Human Lead approval: inherited from boundary IAB-001
- Implementation authorized: YES

Lifecycle: `boundary` mode = `DRAFT → IN_PROGRESS → READY`. DONE suy ra từ Git sau khi merge.

## Goal

Schema 6 collection theo `docs/CONTENT_MODEL.md`, một helper duy nhất lọc `published`, sắp xếp, resolve danh mục mềm; seed 9 danh mục trung tính và settings rỗng.

## Scope

- In scope: validator schema thuần JS (`src/lib/schema.js`, không Zod — ADR-001 Amendment 2), đọc file bằng `js-yaml`; helper `getPublished*`, `resolveCategory` (fallback "Khác"), sort; seed đúng bảng §4 CONTENT_MODEL (drive_folder_url trống).
- In scope (non-blocking note CP1-01, HUMAN LEAD 2026-11-11): (a) tách script `check` one-liner thành `scripts/check.mjs` = `node --check` mọi `.js` của project + validate `src/content/**` bằng `src/lib/schema.js`; (b) `dev` watch cả Tailwind nếu gọn, không thêm dependency; (c) test Markdown `html: false` (HTML thô bị escape).
- Out of scope: Thông báo/hướng dẫn/FAQ/tài liệu thật hoặc giả; liên hệ; trang UI; dependency mới.

## Authority / key decisions

- REQ-001, ADR-001, ADR-002, IAB-001, PD-001, PD-002 (ACCEPTED 2026-11-11); `docs/CONTENT_MODEL.md`, `docs/ARCHITECTURE.md`, `docs/SITEMAP.md`.

## Implementation approach

- Fixture test (thư mục `tests/fixtures`) chứa entry giả *chỉ dùng cho test*, không nằm trong `src/content`.

## Phải giữ nguyên

- Kết quả CP1-01.

## Code bị thay / xóa

- không có (thêm mới).

## Acceptance Criteria

1. Build PASS với 9 danh mục seed, 0 thông báo.
2. Helper loại entry `published=false`; danh mục ẩn/không tồn tại → "Khác" + cảnh báo build, không fail.
3. Không có nội dung học vụ ngoài tên + mô tả trung tính 1 câu.
4. `npm run check` fail (exit ≠ 0) khi entry trong `src/content` sai schema (field bắt buộc thiếu, `slug`/URL sai pattern); Markdown chứa HTML thô được escape.

## Required verification

- `npm test` (content.test.mjs) — AC2
- `npm run build` — AC1
- Review diff `src/content/**` — AC3
- `npm run check` (+ fixture sai schema qua test) — AC4; `npm run verify` toàn bộ

Tất cả required verification phải chạy và PASS trước READY.

## Manual test checklist (Tech Lead)

Task không chạm security model / quyền bên thứ ba; manual test sau automated verification là điểm danh.

- [x] Kiểm trên điện thoại thật hoặc DevTools 360px (nếu có UI) — N/A: task không đổi UI.

## Result

**Trạng thái: READY** — 2026-11-11, sau vòng sửa 2.

- Main changes: `src/lib/schema.js` (schema 6 collection theo CONTENT_MODEL §2, `validateEntry`, export `schemas` cho CP2-01); `src/lib/content.js` (đọc `.yml`/`.md` front matter/`.json` bằng `js-yaml`, một cổng lọc `published`, sort, `resolveCategory` fallback "Khác" + `console.warn`, entry sai schema → cảnh báo + bỏ qua khi build); `src/_data/bulletin.js` (global `bulletin`); seed 9 `src/content/categories/*.yml` (mô tả trung tính 1 câu, `drive_folder_url: ""`), `src/content/settings/site.json` (chỉ `site_title`), `.gitkeep` ×4; `scripts/check.mjs` (`node --check` + validate `src/content/**`, exit 1 khi lỗi); `package.json` scripts `check`, `dev` (Tailwind `--watch` song song `eleventy --serve`).
- Tests (ORCHESTRATOR chạy lại ngoài sandbox sau vòng 2): `npm run verify` exit 0 — `npm run check` PASS, `npm test` 10/10 (content 6, markdown 1, url 3), `npm run build` 2 trang (9 danh mục, 0 thông báo), framework-check PASS; `npm audit` 0 vulnerabilities; `npm run dev` phục vụ `/it-academic-bulletin/` + `assets/site.css` HTTP 200. Grep `src/content` + `tests/fixtures`: không email, không Drive ID, URL duy nhất `https://example.org/fixture` (fixture).
- AC → test: AC1 test seed + `npm run build`; AC2 `content.test.mjs` (lọc/sort/fallback + cảnh báo); AC3 test seed + review diff `src/content/**` (ORCHESTRATOR đọc đủ 9 file + settings); AC4 test checker với `tests/fixtures/invalid` (exit ≠ 0) + `markdown.test.mjs` (Eleventy API, `<script>`/`<b>` bị escape).
- Diff + / − (app + seed + scripts, test + fixtures): ≈ +338 / −2 và +449 / −0 (tổng +787 / −2).
- Helper mới: `validateEntry`, `readEntries`, `getPublished*`, `getHomeAnnouncements`, `resolveCategory`, `getContent` — Codex grep `rg -n 'validateEntry|getPublished|resolveCategory|front.?matter|schema|sort\(' src scripts tests`; repo chỉ có helper URL.
- Review: vòng 1 — Codex BLOCKED đúng: `content` là key global data Eleventy giữ riêng → ORCHESTRATOR đổi tên `src/_data/bulletin.js` (contract + `docs/ARCHITECTURE.md`, commit `9ba7ee3`). Vòng 2 — 1 blocking: field tùy chọn rỗng trong YAML (`deadline:`) parse thành `null` bị coi là sai kiểu → bài `published: true` bị bỏ khỏi build; đã sửa (null tùy chọn = vắng mặt) + case test. Non-blocking: `resolveCategory` cảnh báo mỗi entry (có thể lặp); `timeout npm run dev` không kill tiến trình con (Ctrl+C trong terminal kill cả process group — chấp nhận).
- Pilot evidence: Codex CLI 0.166.0, model `gpt-6.1-sol`, session `01a1ca15-a52c-7893-a45b-8471304e6295`; vòng đầu effort `high` 10:09:38→10:14:32 UTC, 47,977 tokens; vòng sửa 1 (`resume`, `medium`) tích lũy 113,245; vòng sửa 2 tích lũy 119,781. Quota trước mỗi lần giao: 5 giờ 12 % / 16 % / 18 %, tuần 78 %. Codex không commit/push, không sửa ngoài Owned paths.
- Important findings / decisions: global data tên `bulletin` (không phải `content`); sandbox Codex chặn socket (dev server) và pipe subprocess (`EPERM`) — test checker dùng file descriptor tạm.
- Known limitations: chưa có trang dùng `bulletin` (CP1-03/04); `drive_folder_url` trống chờ D-06.
- PR: — (chưa push; HUMAN LEAD quyết integration).
