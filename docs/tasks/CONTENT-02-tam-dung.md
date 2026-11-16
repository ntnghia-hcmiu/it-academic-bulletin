# Task: CONTENT-02 — Hướng dẫn làm đơn tạm dừng (Drive → `src/content`)

## Status / Approval

- Status: IN_PROGRESS
- Type: CHANGE
- Change class: S1
- Owner: HUMAN LEAD (tech owner)
- Execution profile: single-agent
- Orchestrator: claude-code
- Implementer: claude-code — chỉ ORCHESTRATOR có connector Google Drive; Codex sandbox không có mạng
- Human Lead: tech owner
- Authorization mode: boundary
- Authorization source: HUMAN LEAD 2026-11-16 ("Thư ký vừa thêm…"; tiếp quy trình CONTENT-01), ngoài IAB-001 (IAB-001 không phủ nội dung chính thức) ("Chấp nhận": task contract riêng, nội dung chính thức qua git thay vì CMS, HUMAN LEAD duyệt nội dung trước merge)
- Parallel group: P3 (song song UX-01)
- Owned paths: `src/content/**`
- Dependencies: CONTENT-01, FIX-01 (đã merge)
- Base commit / branch: `b1f31c6` (`main`); branch `content/CONTENT-02-tam-dung`
- Human Lead approval: accepted 2026-11-16
- Implementation authorized: YES

Lifecycle: `boundary` mode = `DRAFT → IN_PROGRESS → READY`. DONE suy ra từ Git sau khi merge.

## Goal

Nội dung thư ký cập nhật trong thư mục Drive nguồn được phản ánh đúng vào `src/content/**` theo `docs/CONTENT_MODEL.md`, hiển thị trên site sau merge.

## Scope

- In scope: đọc thư mục Drive nguồn "Tạm dừng / Thôi học / Gia hạn" (ID `1JW3ctff56-44i2tChWj-2zAg8jW29-wG`) qua connector; chép nội dung vào collection tương ứng; link tài liệu Drive giữ nguyên URL.
- Out of scope: đổi schema/code/`.pages.yml`; đổi quyền chia sẻ Drive; tải file PDF/Word lên repo; soạn thêm nội dung không có trong nguồn.

## Authority / key decisions

- REQ-001, ADR-002 (luồng nội dung; rollback nội dung bằng `git revert`), IAB-001, `docs/CONTENT_MODEL.md`, `docs/ai/project-profile.md` §4.

## Implementation approach

- Chỉ chép đúng nguồn; field thiếu/mơ hồ để trống hoặc hỏi HUMAN LEAD, không bịa (ngày, hạn chót, email, cán bộ).
- Dữ liệu nhạy cảm (điểm, danh sách SV, thông tin cá nhân chưa được phép công khai) → dừng, báo, không commit.
- Quyền truy cập link Drive: không gắn nhãn khi chưa kiểm bằng cửa sổ ẩn danh (D-06); ghi giá trị mặc định an toàn theo CONTENT_MODEL và liệt kê để HUMAN LEAD/thư ký kiểm.

## Phải giữ nguyên

- Mã danh mục (`slug`) 9 danh mục seed; code, schema, workflow.

## Code bị thay / xóa

- không có.

## Acceptance Criteria

1. Mỗi mục nội dung trong thư mục nguồn có ánh xạ ghi trong Result (file nguồn → file content hoặc lý do bỏ qua).
2. `npm run verify` PASS.
3. Không có dữ liệu nhạy cảm; không có nội dung ngoài nguồn.

## Required verification

- `npm run verify` (ORCHESTRATOR) — AC2
- HUMAN LEAD duyệt diff nội dung trước merge — AC1, AC3

Tất cả required verification phải chạy và PASS trước READY.

## Manual test checklist (Tech Lead)

Task không chạm security model / quyền bên thứ ba; manual test sau automated verification là điểm danh.

- [ ] Kiểm trên điện thoại thật hoặc DevTools 360px (nếu có UI).

## Result

- Main changes: nguồn = `HƯỚNG DẪN LÀM ĐƠN TẠM DỪNG.docx` (thư ký thêm 2026-11-16). Ánh xạ (AC1):

  | Nguồn | Đích | Ghi chú |
  |---|---|---|
  | `HƯỚNG DẪN LÀM ĐƠN TẠM DỪNG.docx` | `src/content/guides/huong-dan-lam-don-tam-dung.md` | nguyên văn 6 bước + Lưu ý; chỉ thêm heading Markdown |
  | Mẫu đơn tạm dừng (Drive `1AbDLblc…`, visibility `UNLISTED`) | `resources/20261116-mau-don-tam-dung.yml` + đính kèm | "Công khai" theo metadata |
  | Danh sách Cố vấn học tập (`1HM-rqpm…`, `UNLISTED`; cột: tên, email, khóa, ngành CVHT — không có dữ liệu SV) | `resources/20261116-danh-sach-co-van-hoc-tap.yml` + đính kèm | "Công khai" |
  | Google Form nộp request (`19imwc4l…`) | `resources/20261116-form-nop-request-hoc-vu.yml` + đính kèm | nguồn là link `/edit`; đổi `/viewform` theo HUMAN LEAD 2026-11-16; chưa kiểm chứng được (connector không thấy form); `access` trống |
  | Thông báo Edusoft | đính kèm guide | link ngoài |

- Tests: `npm run verify` PASS 103/103 + verify-dist PASS (ORCHESTRATOR, 2026-11-16) — AC2.
- Diff + / − (app, test): content +4 file; app/test 0.
- Helper mới (đã tìm, lý do không tái dùng): không có.
- Review: ORCHESTRATOR tự làm (single-agent).
- Important findings / decisions: Bước 1 có cú pháp đăng nhập onlinerequestoaa (Username = MSSV, Password = ngày sinh ddmmyyyy). Trên Drive file chỉ tài khoản IU xem được; ORCHESTRATOR khuyến nghị bỏ khi đăng công khai — HUMAN LEAD 2026-11-16 chọn **giữ nguyên văn** (chấp nhận rủi ro).
- Known limitations: chưa READY — chờ HUMAN LEAD duyệt nội dung (AC1, AC3). Câu "Sinh viên có thể kiểm tra tình trạng đơn qua link" trong nguồn không kèm link — giữ nguyên, chờ thư ký bổ sung.
- PR:
