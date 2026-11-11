# Content Model — IT Academic Bulletin

| Metadata | Value |
|---|---|
| Status | ACCEPTED — HUMAN LEAD 2026-11-11 (cùng ADR-001/ADR-002/IAB-001) |
| Date | 2026-11-11 |
| Source | PROJECT_BRIEF v1.1 §5; Pages CMS docs (configuration/content, fields, media, collaborators — đọc 2026-11-11) |

Mọi tên field bằng tiếng Anh; nhãn hiển thị trong CMS bằng tiếng Việt. Schema (`src/lib/schema.js`, ADR-001 Amendment 2) và `.pages.yml` phải khớp 1-1; task CP2-01 kiểm bằng test.

## 1. Lưu trữ

| Collection | Pages CMS `type` | Path | Format | Tên file / id |
|---|---|---|---|---|
| announcements | collection | `src/content/announcements` | `yaml-frontmatter` (`.md`) | `{year}-{month}-{day}-{primary}.md`, **rename: false** → URL ổn định |
| categories | collection | `src/content/categories` | `yaml` (`.yml`) | `{fields.slug}.yml`; id = slug |
| guides | collection | `src/content/guides` | `yaml-frontmatter` | `{primary}.md`, rename: false |
| resources | collection | `src/content/resources` | `yaml` | `{year}{month}{day}-{primary}.yml` |
| faq | collection | `src/content/faq` | `yaml-frontmatter` | `{primary}.md` |
| settings | file | `src/content/settings/site.json` | `json` | 1 file; delete: false |
| media | media | `public/media` → `/media` | ảnh | categories: [image], rename: safe |

`id` của entry = tên file (không đuôi). **URL dùng id**, không phụ thuộc tiêu đề sau khi tạo.

> Cần kiểm ở CP2-01: `{primary}` slugify có bỏ dấu tiếng Việt không (vd "Đăng ký" → `dang-ky`). Nếu không, thêm field `slug` bắt buộc với `pattern` `^[a-z0-9-]+$` và dùng `{fields.slug}`.

## 2. Collections

Ký hiệu: ★ bắt buộc. Kiểu theo Pages CMS.

### A. announcements — "Thông báo"

| Field | Kiểu CMS | Nhãn | Ghi chú |
|---|---|---|---|
| `title` ★ | string (maxlength 200) | Tiêu đề | primary |
| `summary` | text (maxlength 300) | Tóm tắt | dùng ở thẻ danh sách + meta description |
| `category` ★ | reference → categories, `value: "{name}"`, `label: "{fields.name}"` | Danh mục | lưu slug |
| `published` | boolean, default false | Đã xuất bản | false → không xuất hiện trên web |
| `important` | boolean, default false | Quan trọng (ghim trang chủ) | |
| `published_date` ★ | date `yyyy-MM-dd` | Ngày đăng | hiển thị khi published |
| `deadline` | date, default "" | Hạn chót (nếu có) | chỉ là dữ liệu, không tự ẩn/hiện bài |
| `attachments` | object list `{label ★ string, url ★ string pattern ^https://, note select: "Công khai" / "Yêu cầu tài khoản IU"}` | Tệp/đường dẫn đính kèm | Drive link |
| `body` | rich-text (markdown) | Nội dung | Markdown body |

### B. categories — "Danh mục học vụ"

| Field | Kiểu | Ghi chú |
|---|---|---|
| `name` ★ | string | Nhãn hiển thị |
| `slug` ★ | string, pattern `^[a-z0-9-]+$`, readonly sau khi tạo (thực tế: rename: false) | id/URL |
| `description` | text | Trống → "Nội dung đang được cập nhật" |
| `order` ★ | number, min 0 | Thứ tự menu |
| `published` | boolean, default true | Ẩn danh mục |
| `drive_folder_url` | string, pattern ^https:// | Link thư mục Drive (chỉ hiển thị nếu thư ký xác nhận công khai) |
| `drive_access` | select: "Công khai" / "Yêu cầu tài khoản IU" | Nhãn quyền truy cập |

### C. guides — "Hướng dẫn"

`title` ★, `category` ★ (reference), `summary`, `body` (rich-text), `attachments` (như A), `updated_date` ★ (date), `published` (bool, default false), `order` (number).

### D. resources — "Biểu mẫu / Tài liệu"

`title` ★, `description`, `category` ★ (reference), `external_url` ★ (string ^https://), `file_type` (select: PDF / Word / Excel / Google Form / Google Docs / Thư mục / Khác), `access` (select: Công khai / Yêu cầu tài khoản IU), `updated_date` ★, `published` (default false).

### E. faq — "Câu hỏi thường gặp"

`question` ★, `answer` (rich-text; trống → hiển thị "Chưa cập nhật câu trả lời" hoặc ẩn — xem D-10), `category` (reference, tùy chọn), `order`, `published` (default false).

### F. settings — "Cài đặt trang & Liên hệ" (file)

`site_title` ★, `site_tagline`, `intro` (text — đoạn giới thiệu trang chủ), `quick_links` (object list `{label, url}` — "Thủ tục thường dùng"), `contacts` (object list `{role ★, name, email, phone, office, hours, responsibilities}`), `contact_note` (rich-text), `footer_text`, `faculty_website_url`, `drive_root_url`.

Seed ban đầu: `site_title` = "Thông tin học vụ — Khoa Công nghệ Thông tin", các field khác **rỗng** (không hardcode liên hệ chưa xác minh).

## 3. Quy tắc hiển thị (frontend)

1. Chỉ entry `published === true` được render; lọc trong **một helper duy nhất** `src/lib/content.js` dùng cho mọi trang, search index, sitemap.
2. Entry tham chiếu danh mục `published=false` hoặc không tồn tại: vẫn hiển thị bài ở danh sách chung, nhãn danh mục = "Khác"; build ghi cảnh báo (không fail build để không chặn thư ký). *Không* tham chiếu strict vì xóa danh mục sẽ làm hỏng build.
3. Sắp xếp thông báo: `important` trước trên trang chủ; danh sách: `published_date` giảm dần, tie-break theo id.
4. Deadline: hiển thị badge "Hạn: dd/MM/yyyy"; đã qua → "Đã hết hạn" (tính lúc build + kiểm lại phía client theo ngày hiện tại). Không tự ẩn bài.
5. Danh mục không có bài/hướng dẫn/tài liệu đã xuất bản → "Nội dung đang được cập nhật".
6. Không lorem ipsum; seed không tạo thông báo/hướng dẫn/FAQ.

## 4. Seed 9 danh mục (từ tên thư mục Drive)

| order | slug | name | Drive folder ID |
|---|---|---|---|
| 1 | thong-bao-hoc-vu | Thông báo học vụ | `154XYlpHgxj1rXgC4cjQfB4wOtNKxoVTe` |
| 2 | chuong-trinh-dao-tao | Chương trình đào tạo | `1YwZ4KxE7ZZ4UxlzuBiX2pfoy2Uldzcgu` |
| 3 | dang-ky-mon-hoc | Đăng ký môn học / Add-Drop | `1tPwbUz3p9y0-58stztIgfBiQNRSnNbba` |
| 4 | dang-ky-chuyen-nganh | Đăng ký chuyên ngành | `18W6kv2GfijrlGF2z7aicTpcGDx0NEuZy` |
| 5 | chuyen-nganh-chuong-trinh | Chuyển ngành / Chuyển chương trình | `1UvzNKUTE-RrwlV9KU8gl0Ha-JgG3CF5C` |
| 6 | internship | Internship / Thực tập | `1TVf0EcTXxOmiIZFrgvVFU-9ViyZ3gxlj` |
| 7 | giay-gioi-thieu-thuc-tap | Giấy giới thiệu thực tập | `10Mb1hdf_I5oCFSBMIlCpzH3VvtltmAvb` |
| 8 | tot-nghiep | Tốt nghiệp | `17aUZ4XsNkO6nGeYVf6yqP8_UB28NRr-k` |
| 9 | tam-dung-thoi-hoc-gia-han | Tạm dừng / Thôi học / Gia hạn | `1JW3ctff56-44i2tChWj-2zAg8jW29-wG` |

Thư mục con của "Giấy giới thiệu thực tập": Form giới thiệu (`1Skk8I4QpZHNcYiLSTERnrQVEBo50l3N4`), Form giới thiệu dành cho Công ty Bosch (`1H716qYEaJp-ZqWspxs5UcKpKNby1bJdI`) — **không** seed thành resource (chưa có file, chưa xác nhận công khai).

Seed: `description` = 1 câu trung tính mô tả *phạm vi chủ đề* (vd "Thông tin liên quan đến thực tập (Internship)."), **không** nêu điều kiện, quy định, thời hạn. `drive_folder_url` **để trống** cho tới khi thư ký xác nhận quyền xem (D-06). `published: true` cho cả 9 (danh mục rỗng hiện "Đang cập nhật").

"Thông báo học vụ" vừa là danh mục vừa trùng nghĩa trang Thông báo: giữ làm danh mục (khớp Drive) — xem D-09.

## 5. Phác thảo `.pages.yml` (minh họa, chưa phải file)

```yaml
media:
  input: public/media
  output: /media
  categories: [image]
  rename: safe
settings:
  commit:
    identity: user          # D-04
content:
  - name: announcements
    label: Thông báo
    type: collection
    path: src/content/announcements
    format: yaml-frontmatter
    filename: "{year}-{month}-{day}-{primary}.md"
    operations: { create: true, rename: false, delete: true }
    view:
      fields: [title, published, important, published_date]
      primary: title
      sort: [published_date, title]
      default: { sort: published_date, order: desc }
    fields:
      - { name: title, label: Tiêu đề, type: string, required: true }
      - { name: summary, label: Tóm tắt, type: text }
      - name: category
        label: Danh mục
        type: reference
        required: true
        options: { collection: categories, value: "{name}", label: "{fields.name}", search: "name" }
      - { name: published, label: Đã xuất bản, type: boolean, default: false }
      - { name: important, label: Quan trọng, type: boolean, default: false }
      - { name: published_date, label: Ngày đăng, type: date, required: true, options: { format: yyyy-MM-dd } }
      - { name: deadline, label: Hạn chót, type: date, default: "", options: { format: yyyy-MM-dd } }
      - name: attachments
        label: Đính kèm
        type: object
        list: true
        fields:
          - { name: label, label: Tên hiển thị, type: string, required: true }
          - { name: url, label: Đường dẫn, type: string, required: true, pattern: "^https://" }
      - { name: body, label: Nội dung, type: rich-text, options: { format: markdown } }
  # categories, guides, resources, faq: tương tự §2
  - name: settings
    label: Cài đặt trang & Liên hệ
    type: file
    path: src/content/settings/site.json
    format: json
    operations: { delete: false }
    fields: [ ... ]   # §2.F
```

Cú pháp chính xác (vị trí `options`, `default`, `pattern` object) phải xác minh với Pages CMS đang chạy ở CP2-01; khác biệt nhỏ không cần decision mới, khác biệt làm đổi content model → dừng.
