# ADR-001 — Static site stack & dependencies

| Metadata | Value |
|---|---|
| Status | ACCEPTED |
| Date | 2026-11-11 |
| Decision owner | HUMAN LEAD — ACCEPTED 2026-11-11 ("duyệt tất cả", phiên CP0) |
| Gate | architecture + dependency (`docs/ai/workflow.md` §3) |
| Source | PROJECT_BRIEF v1.1 §3 (đề xuất trong brief, không phải approval) |

## Context

Cần website công khai, chi phí 0, không backend, thư ký sửa nội dung qua web, sinh viên dùng điện thoại. Brief đề xuất Astro + TypeScript + Tailwind + Pages CMS + GitHub Pages + link Google Drive.

## Decision (đề xuất)

| Thành phần | Lựa chọn | Phiên bản (npm 2026-11-11) | Ghi chú |
|---|---|---|---|
| Static site | `astro` | **6.4.8 (major 6)** — sửa 2026-11-11, xem Amendment 1 | content collections (`src/content.config.ts`, `glob` loader); output tĩnh |
| Ngôn ngữ | `typescript` + `@astrojs/check` | stable hiện hành | `astro check` là verification |
| CSS | `tailwindcss` + `@tailwindcss/vite` | 4.3.5 | Tailwind v4 qua Vite plugin |
| Sitemap | `@astrojs/sitemap` | stable hiện hành | SEO cơ bản |
| Tìm kiếm | **không thêm dependency**: chỉ mục JSON build-time + script client nhỏ, chuẩn hóa bỏ dấu tiếng Việt | — | đủ cho quy mô vài trăm thông báo |
| Test | `node --test` (stdlib) + script kiểm `dist/` | — | không thêm Vitest/Playwright ở MVP |
| CMS | Pages CMS hosted (app.pagescms.org) + `.pages.yml` | — | dịch vụ bên thứ ba, cần GitHub App — xem ADR-002 |
| Hosting | GitHub Pages qua GitHub Actions (`withastro/action@v6`, `actions/deploy-pages@v5`) | — | `site` + `base` cho project page |

Dependency proposal theo `docs/ai/workflow.md` §3:

```text
Library: astro, @astrojs/check, typescript, tailwindcss, @tailwindcss/vite, @astrojs/sitemap
Purpose: build site tĩnh có content collections typed, CSS utility, sitemap
Why current stack is insufficient: chưa có stack; HTML tay không đáp ứng CMS + collections + build
Alternative: Eleventy (ít typed hơn), Hugo (Go template, khó cho người bảo trì JS), Jekyll (Ruby)
Impact: devDependencies npm; lockfile commit; cập nhật major cần decision mới
```

Không thêm dependency khác trong CP1–CP3 nếu không có decision mới (Pagefind, Playwright, Vitest, icon/UI lib… đều ngoài boundary).

## Consequences

- Toàn bộ site là HTML/CSS/JS tĩnh; bài `published=false` bị lọc ở build.
- Thay đổi base path khi chuyển sang domain riêng chỉ cần đổi `site`/`base` (và `public/CNAME`).
- Phiên bản pin bằng `package-lock.json`; CP1 xác minh lại bản stable hiện hành.

## Amendment 1 — Astro major 6 (2026-11-11)

- **Quyết định:** HUMAN LEAD 2026-11-11 (phiên CP1-01: "quay lại hướng 2 (hạ xuống Astro 6)"). `astro` dùng **major 6** (6.4.8) thay major 7; các dependency khác giữ nguyên.
- **Lý do:** compiler native Rust của Astro 7 (`@astrojs/compiler-binding-linux-x64-gnu`) cần AVX/AVX2; VM dev (VMware, CPU ảo không expose `avx`/`avx2`/`xsave`) crash `Illegal instruction` khi `astro check`/`astro build`. Astro 6 dùng `@astrojs/compiler` (WASM), không phụ thuộc tập lệnh CPU. Evidence: `docs/tasks/CP1-01-scaffold.md` Result.
- **Đã kiểm (scratch, 2026-11-11):** astro 6.4.8 + @astrojs/check 0.9.12 + typescript 6.0.3 + tailwindcss/@tailwindcss/vite 4.3.5 → `astro build` và `astro check` PASS trên VM dev. Astro 6 yêu cầu Node ≥ 22.12.0.
- **Hệ quả:** nâng lên Astro 7 sau này cần decision mới, kèm điều kiện máy dev/CI có AVX2. Content collections (`src/content.config.ts`, `glob` loader) có ở Astro 6.

## Open points

- Xác nhận Pages CMS rich-text ghi Markdown vào `body` tương thích renderer Astro (kiểm ở CP2-01).
