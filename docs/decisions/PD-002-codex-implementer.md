# PD-002 — IMPLEMENTER là Codex (`codex exec`), ORCHESTRATOR là Claude Code

| Metadata | Value |
|---|---|
| Status | ACCEPTED |
| Date | 2026-11-11 |
| Decision owner | HUMAN LEAD — chỉ đạo trong phiên CP0: "subagent implementer phải là codex" |
| Scope | Project Layer `docs/ai/project-profile.md` §7 (Danh sách IMPLEMENTER); task contracts CP1–CP3. Core v4.4 không đổi |
| Relation | Thay mặc định native (ADR-003 D2 của kit) **cho project này**; dùng đường `codex exec` làm IMPLEMENTER đã mô tả trong `adapters/codex/README.md` |

## Decision

1. Khi Claude Code là ORCHESTRATOR, IMPLEMENTER của mọi task `dual-agent` là **Codex CLI qua `codex exec`** (`Implementer: codex`). Không dùng subagent `implementer` của Claude Code, trừ khi HUMAN LEAD duyệt dự phòng cho task cụ thể.
2. Khi Codex là ORCHESTRATOR, IMPLEMENTER là built-in worker của Codex (vẫn là Codex).
3. Parallel tối đa 3 (PD-001): mỗi IMPLEMENTER là một tiến trình `codex exec -C <worktree riêng>`.
4. ORCHESTRATOR Claude Code review độc lập: contract → diff (gồm untracked) → AC → tự chạy lại verification ngoài sandbox.

## Runtime đã kiểm (2026-11-11, chưa phải pilot task)

- Codex CLI 0.166.0, model mặc định `gpt-6.1-sol` (session `01a1c9bb-653e-7601-83cc-021c67198b37`).
- `-s workspace-write` ghi được file trong `-C <dir>`; `-c sandbox_workspace_write.network_access=true` cho phép tới npm registry.
- `~/.npm` bị read-only trong sandbox → bắt buộc `npm_config_cache=$PWD/.npm-cache` (thư mục được gitignore).
- Luôn đặt `-c model_reasoning_effort=...` rõ (`high` cho module mới, `medium` cho sửa nhỏ).

## Lệnh chuẩn

```text
codex exec -C <worktree> -s workspace-write \
  -c sandbox_workspace_write.network_access=true \
  -c model_reasoning_effort='"high"' \
  -o <scratch>/<task>.out - < <scratch>/<task>.prompt.md > <scratch>/<task>.log 2>&1
```

Prompt theo mẫu "Mẫu delegation prompt" trong `adapters/codex/README.md` + yêu cầu `npm_config_cache`. Không commit/push trong Codex; ORCHESTRATOR commit trên branch task sau review.

## Consequences

- Tiêu hao hạn mức gói Codex (cửa sổ 5 giờ / tuần): ORCHESTRATOR kiểm trước khi fan-out 3 tiến trình.
- Dev server / test cần socket có thể không chạy trong sandbox → ORCHESTRATOR chạy full verification.
- Pilot đầu tiên (CP1-01) ghi evidence: session id, model, effort, tokens, thời gian, diff, verification ORCHESTRATOR chạy lại.
