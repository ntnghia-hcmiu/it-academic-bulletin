# Current State

| Metadata | Value |
|---|---|
| Status | OPERATIONAL STATE — NOT AUTHORITY |

Chỉ ghi operational state không suy ra được từ Git, task contract hoặc accepted decisions.

Ngân sách token của file: xem `docs/ai/workflow.md` §10.

## Current focus

CP0 DONE 2026-11-11. HUMAN LEAD "duyệt tất cả": ADR-001, ADR-002, IAB-001 (CP1–CP3), PD-001 (≤3 song song), PD-002 (IMPLEMENTER = Codex `codex exec`). CP0 commit trên branch `cp0/framework-adoption`; **chưa push** — chờ trả lời D-01 (public/private).

## Next proposed action

Session mới: CP1-01 (pilot S1 Claude ORCHESTRATOR → Codex IMPLEMENTER), branch `cp1/CP1-01-scaffold` từ `cp0/framework-adoption`; sau đó CP1-02, rồi parallel group P1.

## Open decisions

- D-01 Repo PUBLIC hay chuyển PRIVATE (private + Pages cần gói GitHub trả phí; xem báo cáo 2026-11-11). Chặn push.
- D-02 Ai giữ quyền admin repo lâu dài (bật Pages, ruleset, App)? Agent chỉ có WRITE.
- D-03 Thư ký: collaborator theo email hay tài khoản GitHub; 1 hay nhiều người.
- D-04 `commit.identity: user` (ghi email thư ký vào commit public) hay `app`.
- D-05 Domain: tạm `ntnghia-hcmiu.github.io/it-academic-bulletin`?
- D-06 Link Drive thư mục danh mục: hiển thị hay để trống tới khi thư ký kiểm quyền.
- D-07 Logo/nhận diện IU được phép dùng?
- D-08 Giữ, tắt hay xóa `.github/workflows/requirement-to-task.yml` (kit; cần secret `ANTHROPIC_API_KEY`, quyền `contents: write`).
- D-09 "Thông báo học vụ" giữ là danh mục riêng?
- D-10 FAQ chưa có câu trả lời: ẩn hay hiện "Chưa cập nhật".
- D-11 Lỗi kit K-01…K-05: báo upstream / sửa bản project (cần decision) / bỏ qua.

## Blockers

- Push/PR: chờ D-01.
- `scripts/product-check.mjs` không dùng được (K-01).
- Pilot Codex IMPLEMENTER: chạy ở CP1-01.
