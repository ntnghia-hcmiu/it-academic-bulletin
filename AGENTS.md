# AGENTS.md

Entry point cho mọi agent làm việc trong repository này.

| Cần biết | Ở đâu |
|---|---|
| Quy trình S0/S1/S2, decision gate, lifecycle, review, integration | `docs/ai/workflow.md` |
| IDEA → REQUIREMENT Product Agent | `docs/product/PRODUCT_AGENT.md` |
| Vai trò HUMAN LEAD / ORCHESTRATOR / IMPLEMENTER | `docs/ai/execution-profiles.md` |
| Project này là gì, authority, module, policy, integration | `docs/ai/project-profile.md` |
| Focus, blocker, open decision, next action | `docs/workflow/current-state.md` |
| Task contract S1/S2 | `docs/tasks/_template.md` |
| Lịch sử thay đổi framework sau adoption | `docs/ai/framework-history.md` |

## Bootstrap

Đầu mỗi session/task, đọc theo thứ tự:

1. file này;
2. `docs/ai/project-profile.md`;
3. `docs/workflow/current-state.md`;
4. approved task contract, nếu có;
5. `AGENTS.md` gần nhất của subtree sắp sửa;
6. authority, source và tests liên quan.

Không preload toàn bộ tài liệu. Session mới bootstrap từ repository, không dựa vào transcript chat.

## Native dual-agent (auto-adapt)

CLI đang mở (Claude Code hoặc Codex) tự đề xuất mình là ORCHESTRATOR và giao việc cho subagent native của chính tool đó, chỉ khi: adapter của nó được bật trong `framework.config.json`, hỗ trợ role, không có `agents.orchestrator` cố định mâu thuẫn, và policy của task cho phép. Có binding cố định sang tool khác → dừng, chờ HUMAN LEAD quyết. Chi tiết (mapping native, write concurrency, handoff): `docs/ai/project-profile.md` §7.

## Invariants

- Repository là source of truth; chat/session không thay thế authority, task contract hoặc source/tests.
- Tuân thứ tự authority trong `docs/ai/project-profile.md`.
- File lịch sử không được dùng làm authority hiện hành.
- Không mô tả thành phần mới chỉ được lên kế hoạch như đã implemented.
- Chỉ làm những gì authority và task contract đã duyệt; không âm thầm mở rộng scope.
- Không thay đổi architecture, dependency, security model, public API contract hoặc project-wide policy một cách âm thầm.
- Một normative rule chỉ có một canonical owner; nơi khác chỉ pointer tới rule.
- Không tuyên bố PASS cho verification chưa chạy thành công trong môi trường hiện tại.
- Không sửa test để che lỗi.

## Project boundary

IT Academic Bulletin — website tĩnh thông tin học vụ Khoa CNTT (IU); chi tiết `docs/ai/project-profile.md`.

- Giai đoạn: **CP1 sẵn sàng**. Boundary `docs/decisions/IAB-001-cp1-cp3-implementation-boundary.md` ACCEPTED 2026-11-11; chỉ làm task nằm hoàn toàn trong boundary, theo task contract.
- IMPLEMENTER = **Codex** (`docs/decisions/PD-002-codex-implementer.md`); tối đa 3 song song, mỗi task một worktree (`PD-001`).
- Mọi module ứng dụng là *planned*. Không push, PR, merge, deploy, tạo repo từ xa, cấp quyền GitHub App, đổi sharing Google Drive khi HUMAN LEAD chưa cho phép.
- Không bịa nội dung học vụ (quy định, deadline, email, cán bộ). `published=false` không phải bảo mật — không commit dữ liệu nhạy cảm.
