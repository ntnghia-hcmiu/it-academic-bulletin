# IAB-001 — Implementation Authorization Boundary cho CP1–CP3

| Metadata | Value |
|---|---|
| Status | ACCEPTED |
| Date | 2026-11-11 |
| Decision owner | HUMAN LEAD — ACCEPTED 2026-11-11 ("duyệt tất cả", phiên CP0) |
| Governance mode | `boundary` (`framework.config.json`) |
| Accepted scope | CP1 + CP2 + CP3 trong §1; §6 integration gate vẫn hỏi HUMAN LEAD từng lần |
| Depends on | ADR-001 (stack), ADR-002 (CMS publishing), REQ-001 (requirement) |

> Khi HUMAN LEAD duyệt (ghi `Status | ACCEPTED` + ngày + phạm vi được duyệt), ORCHESTRATOR được tự lập/thực thi task **nằm hoàn toàn trong boundary** dưới đây với `Authorization source: IAB-001`. Mọi thứ ngoài boundary → dừng, báo theo mẫu `Issue → Evidence → Impact → Options → Recommendation`.

Có thể duyệt **từng phần**: IAB-001/CP1, IAB-001/CP2, IAB-001/CP3.

## 1. In scope

| Phần | Được làm | Task |
|---|---|---|
| CP1 | Scaffold stack theo ADR-001 (Eleventy 3 + Tailwind — Amendment 2); layout responsive; routing; trang chủ, thông báo list/detail, danh mục, guides, resources, FAQ, liên hệ, 404; content collections theo `docs/CONTENT_MODEL.md`; seed 9 danh mục (mô tả trung tính) + settings rỗng; tìm kiếm/lọc client; SEO cơ bản; script verify `dist/` | CP1-01 … CP1-06 |
| CP2 | `.pages.yml` ánh xạ đủ collection; nhãn/mô tả field tiếng Việt; `docs/SECRETARY_GUIDE.md`; chuẩn bị checklist acceptance CMS | CP2-01, CP2-02, CP2-03 (phần chuẩn bị) |
| CP3 | `.github/workflows/deploy.yml` (build + content-path guard + deploy Pages); `README.md`, `docs/DEPLOYMENT.md`, checklist bàn giao, quy trình rollback; cấu hình sẵn `site`/`base`, hướng dẫn custom domain (không đổi DNS) | CP3-01, CP3-02 |

## 2. Out of scope (cần decision riêng)

- Dependency ngoài ADR-001; backend, database, form thu dữ liệu sinh viên, đăng nhập sinh viên, Google Drive API, analytics/tracking.
- Nội dung học vụ chính thức (quy định, deadline, email, cán bộ, biểu mẫu) — chỉ thư ký nhập qua CMS.
- Dùng logo/asset IU khi chưa có nguồn và quyền.
- Đổi Core framework, checker, adapter; parallel writers > 1.

## 3. Security / privacy invariants (mọi task)

- Không commit secret/token; workflow chỉ dùng `GITHUB_TOKEN` với `contents: read`, `pages: write`, `id-token: write`.
- Bài `published=false`: không có trang HTML, không trong search index, sitemap, RSS, bundle JS — kiểm tự động bằng `scripts/verify-dist.mjs`.
- Không ghi dữ liệu cá nhân vào repo; seed data chỉ là tên/mô tả danh mục trung tính.
- Link ngoài mở bằng `rel="noopener noreferrer"`; không nhúng script bên thứ ba.

## 4. File ownership

| Path | Owner |
|---|---|
| `src/**` (trừ `src/content/**`), `eleventy.config.js`, `package*.json`, `scripts/verify-dist.mjs`, `tests/**`, `public/**` (trừ `public/media/**`) | agent theo task contract |
| `src/content/**`, `public/media/**` | seed ban đầu do agent (CP1-02); sau bàn giao thuộc **thư ký qua CMS** |
| `.pages.yml`, `.github/workflows/deploy.yml` | agent viết theo task; thay đổi sau bàn giao chỉ qua PR HUMAN LEAD |
| `docs/ai/workflow.md`, `docs/ai/execution-profiles.md`, `scripts/framework-check.mjs`, `adapters/**` | không sửa |

## 5. Execution & testing

- Profile `dual-agent` (multi-agent); IMPLEMENTER = Codex (`codex exec`) theo PD-002, ORCHESTRATOR Claude Code. Tối đa 3 IMPLEMENTER song song theo PD-001 (mỗi người một worktree, owned paths không giao nhau); parallel group P1 = CP1-03 ‖ CP1-04 ‖ CP2-01. CP1-01 là **pilot S1** của Claude ORCHESTRATOR → Codex IMPLEMENTER: ghi evidence session id, model, ORCHESTRATOR tự chạy lại verification.
- Required verification chuẩn: `npm run verify` (xem `docs/ai/project-profile.md` Test policy) + checklist thủ công mobile/keyboard ở task UI.
- Mỗi task: branch riêng `cp<N>/<task-id>-<slug>`, commit cục bộ trên branch được phép trong boundary; **không push**.

## 6. Integration gate (không thuộc boundary — luôn hỏi HUMAN LEAD)

- Tạo repo GitHub, push, PR, merge vào `main`.
- Bật GitHub Pages, cài GitHub App Pages CMS, ruleset/bypass, mời collaborator.
- Chạy acceptance CMS thật (CP2-03 thực thi) và deploy production (CP3-03).
- Custom domain / DNS.

## 7. Stop conditions

Chạm decision gate; verification fail sau 2 vòng; schema Pages CMS thực tế khác docs đến mức đổi content model; thiếu quyền/tài khoản; phát hiện dữ liệu nhạy cảm.
