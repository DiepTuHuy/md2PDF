# MD2PDF - Markdown to PDF Converter Web Application

**MD2PDF** là một ứng dụng web Single-Page App (SPA) hiện đại, trực quan và mạnh mẽ, giúp biên dịch tài liệu Markdown sang PDF chất lượng cao. Công cụ được tối ưu hóa đặc biệt cho các báo cáo kỹ thuật, tài liệu khoa học chứa công thức toán học phức tạp và mã nguồn lập trình.

👉 **Trải nghiệm trực tuyến**: [GitHub Pages Demo](https://dieptuhuy.github.io/md2PDF/)

---

## ✨ Tính năng nổi bật

### 1. Xem trước thời gian thực (Live Preview)
*   Tự động biên dịch cú pháp Markdown sang HTML chuẩn xác bằng thư viện `Marked.js`.
*   Tự động tô sáng cú pháp mã nguồn (Syntax Highlighting) cho nhiều ngôn ngữ lập trình bằng `Highlight.js`.
*   Trình diễn trực quan bố cục A4 chuẩn in ấn trực tiếp trên trình duyệt.

### 2. Hỗ trợ Công thức Toán học KaTeX Siêu Tốc
*   Kết xuất tức thời mọi công thức Toán học LaTeX nội dòng (Inline Math `$ ... $`) và dạng khối hiển thị (Display Math `$$ ... $$`) thông qua thư viện `KaTeX`.
*   Đảm bảo không bị vỡ ký tự unicode tiếng Việt hay công thức phức tạp trong quá trình kết xuất.

### 3. Hệ thống dịch thuật thông minh (Smart Translation)
*   Tích hợp dịch thuật đa ngôn ngữ (Tiếng Việt, Tiếng Anh, Tiếng Trung, Tiếng Nhật, Tiếng Pháp) qua API Google Dịch.
*   **Thuật toán bảo vệ dữ liệu độc quyền**: 
    *   Tự động phát hiện và đóng gói các khối mã nguồn, bảng biểu Markdown, công thức toán học KaTeX, hình ảnh (`![]()`) và liên kết thành các khóa bảo vệ dạng `__PROTECTED_XXX_BLOCK_N__` trước khi gửi đi dịch.
    *   Sử dụng biểu thức chính quy Lookahead nâng cao `(?!\d)` để khôi phục chính xác 100% dữ liệu gốc sau khi dịch, bất kể việc API dịch thuật có thể tự ý thay đổi, xóa dấu gạch dưới hay thêm khoảng cách.

### 4. Tùy biến trang giấy & Bố cục A4 chuyên nghiệp
*   Thay đổi phông chữ (Arial, Times New Roman, Georgia, Fira Code).
*   Điều chỉnh kích thước phông chữ (10pt, 11pt, 12pt, 14pt).
*   Tùy chọn độ rộng lề trang (Hẹp 0.5in, Thường 1.0in, Rộng 1.25in).
*   Điều chỉnh khoảng cách giãn dòng (1.15, 1.25, 1.50).
*   Hỗ trợ chế độ nền xem trước (Nền trắng in ấn hoặc nền trang ngà Sepia chống mỏi mắt).

### 5. Xuất bản PDF Chất lượng cao
*   **Xuất PDF Trực tiếp**: Sử dụng thư viện `html2pdf.js` kết hợp `html2canvas` và `jsPDF` giúp người dùng tải xuống tệp tin PDF trực tiếp chỉ với một cú nhấp chuột mà không phụ thuộc vào hội thoại in của hệ thống.
*   **Hộp thoại in hệ thống (Print Dialog Fallback)**: Tự động phát hiện các tài liệu dài (> 8 trang) để chuyển hướng tối ưu sang hộp thoại in của hệ thống (`window.print()`). Giải pháp này giúp loại bỏ hoàn toàn hiện tượng tràn bộ nhớ/vỡ canvas trên các tài liệu lớn, đồng thời giữ nguyên khả năng bôi đen/sao chép chữ (selectable text) trên file PDF đầu ra.
*   **Ngăn chặn ngắt trang lỗi**: Tự động áp dụng thuộc tính CSS `break-inside: avoid` để đảm bảo công thức Toán học lớn, hình ảnh và khối code không bị cắt đôi một cách mất thẩm mỹ khi chuyển trang.

### 6. Hỗ trợ Ảnh minh họa & PDF đối chiếu
*   **Tải ảnh cục bộ**: Cho phép tải lên các ảnh minh họa trực tiếp từ máy tính để phân giải các đường dẫn tương đối trong tệp Markdown.
*   **Xem PDF đối chiếu**: Giao diện hai tab trực quan giúp người dùng tải lên và xem song song tài liệu PDF gốc (PDF đối chiếu) trực tiếp bên cạnh trang Markdown đang dịch và chỉnh sửa.

---

## 📂 Cấu trúc mã nguồn

Dự án được viết hoàn toàn bằng HTML, CSS và Javascript thuần túy (Vanilla JS), không yêu cầu build/compile phức tạp:

*   [index.html](file:///Users/dieptuhuy/Library/CloudStorage/GoogleDrive-dieptuhuy80@gmail.com/My%20Drive/Paper%20ICLR/code/md_to_pdf/index.html): Cấu trúc giao diện ứng dụng web Single-Page Dashboard với phong cách Glassmorphism cao cấp.
*   [style.css](file:///Users/dieptuhuy/Library/CloudStorage/GoogleDrive-dieptuhuy80@gmail.com/My%20Drive/Paper%20ICLR/code/md_to_pdf/style.css): Hệ thống phong cách (styling), thiết kế đáp ứng (responsive grid) và kiểu in ấn chuyên nghiệp (`@media print`).
*   [app.js](file:///Users/dieptuhuy/Library/CloudStorage/GoogleDrive-dieptuhuy80@gmail.com/My%20Drive/Paper%20ICLR/code/md_to_pdf/app.js): Xử lý toàn bộ logic ứng dụng, bao gồm bảo vệ/khôi phục placeholder, dịch thuật song song, cấu hình tài liệu và xuất bản PDF trực tiếp.

---

## 🚀 Hướng dẫn chạy cục bộ (Local Development)

Bạn không cần cài đặt NodeJS hay bất kỳ thư viện bổ sung nào để chạy dự án. Chỉ cần khởi tạo một máy chủ web tĩnh đơn giản:

### Cách 1: Sử dụng Python (Cài đặt sẵn trên hầu hết hệ điều hành)
Chạy lệnh sau tại thư mục chứa dự án:
```bash
python3 -m http.server 8000
```
Sau đó truy cập địa chỉ `http://localhost:8000` trên trình duyệt.

### Cách 2: Sử dụng tiện ích Live Server trên VS Code
Mở thư mục `md_to_pdf` trong VS Code, nhấp chuột phải vào file `index.html` và chọn **Open with Live Server**.

---

## 📝 Giấy phép & Ghi nhận Bản quyền (License & Attribution)

*   **MD2PDF** được phát triển tự do dưới giấy phép MIT nhằm phục vụ công việc nghiên cứu khoa học, dịch thuật tài liệu học thuật và xuất bản báo cáo chất lượng cao.
*   **Động cơ Chuyển đổi Tài liệu (Import & Conversion Engine)** trong dự án này được phát triển dựa trên ý tưởng kiến trúc và thiết kế của dự án **[Microsoft MarkItDown](https://github.com/microsoft/markitdown)** (Bản quyền © Microsoft Corporation, Giấy phép MIT). Chúng tôi xin chân thành cảm ơn các nhà phát triển Microsoft vì giải pháp chuyển đổi tài liệu sang Markdown tuyệt vời này.
