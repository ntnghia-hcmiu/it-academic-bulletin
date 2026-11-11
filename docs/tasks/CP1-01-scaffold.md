# Task: CP1-01 — Scaffold Astro + TypeScript + Tailwind, base path, layout shell (PILOT S1 — P2)

## Status / Approval

- Status: IN_PROGRESS
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
- Owned paths: `package.json`, `package-lock.json`, `astro.config.mjs`, `tsconfig.json`, `src/layouts/**`, `src/lib/url.ts`, `src/styles/**`, `src/pages/index.astro` (khung), `src/pages/404.astro`, `tests/url.test.mjs`, `.gitignore`
- Dependencies: none
- Base commit / branch: `23c8edb` (origin/cp0/framework-adoption); branch `cp1/CP1-01-scaffold`
- Human Lead approval: inherited from boundary IAB-001
- Implementation authorized: YES

Lifecycle: `boundary` mode = `DRAFT → IN_PROGRESS → READY`. DONE suy ra từ Git sau khi merge.

## Goal

Có dự án Astro build được thành site tĩnh với layout responsive tiếng Việt, header/nav/footer, skip-link, và mọi link nội bộ đúng base path `/it-academic-bulletin/`. Đồng thời là **pilot S1** Claude Code ORCHESTRATOR → Codex IMPLEMENTER (PD-002).

## Scope

- In scope: Cài dependency theo ADR-001; script npm `dev`, `build`, `check`, `test`, `verify`; `site`/`base` từ env với mặc định `https://ntnghia-hcmiu.github.io` + `/it-academic-bulletin`; helper `url()`; layout Base với `<html lang="vi">`, title/description/canonical; 404.
- Out of scope: Content collections, trang nội dung, CMS, workflow deploy, logo IU.

## Authority / key decisions

- REQ-001, ADR-001, ADR-002, IAB-001, PD-001, PD-002 (ACCEPTED 2026-11-11); `docs/CONTENT_MODEL.md`, `docs/ARCHITECTURE.md`, `docs/SITEMAP.md`.

## Implementation approach

- `npm create astro` tối thiểu (hoặc tạo tay) → thêm Tailwind v4 qua `@tailwindcss/vite` → layout Base. Codex chạy với `npm_config_cache=$PWD/.npm-cache` (thêm `.npm-cache/` vào `.gitignore`). Ghi evidence pilot: Codex session id, model, effort, tokens, thời gian; lệnh verification ORCHESTRATOR tự chạy lại.

## Phải giữ nguyên

- Toàn bộ file framework (`AGENTS.md`, `docs/ai/**`, `adapters/**`, `.claude/**`, `scripts/framework-check.mjs`).

## Code bị thay / xóa

- không có (thêm mới).

## Acceptance Criteria

1. `npm run build` tạo `dist/` tĩnh; `npm run check` 0 lỗi.
2. Mọi `href`/`src` nội bộ trong `dist/` bắt đầu bằng `/it-academic-bulletin/`; build với `BASE_PATH=/` cho link gốc `/`.
3. Layout ở 360px không cuộn ngang; skip-link + focus nhìn thấy được.
4. `node scripts/framework-check.mjs` vẫn PASS.

## Required verification

- `npm run check && npm test && npm run build`
- `node --test tests/url.test.mjs` — AC2
- grep link trong `dist/` (tạm thời, trước CP1-06) — AC2
- `node scripts/framework-check.mjs` — AC4
- Thủ công: DevTools 360px + Tab — AC3

Tất cả required verification phải chạy và PASS trước READY.

## Manual test checklist (Tech Lead)

Task không chạm security model / quyền bên thứ ba; manual test sau automated verification là điểm danh.

- [ ] Kiểm trên điện thoại thật hoặc DevTools 360px (nếu có UI).

## Result

**Trạng thái: BLOCKED (2026-11-11)** — decision gate môi trường/dependency; code scaffold có trong working tree, chưa commit.

- Main changes (Codex, untracked): `.gitignore`, `package.json`, `package-lock.json`, `astro.config.mjs`, `tsconfig.json`, `src/lib/url.ts` (`joinBase`, `url`), `src/layouts/Base.astro`, `src/styles/global.css`, `src/pages/index.astro`, `src/pages/404.astro`, `tests/url.test.mjs`. Dependency: astro 7.4.10, @astrojs/check 0.9.12, typescript 6.0.3, tailwindcss + @tailwindcss/vite 4.3.5.
- ORCHESTRATOR micro-fix: script `test` → `node --test tests/*.test.mjs` (Node 24 không nhận thư mục); `engines.node` → `>=22.23.4` (yêu cầu của astro 7.4.10); contract `Implementation authorized: YES` (checker không nhận hậu tố).
- Tests (ORCHESTRATOR chạy lại ngoài sandbox): `npm test` PASS 3/3; `node scripts/framework-check.mjs` PASS; `npm run check` / `npm run build` **FAIL exit 132 `Illegal instruction`**; grep `dist/` và DevTools 360px **NOT RUN** (không có build).
- Root cause: `@astrojs/compiler-binding-linux-x64-gnu` (compiler Rust native của Astro 7) dùng lệnh AVX/AVX2; CPU ảo của máy dev (Xeon Silver 4216, chỉ expose SSE4.2/BMI2, không có avx/avx2) không hỗ trợ → SIGILL khi `dlopen`. Các native binding khác (rolldown, lightningcss, oxide, sharp) nạp được. Thử fallback WASI (`@astrojs/compiler-binding-wasm32-wasi` + `NAPI_RS_NATIVE_LIBRARY_PATH`, cài trong scratch) thất bại: biến môi trường áp cho mọi package napi-rs (rolldown nạp nhầm binding). GitHub Actions runner có AVX2 → dự kiến chỉ ảnh hưởng máy dev.
- Diff + / − (app, test): +5952 / −0 (gồm `package-lock.json` 5619); app/test không tính lockfile ≈ +333.
- Helper mới: `joinBase()` + `url()` — repo chưa có source app (Codex đã grep), không có helper để tái dùng.
- Review: 0 blocking finding về code; non-blocking: hai `<nav>` cùng `aria-label` (một cái `display:none` theo breakpoint — chấp nhận).
- Pilot evidence: Codex CLI 0.166.0, model `gpt-6.1-sol`, effort `high`, session `01a1c9c4-e9b6-7100-a0b7-5dc11348f054`, 77,405 tokens, 08:41:27→08:46:31 UTC (≈ 5 phút); quota trước khi giao: 5 giờ 3 %, tuần 76 %. Codex không commit/push, không sửa ngoài Owned paths, báo BLOCKED trung thực (không claim PASS).
- Known limitations: AC1–AC3 chưa chứng minh được trên máy này.
- PR: —
