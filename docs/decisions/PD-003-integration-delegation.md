# PD-003 — ORCHESTRATOR được ủy quyền push / PR / merge

| Metadata | Value |
|---|---|
| Status | ACCEPTED |
| Date | 2026-11-11 |
| Decision owner | HUMAN LEAD — chỉ đạo trong phiên CP1-05: "push/PR/merge bạn làm giúp tôi luôn"; xác nhận ghi decision record cùng ngày |
| Scope | Luồng A `docs/ai/project-profile.md` §5 (source / cấu hình / governance). Không áp dụng luồng B (nội dung CMS) |
| Relation | Là "policy integration được duyệt sau" mà project-profile §5 dự liệu; thay yêu cầu HUMAN LEAD cho phép từng lần cho push / PR / merge |

## Decision

1. ORCHESTRATOR được push feature branch, tạo PR vào `main` và merge PR **khi task READY** (mọi required verification PASS, kể cả kiểm thủ công do HUMAN LEAD) mà không cần hỏi lại từng lần.
2. Merge bằng merge commit (`gh pr merge --merge`); không rebase / force-push branch đã push.
3. Trước merge, ORCHESTRATOR chạy `npm run verify` trên kết quả merge với `main` và ghi kết quả vào contract hoặc mô tả PR.
4. **Vẫn hỏi HUMAN LEAD từng lần** (IAB-001 §6 giữ nguyên): merge làm kích hoạt deploy production lần đầu hoặc thay đổi `.github/workflows/**`; bật GitHub Pages, cài GitHub App, ruleset, đổi default branch, đổi visibility; force-push, xóa branch remote; thao tác quyền Google Drive; mọi việc ngoài boundary IAB-001.

## Consequences

- `main` được tạo tại `23c8edb` (tip CP0) 2026-11-11; PR #1–#7, #9 merge theo chỉ đạo này.
- Default branch repo vẫn là `cp0/framework-adoption` (HUMAN LEAD giữ nguyên 2026-11-11).
