# Task: CONTENT-01 — Đưa nội dung thư ký cập nhật trên Google Drive vào `src/content`

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
- Authorization source: HUMAN LEAD chấp thuận riêng 2026-11-12, ngoài IAB-001 (IAB-001 không phủ nội dung chính thức) ("Chấp nhận": task contract riêng, nội dung chính thức qua git thay vì CMS, HUMAN LEAD duyệt nội dung trước merge)
- Parallel group: —
- Owned paths: `src/content/**`
- Dependencies: CP1-02 (schema), CP3-01 (deploy), FIX-01 (test seed-only — merge trước)
- Base commit / branch: `c7243a6` (`main`); branch `content/CONTENT-01-drive-sync`
- Human Lead approval: accepted 2026-11-12
- Implementation authorized: YES

Lifecycle: `boundary` mode = `DRAFT → IN_PROGRESS → READY`. DONE suy ra từ Git sau khi merge.

## Goal

Nội dung thư ký cập nhật trong thư mục Drive nguồn được phản ánh đúng vào `src/content/**` theo `docs/CONTENT_MODEL.md`, hiển thị trên site sau merge.

## Scope

- In scope: đọc thư mục Drive nguồn (ID `10Mb1hdf_I5oCFSBMIlCpzH3VvtltmAvb`) qua connector; chép nội dung vào collection tương ứng; link tài liệu Drive giữ nguyên URL.
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

- Main changes: thư mục nguồn = "1. GIẤY GIỚI THIỆU THỰC TẬP" (thư ký cập nhật 2026-11-12). Ánh xạ (AC1):

  | Nguồn Drive | Đích | Ghi chú |
  |---|---|---|
  | `Thông tin giấy giơi thiệu thực tập.docx` | `src/content/guides/xin-giay-gioi-thieu-thuc-tap.md` | chép nguyên ý quy trình + 3 ngày làm việc |
  | `RECOMMENDATION LETTER-Student's name-ID.doc` | `src/content/resources/20261112-recommendation-letter.yml` + đính kèm guide | Word; Drive visibility `UNLISTED_TO_DOMAIN` → "Yêu cầu tài khoản IU" |
  | `Student's name - ID- RecommendationLetter (Form dành cho công ty cần mộc ).docx` | `src/content/resources/20261112-giay-gioi-thieu-cong-ty-can-moc.yml` + đính kèm guide | như trên |
  | Google Form `forms.gle/5dhikZKrHUoxBPPB6` (trong docx) | `src/content/resources/20261112-form-yeu-cau-giay-gioi-thieu.yml` + đính kèm guide | `access` để trống: chưa kiểm được |
  | Sheet "Theo dõi tiến trình Request Giấy Giới thiệu" (trong docx) | **bỏ qua** | là sheet Form Responses (họ tên, MSSV, điện thoại, nơi nhận, email/địa chỉ), visibility "anyone with link" → dữ liệu cá nhân; HUMAN LEAD 2026-11-12: bỏ link, báo thư ký |

- Tests: `npm run verify` FAIL do 2 test seed-only (xem FIX-01), không do nội dung; `npm run check` (schema) chạy trong verify trước test.
- Diff + / − (app, test): content +4 file; app/test 0.
- Helper mới (đã tìm, lý do không tái dùng): không có.
- Review: ORCHESTRATOR tự làm (single-agent).
- Important findings / decisions: quyền truy cập đọc từ metadata Drive, không đổi sharing. File mẫu chứa MSSV/CCCD ví dụ — HUMAN LEAD xác nhận 2026-11-12 là dữ liệu giả, giữ link. `drive_folder_url` danh mục giữ trống (D-06).
- Known limitations: chưa READY — chờ FIX-01 merge, verify lại, HUMAN LEAD duyệt diff.
- PR:
