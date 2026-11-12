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
- Dependencies: CP1-02 (schema), CP3-01 (deploy)
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

- Main changes:
- Tests:
- Diff + / − (app, test):
- Helper mới (đã tìm, lý do không tái dùng):
- Review:
- Important findings / decisions:
- Known limitations:
- PR:
