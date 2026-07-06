# KẾ HOẠCH PHÂN CHIA CÔNG VIỆC & QUY TRÌNH HỢP TÁC NHÓM
## DỰ ÁN: MUNDIBLOG - HỆ THỐNG BLOG ĐA NGÔN NGỮ TÍCH HỢP AI

Tài liệu này được biên soạn nhằm phân chia nhiệm vụ chi tiết cho **nhóm 3 thành viên** để phát triển dự án thực tập sinh trong vòng 2 tháng. Dự án sử dụng công nghệ **ExpressJS + Sequelize (Backend)** và **Angular (Frontend)** với cơ sở dữ liệu **MySQL**.

---

## 1. PHÂN CHIA VAI TRÒ CHỦ CHỐT
* **Developer A (Trưởng nhóm - Tech Lead)**: Phụ trách cấu trúc hệ thống, Cơ sở dữ liệu (Sequelize), Cơ chế đăng nhập bảo mật (Auth), và Phân hệ quản trị **Admin**.
* **Developer B (Frontend & UX Specialist)**: Phụ trách luồng đọc của Độc giả, **Bình luận phân cấp (Nested Comments)**, **Yêu thích (Likes)** và Đa ngôn ngữ giao diện tĩnh.
* **Developer C (Feature Developer - AI Integration)**: Phụ trách luồng viết bài của Tác giả, **Biên dịch tự động AI (AI Auto-translation)** và Tải lên tập tin.

---

## 2. BẢNG PHÂN CHIA NHIỆM VỤ CHI TIẾT (BACKEND & FRONTEND)

### 🧑‍💻 NHIỆM VỤ CỦA DEVELOPER A: AUTH & ADMIN CONTROL PANEL

#### GIAI ĐOẠN 1: HTML TĨNH (PROTOTYPE)
* Dựng Sidebar trái dạng menu Admin (Dashboard, Users, Categories, Languages).
* Dựng trang `dashboard.html` (Thống kê chỉ số, hàng đợi dịch AI).
* Dựng trang `manage-users.html` (Bảng thành viên, nút gạt khóa tài khoản, bộ lọc tìm kiếm).
* Dựng trang `manage-categories.html` (Bảng danh mục, modal thêm mới, tự động tạo slug).
* Dựng trang `manage-languages.html` (Bảng quản lý ngôn ngữ, tiến độ phủ dịch thuật).
* Viết file JS dùng chung `core.js` (Bật/tắt Dark mode, quản lý session đăng nhập giả lập bằng `localStorage`).

#### GIAI ĐOẠN 2: HẬU PHƯƠNG (BACKEND - ExpressJS + Sequelize)
* Thiết lập khung dự án ExpressJS, cấu hình Sequelize kết nối MySQL cho 2 môi trường (Dev và Test). Chạy Sequelize Migrations tạo hệ thống bảng database.
* Code API Đăng ký (`register`), Đăng nhập cấp token JWT (`login`), Đổi mật khẩu (`change-password`).
* Code API Admin - Quản lý thành viên: Lấy danh sách, khóa/mở khóa tài khoản (cập nhật cột `status` trong bảng `users` sang `banned`).
* Code API Admin - Quản lý ngôn ngữ: CRUD bảng `languages` (Cột `is_active` để kích hoạt ngôn ngữ).
* Code API Admin - Quản lý danh mục: CRUD bảng `categories` và bảng dịch tên danh mục `category_translations` (hỗ trợ lưu tên đa ngôn ngữ).

#### GIAI ĐOẠN 3: TIỀN TUYẾN (FRONTEND - Angular)
* Khởi tạo dự án Angular, cấu hình các route chính và **AuthGuard** phân quyền (chặn độc giả truy cập trang Admin).
* Viết Admin Layout và các Component tương ứng: **Admin Dashboard**, **Manage Users**, **Manage Categories**, **Manage Languages** liên kết với API đã viết ở Giai đoạn 2.

---

### 🧑‍💻 NHIỆM VỤ CỦA DEVELOPER B: PUBLIC FEEDS & SOCIAL INTERACTIONS

#### GIAI ĐOẠN 1: HTML TĨNH (PROTOTYPE)
* Thiết kế Header chuẩn (Logo, Nút Login/Subscribe, Avatar Dropdown) và Footer làm file template dùng chung cho cả nhóm.
* Dựng trang chủ độc giả `home.html` (Bài viết nổi bật, thanh sidebar danh mục, bài viết mới).
* Dựng trang chủ độc giả khi đã đăng nhập `home-logged-in.html`.
* Dựng trang giới thiệu tĩnh `about.html`.
* Dựng trang chi tiết bài viết `post-detail-1.html` (Nút thả tim, **Khung bình luận phân cấp** hỗ trợ nút Reply thụt lề).
* Dựng trang báo lỗi dịch thuật `translation-not-available.html`.

#### GIAI ĐOẠN 2: HẬU PHƯƠNG (BACKEND - ExpressJS + Sequelize)
* Code API xem bài viết trang chủ: Có phân trang, lọc theo danh mục (`categories.slug`) và lọc theo ngôn ngữ đang chọn (`languages.code`).
* Code API xem chi tiết bài viết (Join bảng `posts` với bảng dịch nội dung `post_languages`).
* Code API thả tim bài viết: Thích/Bỏ thích, đếm tổng lượt thích (`post_likes` table).
* Code API bình luận phân cấp: CRUD bảng `comments`, xử lý logic liên kết đệ quy cha-con qua cột `parent_id` để trả về cấu trúc phân cấp cây bình luận (Reply).

#### GIAI ĐOẠN 3: TIỀN TUYẾN (FRONTEND - Angular)
* Xây dựng luồng đọc của Độc giả: **Homepage Component**, **Post Detail Component**, **About Component**.
* Tích hợp cơ chế dịch ngôn ngữ tĩnh toàn trang (i18n / Localize) khi thay đổi ngôn ngữ trên Header.
* Phát triển Component **Nested Comments** (Sử dụng cấu trúc đệ quy hoặc thụt lề UI để hiển thị các câu trả lời bình luận).
* Phát triển Component **Liked Posts**: Hiển thị danh sách bài viết đã lưu thích của tài khoản hiện tại.

---

### 🧑‍💻 NHIỆM VỤ CỦA DEVELOPER C: AUTHOR WORKSPACE & AI TRANSLATION

#### GIAI ĐOẠN 1: HTML TĨNH (PROTOTYPE)
* Dựng trang soạn thảo bài viết `create-post.html` (Thanh công cụ WYSIWYG, check-box chọn ngôn ngữ đích dịch thuật, màn hình split-view xem trước bản dịch AI).
* Dựng trang quản lý bài viết cá nhân `my-posts.html` (Bảng hiển thị các bài viết dạng nháp/đã đăng và **Ma trận trạng thái dịch thuật AI** gồm EN/VI/ZH).
* Dựng trang thông tin hồ sơ `profile.html` (Cập nhật avatar tròn có click đổi ảnh, bio cá nhân, khóa trường username chỉ đọc).
* Dựng trang đổi mật khẩu tài khoản `change-password.html` (Có nút con mắt ẩn/hiển thị mật khẩu).

#### GIAI ĐOẠN 2: HẬU PHƯƠNG (BACKEND - ExpressJS + Sequelize)
* Code API Tác giả soạn thảo: Tạo bài viết, lưu bản nháp (`status = 'draft'`), cập nhật chỉnh sửa bài viết (Ghi đè hoặc thêm bản ghi vào `posts` và `post_languages`).
* Phát triển **Cơ chế biên dịch tự động AI**: Viết Background Worker giả lập kết nối API dịch thuật. Khi bài viết chuyển trạng thái sang `published`, hệ thống tự động gọi tiến trình dịch ngầm sang các ngôn ngữ đã chọn và lưu kết quả vào `post_languages`.
* Code API danh sách bài viết cá nhân của tác giả (lọc theo bản nháp / bài đã đăng).
* Code API Upload hình ảnh: Sử dụng thư viện `multer` để xử lý tải ảnh bài viết và ảnh đại diện lên server.

#### GIAI ĐOẠN 3: TIỀN TUYẾN (FRONTEND - Angular)
* Phát triển Component **Create/Edit Post**: Thiết lập Form soạn thảo bài viết, tích hợp bộ soạn thảo WYSIWYG và khung xem trước (Preview) bản dịch AI.
* Phát triển Component **My Workspace**: Bảng quản lý bài viết của tôi, hiển thị trạng thái dịch AI trên ma trận ngôn ngữ.
* Phát triển Component **Profile Settings**: Cho phép chỉnh sửa thông tin cá nhân, tích hợp tính năng tải lên hình ảnh avatar.
* Phát triển Component **Change Password**: Form đổi mật khẩu bảo mật (kiểm tra mật khẩu xác nhận trùng khớp bằng Angular Form Validators).

---

## 3. QUY TRÌNH LÀM VIỆC NHÓM (METHODOLOGY)

Để dự án vận hành trơn tru và đúng tiến độ, nhóm cần áp dụng mô hình **Agile/Scrum rút gọn** với các nguyên tắc sau:

### A. QUẢN LÝ MÃ NGUỒN (GIT WORKFLOW)
1. **Branch chính**:
   * Nhánh `main`: Chỉ chứa mã nguồn hoàn chỉnh đã test chạy ổn định, dùng để demo.
   * Nhánh `develop`: Nhánh gom code của cả nhóm để test tích hợp.
2. **Branch cá nhân**: Mỗi thành viên tạo nhánh riêng từ `develop` để code tính năng của mình:
   * Cú pháp đặt tên: `feature/ten-tinh-nang` (ví dụ: `feature/auth-backend`, `feature/nested-comments-ui`).
3. **Quy tắc Commit**: Commit rõ ràng, viết bằng tiếng Việt có dấu hoặc tiếng Anh:
   * Ví dụ: `feat: add toggle password visibility in change-password` hoặc `fix: resolve responsive grid crash under 991px`.
4. **Review chéo**: Trước khi gộp (Merge) code từ nhánh cá nhân vào `develop`, phải tạo Pull Request (PR) và được ít nhất 1 thành viên khác xem, chạy thử để duyệt gộp.

### B. QUY TẮC PHÁT TRIỂN CODE (CLEAN CODE RULES)
* **Không dùng CSS nội dòng (Inline Styles)**: Khi code HTML tĩnh cũng như Angular, tuyệt đối không viết CSS trực tiếp vào thẻ HTML (`style="..."`). Phải định nghĩa class trong các file CSS tương ứng.
* **Tận dụng tối đa biến dùng chung**: Sử dụng các mã màu và kích thước đã khai báo sẵn trong `variables.css` để giao diện cả 3 người tự động đồng bộ khi đổi màu giao diện tối/sáng.
* **Xử lý lỗi bất đồng bộ ở Backend**: Tất cả các truy vấn DB (Sequelize) phải sử dụng cú pháp `async/await` kết hợp với khối lệnh `try...catch` để bắt và trả về mã lỗi HTTP chuẩn (400 Bad Request, 401 Unauthorized, 403 Forbidden, 500 Server Error).
* **Kiểm tra dữ liệu đầu vào (Validation)**: Cả Frontend (Angular Validators) và Backend (express-validator) đều phải kiểm duyệt kỹ các trường dữ liệu (ví dụ: email phải đúng định dạng, mật khẩu tối thiểu 6 ký tự, slug không chứa ký tự đặc biệt).

### C. GIAO TIẾP VÀ THEO DÕI TIẾN ĐỘ
* **Họp nhóm Daily Standup (10-15 phút hàng ngày - Online/Trực tiếp)**: Mỗi thành viên trả lời nhanh 3 câu hỏi:
  1. Hôm qua tôi đã làm được gì?
  2. Hôm nay tôi sẽ làm gì?
  3. Tôi có đang gặp khó khăn/vướng mắc gì cần hỗ trợ không?
* **Họp Sơ kết Tuần (Weekly Sync - Cuối tuần)**:
  * Cả nhóm ngồi lại chạy thử bản ghép nối chung để phát hiện lỗi tích hợp sớm nhất.
  * Phân chia khối lượng công việc cho tuần tiếp theo dựa theo tiến độ thực tế.

---

> [!IMPORTANT]
> **Lời khuyên cho giai đoạn HTML tĩnh**: Để các trang HTML của 3 người hoạt động liên kết như ứng dụng thật khi demo, hãy sử dụng chung thư viện lưu trữ trình duyệt `localStorage` để lưu thông tin tài khoản đăng nhập. Các sự kiện bấm "Đăng nhập", "Đăng ký", "Xóa người dùng" cần cập nhật lại `localStorage` để khi chuyển trang, mã JS ở trang tiếp theo có thể đọc và tự động thay đổi UI tương thích.
