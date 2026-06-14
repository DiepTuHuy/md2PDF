# Tài liệu Kiểm thử Chuyển đổi Markdown sang PDF

Tài liệu này dùng để kiểm tra khả năng biên dịch tài liệu của công cụ `md2pdf.py` với các thành phần cốt lõi: tiếng Việt có dấu, công thức toán học LaTeX, khối mã nguồn (code blocks) và bảng dữ liệu.

## 1. Kiểm thử tiếng Việt có dấu

Tiếng Việt là ngôn ngữ có hệ thống dấu thanh phức tạp. Dưới đây là các chữ cái tiếng Việt đầy đủ để kiểm tra độ tương thích của font chữ hệ thống (Arial/Times New Roman):

*   **Nguyên âm:** á à ả ã ạ, ă ắ ằ ẳ ẵ ặ, â ấ ầ ẩ ẫ ậ, é è ẻ ẽ ẹ, ê ế ề ể ễ ệ, í ì ỉ ĩ ị, ó ò ỏ õ ọ, ô ố ồ ổ ỗ ộ, ơ ớ ờ ở ở ợ, ú ù ủ ũ ụ, ư ứ ừ ử ữ ự, ý ỳ ỷ ỹ ỵ.
*   **Chữ cái hoa:** Á À Ả Ã Ạ, Â Ấ Ầ Ẩ Ẫ Ậ, Ê Ế Ề Ể Ễ Ệ, Ô Ố Ồ Ổ Ỗ Ộ, Ư Ứ Ừ Ử Ữ Ự.
*   **Ví dụ câu:** *"Đất nước Việt Nam hòa bình, thịnh vượng, phát triển rực rỡ và hội nhập quốc tế sâu rộng."*

## 2. Kiểm thử công thức toán học LaTeX

XeLaTeX hỗ trợ render trực tiếp các khối toán học dạng TeX cực kỳ sắc nét:

*   **Công thức trên dòng (Inline Math):** Phương trình Euler nổi tiếng là $e^{i\pi} + 1 = 0$, biểu diễn mối quan hệ giữa 5 hằng số toán học cơ bản.
*   **Công thức khối (Display Math):** Tích phân Gaussian được tính toán như sau:

$$\int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}$$

Và đây là ma trận xoay góc $\theta$ trong không gian 2D:

$$R(\theta) = \begin{pmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{pmatrix}$$

## 3. Khối mã nguồn (Code Block)

Biên dịch cú pháp code Python với cấu trúc thụt lề và màu sắc trực quan:

```python
def fibonacci(n):
    """
    Sinh chuỗi Fibonacci lên tới phần tử thứ n.
    """
    if n <= 0:
        return []
    elif n == 1:
        return [0]
        
    sequence = [0, 1]
    while len(sequence) < n:
        next_val = sequence[-1] + sequence[-2]
        sequence.append(next_val)
    return sequence

# In ra 10 số đầu tiên
print("Dãy Fibonacci:", fibonacci(10))
```

## 4. Bảng biểu dữ liệu (Markdown Tables)

Dưới đây là một bảng so sánh hiệu năng của các thuật toán:

| Thuật toán | Độ phức tạp (Tốt nhất) | Độ phức tạp (Trung bình) | Sử dụng bộ nhớ bổ sung |
| :--- | :---: | :---: | :---: |
| **Quicksort** | $O(n \log n)$ | $O(n \log n)$ | $O(\log n)$ |
| **Mergesort** | $O(n \log n)$ | $O(n \log n)$ | $O(n)$ |
| **Bubblesort** | $O(n)$ | $O(n^2)$ | $O(1)$ |

---
*Tài liệu kiểm thử được biên dịch bởi MathForge MD-to-PDF Converter.*
