# Project Profile — IT Academic Bulletin (Cổng thông tin học vụ Khoa CNTT, IU)

| Metadata | Value |
|---|---|
| Status | CURRENT |
| Project stage | CP0 xong; ADR-001/002, IAB-001, PD-001/002 ACCEPTED 2026-11-11; CP1 sẵn sàng (pilot S1 = CP1-01) |

Canonical owner cho: project là gì, authority order, module map, project policy, integration mechanism, execution profile được phép, setup và Test policy.

## 1. Project

**Mục tiêu.** Website tĩnh công khai cung cấp thông tin học vụ cho sinh viên Khoa CNTT, Trường Đại học Quốc tế (IU). Thư ký khoa tự quản lý nội dung hằng ngày qua giao diện web CMS, không cần Git/CLI/Markdown thủ công.

**Repository:** `https://github.com/ntnghia-hcmiu/it-academic-bulletin` (PUBLIC; rỗng tại 2026-11-11; owner `ntnghia-hcmiu`). Local clone: remote `origin` đã cấu hình, **chưa push**. Tài khoản `gh` của agent (`ntnghia1908`) có quyền WRITE, không admin → bật Pages, ruleset, cài GitHub App phải do admin repo làm.

**Phạm vi MVP.** Trang chủ, thông báo (danh sách/chi tiết/tìm kiếm/lọc), danh mục học vụ, hướng dẫn, biểu mẫu/tài liệu (link), FAQ, liên hệ; CMS cho thư ký; deploy tĩnh.

**Ngoài phạm vi MVP.** Đăng nhập sinh viên, dữ liệu cá nhân, nộp đơn online, workflow duyệt đa cấp, backend/database riêng, đồng bộ Google Drive API/Sheets, hẹn giờ đăng, dịch vụ trả phí.

**Tham chiếu bên ngoài (KHÔNG phải source of truth):**

- `PROJECT_BRIEF.md` v1.1 (2026-11-11) — đầu vào IDEA; không phải requirement đã duyệt.
- Google Drive thư mục học vụ (ID ghi ở `docs/CONTENT_MODEL.md`) — nguồn tham khảo phân loại; không được suy ra file nào đã công khai hay chính xác. Tại 2026-11-11 các thư mục không trả về file nào.
- Trang School of Business bulletin — chỉ tham khảo cách tổ chức thông tin; không sao chép giao diện, nội dung, liên hệ.

## 2. Authority order

1. HUMAN LEAD decisions / accepted decision records (`docs/decisions/`) / approved Implementation Authorization Boundary / task contracts có authorization hợp lệ;
2. `docs/ai/workflow.md`, `docs/ai/execution-profiles.md` (Core v4.4, không sửa) và file này;
3. requirement (`docs/product/requirements/`) đã được HUMAN LEAD chấp nhận; `docs/ARCHITECTURE.md`, `docs/CONTENT_MODEL.md` chỉ là authority khi decision record tương ứng ACCEPTED;
4. source code và tests hiện hành;
5. `docs/workflow/current-state.md` — operational state, không phải authority;
6. README, `docs/SECRETARY_GUIDE.md`, tài liệu onboarding — mô tả / cross-link.

**Nội dung học vụ chính thức:** thư ký khoa (CONTENT OWNER / PUBLISHER) là người duy nhất quyết định nội dung nào được xuất bản là chính thức, qua CMS. Agent không tạo, suy diễn hay "điền hộ" quy định, deadline, điều kiện, email, tên cán bộ.

**Đã có authority (2026-11-11):** ADR-001 stack, ADR-002 CMS publishing, IAB-001 boundary, PD-001 parallel, PD-002 Codex implementer. **Chưa quyết:** repo public/private (D-01), domain riêng, các D-xx trong current-state.

## 3. Module map

Tất cả module ứng dụng hiện là **planned**; chưa có file nào được implement.

| Path | Vai trò | Trạng thái | Rule riêng |
|---|---|---|---|
| `src/pages/` | routing Astro (trang chủ, thông báo, danh mục, tài liệu, FAQ, liên hệ, 404) | planned | `docs/ARCHITECTURE.md` (ACCEPTED) |
| `src/layouts/`, `src/components/` | layout responsive, component UI | planned | như trên |
| `src/content/` | nội dung do CMS ghi (Markdown/YAML/JSON) | planned | `docs/CONTENT_MODEL.md` (ACCEPTED); agent không tạo nội dung học vụ giả |
| `src/content.config.ts` | schema content collections | planned | khớp `.pages.yml` |
| `src/lib/` | helper thuần (lọc published, sắp xếp, chuẩn hóa tìm kiếm) | planned | — |
| `public/media/` | ảnh nhỏ do CMS upload | planned | không chứa tài liệu nội bộ |
| `.pages.yml` | cấu hình Pages CMS | planned | thuộc HUMAN LEAD/tech owner; thư ký không cần sửa |
| `.github/workflows/deploy.yml` | build + deploy GitHub Pages | planned | integration gate |
| `.github/workflows/requirement-to-task.yml` | workflow kit (Claude Code Action) | implemented (từ kit), **không hoạt động** khi chưa có secret `ANTHROPIC_API_KEY` | OPEN DECISION D-08 |
| `scripts/framework-check.mjs`, `scripts/product-check.mjs` | checker kit | implemented (từ kit) | không sửa; xem `FRAMEWORK_ADOPTION.md` |
| `docs/` | governance, product, kiến trúc, task | implemented (CP0) | — |

## 4. Project policy

- **Ngôn ngữ:** giao tiếp với HUMAN LEAD, tài liệu user-facing và hướng dẫn thư ký bằng tiếng Việt; identifiers, tên field, canonical contract fields bằng tiếng Anh. Giữ thuật ngữ quen dùng: Internship, Add/Drop.
- **Publishing invariant:** `published=false` chỉ ẩn khỏi frontend (không sinh trang HTML, không có trong chỉ mục tìm kiếm, sitemap, bundle JS). Nó **không bảo mật** dữ liệu: mọi thứ commit vào repository public đều có thể bị xem, kể cả bản nháp và lịch sử Git. Không đưa điểm, danh sách sinh viên, hồ sơ, thông tin cá nhân, tài liệu nội bộ hay chưa được phép công khai vào repository hoặc build artifact.
- **Không bịa nội dung:** không có nguồn xác thực → hiển thị trạng thái "Nội dung đang được cập nhật"; không lorem ipsum/filler trong production; không tạo thông báo giả.
- **Google Drive:** chỉ tham chiếu link do thư ký kiểm tra quyền xem; tài liệu cần đăng nhập gắn nhãn "Yêu cầu tài khoản IU". Agent không đổi quyền chia sẻ Drive, không tự công khai file.
- **Secrets:** không commit token, private key, secret; GitHub App chỉ quyền tối thiểu trên đúng repository.
- **Dependency:** mọi dependency mới là decision gate (`docs/ai/workflow.md` §3). Danh sách dependency được đề xuất ở `docs/decisions/ADR-001-static-site-stack.md`; chỉ dùng khi ADR/boundary được ACCEPTED.
- **Asset IU:** chỉ dùng logo/asset khi có quyền và nguồn chính thức do khoa cung cấp.
- **Accessibility/UX:** mobile-first, điều hướng bàn phím, tương phản đủ (mục tiêu WCAG 2.1 AA), tiêu đề có thứ bậc, link mô tả rõ.

## 5. Integration mechanism

Hai luồng tách biệt:

**A. Source / cấu hình / governance (agent + tech owner):** feature branch `cp<N>/<task-id>-<slug>` từ `main` → commit trên branch → ORCHESTRATOR review → READY → **HUMAN LEAD** quyết push, tạo PR, merge vào `main`. Agent không tự push/PR/merge/deploy. Remote `origin` = repo ở §1; mọi push/PR/merge do HUMAN LEAD cho phép từng lần (hoặc theo policy integration được duyệt sau).

**B. Nội dung (thư ký qua Pages CMS):** Pages CMS commit trực tiếp vào branch nội dung đã cấu hình → GitHub Actions build & deploy. Luồng này không đi qua task contract hay review của agent; quyền ghi giới hạn bởi cấu hình `.pages.yml` và cơ chế bảo vệ đề xuất ở `docs/decisions/ADR-002-cms-publishing-boundary.md` (ACCEPTED). Thư ký không cần quyền sửa `.pages.yml`, workflow hay cài GitHub App.

Với `governance.taskAuthorization=boundary`, task nằm hoàn toàn trong Implementation Authorization Boundary đã được HUMAN LEAD chấp thuận không cần APPROVE TASK riêng; integration gate vẫn giữ nguyên.

## 6. Ownership

| Vai trò | Người | Giữ quyền |
|---|---|---|
| HUMAN LEAD / TECH OWNER | Quản trị repository (phụ trách kỹ thuật) | scope, architecture, dependency, security/privacy, quyền CMS/GitHub App, repo public/private, domain/DNS, push/PR/merge/deploy, sở hữu tài khoản GitHub |
| CONTENT OWNER / PUBLISHER | Thư ký Khoa CNTT | toàn quyền nội dung qua CMS: tạo/sửa/ẩn/xóa thông báo, hướng dẫn, tài liệu, FAQ, liên hệ, danh mục, trang chủ; quyết nội dung nào là chính thức |
| ORCHESTRATOR | CLI đang mở (Claude Code hoặc Codex) theo §7 | task graph, contract, review, verification, báo READY/BLOCKED |
| IMPLEMENTER | subagent native theo §7 | viết code trong owned paths của task |

HUMAN LEAD không cần duyệt từng bài viết học vụ do thư ký xuất bản trong phạm vi quyền CMS đã chấp thuận.

## 7. Execution profiles

Profile **mặc định: `dual-agent` (multi-agent)**, native; `single-agent` chỉ khi HUMAN LEAD duyệt cho task cụ thể. Song song tối đa **3 IMPLEMENTER** theo `docs/decisions/PD-001-multi-agent-parallel-implementers.md` (ACCEPTED 2026-11-11). Profile của từng task là source of truth; không suy đoán profile từ tool/model.

### Governance mode

`boundary` (`framework.config.json`). Boundary hiện hành: `docs/decisions/IAB-001-cp1-cp3-implementation-boundary.md` — **ACCEPTED 2026-11-11** cho CP1–CP3; integration gate (§6 của IAB-001) vẫn hỏi HUMAN LEAD.

### Execution profile ưu tiên: native dual-agent

- Ưu tiên `dual-agent` với subagent **native của cùng tool** đang mở; `single-agent` vẫn dùng được khi HUMAN LEAD duyệt cho task. Profile của task đã duyệt không đổi chỉ vì mở CLI khác; native delegation không khả dụng thì xin duyệt phương án khác, không tự hạ profile.
- Mapping (PD-002 thay mặc định native): Claude Code main session (ORCHESTRATOR) → **Codex qua `codex exec`**; Codex main session (ORCHESTRATOR) → built-in native worker. Không hard-code model ID; model thực tế do runtime/user quyết và phải ghi nhận khi pilot (xem README adapter).
- `governance.maxParallelImplementers = 3` là **giới hạn được phép thực tế** cho project này (PD-001, thay quy tắc "thực tế 1 writer" của template). Mỗi parallel group vẫn phải thỏa `docs/ai/workflow.md` §5: mỗi IMPLEMENTER một branch + git worktree riêng, owned paths không giao nhau, dependency thỏa, không có decision chưa chốt, verification độc lập; thiếu điều kiện → serialize. Subagent dùng chung quyền của process cha; thread riêng không phải worktree — bắt buộc isolation worktree. Parallel group đầu tiên ghi evidence như pilot worktree.
- `boundary` mode là chế độ governance, không phải authorization: project mới **chưa có boundary được duyệt** nên phải DỪNG, không sửa source project cho tới khi HUMAN LEAD định nghĩa và duyệt boundary (hoặc duyệt task theo `task` mode).
- Handoff: đổi CLI giữa các task độc lập dùng bootstrap repository + authorization của task mới. Đổi giữa chừng một task cần HUMAN LEAD duyệt rõ; handoff prompt theo `docs/ai/workflow.md` §9. Trước khi nhận: kiểm boundary/task, branch/base/HEAD, `git status --short --untracked-files=all`, `git worktree list` và xác nhận session cũ đã dừng; writer mơ hồ → STOP/BLOCKED.
- Không có gateway, daemon, router, hay gọi lồng `claude -p` ↔ `codex exec` tự động. Cross-provider review chỉ read-only và tùy chọn (ADR-003 D5).

**Runtime quan sát 2026-11-11 (chưa phải evidence pilot):** Claude Code 2.1.322; Codex CLI 0.166.0 (README adapter ghi kiểm chứng trên 0.163.0 — kiểm lại cờ khi pilot). Pilot P2 (Claude native) và P3 (Codex native) **chưa chạy**.

### Danh sách IMPLEMENTER

Canonical owner cho việc tool nào được làm IMPLEMENTER của task `dual-agent`; HUMAN LEAD duyệt danh sách adapter được phép. Tên model / vendor chỉ ghi ở đây và ở adapter, không ghi vào Core.

| Adapter | Điểm mạnh | Giới hạn | Dùng khi | Dự phòng |
|---|---|---|---|---|
| `codex` — **mặc định bắt buộc (PD-002)**: `codex exec` khi Claude Code là ORCHESTRATOR; built-in worker khi Codex là ORCHESTRATOR | dùng hạn mức gói Codex thay ORCHESTRATOR; vendor khác → review chéo tự nhiên | sandbox `workspace-write`: cần `network_access=true` + `npm_config_cache=$PWD/.npm-cache`; socket/dev server có thể không chạy → ORCHESTRATOR chạy full verification; quota 5 giờ/tuần — ngưỡng chuyển dự phòng (HUMAN LEAD 2026-11-11): cửa sổ 5 giờ ≥ 95 % hoặc tuần ≥ 97 % (thay gợi ý 85 % / 80 % của README adapter); kiểm bằng `codex-usage.py` của kit trước mỗi lần giao | mọi task `dual-agent` | `claude-code` subagent — chỉ khi HUMAN LEAD duyệt cho task |
| `claude-code` (subagent native `implementer`) | native, chạy được dev server | dùng hạn mức Claude | **chỉ dự phòng** có duyệt | — |

Cách chọn:

- ORCHESTRATOR chọn IMPLEMENTER lúc viết task contract và ghi vào field `Implementer`. Trong `boundary` mode, lựa chọn này không cần APPROVE TASK riêng; vẫn phải nằm trong danh sách adapter được phép.
- Không đổi IMPLEMENTER giữa task (một writer trên một branch), trừ dự phòng đã khai ở bảng (hạn mức, auth, lỗi tool, circuit breaker); ghi việc đổi vào Result.
- Nhiều IMPLEMENTER (tối đa 3) chạy song song khi task graph chứng minh độc lập, mỗi người một branch/worktree, ownership không giao nhau và không vượt `governance.maxParallelImplementers` (`docs/ai/workflow.md` §5, PD-001). Không tạo parallelism giả.
- `codex exec` làm IMPLEMENTER cho ORCHESTRATOR Claude (và ngược lại) là đường tùy chọn của adapter, không dùng khi chưa có approval riêng.

## 9. Setup / tools

- Runtime: Node.js ≥ 20 (máy dev hiện: v24.21.0, npm 11.19.0). Git; GitHub CLI chỉ dùng read-only khi chưa được phép.
- Ứng dụng (planned, sau khi ADR-001 ACCEPTED): `npm ci`, `npm run dev`, `npm run build`, `npm run check`, `npm test`. Dependency được duyệt: chưa có — xem `docs/decisions/ADR-001-static-site-stack.md`.
- Session context handoff: ngưỡng mặc định Core (250k token).

Framework checker: `node scripts/framework-check.mjs`.

### Test policy

Canonical owner; áp dụng cho mọi IMPLEMENTER bất kể tool.

- Trong vòng sửa: chạy test liên quan tới thay đổi (file hoặc bộ lọc theo tên), ưu tiên dừng ở lỗi đầu tiên với traceback ngắn.
- Toàn bộ suite: một lần trước khi báo READY và một lần sau mỗi vòng fix review; không chạy toàn bộ sau từng lần sửa.
- Lệnh chuẩn chạy toàn bộ suite: hiện tại (chưa có source) `node scripts/framework-check.mjs`. Sau CP1 (planned, chờ ADR-001): `npm run verify` = `astro check` + `node --test` (helper thuần) + `astro build` + `node scripts/verify-dist.mjs` (không lộ bài `published=false`, link nội bộ không gãy, base path đúng) + `node scripts/framework-check.mjs`.
- Acceptance CMS (CP2) là kiểm thử thủ công end-to-end với tài khoản thư ký thật; không mô phỏng, không claim PASS khi chưa chạy — ghi `NOT RUN / BLOCKED` kèm lý do.
- Không nới `docs/ai/workflow.md` §7: required verification trong task contract vẫn phải chạy và PASS trước READY.
