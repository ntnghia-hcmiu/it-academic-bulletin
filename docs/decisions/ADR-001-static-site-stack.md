# ADR-001 — Static site stack & dependencies

| Metadata | Value |
|---|---|
| Status | ACCEPTED (Amendment 2 — Eleventy 3, chờ HUMAN LEAD duyệt nội dung chi tiết) |
| Date | 2026-11-11 (gốc) · 2026-11-11 (Amendment 1, Amendment 2) |
| Decision owner | HUMAN LEAD — ACCEPTED 2026-11-11 ("duyệt tất cả", phiên CP0); Amendment 2: "chọn Eleventy 3" (phiên CP1-01) |
| Gate | architecture + dependency (`docs/ai/workflow.md` §3) |
| Source | PROJECT_BRIEF v1.1 §3 (đề xuất trong brief, không phải approval) |

## Context

Cần website công khai, chi phí 0, không backend, thư ký sửa nội dung qua web, sinh viên dùng điện thoại. Brief đề xuất Astro + TypeScript + Tailwind + Pages CMS + GitHub Pages + link Google Drive. Lựa chọn Astro bị thay ở Amendment 2 (lý do: Amendment 1–2).

## Decision (hiện hành — Amendment 2)

| Thành phần | Lựa chọn | Phiên bản (npm 2026-11-11) | Ghi chú |
|---|---|---|---|
| Static site | `@11ty/eleventy` | 3.1.8 (major 3) | JS thuần, không compiler native; Node ≥ 18; template Nunjucks (`.njk`); Markdown qua markdown-it có sẵn của Eleventy, cấu hình `html: false` |
| Đọc nội dung | `js-yaml` | major 4 (đã là dependency của Eleventy; khai trực tiếp) | đọc `src/content/**` (`.yml`, front matter `.md`) trong helper thuần `src/lib/content.js`; `.json` bằng `JSON.parse` |
| Ngôn ngữ | JavaScript ESM + JSDoc | — | **bỏ TypeScript / `astro check`**; bù bằng validator schema thuần (`src/lib/schema.js`) có test, build fail khi entry thiếu field bắt buộc |
| CSS | `tailwindcss` + `@tailwindcss/cli` | 4.3.5 | Tailwind v4 qua CLI (không Vite) |
| Base path | `HtmlBasePlugin` (built-in Eleventy 3) + `pathPrefix` từ env `BASE_PATH` | — | HTML được rewrite tự động; helper `src/lib/url.js` cho JSON/XML/canonical |
| Sitemap | template Eleventy (`sitemap.xml.njk`) từ dữ liệu đã lọc | — | **không dependency** (bỏ `@astrojs/sitemap`) |
| Tìm kiếm | **không thêm dependency**: chỉ mục JSON build-time + script client nhỏ, chuẩn hóa bỏ dấu tiếng Việt | — | đủ cho quy mô vài trăm thông báo |
| Test | `node --test` (stdlib) + script kiểm `dist/` | — | không thêm Vitest/Playwright ở MVP |
| CMS | Pages CMS hosted (app.pagescms.org) + `.pages.yml` | — | độc lập framework (chỉ sửa file trong repo) — xem ADR-002 |
| Hosting | GitHub Pages qua GitHub Actions (build tay + `actions/upload-pages-artifact` + `actions/deploy-pages@v5`) | — | bỏ `withastro/action` |

Dependency proposal theo `docs/ai/workflow.md` §3:

```text
Library: @11ty/eleventy, js-yaml, tailwindcss, @tailwindcss/cli
Purpose: build site tĩnh từ Markdown/YAML/JSON do CMS ghi, CSS utility
Why current stack is insufficient: Astro 7 không chạy trên VM dev (thiếu AVX2); Astro 6 có advisory critical chưa vá
Alternative: Astro 7 + VM có AVX2; Hugo (Go template); Jekyll (Ruby)
Impact: devDependencies npm; lockfile commit; cập nhật major cần decision mới
```

Không thêm dependency khác trong CP1–CP3 nếu không có decision mới (Pagefind, Playwright, Vitest, gray-matter, icon/UI lib… đều ngoài boundary).

## Consequences

- Toàn bộ site là HTML/CSS/JS tĩnh; bài `published=false` bị lọc ở build bởi một helper duy nhất (`src/lib/content.js`) trước khi sinh trang, chỉ mục, sitemap.
- Mất type-check tĩnh của Astro; an toàn dữ liệu dựa vào validator schema + `node --test` + `scripts/verify-dist.mjs`.
- Thay đổi base path khi chuyển sang domain riêng chỉ cần đổi `SITE_URL`/`BASE_PATH` (và `public/CNAME`).
- Phiên bản pin bằng `package-lock.json`; `npm audit` không có advisory high/critical là điều kiện READY của task chạm dependency.

## Amendment 2 — Eleventy 3 thay Astro (2026-11-11)

- **Quyết định:** HUMAN LEAD 2026-11-11 (phiên CP1-01: "chọn Eleventy 3"). Bảng Decision ở trên thay bảng Astro gốc; Amendment 1 hết hiệu lực.
- **Lý do:** Astro 7 không chạy trên VM dev (Amendment 1); Astro 6.4.8 (bản 6.x cuối) có `npm audit` critical — `astro <=7.3.1`: GHSA-f48w-9m4c-m7f5, GHSA-7pw4-f3q4-r2p2, GHSA-4g3v-8h47-v7g6, GHSA-26w7-cxv4-gfx2, GHSA-376h-93r7-7g6f, GHSA-98hj-9722-w3j8 — bản vá chỉ có ở 7.x. Evidence: `docs/tasks/CP1-01-scaffold.md` Result.
- **Đã kiểm (scratch, 2026-11-11):** `@11ty/eleventy` 3.1.8 + `tailwindcss`/`@tailwindcss/cli` 4.3.5 → build Markdown với `--pathprefix` PASS trên VM dev; `npm audit` 0 vulnerabilities; native binary (lightningcss, tailwind oxide, watcher) nạp được.
- **Phạm vi ảnh hưởng:** `docs/ARCHITECTURE.md` §2–§3, `docs/CONTENT_MODEL.md` (tên helper), `docs/ai/project-profile.md` (module map, Test policy), IAB-001 §1/§4, contract CP1-01…CP1-06, CP2-01, CP3-01 — sửa cùng commit.

## Amendment 1 — Astro major 6 (2026-11-11) — SUPERSEDED bởi Amendment 2

- Quyết định HUMAN LEAD 2026-11-11 ("quay lại hướng 2 (hạ xuống Astro 6)"): Astro 6.4.8 thay 7.4.10.
- Lý do: compiler native Rust của Astro 7 (`@astrojs/compiler-binding-linux-x64-gnu`) cần AVX/AVX2; VM dev (VMware, CPU ảo không expose `avx`/`avx2`/`xsave`) crash `Illegal instruction`.
- Bị thay vì `npm audit` critical (Amendment 2).

## Open points

- Xác nhận Pages CMS rich-text ghi Markdown vào `body` tương thích markdown-it với `html: false` (kiểm ở CP2-01).
