# Implementation Plan — CP1–CP3

| Metadata | Value |
|---|---|
| Status | ACCEPTED — HUMAN LEAD 2026-11-11 (cùng ADR-001/ADR-002/IAB-001) |
| Date | 2026-11-11 |
| Inputs | REQ-001, ADR-001, ADR-002, IAB-001, `docs/ARCHITECTURE.md`, `docs/CONTENT_MODEL.md`, `docs/SITEMAP.md` |

## 1. Checkpoints

| CP | Kết quả | Exit criteria |
|---|---|---|
| CP0 | Framework adopted + proposal | DONE 2026-11-11: checker PASS; IAB-001 ACCEPTED |
| CP1 | Site tĩnh chạy local | `npm run verify` PASS; 9 danh mục; tìm kiếm/lọc; mobile/a11y thủ công OK |
| CP2 | CMS cho thư ký | `.pages.yml` khớp schema; guide; **acceptance thật** CP2-03 PASS |
| CP3 | Deploy + bàn giao | Actions deploy PASS; rollback đã thử; checklist DoD brief §9 đủ |

## 2. Task graph

```text
CP1-01 scaffold (PILOT S1/P2)
   │
CP1-02 content collections + seed
   ├──────────────┬───────────────┐
CP1-03 trang      CP1-04 trang    CP2-01 .pages.yml
thông báo/danh mục  guides/res/faq/contact   │
   │              │               CP2-02 secretary guide
CP1-05 search     │                  │
   └──────┬───────┘                  │
       CP1-06 SEO/a11y/verify-dist   │
          │                          │
       CP3-01 deploy workflow + guard│
          │                          │
          ├── [INTEGRATION GATE: push main, bật Pages, cài App, ruleset, mời thư ký]
          │                          │
       CP2-03 CMS e2e acceptance (S2) ◄┘
          │
       CP3-02 handover docs
          │
       CP3-03 production release (S2, integration gate)
```

Multi-agent, tối đa **3 IMPLEMENTER song song** (PD-001). Lịch đề xuất:

| Bước | Chạy | Writers |
|---|---|---|
| 1 | CP1-01 (pilot P2) | 1 |
| 2 | CP1-02 | 1 |
| 3 | **Parallel group P1:** CP1-03 ‖ CP1-04 ‖ CP2-01 (owned paths rời nhau, mỗi task 1 worktree; đồng thời là pilot worktree) | 3 |
| 4 | **P2:** CP1-05 ‖ CP2-02 | 2 |
| 5 | CP1-06 → CP3-01 | 1 |
| 6 | gate → CP2-03 → CP3-02 → CP3-03 | 1 |

Chia sẻ file duy nhất có rủi ro: `package.json` (chỉ CP1-01/CP1-06 sửa) — task song song không được sửa.

## 3. Task list

| ID | Class | Tóm tắt | Contract |
|---|---|---|---|
| CP1-01 | S1 | Scaffold, base path, layout — pilot P2 | `docs/tasks/CP1-01-scaffold.md` |
| CP1-02 | S1 | Collections, helper lọc published, seed 9 danh mục | `docs/tasks/CP1-02-content-collections.md` |
| CP1-03 | S1 | Trang chủ, thông báo, danh mục | `docs/tasks/CP1-03-announcement-pages.md` |
| CP1-04 | S1 | Hướng dẫn, biểu mẫu, FAQ, liên hệ | `docs/tasks/CP1-04-guides-resources-faq-contact.md` |
| CP1-05 | S1 | Tìm kiếm/lọc client | `docs/tasks/CP1-05-client-search.md` |
| CP1-06 | S1 | SEO, a11y, verify-dist | `docs/tasks/CP1-06-seo-a11y-verify.md` |
| CP2-01 | S1 | `.pages.yml` | `docs/tasks/CP2-01-pages-cms-config.md` |
| CP2-02 | S1 | Secretary guide | `docs/tasks/CP2-02-secretary-guide.md` |
| CP2-03 | S2 | CMS acceptance thật | `docs/tasks/CP2-03-cms-e2e-acceptance.md` |
| CP3-01 | S1 | Deploy workflow + guard | `docs/tasks/CP3-01-deploy-workflow.md` |
| CP3-02 | S1 | README/DEPLOYMENT/rollback/checklist | `docs/tasks/CP3-02-handover-docs.md` |
| CP3-03 | S2 | Production release | `docs/tasks/CP3-03-production-release.md` |

Tất cả: `Status: DRAFT`, `Implementation authorized: NO`, `Authorization source: PENDING — IAB-001`. Khi IAB-001 ACCEPTED, ORCHESTRATOR cập nhật Authorization source, base commit và chuyển `IN_PROGRESS` cho task đang làm.

## 4. Rủi ro

| Rủi ro | Ảnh hưởng | Giảm thiểu |
|---|---|---|
| Pages CMS hành vi thực tế khác docs (slug tiếng Việt, rich-text, reference, branch) | đổi content model | kiểm sớm ở CP2-01 trên repo thật; dừng nếu đổi model |
| Ruleset bypass cho GitHub App không khả dụng | thư ký bị chặn hoặc mất gate code | ADR-002 option B/C; quyết ở CP2-03 |
| Thư ký vô tình đăng dữ liệu cá nhân vào repo public | lộ dữ liệu vĩnh viễn trong lịch sử | guide + cảnh báo trong CMS description; quy trình xử lý sự cố (rewrite history) ghi ở DEPLOYMENT |
| Tài khoản agent chỉ WRITE | không tự bật Pages/ruleset | đã đưa vào integration gate cho admin |
| Build lỗi do dữ liệu CMS | site không cập nhật | resolve mềm, validate nhẹ, log Actions, hướng dẫn |
| Link Drive mất quyền | sinh viên không mở được | nhãn quyền truy cập; thư ký kiểm định kỳ |
