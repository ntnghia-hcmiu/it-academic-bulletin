---
id: REQ-001
title: "Cổng thông tin học vụ Khoa CNTT — MVP"
status: NEEDS_CLARIFICATION
version: 1
owner: "HUMAN LEAD (tech owner); content owner: Thư ký Khoa CNTT"
created: 2026-11-11
updated: 2026-11-11
---

# Requirement: REQ-001 — Cổng thông tin học vụ Khoa CNTT (MVP)

> Chuyển từ IDEA `docs/product/ideas/PROJECT_BRIEF-v1.1.md` bởi ORCHESTRATOR (Claude Code) theo Product Layer. Đây là **draft**, chưa được HUMAN LEAD chấp nhận. FACT = brief nêu rõ; ASSUMPTION = diễn giải chưa xác nhận; UNKNOWN = thiếu.

## 1. Problem
Sinh viên Khoa CNTT (IU) thiếu một nơi công khai, dễ dùng trên điện thoại để tra thông báo, thủ tục và biểu mẫu học vụ; tài liệu nằm rải rác ở Google Drive (FACT: 9 thư mục, chưa có file). Thư ký khoa cần tự đăng/sửa nội dung mà không cần kỹ năng kỹ thuật (FACT, ưu tiên số 1).

## 2. Goal
Sinh viên tìm được thông báo và hướng dẫn học vụ chính thức theo chủ đề trong vài thao tác; thư ký tự xuất bản, sửa, ẩn, xóa nội dung qua giao diện web và thấy thay đổi trên trang công khai.

## 3. Actors
| Actor | Role / need |
|---|---|
| Sinh viên Khoa CNTT | đọc thông báo, deadline, thủ tục, biểu mẫu, FAQ, liên hệ; chủ yếu trên điện thoại; không đăng nhập |
| Thư ký khoa (CONTENT OWNER) | tạo/sửa/ẩn/xóa nội dung, quyết định nội dung chính thức; không dùng Git/CLI |
| Tech owner (HUMAN LEAD) | sở hữu repo, cấu hình, quyền, deploy, hỗ trợ |

## 4. Current workflow / context
Thông tin nằm ở Google Drive thư mục khoa (ASSUMPTION: được chia sẻ cho sinh viên theo cách riêng từng tài liệu). Chưa có website học vụ riêng của khoa (ASSUMPTION). Khoa QTKD có Google Site bulletin làm tham khảo tổ chức thông tin (FACT).

## 5. Desired workflow / outcome
1. Thư ký đăng nhập CMS → chọn loại nội dung → nhập/sửa → bật "Đã xuất bản" → lưu → vài phút sau trang công khai cập nhật.
2. Sinh viên mở trang chủ → thấy thông báo quan trọng, deadline, danh mục thủ tục, ô tìm kiếm → mở chi tiết/biểu mẫu (link Drive).

## 6. Functional requirements
### FR-001 — Trang chủ
- User: sinh viên. Trigger: mở site. Behavior: hiển thị thông báo quan trọng, thông báo mới, danh mục thủ tục, tìm kiếm, hướng dẫn nhanh, liên hệ. Result: thấy mục quan trọng/deadline mà không cần cuộn nhiều.
### FR-002 — Danh sách & chi tiết thông báo
- Tìm kiếm theo từ khóa (không phân biệt dấu), lọc theo danh mục, sắp xếp mới nhất; trang chi tiết có ngày đăng, deadline, đính kèm.
### FR-003 — Danh mục học vụ
- 9 danh mục từ Drive; mỗi danh mục: mô tả, hướng dẫn, tài liệu, thông báo liên quan; danh mục rỗng hiện "Nội dung đang được cập nhật".
### FR-004 — Biểu mẫu / Tài liệu
- Danh sách link có nhãn, mô tả, loại, danh mục, ngày cập nhật, nhãn quyền truy cập.
### FR-005 — FAQ
- Câu hỏi theo danh mục; chỉ hiển thị câu đã xuất bản.
### FR-006 — Liên hệ
- Chỉ hiển thị đầu mối do khoa xác nhận, nhập qua CMS.
### FR-007 — Biên tập nội dung bởi thư ký
- Tạo/sửa/ẩn/xóa thông báo, hướng dẫn, tài liệu, FAQ; thêm/sửa/sắp xếp/ẩn danh mục; sửa liên hệ, giới thiệu trang chủ, footer — không cần Git/CLI/Markdown thủ công.
### FR-008 — Xuất bản
- Lưu trong CMS dẫn tới cập nhật trang công khai tự động; bài `published=false` không xuất hiện.

## 7. Non-functional requirements
- NFR-001: dùng tốt trên điện thoại (từ 360px), không cuộn ngang.
- NFR-002: điều hướng bàn phím, tương phản đủ, tiêu đề có thứ bậc (mục tiêu WCAG 2.1 AA).
- NFR-003: SEO cơ bản (title, description, sitemap, canonical); chạy ở `/<repo>/` và domain riêng.
- NFR-004: chi phí vận hành 0 (không backend/database/dịch vụ trả phí).
- NFR-005: cập nhật nội dung hiển thị trên site trong ≤ 10 phút sau khi lưu (ASSUMPTION — cần xác nhận).

## 8. Business rules / constraints
- BR-001: thư ký là người duy nhất quyết định nội dung chính thức.
- BR-002: không bịa quy định, deadline, email, cán bộ; thiếu nguồn → "Đang cập nhật".
- BR-003: `published=false` chỉ ẩn khỏi web, không bảo mật dữ liệu trong repo public.
- BR-004: không đưa dữ liệu cá nhân/nội bộ vào CMS/repo.
- BR-005: link Drive phải được thư ký kiểm quyền xem; tài liệu cần đăng nhập gắn "Yêu cầu tài khoản IU".
- BR-006: không hẹn giờ đăng; deadline không tự đổi trạng thái xuất bản.
- BR-007: tiếng Việt mặc định; giữ thuật ngữ Internship, Add/Drop.

## 9. Edge cases / failure behavior
- EC-001: danh mục không có nội dung → "Nội dung đang được cập nhật".
- EC-002: thông báo thuộc danh mục bị ẩn/xóa → vẫn hiển thị, nhãn "Khác".
- EC-003: deadline đã qua → nhãn "Đã hết hạn", bài vẫn hiển thị.
- EC-004: tìm kiếm không có kết quả → thông báo rõ + gợi ý xem danh mục.
- EC-005: thư ký nhập sai dữ liệu làm build lỗi → site giữ bản cũ; tech owner được báo qua Actions.
- EC-006: link Drive không còn quyền xem → (không tự phát hiện ở MVP) — ASSUMPTION: chấp nhận.
- EC-007: người dùng JS tắt → vẫn xem được danh sách đầy đủ (không tìm kiếm động).

## 10. Acceptance criteria
### AC-001 — Danh mục
Given 9 danh mục seed, when mở trang chủ và `/danh-muc/`, then thấy 9 danh mục đúng thứ tự, không có nội dung học vụ bịa.
### AC-002 — Ẩn bài
Given một thông báo `published=false`, when build site, then không có trang HTML, mục tìm kiếm, sitemap hay chuỗi tiêu đề của bài đó trong `dist/`.
### AC-003 — Tìm kiếm/lọc
Given các thông báo đã xuất bản, when tìm "dang ky" hoặc "đăng ký" và lọc theo danh mục, then kết quả khớp, sắp xếp mới nhất trước.
### AC-004 — Mobile/A11y
Given điện thoại 360px, when duyệt mọi trang, then không cuộn ngang; toàn bộ điều hướng dùng được bằng bàn phím.
### AC-005 — Thư ký end-to-end
Given thư ký được mời bằng email, when đăng nhập CMS, tạo một thông báo test vô hại, xuất bản, rồi ẩn và xóa, then trang công khai lần lượt hiện rồi mất bài đó — thư ký không dùng Git/CLI.
### AC-006 — Cập nhật tài liệu, FAQ, liên hệ
Given thư ký trong CMS, when sửa link Drive của một tài liệu, một FAQ và một liên hệ, then site phản ánh thay đổi sau deploy.
### AC-007 — Deploy & rollback
Given push vào `main`, when Actions chạy, then site deploy thành công; có hướng dẫn rollback đã thử.
### AC-008 — Hướng dẫn thư ký
Given `docs/SECRETARY_GUIDE.md`, when thư ký đọc, then thao tác chính nằm trong ~2 trang, có ảnh màn hình nếu tạo được.

## 11. Out of scope
- Đăng nhập sinh viên, dữ liệu cá nhân, nộp đơn online, workflow duyệt đa cấp, backend/database.
- Google Drive API, đồng bộ Sheets, tự công khai file Drive.
- Hẹn giờ đăng, thông báo email/push, đa ngôn ngữ đầy đủ (EN).
- Mục "Thesis / Pre-thesis" chính thức khi chưa có nguồn (có thể tạo qua CMS sau).

## 12. Assumptions
- Repo GitHub public (đã tạo: `ntnghia-hcmiu/it-academic-bulletin`) + GitHub Pages free được chấp nhận.
- Pages CMS hosted miễn phí và collaborator theo email dùng được cho thư ký.
- Thời gian deploy ≤ 10 phút chấp nhận được.
- Bản tiếng Anh không cần trong MVP.

## 13. Open questions
- OQ-1: Ai là thư ký (1 hay nhiều người)? Có tài khoản GitHub không, hay dùng mời theo email? (D-03)
- OQ-2: Domain/subdomain dự kiến? Tạm dùng `ntnghia-hcmiu.github.io/it-academic-bulletin`? (D-05)
- OQ-3: ~~Repo public?~~ Quyết 2026-11-11: giữ PUBLIC (D-01). Còn: ai giữ quyền admin lâu dài (D-02).
- OQ-4: Có logo/bộ nhận diện IU được phép dùng? (D-07)
- OQ-5: Có cần bản tiếng Anh trong MVP không? (ASSUMPTION: không)
- OQ-6: FAQ chưa có câu trả lời: ẩn hay hiện "Chưa cập nhật"? (D-10)

## 14. Readiness
- [x] Problem is specific.
- [x] Goal is observable and non-technical.
- [x] Actors are known.
- [x] Current context is sufficient.
- [x] Desired workflow is clear.
- [x] Functional requirements are explicit.
- [x] Relevant rules and edge cases are recorded.
- [x] Acceptance criteria are testable.
- [x] Out of scope is explicit.
- [ ] No material open question blocks planning.

Readiness: NEEDS_CLARIFICATION

## 15. Traceability
- Source idea / request: `docs/product/ideas/PROJECT_BRIEF-v1.1.md` (2026-11-11).
- Parent requirement: None
- Generated tasks: DRAFT task graph `docs/IMPLEMENTATION_PLAN.md` §3 (CP1-01 … CP3-03).
- HUMAN LEAD accepted for development planning 2026-11-11 ("duyệt tất cả"); OQ còn mở không chặn CP1, được xử lý trước task liên quan.
- Notes: `scripts/product-check.mjs` không dùng được (lỗi kit K-01, `FRAMEWORK_ADOPTION.md`). Không tạo branch/PR requirement — chờ HUMAN LEAD cho phép integration.
