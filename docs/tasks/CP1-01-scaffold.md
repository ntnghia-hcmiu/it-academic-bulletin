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
- Implementation authorized: YES (IAB-001)

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

- Main changes:
- Tests:
- Diff + / − (app, test):
- Helper mới (đã tìm, lý do không tái dùng):
- Review:
- Important findings / decisions:
- Known limitations:
- PR:
