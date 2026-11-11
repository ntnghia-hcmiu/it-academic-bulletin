# Current State

| Metadata | Value |
|---|---|
| Status | OPERATIONAL STATE — NOT AUTHORITY |

Chỉ ghi operational state không suy ra được từ Git, task contract hoặc accepted decisions.

Ngân sách token của file: xem `docs/ai/workflow.md` §10.

## Current focus

CP0 DONE. `main` có CP1-01…CP1-06, CP2-01, CP3-01, PD-003 (PR #1–#11). Site live: https://ntnghia-hcmiu.github.io/it-academic-bulletin/ (Pages Source = GitHub Actions; environment `github-pages` cho phép `main` + `cp0/framework-adoption`; default branch vẫn `cp0/framework-adoption`). Content guard tắt tới khi đặt biến `CMS_BOT_ACTORS`. Mở: CP2-02 (`cp2/CP2-02-secretary-guide`, chờ thư ký đọc thử; placeholder D-03/D-05/D-06).

## Next proposed action

Chờ thư ký review CP2-02 → READY/merge. Sau đó CP3-02 (HUMAN LEAD chọn chờ CP3-01 + CP2-02 vào `main`, không stack). CP2-03 (CMS thật, xác minh tên bot → biến `CMS_BOT_ACTORS`).

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
