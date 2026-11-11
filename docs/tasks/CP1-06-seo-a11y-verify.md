# Task: CP1-06 — SEO, sitemap, a11y pass, script verify-dist

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
- Owned paths: `scripts/verify-dist.mjs`, `src/pages/sitemap.xml.njk`, `public/robots.txt`, `package.json` (script verify), sửa a11y nhỏ trong `src/_includes/**`; mở rộng bởi ORCHESTRATOR 2026-11-11: `tests/verify-dist.test.mjs` (test âm AC1), `src/pages/robots.txt.njk` thay cho `public/robots.txt` (robots cần URL sitemap tuyệt đối theo `site.url` + base path, file tĩnh không biết base)
- Dependencies: CP1-03, CP1-04, CP1-05
- Base commit / branch: `6010fce` (`main` sau merge CP1-05); branch `cp1/CP1-06-seo-a11y-verify`
- Human Lead approval: inherited from boundary IAB-001
- Implementation authorized: YES

Lifecycle: `boundary` mode = `DRAFT → IN_PROGRESS → READY`. DONE suy ra từ Git sau khi merge.

## Goal

Tự động chứng minh: không lộ bài ẩn, link nội bộ không gãy, base path đúng; sitemap/canonical; a11y cơ bản.

## Scope

- In scope: verify-dist: quét `dist/**/*.html|json|xml` cho id/tiêu đề fixture ẩn, link nội bộ tồn tại, mọi link có base; sitemap template Eleventy chỉ từ dữ liệu đã lọc (không dependency).
- Out of scope: Lighthouse CI, Playwright.

## Authority / key decisions

- REQ-001, ADR-001, ADR-002, IAB-001, PD-001, PD-002 (ACCEPTED 2026-11-11); `docs/CONTENT_MODEL.md`, `docs/ARCHITECTURE.md`, `docs/SITEMAP.md`.

## Implementation approach

- Node stdlib.

## Phải giữ nguyên

- Hành vi CP1-01…05.

## Code bị thay / xóa

- không có (thêm mới).

## Acceptance Criteria

1. `npm run verify` FAIL khi cố ý đưa bài ẩn vào output (test âm).
2. 0 link nội bộ gãy.
3. Mỗi trang có title, description, canonical; sitemap không chứa trang ẩn.

## Required verification

- `npm run verify` — AC1–AC3
- Test âm cho verify-dist — AC1

Tất cả required verification phải chạy và PASS trước READY.

## Manual test checklist (Tech Lead)

Task không chạm security model / quyền bên thứ ba; manual test sau automated verification là điểm danh.

- [ ] Kiểm trên điện thoại thật hoặc DevTools 360px (nếu có UI).

## Result

- Main changes: `scripts/verify-dist.mjs` (Node stdlib; bài ẩn mọi collection có publish gate qua `readEntries` — route + tiêu đề thô/escape trong html/json/xml/js; link `href`/`src` nội bộ có base path và file tồn tại; mỗi trang không noindex có title, description, canonical tuyệt đối đúng; sitemap `<loc>` tuyệt đối, tồn tại, không noindex/bài ẩn); `/sitemap.xml` (trang HTML không phân trang + chi tiết danh mục/thông báo/hướng dẫn đã published); `/robots.txt` trỏ sitemap tuyệt đối; `verify` thêm `verify-dist` sau build; `aria-current="page"` cho menu.
- Tests: `tests/verify-dist.test.mjs` 37 test (PASS trên fixture; test âm: tiêu đề ẩn thô/escape trong HTML/JSON/XML/JS, route ẩn, link gãy, thiếu/sai base, thiếu title/description/canonical, sitemap thiếu/chứa bài ẩn/noindex/URL ngoài site). ORCHESTRATOR chạy `npm run verify` ngoài sandbox 2026-11-11: PASS, test 72/72, verify-dist PASS trên build thật. Probe ORCHESTRATOR: build nội dung demo + chèn tiêu đề bài `published=false` vào `index.html` → verify-dist FAIL đúng.
- Diff + / − (app, test): app/config +190/−2; test +176/−0.
- Helper mới (đã tìm, lý do không tái dùng): `filesIn`, `decodeEntities`, `tagsIn`, `localTarget` trong `scripts/verify-dist.mjs` — chưa có helper duyệt output/parse HTML; tái dùng `readEntries`, `schemas`, `joinBase`, `absoluteUrl`, `site`.
- Review: ORCHESTRATOR vòng 1: 0 blocking. Non-blocking: dò tiêu đề ẩn theo chuỗi con → tiêu đề ẩn rất ngắn có thể FAIL giả (an toàn theo hướng chặn); tiêu đề ẩn trùng hệt tiêu đề published được miễn dò chuỗi (route vẫn kiểm).
- Pilot evidence: Codex CLI 0.166.0, model `gpt-6.1-sol`, effort `high`, 11:40→11:45 UTC, 52,396 tokens. Quota trước khi giao: 5 giờ 14 % / tuần 83 %. Codex không commit, không sửa ngoài Owned paths.
- Important findings / decisions: chọn tên `sitemap.xml` (contract) thay `sitemap-index.xml` (`docs/SITEMAP.md` — cần đồng bộ tài liệu sau). Owned paths mở rộng: `tests/verify-dist.test.mjs`, `src/pages/robots.txt.njk` thay `public/robots.txt`.
- Known limitations: GitHub Pages project site → `robots.txt` nằm dưới base path, crawler không đọc; có hiệu lực khi có domain riêng (D-05). Manual 360px: không có thay đổi giao diện ngoài `aria-current`.
- PR:
