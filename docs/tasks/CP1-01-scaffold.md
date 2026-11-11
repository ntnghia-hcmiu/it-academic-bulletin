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

**Trạng thái: BLOCKED (2026-11-11, sau vòng sửa 1)** — decision gate bảo mật: Astro 6 có advisory critical (xem dưới). Code scaffold trong working tree, chưa commit.

- Main changes (Codex, untracked): `.gitignore`, `package.json`, `package-lock.json`, `astro.config.mjs`, `tsconfig.json`, `src/lib/url.ts` (`joinBase`, `url`), `src/layouts/Base.astro`, `src/styles/global.css`, `src/pages/index.astro`, `src/pages/404.astro`, `tests/url.test.mjs`. Dependency: astro 7.4.10, @astrojs/check 0.9.12, typescript 6.0.3, tailwindcss + @tailwindcss/vite 4.3.5.
- ORCHESTRATOR micro-fix: script `test` → `node --test tests/*.test.mjs` (Node 24 không nhận thư mục); `engines.node` → `>=22.23.4` (yêu cầu của astro 7.4.10); contract `Implementation authorized: YES` (checker không nhận hậu tố).
- Tests (ORCHESTRATOR chạy lại ngoài sandbox): `npm test` PASS 3/3; `node scripts/framework-check.mjs` PASS; `npm run check` / `npm run build` **FAIL exit 132 `Illegal instruction`**; grep `dist/` và DevTools 360px **NOT RUN** (không có build).
- Root cause: `@astrojs/compiler-binding-linux-x64-gnu` (compiler Rust native của Astro 7) dùng lệnh AVX/AVX2; CPU ảo của máy dev (Xeon Silver 4216, chỉ expose SSE4.2/BMI2, không có avx/avx2) không hỗ trợ → SIGILL khi `dlopen`. Các native binding khác (rolldown, lightningcss, oxide, sharp) nạp được. Thử fallback WASI (`@astrojs/compiler-binding-wasm32-wasi` + `NAPI_RS_NATIVE_LIBRARY_PATH`, cài trong scratch) thất bại: biến môi trường áp cho mọi package napi-rs (rolldown nạp nhầm binding). GitHub Actions runner có AVX2 → dự kiến chỉ ảnh hưởng máy dev.
- Diff + / − (app, test): +5952 / −0 (gồm `package-lock.json` 5619); app/test không tính lockfile ≈ +333.
- Helper mới: `joinBase()` + `url()` — repo chưa có source app (Codex đã grep), không có helper để tái dùng.
- Review: 0 blocking finding về code; non-blocking: hai `<nav>` cùng `aria-label` (một cái `display:none` theo breakpoint — chấp nhận).
- Pilot evidence: Codex CLI 0.166.0, model `gpt-6.1-sol`, effort `high`, session `01a1c9c4-e9b6-7100-a0b7-5dc11348f054`, 77,405 tokens, 08:41:27→08:46:31 UTC (≈ 5 phút); quota trước khi giao: 5 giờ 3 %, tuần 76 %. Codex không commit/push, không sửa ngoài Owned paths, báo BLOCKED trung thực (không claim PASS).
- Vòng sửa 1 (sau ADR-001 Amendment 1): Codex resume cùng session, effort `medium`, 08:53:36→08:56:08 UTC, tổng session 144,686 tokens; hạ `astro` 6.4.8, `engines.node >=22.12.0`, `npm dedupe` (Vite 7.3.8 dùng chung). Không đổi source.
- Verification ORCHESTRATOR chạy lại (ngoài sandbox, sau vòng 1): `npm run check` 0 lỗi/0 cảnh báo; `npm test` 3/3; `npm run build` 2 trang; grep `dist/`: 29/29 `href`/`src` nội bộ có prefix `/it-academic-bulletin/`, `BASE_PATH=/` 29/29 prefix `/`; canonical tuyệt đối đúng; `node scripts/framework-check.mjs` PASS. AC3 (360px + Tab) **NOT RUN** — máy không có trình duyệt; chờ Tech Lead kiểm thủ công.
- **Security finding (blocking, decision gate):** `npm audit` — `astro <=7.3.1` critical (GHSA-f48w-9m4c-m7f5, GHSA-7pw4-f3q4-r2p2, GHSA-4g3v-8h47-v7g6, GHSA-26w7-cxv4-gfx2 RCE AVIF, GHSA-376h-93r7-7g6f, GHSA-98hj-9722-w3j8); `sharp <=0.35.5-rc.1` high; `esbuild` low (dev server Windows). 6.4.8 là bản 6.x mới nhất — bản sửa chỉ có ở 7.x. Cần HUMAN LEAD quyết.
- Non-blocking: trang 404 có canonical `/404/` (nên bỏ canonical/thêm `noindex` ở CP1-06).
- Known limitations: AC3 chờ kiểm thủ công.
- PR: —
