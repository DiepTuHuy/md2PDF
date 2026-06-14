# MathForge MD-to-PDF Converter

**MathForge MD-to-PDF** là một công cụ dòng lệnh (CLI) gọn nhẹ bằng Python giúp chuyển đổi các tệp tin Markdown (`.md`) sang định dạng tài liệu PDF chất lượng cao. 

Công cụ được thiết kế để hỗ trợ tốt nhất cho:
*   **Tiếng Việt có dấu:** Tự động cấu hình hệ thống font chữ unicode qua trình biên dịch XeLaTeX để tránh lỗi hiển thị ký tự tiếng Việt.
*   **Công thức toán học chuyên sâu:** Tự động biên dịch các khối công thức LaTeX (bao gồm cả ký hiệu nội dòng và khối hiển thị phức tạp).
*   **Mã nguồn có màu sắc (Syntax Highlighting):** Hỗ trợ nhiều phong cách tô sáng mã nguồn (code blocks) của các ngôn ngữ lập trình phổ biến.

---

## 🛠️ Yêu cầu hệ thống

Công cụ này hoạt động như một lớp giao tiếp tiện ích bao quanh **Pandoc** và **XeLaTeX**. Bạn cần cài đặt hai công cụ nền này:

1.  **Pandoc:** Trình chuyển đổi định dạng tài liệu đa năng.
2.  **XeLaTeX:** Một động cơ TeX hiện đại, cho phép sử dụng trực tiếp các font chữ hệ thống (Arial, Times New Roman...) để kết xuất tiếng Việt.

### Hướng dẫn cài đặt nhanh trên macOS (Homebrew)

Mở Terminal và chạy các lệnh sau:

```bash
# Cài đặt Pandoc
brew install pandoc

# Cài đặt bộ công cụ soạn thảo LaTeX đầy đủ (MacTeX)
brew install --cask mactex-no-gui
```

---

## 🚀 Hướng dẫn sử dụng

### Lệnh chạy cơ bản
Để chuyển đổi một file Markdown sang PDF với cấu hình mặc định (font Arial, cỡ chữ 12pt, lề 1 inch):

```bash
python3 md2pdf.py input.md
```
*Kết quả đầu ra sẽ là tệp `input.pdf` nằm cùng thư mục và tự động mở lên bằng ứng dụng xem PDF mặc định của hệ thống.*

---

## ⚙️ Các tùy chọn tham số (CLI Flags)

Bạn có thể tùy chỉnh đầu ra bằng cách truyền thêm các cờ tham số:

| Tham số | Ý nghĩa | Mặc định | Ví dụ |
| :--- | :--- | :---: | :--- |
| `input` | File Markdown đầu vào (Bắt buộc). | *N/A* | `test.md` |
| `-o`, `--output` | Đường dẫn file PDF đầu ra. | *Trùng tên file md* | `-o baocao.pdf` |
| `-f`, `--font` | Font chữ chính của tài liệu. | `Arial` | `-f "Times New Roman"` |
| `-m`, `--margin` | Độ rộng lề trang (top/bottom/left/right). | `1in` | `-m 2cm` hoặc `-m 20mm` |
| `-s`, `--size` | Cỡ chữ chính của tài liệu. | `12pt` | `-s 11pt` |
| `--stretch` | Khoảng cách giãn dòng. | `1.25` | `--stretch 1.5` |
| `--toc` | Tạo Mục lục tự động ở đầu tài liệu. | *Không bật* | `--toc` |
| `--numbered` | Đánh số thứ tự tự động cho các tiêu đề lớn/nhỏ. | *Không bật* | `--numbered` |
| `--engine` | Trình kết xuất PDF của Pandoc. | `xelatex` | `--engine pdflatex` |
| `--highlight` | Style tô sáng cú pháp code block. | `tango` | `--highlight pygments` |
| `--no-open` | Không tự động mở file PDF sau khi chạy xong. | *Tự động mở* | `--no-open` |

### Ví dụ về câu lệnh nâng cao
Để tạo một báo cáo chuyên nghiệp có **mục lục**, các mục được **đánh số thứ tự**, lề **2 cm**, font chữ **Times New Roman** và cỡ chữ **11pt**:

```bash
python3 md2pdf.py test_document.md -o BaoCaoQuocTe.pdf -f "Times New Roman" -m 2cm -s 11pt --toc --numbered
```

---

## 📝 Giấy phép
Công cụ này được phân phối tự do để hỗ trợ công việc nghiên cứu khoa học và soạn thảo văn bản chất lượng cao.
