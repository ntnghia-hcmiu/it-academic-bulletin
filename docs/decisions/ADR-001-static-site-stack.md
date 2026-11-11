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
| Static site | `astro` | 7.4.10 (major 7) | content collections (`src/content.config.ts`, `glob` loader); output tĩnh |
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

## Open points

- Xác nhận Pages CMS rich-text ghi Markdown vào `body` tương thích renderer Astro (kiểm ở CP2-01).
