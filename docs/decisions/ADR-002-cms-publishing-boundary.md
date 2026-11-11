# ADR-002 — CMS publishing boundary (Pages CMS ↔ GitHub ↔ Actions)

| Metadata | Value |
|---|---|
| Status | ACCEPTED |
| Date | 2026-11-11 |
| Decision owner | HUMAN LEAD — ACCEPTED 2026-11-11 ("duyệt tất cả", phiên CP0) |
| Gate | security model + project-wide policy + publication permissions |

## Context

- Pages CMS commit nội dung thẳng vào branch của repository bằng **installation token của GitHub App** (docs `configuration/collaborators`). Collaborator mời bằng email (không cần tài khoản GitHub) sửa được content/media đã khai trong `.pages.yml`; **không** sửa được `.pages.yml`, không quản lý collaborator. Thao tác create/rename/delete theo `content.operations`.
- Giới hạn là ở **UI** của Pages CMS; token của App về kỹ thuật có quyền ghi theo quyền App được cấp trên repo.
- Docs Pages CMS không nêu cách pin branch hay hành vi với branch protection → phải thực nghiệm.
- GitHub Pages bản free cần repo **public**: mọi file (kể cả `published: false`) và lịch sử commit đều xem được.
- Source code cần đi qua review + HUMAN LEAD gate; nội dung của thư ký thì không được bị chặn bởi gate đó.

## Options

| | Mô tả | Ưu | Nhược |
|---|---|---|---|
| **A (đề xuất)** | `main` có ruleset "require PR" cho người; **Pages CMS GitHub App là bypass actor**; deploy workflow có job **content-path guard**: commit của bot CMS chạm file ngoài allowlist (`src/content/**`, `public/media/**`) → build fail, không deploy | luồng thư ký không bị chặn; code vẫn qua PR; guard phát hiện ghi ngoài vùng | cần xác minh bypass App trong ruleset với repo public/free; guard chỉ phát hiện, không ngăn commit |
| B | Branch nội dung riêng `content`; Actions merge/deploy từ `content` + `main` | tách hẳn | phức tạp, dễ lệch branch, thư ký thấy trễ |
| C | `main` không bảo vệ; mọi người push thẳng | đơn giản nhất | mất gate review source |

## Decision (đề xuất)

Option **A**, kèm:

1. GitHub App Pages CMS cài **chỉ trên repository này** (không "All repositories"), quyền tối thiểu App yêu cầu.
2. Thư ký: collaborator theo email (mặc định) — hoặc tài khoản GitHub riêng nếu khoa muốn quy trách nhiệm theo GitHub (OPEN DECISION D-03).
3. `settings.commit.identity: user` để commit ghi tên/email người biên tập (trace ai sửa gì) — lưu ý email thư ký sẽ nằm trong lịch sử commit public (D-04).
4. `.pages.yml`, `.github/**`, `src/**` ngoài `src/content/**`: chỉ thay đổi qua PR do HUMAN LEAD merge.
5. Rollback nội dung: `git revert` commit CMS (tech owner) hoặc thư ký sửa lại qua CMS.
6. Nếu thực nghiệm CP2-03 cho thấy ruleset bypass không khả dụng → BLOCKED, quay lại HUMAN LEAD chọn B/C.

## Consequences

- Thư ký publish không cần review; HUMAN LEAD chấp nhận trách nhiệm nội dung thuộc thư ký (brief §12.4).
- Nội dung nhạy cảm không bao giờ được đưa vào CMS (repo public).
