// DOM Elements & State
const state = {
  fontFamily: "Arial, sans-serif",
  fontSize: "12pt",
  margin: "1in",
  lineHeight: "1.25",
  theme: "light"
};

const elements = {
  markdownInput: document.getElementById('markdown-input'),
  documentPreview: document.getElementById('document-preview'),
  fontSelect: document.getElementById('font-family-select'),
  sizeSelect: document.getElementById('font-size-select'),
  marginSelect: document.getElementById('margin-select'),
  lineHeightSelect: document.getElementById('line-height-select'),
  bgToggleBtns: document.querySelectorAll('.bg-toggle-btn'),
  btnExportPdf: document.getElementById('btn-export-pdf'),
  btnCopyHtml: document.getElementById('btn-copy-html'),
  btnDownloadMd: document.getElementById('btn-download-md'),
  toastBox: document.getElementById('toast-box')
};

// Initial document template (preloaded in editor)
const defaultMarkdown = `# Tài liệu Báo cáo Nghiên cứu Khoa học

Tài liệu này được soạn thảo bằng Markdown và biên dịch trực quan sang PDF chất lượng cao. Bạn có thể chỉnh sửa văn bản ở khung bên trái và xem kết quả hiển thị thời gian thực ở trang bên phải.

## 1. Giới thiệu Hình học Vi phân Fisher

Trong lý thuyết học sâu và mô hình thống kê, **đa tạp Riemann Fisher** cung cấp một khung toán học mạnh mẽ để đo lường độ cong của không gian tham số. 

*   **Euclid tham số:** Khoảng cách Euclid thông thường giữa các vector trọng số: $d(w_1, w_2) = \\|w_1 - w_2\\|_2$.
*   **Đa tạp Riemann Fisher:** Khoảng cách đo lường sự thay đổi của phân phối xác suất đầu ra: $ds^2 = dw^T F(w) dw$.

### Ý nghĩa của ma trận thông tin Fisher:
Ma trận thông tin Fisher $F$ đóng vai trò là một Riemann Metric, xác định khoảng cách cục bộ trên đa tạp.

> "Khoảng cách Fisher mô tả sự khác biệt về hành vi của mô hình, thay vì sự khác biệt cơ học về giá trị tham số."

---

## 2. Công thức Toán học LaTeX

Ứng dụng hỗ trợ kết xuất tức thời mọi công thức toán học LaTeX thông qua thư viện KaTeX siêu tốc:

*   **Inline Math (Toán nội dòng):** Cho hàm mất mát entropy chéo, khoảng cách Kullback-Leibler cục bộ được xấp xỉ bởi dạng toàn phương Fisher: $D_{KL}(p_w \\| p_{w+dw}) \\approx \\frac{1}{2} dw^T F(w) dw$.
*   **Display Math (Toán khối):**

$$\\int_{-\\infty}^{\\infty} e^{-x^2} \\, dx = \\sqrt{\\pi}$$

Chúng ta cũng có thể biểu diễn ma trận quay trong mặt phẳng Euclid:

$$R(\\theta) = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}$$

---

## 3. Khối mã nguồn lập trình

Mã nguồn được tự động nhận diện ngôn ngữ và tô sáng cú pháp (syntax highlighting) với giao diện trang nhã:

\`\`\`python
def train_epoch(model, dataloader, optimizer, criterion):
    """
    Huấn luyện mô hình qua 1 epoch và trả về loss trung bình.
    """
    model.train()
    total_loss = 0.0
    for inputs, targets in dataloader:
        optimizer.zero_grad()
        outputs = model(inputs)
        loss = criterion(outputs, targets)
        loss.backward()
        optimizer.step()
        total_loss += loss.item() * inputs.size(0)
    return total_loss / len(dataloader.dataset)
\`\`\`

---

## 4. Bảng biểu so sánh

Bảng dữ liệu được định dạng căn lề và đổ bóng chuyên nghiệp:

| Tên Mô hình | Độ chính xác (Accuracy) | Số lượng tham số | Thời gian chạy/Epoch |
| :--- | :---: | :---: | :---: |
| **SmallCNN** | $89.2\\%$ | $0.5\\text{M}$ | $12\\text{ giây}$ |
| **ResNet18** | $93.5\\%$ | $11.2\\text{M}$ | $45\\text{ giây}$ |
| **VGG9** | $91.8\\%$ | $8.4\\text{M}$ | $35\\text{ giây}$ |

---
*Tài liệu kiểm thử kết xuất bởi MD2PDF.*`;

// Configure marked to use highlight.js for code syntax highlighting
marked.setOptions({
  highlight: function(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: 'hljs language-'
});

// Toast notification helper
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = 'fa-info-circle';
  if (type === 'success') icon = 'fa-circle-check';
  if (type === 'error') icon = 'fa-circle-exclamation';
  
  toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
  elements.toastBox.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'none';
    toast.offsetHeight; // Trigger reflow
    toast.style.animation = 'slideIn 0.3s reverse forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Cursor text insertion helper
function insertTextAtCursor(textarea, text) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const currentVal = textarea.value;
  textarea.value = currentVal.substring(0, start) + text + currentVal.substring(end);
  textarea.focus();
  textarea.selectionStart = textarea.selectionEnd = start + text.length;
}

// Compile Markdown to HTML with KaTeX and Highlight.js
let compileTimeout;
function updatePreview() {
  const markdownText = elements.markdownInput.value;
  
  clearTimeout(compileTimeout);
  compileTimeout = setTimeout(() => {
    try {
      // Parse markdown to HTML
      const htmlContent = marked.parse(markdownText);
      elements.documentPreview.innerHTML = htmlContent;
      
      // Auto-render math equations using KaTeX
      renderMathInElement(elements.documentPreview, {
        delimiters: [
          {left: '$$', right: '$$', display: true},
          {left: '$', right: '$', display: false},
          {left: '\\(', right: '\\)', display: false},
          {left: '\\[', right: '\\]', display: true}
        ],
        throwOnError: false
      });
      
    } catch (err) {
      console.error('Markdown parsing error:', err);
      elements.documentPreview.innerHTML = `<div style="color: #ef4444; padding: 1rem;"><i class="fa-solid fa-triangle-exclamation"></i> Lỗi biên dịch cú pháp Markdown</div>`;
    }
  }, 100);
}

// Apply document customization settings
function applySettings() {
  document.documentElement.style.setProperty('--document-font', state.fontFamily);
  document.documentElement.style.setProperty('--document-font-size', state.fontSize);
  document.documentElement.style.setProperty('--document-margin', state.margin);
  document.documentElement.style.setProperty('--document-line-height', state.lineHeight);
  
  if (state.theme === 'light') {
    document.documentElement.style.setProperty('--document-bg', '#ffffff');
    document.documentElement.style.setProperty('--document-color', '#1e293b');
  } else if (state.theme === 'sepia') {
    document.documentElement.style.setProperty('--document-bg', '#fcf6e4');
    document.documentElement.style.setProperty('--document-color', '#433422');
  }
}

// Setup Event Listeners for Settings
elements.fontSelect.addEventListener('change', (e) => {
  state.fontFamily = e.target.value;
  applySettings();
});

elements.sizeSelect.addEventListener('change', (e) => {
  state.fontSize = e.target.value;
  applySettings();
});

elements.marginSelect.addEventListener('change', (e) => {
  state.margin = e.target.value;
  applySettings();
});

elements.lineHeightSelect.addEventListener('change', (e) => {
  state.lineHeight = e.target.value;
  applySettings();
});

// Setup Background theme switcher
elements.bgToggleBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    elements.bgToggleBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    state.theme = btn.getAttribute('data-theme');
    applySettings();
  });
});

// Snippet toolbar buttons
document.querySelectorAll('.tool-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const snippet = btn.getAttribute('data-snippet');
    insertTextAtCursor(elements.markdownInput, snippet);
    updatePreview();
  });
});

// Action triggers: Print to PDF
elements.btnExportPdf.addEventListener('click', () => {
  window.print();
});

// Action triggers: Copy raw HTML code
elements.btnCopyHtml.addEventListener('click', async () => {
  const htmlCode = elements.documentPreview.innerHTML;
  try {
    await navigator.clipboard.writeText(htmlCode);
    showToast('Đã sao chép mã nguồn HTML!', 'success');
  } catch (err) {
    showToast('Sao chép thất bại.', 'error');
  }
});

// Action triggers: Download Markdown file
elements.btnDownloadMd.addEventListener('click', () => {
  const markdownText = elements.markdownInput.value;
  const blob = new Blob([markdownText], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `document-${Date.now()}.md`;
  a.click();
  
  URL.revokeObjectURL(url);
  showToast('Đã tải xuống file Markdown!', 'success');
});

// Start app and render default markdown
window.addEventListener('load', () => {
  elements.markdownInput.value = defaultMarkdown;
  applySettings();
  updatePreview();
});

// Input listener on typing
elements.markdownInput.addEventListener('input', updatePreview);
