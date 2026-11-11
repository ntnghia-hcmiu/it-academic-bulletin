# Framework Adoption Record

## Reference

- Framework kit: `ntnghia1908/ai-dev-framework`, branch `main` (chưa có tag release), commit **`7496eac6c8046281da14a04501dc277a18cdc343`** (khớp SHA quan sát trong PROJECT_BRIEF v1.1). Phiên bản Core **v4.4** — đối chiếu `VERSION` = `4.4`, `docs/ai/workflow.md` metadata `Version | 4.4`, `templates/framework.config.json` `frameworkVersion: "4.4"`. (Câu "v4.3" trong README kit không dùng để suy phiên bản.)
- Bootstrap mode: **Mode B — local** (`bash scripts/bootstrap-project.sh <target>` từ clone kit đã pin SHA) vào thư mục dự án trống, sau khi `git init -b main` cục bộ. Không tạo repo từ xa; không dùng Mode A (GitHub Actions bootstrap).
- Adoption date / decision: 2026-11-11 — thực hiện CP0-A theo scope HUMAN LEAD giao trong PROJECT_BRIEF v1.1 §10/§12.6 và yêu cầu phiên 2026-11-11. Chấp nhận chính thức adoption: **chờ HUMAN LEAD** (xem Verification status).

Thay đổi framework sau adoption ghi ở `docs/ai/framework-history.md`.

## Adopted

Dùng nguyên văn, không sửa (đã `cmp` với kit tại SHA pin):

- **Framework Core v4.4:** `docs/ai/workflow.md`, `docs/ai/execution-profiles.md`, `docs/ai/agent-adapter-contract.md`, `docs/ai/adapter-descriptor.schema.json`.
  SHA-256: workflow `b6a2012a…1c63b66`, execution-profiles `842aa387…ca915a`, agent-adapter-contract `f7cac1ca…f32de`, schema `935e573a…2641`.
- **Checker:** `scripts/framework-check.mjs`, `scripts/product-check.mjs` (xem lỗi kit K-01 bên dưới).
- **Tool adapters:** `claude-code` (`adapters/claude-code/`, `.claude/agents/implementer.md`, `.claude/rules/execution.md`, `CLAUDE.md` bridge `@AGENTS.md` nguyên template), `codex` (descriptor + README, không `.codex/*.toml` theo ADR-003 D2), `chatgpt` (Product Agent adapter, giữ cho handoff; không cần runner local).
- **Templates không cần điền:** `docs/tasks/_template.md`, `docs/product/PRODUCT_AGENT.md`, `docs/product/README.md`, `docs/product/requirements/_template.md`.
- **Workflow kit:** `.github/workflows/requirement-to-task.yml` (giữ đúng bootstrap; không hoạt động khi chưa có secret — OPEN DECISION D-08).
- Governance mặc định ADR-003 D6: `taskAuthorization: boundary`, `maxParallelImplementers: 3` (trần), `agents.product: chatgpt`, **không** cố định `agents.orchestrator`.

## Adapted

- **Project Layer:** `AGENTS.md` (mục Project boundary), `docs/ai/project-profile.md` (project, authority order, module map planned/implemented, publishing invariant, integration 2 luồng source/CMS, ownership HUMAN LEAD vs CONTENT OWNER, execution profiles + Danh sách IMPLEMENTER, setup, Test policy), `docs/workflow/current-state.md`, `docs/ai/framework-history.md` (entry adoption dưới `## v4.4`).
- **`framework.config.json`:** giữ toàn bộ mặc định template; chỉ thêm `requiredFiles` / `requiredTokens` riêng project (publishing invariant, ADR stack, boundary proposal) để checker giữ chúng.
- **Parallelism (PD-001, HUMAN LEAD 2026-11-11):** mặc định multi-agent `dual-agent`; `maxParallelImplementers = 3` là giới hạn thực tế được phép (thay quy tắc template "thực tế 1 writer"), vẫn theo điều kiện Core §5 (worktree riêng, owned paths rời nhau).
- **IMPLEMENTER (PD-002, HUMAN LEAD 2026-11-11):** Codex qua `codex exec` khi Claude Code là ORCHESTRATOR (thay mặc định subagent native của ADR-003 cho project này).
- **Integration:** feature branch → review → HUMAN LEAD gate cho push/PR/merge; luồng nội dung CMS tách riêng (ADR-002, PROPOSED).
- **Decision records riêng project** ở `docs/decisions/` (ADR-001, ADR-002, IAB-001, PD-001, PD-002 — ACCEPTED 2026-11-11). ADR-003 của kit được tham chiếu theo SHA pin, không chép vào project.

## Not adopted

- Sửa Framework Core, checker, descriptor schema, `VERSION`, `CLAUDE.md` template — không.
- Adapter `copilot` — không cần cho project.
- `.codex/config.toml`, `.codex/agents/*.toml` — ngoài Phase 1 (ADR-003 D2).
- Orchestrator router, gateway/daemon, gọi lồng Claude ↔ Codex tự động, hai writer trên một task, custom CMS/backend.
- `scripts/codex-usage.py`, `scripts/token-audit.py` — không chép (bootstrap không cài; chép khi cần đo quota/chi phí).
- `docs/ai/PROJECT_BOOTSTRAP.md` — script bootstrap không chép (xem K-02); tham chiếu bản kit tại SHA pin.

## Adoption boundary

Adoption này **KHÔNG** authorize:

- tạo/sửa source ứng dụng (CP1–CP3), thêm dependency, tạo `package.json`, `.pages.yml`, deploy workflow;
- commit (chưa có commit nào), push, tạo repo từ xa, PR, merge, bật GitHub Pages, DNS;
- cài/cấu hình GitHub App (Pages CMS), mời collaborator, đổi sharing Google Drive;
- tạo nội dung học vụ chính thức.

Requirement/architecture/plan của CP0-B đều PROPOSED; cần HUMAN LEAD duyệt `IAB-001` trước khi implement.

## Verification status

- `node scripts/framework-check.mjs` — **PASS** (exit 0) sau khi điền Project Layer, 2026-11-11 (evidence: báo cáo CP0 trong phiên; chạy lại bất kỳ lúc nào).
- Kit test suite tại SHA pin (`node --test` trong clone kit) — **PASS 56/56**.
- Core / checker giống hệt kit (`cmp`) — **PASS**.
- **Pilot S1: CHƯA CHẠY** — không có task nào được authorize. Adoption ở trạng thái **ADOPTED — PILOT PENDING**, chưa được coi là verified hoàn toàn. Pilot: `docs/tasks/CP1-01-scaffold.md` — Claude Code ORCHESTRATOR → Codex IMPLEMENTER (PD-002). P3 (Codex native), P5 (handoff), P6 (cross-review) chưa chạy.
- `scripts/product-check.mjs` — **BLOCKED (lỗi kit K-01)**: không dùng được làm gate cho REQ.

### Lỗi / lệch phát hiện trong kit (báo HUMAN LEAD, không tự sửa)

- **K-01** `scripts/product-check.mjs`: regex bị escape kép (`/^REQ-[0-9]+-.+\\.md$/`, `/^---\\n…/`) → FAIL mọi file REQ hợp lệ ("filename must match…", "missing YAML frontmatter"). Đã tái hiện với template REQ của kit.
- **K-02** `scripts/bootstrap-project.sh` có comment "PROJECT_BOOTSTRAP.md is copied explicitly" nhưng không chép file đó.
- **K-03** `docs/install-new-project.md` bước 5 bảo ghi entry adoption dưới `## v4.3` trong khi Core là v4.4; project ghi dưới `## v4.4` (checker yêu cầu heading khớp Version).
- **K-04** `adapters/codex/README.md` lặp lại các mục (mẫu delegation, config mẫu, "Sự kiện đã tra", "Cài đặt", "Cách chạy") hai lần với nội dung khác nhau.
- **K-05** `.claude/agents/implementer.md` trỏ Test policy ở "project-profile §8" nhưng template đánh số mục Setup/Test policy là §9 (không có §8).
