# Current State

| Metadata | Value |
|---|---|
| Status | OPERATIONAL STATE — NOT AUTHORITY |

Chỉ ghi operational state không suy ra được từ Git, task contract hoặc accepted decisions.

Ngân sách token của file: xem `docs/ai/workflow.md` §10.

## Current focus

CP0 DONE. CP1-01…CP1-06 + CP2-01 đã merge vào `main` (PR #1–#7, merge commit; `main` tạo tại `23c8edb` 2026-11-11). HUMAN LEAD 2026-11-11 giao ORCHESTRATOR push/PR/merge khi task READY (chỉ đạo trong session; chưa ghi decision record). Mở: CP2-02 (`cp2/CP2-02-secretary-guide`, chờ HUMAN LEAD + thư ký review; placeholder D-03/D-05/D-06), CP3-01 (draft PR #8, chờ integration gate). Default branch repo vẫn `cp0/framework-adoption` (đổi cần admin, D-02).

## Next proposed action

HUMAN LEAD: bật GitHub Pages (Source: GitHub Actions) → cho merge PR #8 (deploy đầu tiên, chạy thật CP3-01); đổi default branch sang `main`. Sau đó CP3-02 (cần CP3-01 + CP2-02), CP2-03 (CMS thật, xác minh tên bot → biến `CMS_BOT_ACTORS`).

## Open decisions

- D-02 Ai giữ quyền admin repo lâu dài (bật Pages, ruleset, App)? Agent chỉ có WRITE.
- D-03 Thư ký: collaborator theo email hay tài khoản GitHub; 1 hay nhiều người.
- D-04 `commit.identity: user` (ghi email thư ký vào commit public) hay `app`.
- D-05 Domain: tạm `ntnghia-hcmiu.github.io/it-academic-bulletin`?
- D-06 Link Drive thư mục danh mục: hiển thị hay để trống tới khi thư ký kiểm quyền.
- D-07 Logo/nhận diện IU được phép dùng?
- D-08 Giữ, tắt hay xóa `.github/workflows/requirement-to-task.yml` (kit; cần secret `ANTHROPIC_API_KEY`, quyền `contents: write`).
- D-09 "Thông báo học vụ" giữ là danh mục riêng?
- D-11 Lỗi kit K-01…K-05: báo upstream / sửa bản project (cần decision) / bỏ qua.

## Blockers

- `scripts/product-check.mjs` không dùng được (K-01).
- VM dev (VMware) không expose AVX/AVX2 — tránh dependency có binary native đòi AVX2.
