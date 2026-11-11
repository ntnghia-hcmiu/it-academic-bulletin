# Current State

| Metadata | Value |
|---|---|
| Status | OPERATIONAL STATE — NOT AUTHORITY |

Chỉ ghi operational state không suy ra được từ Git, task contract hoặc accepted decisions.

Ngân sách token của file: xem `docs/ai/workflow.md` §10.

## Current focus

CP0 DONE 2026-11-11 (D-01: giữ PUBLIC). Tất cả READY và đã push lên origin (HUMAN LEAD 2026-11-11), chưa có PR: chuỗi stacked CP1-01 → CP1-02 (`258faa7`) → CP1-03 → CP1-04; CP2-01 tách từ `258faa7`. Global data nội dung tên `bulletin`. Stack **Eleventy 3** (ADR-001 Amendment 2). Claude ORCHESTRATOR → Codex IMPLEMENTER: chạy song song 2 worktree (P1) được; evidence trong contract.

## Next proposed action

HUMAN LEAD: mở PR / thứ tự merge chuỗi stacked (+ CP2-01). Sau đó CP1-05 (tìm kiếm), base = HEAD CP1-04.

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
