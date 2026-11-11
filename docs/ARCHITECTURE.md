# Architecture — IT Academic Bulletin

| Metadata | Value |
|---|---|
| Status | ACCEPTED — HUMAN LEAD 2026-11-11 (cùng ADR-001/ADR-002/IAB-001) |
| Date | 2026-11-11 |
| Repository | `https://github.com/ntnghia-hcmiu/it-academic-bulletin` — PUBLIC, rỗng (kiểm 2026-11-11); `site: https://ntnghia-hcmiu.github.io`, `base: /it-academic-bulletin` |
| Related | `docs/decisions/ADR-001-static-site-stack.md`, `ADR-002-cms-publishing-boundary.md`, `IAB-001-…`, `docs/CONTENT_MODEL.md`, `docs/SITEMAP.md` |

## 1. Tổng quan

```text
 Thư ký khoa ──(trình duyệt)──► Pages CMS (app.pagescms.org, hosted)
                                    │ GitHub App installation token
                                    ▼  commit src/content/** , public/media/**
 Tech owner ──PR/merge──►   GitHub repo  (branch main)
                                    │ push event
                                    ▼
                         GitHub Actions: deploy.yml
                           1. guard: commit CMS chỉ chạm content/media
                           2. npm ci → astro check → node --test → astro build
                           3. verify-dist (không lộ bài ẩn, link, base path)
                           4. upload-pages-artifact → deploy-pages
                                    │
                                    ▼
 Sinh viên ─────────────► GitHub Pages  https://ntnghia-hcmiu.github.io/it-academic-bulletin/
                           (sau này: domain riêng, base "/")
 Tài liệu/biểu mẫu ─────► Google Drive (link do thư ký kiểm quyền xem)
```

Không backend, không database, không API runtime. Hai địa chỉ phải phân biệt trong tài liệu bàn giao: **trang công khai** (GitHub Pages) và **trang đăng nhập CMS** (app.pagescms.org).

## 2. Cấu trúc thư mục (planned)

```text
astro.config.mjs        site, base (từ env SITE_URL / BASE_PATH), sitemap, tailwind vite plugin
src/content.config.ts   collections: announcements, categories, guides, resources, faq, settings
src/content/**          dữ liệu do CMS ghi
src/lib/content.ts      DUY NHẤT nơi lọc published, sắp xếp, resolve category (fallback "Khác")
src/lib/search.ts       chuẩn hóa tiếng Việt (NFD, bỏ dấu, đ→d), build index
src/lib/url.ts          ghép base path cho mọi link nội bộ
src/layouts/Base.astro  <head> SEO (title, description, canonical), skip-link, header/nav, footer
src/components/         AnnouncementCard, CategoryNav, SearchBox, EmptyState, DeadlineBadge, AttachmentList, ContactCard
src/pages/              xem docs/SITEMAP.md
src/pages/search-index.json.ts   chỉ mục tĩnh (chỉ bài published)
public/media/           ảnh do CMS upload
scripts/verify-dist.mjs kiểm dist/ sau build
tests/*.test.mjs        node --test cho helper thuần
.pages.yml              cấu hình CMS
.github/workflows/deploy.yml
```

## 3. Quyết định kỹ thuật chính

| # | Quyết định | Lý do |
|---|---|---|
| T1 | Static output, `getStaticPaths` chỉ từ entry đã lọc published | bài ẩn không có HTML |
| T2 | Base path cấu hình qua env, mọi link qua `url()` helper | chạy ở `/<repo>/` và domain riêng |
| T3 | Tìm kiếm: fetch `search-index.json` (title, summary, category, date, url) + lọc client, bỏ dấu | không dependency, đủ quy mô |
| T4 | Lọc danh mục + sắp xếp bằng query string (`?category=…&sort=…`) → link chia sẻ được; không JS vẫn xem được danh sách đầy đủ | progressive enhancement |
| T5 | Category là string slug, resolve mềm (không `reference()` strict) | xóa/ẩn danh mục không làm hỏng build của thư ký |
| T6 | Deadline "đã hết hạn" tính lúc build và cập nhật phía client | site tĩnh không rebuild mỗi ngày |
| T7 | Markdown body render bằng Astro; không cho HTML thô nguy hiểm (CMS markdown) | an toàn nội dung |
| T8 | Ảnh trong repo chỉ minh họa nhỏ; PDF/Word ở Drive | repo nhẹ, quyền tài liệu ở Drive |

## 4. Bảo mật & quyền riêng tư

- Repo public (nếu HUMAN LEAD chọn Pages free): coi mọi thứ trong repo là công khai. Draft ≠ bí mật.
- Workflow quyền tối thiểu; không secret ngoài `GITHUB_TOKEN`.
- Pages CMS App cài cho đúng 1 repo; collaborator theo email; `.pages.yml` không sửa được bởi collaborator.
- Content-path guard trong CI (ADR-002) phát hiện commit CMS chạm ngoài vùng nội dung.
- Không form thu thập dữ liệu; không analytics/cookie bên thứ ba.

## 5. Vận hành

- Deploy: mỗi push vào `main` (CMS hoặc merge PR) → build ~1–3 phút → site cập nhật.
- Build lỗi (vd thư ký nhập dữ liệu sai schema): site giữ phiên bản cũ; tech owner xem log Actions, sửa qua CMS hoặc revert.
- Rollback: `git revert <sha>` + push (tech owner) hoặc "Re-run" deploy commit cũ. Chi tiết ở `docs/DEPLOYMENT.md` (CP3).

## 6. Biến còn thiếu (ảnh hưởng kiến trúc)

Tên miền/subdomain; quyền admin repo `ntnghia-hcmiu/it-academic-bulletin` (Pages, ruleset, GitHub App) — tài khoản agent `ntnghia1908` chỉ có WRITE; logo/màu nhận diện chính thức; email/đầu mối khoa; danh sách thư ký; biểu mẫu chính thức; cơ chế quyền Pages CMS thực tế; tình trạng chia sẻ tài liệu Drive. Xem `docs/workflow/current-state.md` Open decisions.
