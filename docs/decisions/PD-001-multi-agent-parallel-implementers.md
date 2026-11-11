# PD-001 — Mặc định multi-agent, tối đa 3 IMPLEMENTER song song

| Metadata | Value |
|---|---|
| Status | ACCEPTED |
| Date | 2026-11-11 |
| Decision owner | HUMAN LEAD — chỉ đạo trong phiên CP0 ngày 2026-11-11: "cấu hình mặc định phải là multi agent và cho phép tối đa 3 implementers" |
| Scope | Project Layer (`docs/ai/project-profile.md` §7, `framework.config.json`); Core v4.4 không đổi |
| Supersedes | quy tắc template "số writer đồng thời thực tế là 1 cho tới pilot worktree" (ADR-003 D3 của kit) — **cho project này** |

## Decision

1. Execution profile mặc định của mọi task: `dual-agent` (multi-agent: 1 ORCHESTRATOR + 1..N IMPLEMENTER instance native). `single-agent` chỉ khi HUMAN LEAD duyệt cho task.
2. `governance.maxParallelImplementers = 3` là **giới hạn được phép thực tế**: ORCHESTRATOR được fan-out tới 3 IMPLEMENTER đồng thời trên các task độc lập, không cần xin duyệt riêng từng lần, trong boundary đã duyệt.
3. Điều kiện của Core `docs/ai/workflow.md` §5 vẫn bắt buộc cho mỗi parallel group: dependency thỏa; owned paths không giao nhau; không có shared decision chưa chốt; **mỗi IMPLEMENTER một branch + git worktree riêng**; verification độc lập; ≤ 3. Thiếu bất kỳ điều kiện nào → serialize.
4. Một task vẫn chỉ có một writer. Parallel là task-level fan-out.

## Consequences

- Parallel group đầu tiên chạy được coi là **pilot worktree**: ORCHESTRATOR ghi evidence (worktree path, branch, owned paths, model thực tế, verification từng nhánh, `git worktree list`) vào Result của các task trong group.
- Subagent native dùng chung quyền process cha: tách worktree (vd Claude Code `isolation: worktree` hoặc `git worktree add`) là bắt buộc, prompt không thay thế isolation.
- ORCHESTRATOR merge các branch song song vào branch tích hợp theo thứ tự, chạy lại full verification sau tích hợp trước READY.
