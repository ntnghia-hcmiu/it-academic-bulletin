# Current State

| Metadata | Value |
|---|---|
| Status | OPERATIONAL STATE — NOT AUTHORITY |

Chỉ ghi operational state không suy ra được từ Git, task contract hoặc accepted decisions.

Ngân sách token của file: xem `docs/ai/workflow.md` §10.

## Current focus

CP0 DONE 2026-11-11 (D-01: giữ PUBLIC). CP1-01 READY (AC3 PASS), branch `cp1/CP1-01-scaffold`; CP1-02 READY, branch `cp1/CP1-02-content-collections` stacked trên CP1-01 (cả hai chưa push). Global data nội dung tên `bulletin` (`content` bị Eleventy giữ). Stack đổi sang **Eleventy 3** (ADR-001 Amendment 2) vì VM dev thiếu AVX2 (Astro 7) và Astro 6 có advisory critical. Pilot Claude ORCHESTRATOR → Codex IMPLEMENTER: chạy được, evidence trong contract CP1-01.

## Next proposed action

HUMAN LEAD: quyết push/PR cho CP1-01 + CP1-02 (stacked). Sau đó parallel group P1 (CP1-03 ‖ CP1-04 ‖ CP2-01), base = HEAD CP1-02.

## Open decisions

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

- `scripts/product-check.mjs` không dùng được (K-01).
- VM dev (VMware) không expose AVX/AVX2 — tránh dependency có binary native đòi AVX2.
