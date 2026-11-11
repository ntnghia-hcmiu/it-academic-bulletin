# PROJECT BRIEF — Cổng thông tin học vụ Khoa CNTT (IU)

**Ngày lập:** 2026-11-11  
**Trạng thái:** Kế hoạch MVP v1.1 — CP0 bắt đầu bằng adaptation ai-dev-framework v4.4.  
**Người quản trị nội dung chính:** Thư ký Khoa CNTT.  
**Người phụ trách kỹ thuật:** Quản trị repository, hệ thống triển khai, cấu hình và hỗ trợ.

## 1. Mục tiêu và nguyên tắc

Xây dựng một **website thông tin học vụ công khai** dành cho sinh viên Khoa Công nghệ Thông tin, Trường Đại học Quốc tế (IU), tham khảo cách tổ chức nội dung của https://sites.google.com/hcmiu.edu.vn/bulletin-sob/home nhưng **không sao chép nguyên giao diện, nội dung hay thông tin liên hệ của Khoa QTKD**.

**Ưu tiên số 1:** Thư ký khoa phải tự làm được các việc hằng ngày bằng giao diện web: đăng thông báo, sửa/ẩn/xóa thông báo, tạo bài hướng dẫn, cập nhật biểu mẫu/tài liệu, thay đổi FAQ và liên hệ, điều chỉnh nội dung trang chủ — không cần Git, GitHub CLI, viết Markdown thủ công hay Claude Code.

MVP là cổng nội dung, **không phải hệ thống sinh viên**: không đăng nhập sinh viên, không dữ liệu cá nhân, không nộp đơn online, không workflow duyệt đa cấp, không backend riêng.

## 2. Nguồn nội dung đã được khảo sát

**Thư mục gốc:** https://drive.google.com/drive/u/0/folders/1ZK-ml3rjNL-deOQb5rAvNbrrMFEuFTEh

Đã xác định 9 thư mục cấp 1:

| Slug gợi ý | Nhãn hiển thị | Google Drive folder ID |
|---|---|---|
| thong-bao-hoc-vu | Thông báo học vụ | `154XYlpHgxj1rXgC4cjQfB4wOtNKxoVTe` |
| chuong-trinh-dao-tao | Chương trình đào tạo | `1YwZ4KxE7ZZ4UxlzuBiX2pfoy2Uldzcgu` |
| dang-ky-mon-hoc | Đăng ký môn học / Add-Drop | `1tPwbUz3p9y0-58stztIgfBiQNRSnNbba` |
| dang-ky-chuyen-nganh | Đăng ký chuyên ngành | `18W6kv2GfijrlGF2z7aicTpcGDx0NEuZy` |
| chuyen-nganh-chuong-trinh | Chuyển ngành / Chuyển chương trình | `1UvzNKUTE-RrwlV9KU8gl0Ha-JgG3CF5C` |
| internship | Internship / Thực tập | `1TVf0EcTXxOmiIZFrgvVFU-9ViyZ3gxlj` |
| giay-gioi-thieu-thuc-tap | Giấy giới thiệu thực tập | `10Mb1hdf_I5oCFSBMIlCpzH3VvtltmAvb` |
| tot-nghiep | Tốt nghiệp | `17aUZ4XsNkO6nGeYVf6yqP8_UB28NRr-k` |
| tam-dung-thoi-hoc-gia-han | Tạm dừng / Thôi học / Gia hạn | `1JW3ctff56-44i2tChWj-2zAg8jW29-wG` |

Trong mục **Giấy giới thiệu thực tập** có 2 thư mục con:
- `Form giới thiệu`: `1Skk8I4QpZHNcYiLSTERnrQVEBo50l3N4`
- `Form giới thiệu dành cho Công ty Bosch`: `1H716qYEaJp-ZqWspxs5UcKpKNby1bJdI`

**Kết quả đọc Drive ngày 11/11/2026:** Các thư mục trên, kể cả hai thư mục con, không trả về file tài liệu nào. Vì vậy **chỉ có tên thư mục làm nguồn phân loại**, chưa có nội dung quy định, deadline, biểu mẫu thực tế hoặc thông tin cán bộ được xác thực. Không tự bịa nội dung/điều kiện/thời hạn/email. Nếu Claude Code không có quyền đọc Drive, dựa trên bảng này và sử dụng liên kết thư mục gốc. Không tự động công khai tất cả file Drive.

## 3. Kiến trúc chốt cho MVP

- **Frontend / static site:** Astro + TypeScript + Tailwind CSS, responsive, giao diện tiếng Việt.
- **Hosting:** GitHub Pages, deploy bằng GitHub Actions sau khi build thành HTML/CSS/JS tĩnh.
- **CMS biên tập:** Hosted Pages CMS (https://app.pagescms.org/), cấu hình `.pages.yml` trong repository; không tự viết admin CMS mới.
- **Lưu nội dung:** Markdown có frontmatter và/hoặc JSON/YAML trong GitHub repository, được Pages CMS tạo và chỉnh sửa.
- **Tài liệu, PDF, Word, biểu mẫu:** ưu tiên giữ trong Google Drive và tham chiếu bằng **liên kết được thư ký kiểm tra quyền xem**; ảnh minh họa nhỏ có thể đưa vào thư mục media của repo qua CMS.
- **Không cần** MySQL, Spring Boot, Firebase, Google Sheets sync, Google Drive API, Google OAuth hoặc máy chủ riêng trong MVP.
- **Repo:** dùng repo hiện có nếu được cung cấp; nếu chưa có, khởi tạo repo đề xuất `it-academic-bulletin`. Không tạo repo công khai, kết nối tài khoản, bật Pages hoặc cấp quyền bên thứ ba mà chưa được người dùng cho phép.

### Luồng xuất bản

Thư ký khoa → đăng nhập Pages CMS → chọn loại nội dung → nhập/sửa thông tin, chọn `Đã xuất bản` → lưu → commit vào repository → GitHub Actions build & deploy → sinh viên xem trên website.

Cần **thực nghiệm thực tế** luồng đăng nhập thư ký bằng email invite/collaborator, cập nhật, ẩn/xóa, commit/deploy. Không coi cấu hình CMS thành công nếu thư ký chưa làm được end-to-end. Phân biệt rõ địa chỉ trang công khai và địa chỉ đăng nhập CMS.

**Chủ sở hữu GitHub/repository** vẫn do phụ trách kỹ thuật nắm; thư ký **toàn quyền về nội dung** nhưng không bắt buộc có quyền thay đổi `.pages.yml`, GitHub Actions hoặc cài GitHub App. Pages CMS hỗ trợ collaborator theo email; phải kiểm chứng hành vi phiên bản đang triển khai.

## 4. Sitemap và trang cần có

1. **Trang chủ:** thông báo mới, thông báo quan trọng, nhóm thủ tục thường dùng, ô tìm kiếm, hướng dẫn nhanh và liên hệ.
2. **Thông báo:** danh sách, tìm kiếm, lọc theo danh mục, ngày đăng, sắp xếp mới nhất; trang chi tiết.
3. **Danh mục học vụ:** các danh mục từ Drive như bảng ở Mục 2; mỗi danh mục có mô tả, bài hướng dẫn, liên kết tài liệu/biểu mẫu và các thông báo liên quan.
4. **Biểu mẫu / Tài liệu:** danh sách link có nhãn, mô tả, loại tài liệu, nhóm học vụ, đường dẫn Drive, ngày cập nhật.
5. **FAQ:** câu hỏi thường gặp theo danh mục (chưa có câu trả lời xác thực thì để rỗng/chưa cập nhật).
6. **Liên hệ:** nhân sự học vụ và trách nhiệm từng người; chỉ xuất bản thông tin do khoa xác nhận.

Không đặt mục 'Thesis / Pre-thesis' thành nội dung chính thức nếu chưa có nguồn; cấu trúc CMS có thể tạo thêm danh mục sau mà không sửa source code.

## 5. Mô hình nội dung CMS

Tạo các collection hoặc file cấu hình sau, tất cả chỉnh được bởi thư ký (trừ cấu hình kỹ thuật):

**A. Announcements**
- `title` (required)
- `summary`
- `body` (rich text)
- `category` (reference to categories, hoặc phương án tương thích đã kiểm chứng)
- `published` (boolean, mặc định false)
- `important` (boolean)
- `published_date` (date, chỉ hiển thị khi published)
- `deadline` (optional date)
- `attachments` (danh sách `{ label, url }` hoặc cấu trúc tương đương)
- `slug` (stable, URL-safe)

**B. Categories**
- `name`, `slug`, `description`, `order`, `published`, `drive_folder_url`
- Thư ký có thể thêm, sửa tên, sắp xếp, ẩn danh mục mà không sửa mã nguồn.

**C. Guides**
- `title`, `category`, `body` rich-text, `attachments`, `updated_date`, `published`.

**D. Resources**
- `title`, `description`, `category`, `external_url`, `file_type`, `updated_date`, `published`.

**E. FAQ**
- `question`, `answer` rich-text, `category`, `order`, `published`.

**F. Site settings / Contacts**
- `site_title`, `intro`, danh sách email/đầu mối do khoa cung cấp, `contact_note`, footer; không hardcode thông tin chưa xác minh.

**Quy tắc hiển thị:** `published=false` không xuất hiện trên website; bài không có nội dung thật sẽ hiện trạng thái 'Đang cập nhật' tại khu vực danh mục, không tạo dữ liệu giả làm thông báo chính thức. Không giả định CMS hỗ trợ hẹn giờ đăng; MVP chỉ có thao tác bật/tắt xuất bản. Ngày deadline là dữ liệu, không tự động thay thế tình trạng xuất bản.

## 6. UI/UX yêu cầu

- Tham khảo phong cách cổng thông báo của School of Business nhưng thiết kế mới, sáng sủa, ít chữ thừa, chuyên nghiệp theo nhận diện IU (chỉ dùng logo/asset nếu có quyền sử dụng và nguồn chính thức).
- **Mobile-first:** trải nghiệm tốt trên điện thoại của sinh viên.
- Tiếng Việt là mặc định; giữ tên Internship, Add/Drop như thuật ngữ quen dùng.
- Trang chủ thấy ngay mục quan trọng, deadline (nếu có), menu danh mục và thanh tìm kiếm.
- Hỗ trợ keyboard navigation, màu đủ tương phản, tiêu đề có thứ bậc, mô tả link dễ hiểu.
- Empty state rõ ràng ('Nội dung đang được cập nhật') và không hiển thị text filler/lorem ipsum khi production.
- SEO cơ bản: title, description, sitemap, canonical URL; kiểm tra base path để chạy cả ở `username.github.io/repo/` và domain riêng sau này.

## 7. An toàn, quyền truy cập và vận hành

- **Chỉ xuất bản nội dung công khai:** không đưa điểm, danh sách sinh viên, hồ sơ, thông tin cá nhân, tài liệu nội bộ vào repo public, HTML output, bundle JS hay link Drive công khai.
- GitHub Pages bản free thường cần public repo. Mọi dữ liệu commit trong public repo đều có thể bị xem, kể cả file `published: false`. Chế độ draft **không phải bảo mật**. Nội dung nhạy cảm phải ở nơi riêng, không lưu trong CMS GitHub public.
- Kiểm tra link Google Drive: tài liệu phải được chủ sở hữu cho phép công khai; tài liệu cần đăng nhập nội bộ thì gắn nhãn 'Yêu cầu tài khoản IU', không tự sửa quyền chia sẻ.
- GitHub App chỉ cấp quyền tối thiểu cần thiết trên đúng repository; không commit tokens, private keys, secrets.
- Việc xóa file trong Git không xóa lịch sử commit; tránh đưa tài liệu mật lên repo ngay từ đầu.
- Không triển khai form có chứa dữ liệu sinh viên qua GitHub Pages tĩnh.
- Lưu log triển khai trên Actions; quy trình rollback bằng Git revert; cập nhật tài liệu bàn giao.

## 8. Kế hoạch thực hiện theo thứ tự

### CP0-A — Bootstrap và adapt ai-dev-framework (BẮT BUỘC, TRƯỚC APP CODE)
1. Inspect repository của dự án và framework nguồn; xác định greenfield/đã có source, trạng thái Git, branch, HEAD và các file hiện hữu. Tuyệt đối không overwrite dữ liệu/project hiện có.
2. Bootstrap snapshot **ai-dev-framework v4.4**, sử dụng đúng đường dẫn script/tài liệu của kit và pin commit nguồn. Chỉ bootstrap sau khi xác nhận target repo độc lập; không biến website thành fork hay runtime dependency của framework.
3. Adapt **Project Layer** cho IT Academic Bulletin: ownership, authority order, domain/sitemap, CMS publishing boundary, content policy, verification, GitHub Pages integration. Không chỉnh framework Core.
4. Kích hoạt adapter `claude-code` và `codex`; ưu tiên native dual-agent theo ADR-003. Không tạo gateway hoặc cross-CLI invocation tự động.
5. Hoàn thiện `FRAMEWORK_ADOPTION.md`, `framework.config.json`, `AGENTS.md`, `CLAUDE.md`, `docs/ai/project-profile.md`, `docs/ai/framework-history.md`, `docs/workflow/current-state.md`; loại bỏ marker chưa điền, ghi pin SHA và giới hạn.
6. Chạy `node scripts/framework-check.mjs` và ghi kết quả kiểm chứng. Không tuyên bố hoàn tất adoption nếu chưa pilot một S1 task thật; đánh dấu đúng trạng thái pilot.
7. Viết báo cáo CP0-A gồm Adopted / Adapted / Not adopted, trạng thái PASS/BLOCKED, những hành động cần HUMAN LEAD xác nhận.

Chi tiết ràng buộc và acceptance criteria ở **Mục 12 — Framework Adaptation**.

### CP0-B — Khảo sát sản phẩm, cấu trúc và boundary triển khai
1. Sau khi CP0-A có snapshot hợp lệ, đọc brief này như **đầu vào IDEA**, không tự coi brief là requirement đã approved.
2. Dùng Product Layer của kit chuyển IDEA thành requirement có scope, acceptance criteria, risks và open decisions. Không tự tạo requirement giả định hay tự cấp approval.
3. Audit repository và trang School of Business; xác nhận 9 danh mục Drive theo bảng ở trên.
4. Viết `docs/IMPLEMENTATION_PLAN.md`, `docs/ARCHITECTURE.md`, `docs/CONTENT_MODEL.md`, sitemap và mockup trang chủ.
5. Chỉ rõ các biến còn thiếu: tên miền, logo, email khoa, danh sách thư ký, biểu mẫu chính thức, cơ chế CMS permission và tình trạng tài liệu Drive.
6. Đề xuất **Implementation Authorization Boundary** cho CP1–CP3: in/out scope, security/privacy, dependency choices, file ownership, testing, integration gate. HUMAN LEAD duyệt trước khi sửa source ứng dụng.

### CP1 — Website tĩnh chạy local
1. Tạo Astro + Tailwind + TypeScript, routing và layout responsive.
2. Trang chủ, danh sách/chi tiết thông báo, danh mục, guides/resources, FAQ, liên hệ.
3. Tìm kiếm và lọc phía client với dữ liệu đã build; không cần backend.
4. Seed 9 danh mục ở trạng thái `published` phù hợp, mô tả trung tính; không bịa nội dung chính thức.
5. Kiểm tra `npm run build`, routing, broken links, mobile.

### CP2 — CMS phục vụ thư ký
1. Cấu hình `.pages.yml` đúng schema Pages CMS hiện hành, ánh xạ các collection ở Mục 5.
2. Bảo đảm tạo/sửa/ẩn/xóa bài, sắp xếp danh mục, chỉnh link Drive và thông tin liên hệ qua CMS.
3. Thiết kế nhãn, mô tả field bằng tiếng Việt, bắt buộc nhập các trường quan trọng.
4. Viết `docs/SECRETARY_GUIDE.md` (màn hình nào, thao tác gì, cách sửa link và cách ẩn bài).
5. Kiểm thử: thư ký được mời bằng email, đăng nhập, thêm một bài test công khai vô hại, thấy website cập nhật, rồi ẩn bài; test có xác thực thực tế, không chỉ mô phỏng.

### CP3 — Deploy và bàn giao
1. Thiết lập GitHub Actions build Astro và deploy GitHub Pages.
2. Kiểm tra repo/project base path, asset path,404, bảo mật secrets, quyền ghi của CMS.
3. Chuẩn bị cấu hình custom domain khi khoa xác nhận DNS/subdomain; không tự thay đổi DNS.
4. Viết `README.md`, `docs/DEPLOYMENT.md`, `docs/SECRETARY_GUIDE.md` và checklist bàn giao.
5. Triển khai production chỉ sau khi người dùng chấp thuận repository, quyền Pages CMS và nội dung công khai.

## 9. Tiêu chí nghiệm thu MVP (Definition of Done)

- [ ] 9 danh mục được hiển thị hợp lý; không bịa quy định học vụ.
- [ ] Site chạy tốt trên desktop và mobile; có tìm kiếm thông báo, lọc theo danh mục.
- [ ] Thư ký (không dùng CLI/Git) có thể đăng nhập CMS, tạo/sửa/ẩn/xóa thông báo.
- [ ] Thư ký có thể cập nhật biểu mẫu/link Drive, FAQ, thông tin liên hệ.
- [ ] Bài `published=false` không xuất hiện ở frontend và không lộ dưới dạng trang HTML; ghi rõ nội dung trong repository có thể vẫn công khai.
- [ ] GitHub Actions build/deploy thành công, có hướng dẫn rollback.
- [ ] Hướng dẫn thư ký dài tối đa khoảng 2 trang thao tác chính, có ảnh màn hình nếu tạo được.
- [ ] Không lưu thông tin nhạy cảm; không yêu cầu thêm backend, database hay dịch vụ trả phí cho MVP.

## 10. Lệnh giao việc cho Claude Code

> **Bắt đầu NGAY từ CP0-A, không nhảy sang CP1.** Đọc toàn bộ PROJECT_BRIEF.md, inspect repo hiện tại, rồi clone/inspect `https://github.com/ntnghia1908/ai-dev-framework` (pin SHA được kiểm chứng). Thực hiện bootstrap + adoption theo `docs/install-new-project.md` hoặc `docs/install-existing-project.md` của kit, `docs/ai/PROJECT_BOOTSTRAP.md` và ADR-003. Adapt Project Layer theo Mục 12 nhưng không sửa Core. Xác minh `node scripts/framework-check.mjs`, ghi `FRAMEWORK_ADOPTION.md` và trạng thái kiểm chứng. Sau đó **tiếp tục CP0-B**: chuyển brief thành requirement/boundary proposal, lập architecture + content model + implementation plan và task graph cho CP1–CP3. Không tự coi framework bootstrap hay bản brief này là approval triển khai source website. Chỉ bắt đầu implement CP1+ sau khi HUMAN LEAD duyệt architecture/dependencies/security và Implementation Authorization Boundary; khi đã duyệt, thực thi trong boundary theo task contract, review/test, không push/merge/deploy production khi chưa được phép. Không tự cấp quyền app, thay đổi sharing Drive, chế ra dữ liệu học vụ hoặc ghi đè files có sẵn. Báo cáo rõ DONE/READY/BLOCKED và những thao tác thủ công phải thực hiện.


## 12. Framework Adaptation — ai-dev-framework (MUST ADOPT IN CP0)

### 12.1 Nguồn chuẩn và cách pin phiên bản

- Canonical framework repository: https://github.com/ntnghia1908/ai-dev-framework
- **Framework Core: v4.4**, đối chiếu `VERSION`, `core/docs/ai/workflow.md` và `templates/framework.config.json`. `README.md` hiện vẫn có câu nói v4.3; KHÔNG suy ra phiên bản từ riêng câu đó.
- Snapshot `main` **quan sát ngày 2026-11-11**: `7496eac6c8046281da14a04501dc277a18cdc343`. Claude phải xác minh commit đang checkout và ghi SHA thực tế vào `FRAMEWORK_ADOPTION.md`; nếu khác, đọc changelog/diff trước khi adopt.
- Những file kit cần đọc trước bootstrap: `docs/install-new-project.md`, `docs/install-existing-project.md`, `docs/ai/PROJECT_BOOTSTRAP.md`, `core/docs/ai/workflow.md`, `core/docs/ai/execution-profiles.md`, `docs/decisions/ADR-003-adaptive-native-dual-agent.md`, `adapters/claude-code/README.md`, `adapters/codex/README.md`.

### 12.2 Phạm vi **Adopted / Adapted / Not adopted**

| Lớp | Hành động | Quy tắc |
|---|---|---|
| Framework Core | **Adopted, unchanged** | Copy `core/docs` vào dự án theo installer. Không tùy biến workflow / governance Core. |
| Project Layer | **Adapted** | Điền template của kit bằng domain IT Academic Bulletin, module map, authority, current state, test policy, integration, quyết định về CMS. |
| Tool Adapter | **Adopted** | Claude Code và Codex; ChatGPT Product adapter có thể giữ để handoff, không yêu cầu có runner ChatGPT local. |
| Integration | **Adapted** | GitHub feature branch → task review → HUMAN LEAD kiểm soát push/PR/merge; CMS content publishing là operational flow riêng và cần quyền thư ký. |
| Không dùng trong MVP | **Not adopted** | Custom framework core, tự tạo orchestrator router, gateway/daemon, tự launch Claude↔Codex lồng nhau, parallel writers, tự viết CMS/backend. |

Không chỉnh repo framework nguồn để phục vụ duy nhất project website. Các điều chỉnh riêng project nằm ở `docs/ai/project-profile.md`, `docs/decisions/`, task contracts và cấu hình ứng dụng.

### 12.3 Bootstrap đúng chế độ

1. **Repo dự án trống ngoài `.git`:** áp dụng `scripts/bootstrap-project.sh <target>` từ một clone framework đã pin SHA, hoặc mode GitHub bootstrap theo `docs/ai/PROJECT_BOOTSTRAP.md` khi phù hợp/quyền cho phép. **Không chạy script vào repo đã có file.**
2. **Repo dự án đã có file:** đọc và làm đúng `docs/install-existing-project.md`; backup/diff và preserve file có sẵn; tuyệt đối không dùng `cp` overwrite mù.
3. Bootstrapping chỉ đưa kit vào repo và kiểm chứng snapshot; không tự sản sinh app code trong bước bootstrap. Sau đó brief này đã cung cấp IDEA, Claude **tiếp tục công việc CP0-B** bằng Product Layer; không cần yêu cầu người dùng nhắc lại IDEA.
4. Mọi quyết định thuộc decision gate S2 (architecture, dependency, security/privacy, publication permissions, shared conventions) cần HUMAN LEAD duyệt trước khi thực thi phần source tương ứng.

Các thành phần đầu ra kỳ vọng (tên/path theo kit):

```text
AGENTS.md                          # canonical entry cho cả Claude và Codex
CLAUDE.md                          # bridge chuẩn @AGENTS.md, giữ nguyên template
FRAMEWORK_ADOPTION.md
framework.config.json
.claude/agents/implementer.md
.claude/rules/execution.md
adapters/claude-code/
adapters/codex/
adapters/chatgpt/                # Product agent adapter, nếu adopt
scripts/framework-check.mjs
docs/ai/workflow.md                 # Core snapshot, unchanged
docs/ai/execution-profiles.md       # Core snapshot, unchanged
docs/ai/project-profile.md         # ADAPTED
docs/ai/framework-history.md
docs/workflow/current-state.md
docs/product/                      # Requirement/IDEA layer
docs/tasks/                        # Task contracts
```

### 12.4 Project-specific policy phải điền vào Project Layer

- **Project:** Static public academic bulletin — IU School of Computer Science / IT Faculty; sinh viên xem thông tin; thư ký khoa là **CONTENT OWNER / PUBLISHER** và duy nhất quyết định nội dung nào chính thức.
- **HUMAN LEAD / TECH OWNER:** phê duyệt scope, architecture, dependency, bảo mật, integration và deploy; không cần duyệt từng bài viết học vụ do thư ký xuất bản nếu đã nằm trong quyền CMS được chấp thuận.
- **Authority order:** HUMAN LEAD decisions/accepted ADR/task contract → Core workflow/profile → project-profile → source/tests → current-state. Google Drive là **nguồn dữ liệu tham khảo**, không được suy diễn rằng tất cả file trong Drive đã công khai hoặc chính xác.
- **Modules (planned, chưa phải implemented):** `src/pages`, `src/layouts`, `src/components`, `src/content` hoặc paths Astro tương đương; `.pages.yml` CMS config; `.github/workflows` deploy; `docs/` governance. Ghi rõ planned/implemented sau audit.
- **Tech stack proposal:** Astro + TypeScript + Tailwind + Pages CMS + GitHub Pages + link Google Drive. Đây là *đề xuất trong brief*; khi formalize ở CP0-B, xác nhận compatibility/schema và ghi approval cho các dependencies cần thiết.
- **Publishing invariant:** CMS `published=false` chỉ ẩn frontend, **không bảo mật dữ liệu trong public repo**. Không đưa hồ sơ sinh viên/nội dung nội bộ/chưa được phép công khai vào repository hoặc build artifacts. Thư ký điều hành nội dung, không cần CLI/Git.
- **Verification:** checker, `node --test` khi áp dụng cho kit, lệnh build/test/lint của website khi đã có source, acceptance CMS end-to-end bằng tài khoản thư ký. Không claim PASS khi không thực chạy được; ghi `NOT RUN / BLOCKED` với lý do.
- **Integration:** source/architecture changes đi qua feature branch + review + HUMAN LEAD gate; CMS content commits cần cơ chế riêng tránh branch protection chặn biên tập. CP0-B phải thiết kế rõ cách CMS ghi nội dung và Actions deploy mà không cấp quyền sửa code cho thư ký.
- **Language:** giao tiếp, tài liệu user-facing và hướng dẫn thư ký bằng tiếng Việt; identifiers và canonical contract fields bằng English.

### 12.5 Adaptive Claude Code / Codex (ADR-003)

- Giữ `agents.product = "chatgpt"` nếu adapter ChatGPT được cài, **không khóa `agents.orchestrator`** cho project mới; chỉ có thể dùng tool đang mở làm ORCHESTRATOR khi role/adapter/policy cho phép.
- Mặc định `dual-agent`: Claude main → `.claude/agents/implementer.md` (Sonnet nếu khả dụng); Codex main → native built-in worker (pilot runtime trước). ORCHESTRATOR tự review diff và chạy lại verification.
- Nếu cần `single-agent`, đổi execution profile theo approval HUMAN LEAD; không tự động fallback khi native worker thất bại. Cross-provider review chỉ read-only và tùy chọn.
- **One writer** tại một thời điểm, kể cả khi template `maxParallelImplementers = 3`: đây là ceiling, không phải được phép chạy 3 writer. Chỉ tăng sau pilot worktree riêng + approval.
- Mỗi task ghi: `Execution profile`, `Orchestrator` (optional), `Implementer` (khi dual), `Owner`, `Authorization source`, `Owned paths`, `Base SHA`, `Acceptance criteria`, `Required verification`. Không tự gán `Implementation authorized: YES` nếu chưa có nguồn authority.
- Khi đổi Claude ↔ Codex: bảo toàn task contract, Git state, current-state, kiểm `git status`, branch/base/HEAD, đảm bảo không có hai writer. Mid-task handoff cần HUMAN LEAD approval; không lấy chat history làm source of truth.

### 12.6 Boundaries và checkpoint approvals

**Scope được người dùng giao ngay trong brief này:** thực hiện CP0-A + CP0-B (inspect, bootstrap độc lập an toàn, adapt Project Layer, requirement draft, plans, proofs). Không tự phát hành production, cấp quyền third party, tạo/mutate repo từ xa hoặc publicize thông tin học vụ.

**Chưa được cấp quyền theo mặc định:** sửa source ứng dụng trong CP1–CP3; push, tạo PR, merge, bật GitHub Pages/DNS, cấu hình GitHub App permissions, sửa Google Drive sharing. Nếu HUMAN LEAD duyệt Implementation Authorization Boundary cho CP1–CP3, các task nằm trong boundary được triển khai theo governance mode, nhưng integration gate riêng vẫn phải tuân thủ.

**CP0 exit criteria:**

- [ ] Inspect target Git repository và pin SHA framework; không làm hỏng file có sẵn.
- [ ] Framework snapshot v4.4 và cả Claude/Codex adapter được adopt chính xác; `AGENTS.md` + `CLAUDE.md` đúng kit.
- [ ] `FRAMEWORK_ADOPTION.md` khai Adopted/Adapted/Not adopted/Verification + commit pin.
- [ ] Project Profile điền đủ scope/authority/module map/profile/test policy/CMS content-owner/integration; mọi template placeholder của kit được giải quyết.
- [ ] `node scripts/framework-check.mjs` PASS (hoặc BLOCKED có evidence cụ thể).
- [ ] Requirement / Implementation Plan / Architecture / Content Model / task graph CP1–CP3 ở trạng thái PROPOSED, rõ decision gates.
- [ ] Nêu S1 pilot chưa chạy nếu chưa được authorize thực thi app; không gọi adoption verified hoàn toàn khi pilot chưa có.
- [ ] Báo cáo ngắn CP0-A và CP0-B, tách rõ DONE, OPEN DECISIONS, BLOCKED và NEXT APPROVAL.

## 13. Tài liệu kỹ thuật để đối chiếu

- Trang mẫu: https://sites.google.com/hcmiu.edu.vn/bulletin-sob/home
- Pages CMS: https://pagescms.org/docs/ và https://pagescms.org/docs/configuration/collaborators/
- Astro + Pages CMS: https://docs.astro.build/en/guides/cms/pages-cms/
- GitHub Pages: https://docs.github.com/en/pages

- Framework source: https://github.com/ntnghia1908/ai-dev-framework
