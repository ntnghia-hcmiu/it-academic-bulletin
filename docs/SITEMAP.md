# Sitemap & Homepage Mockup

| Metadata | Value |
|---|---|
| Status | ACCEPTED — HUMAN LEAD 2026-11-11 (cùng ADR-001/ADR-002/IAB-001) |
| Date | 2026-11-11 |

Tham khảo *cách tổ chức* trang School of Business (thông báo chung → danh mục → liên hệ → FAQ trên một trang chủ; menu theo thủ tục), nhưng thiết kế, văn bản và liên hệ là mới. Khác biệt có chủ đích: thông báo có ngày đăng + deadline, có trang Biểu mẫu riêng, tìm kiếm/lọc thật, FAQ tách trang.

## 1. Routes

| Route | Trang | Nguồn dữ liệu |
|---|---|---|
| `/` | Trang chủ | settings, announcements (important + 6 mới nhất), categories, quick_links |
| `/thong-bao/` | Danh sách thông báo — tìm kiếm, lọc danh mục, sắp xếp | announcements |
| `/thong-bao/<id>/` | Chi tiết thông báo | announcement |
| `/danh-muc/` | Tất cả danh mục học vụ | categories |
| `/danh-muc/<slug>/` | Danh mục: mô tả, hướng dẫn, tài liệu, thông báo liên quan, FAQ liên quan | categories + all |
| `/huong-dan/<id>/` | Chi tiết hướng dẫn | guides |
| `/bieu-mau/` | Biểu mẫu / Tài liệu (lọc theo danh mục, loại) | resources |
| `/hoi-dap/` | FAQ theo danh mục | faq |
| `/lien-he/` | Liên hệ | settings.contacts |
| `/404.html` | Không tìm thấy | — |
| `/search-index.json`, `/sitemap-index.xml`, `/robots.txt` | kỹ thuật | — |

Menu chính (mobile: nút "Menu"): Trang chủ · Thông báo · Danh mục ▾ (9 mục theo `order`) · Biểu mẫu · Hỏi đáp · Liên hệ.

## 2. Mockup trang chủ (mobile-first, ~375px)

```text
┌─────────────────────────────────────┐
│ [logo nếu được phép]  Học vụ CNTT  ☰│  header dính, skip-link "Bỏ qua tới nội dung"
├─────────────────────────────────────┤
│ Thông tin học vụ — Khoa CNTT        │  settings.site_title
│ <intro ngắn>                        │  settings.intro (trống → ẩn)
│ ┌─────────────────────────────┐ 🔍  │  ô tìm kiếm → /thong-bao/?q=
│ └─────────────────────────────┘     │
├─────────────────────────────────────┤
│ ⚑ QUAN TRỌNG                        │  important=true, tối đa 3
│ ┌─────────────────────────────────┐ │
│ │ [Đăng ký môn học] 10/11/2026    │ │  nhãn danh mục + ngày đăng
│ │ <Tiêu đề thông báo>             │ │
│ │ ⏰ Hạn: 20/11/2026               │ │  deadline badge (nếu có)
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ THÔNG BÁO MỚI            Xem tất cả→│  6 bài mới nhất
│ • 10/11 <Tiêu đề>  [Tốt nghiệp]     │
│ • …                                 │
│ (trống → "Chưa có thông báo")       │
├─────────────────────────────────────┤
│ THỦ TỤC THƯỜNG DÙNG                 │  lưới 2 cột: 9 danh mục (+ quick_links)
│ ┌──────────┐ ┌──────────┐           │
│ │Đăng ký   │ │Internship│           │
│ │môn học   │ │/Thực tập │           │
│ └──────────┘ └──────────┘  …        │
├─────────────────────────────────────┤
│ HƯỚNG DẪN NHANH                     │  guides mới cập nhật (trống → ẩn mục)
├─────────────────────────────────────┤
│ LIÊN HỆ                             │  settings.contacts[0..2] + "Xem tất cả"
│ (trống → "Thông tin liên hệ đang    │
│  được cập nhật")                    │
├─────────────────────────────────────┤
│ footer: footer_text · link web khoa │
└─────────────────────────────────────┘
```

Desktop (≥1024px): 2 cột — trái: Quan trọng + Thông báo mới; phải: Thủ tục thường dùng + Liên hệ. Màu: nền sáng, 1 màu nhấn (xanh dương đậm, tương phản ≥ 4.5:1) cho tới khi có nhận diện IU chính thức.

## 3. Trang danh mục khi chưa có nội dung

```text
Internship / Thực tập
Thông tin liên quan đến thực tập (Internship).
ℹ Nội dung đang được cập nhật. Vui lòng theo dõi thông báo của Khoa.
```
