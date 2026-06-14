// DOM Elements & State
const state = {
  fontFamily: "Arial, sans-serif",
  fontSize: "12pt",
  margin: "1in",
  lineHeight: "1.25",
  theme: "light",
  currentTab: "markdown" // "markdown" or "pdf"
};

const elements = {
  markdownInput: document.getElementById('markdown-input'),
  documentPreview: document.getElementById('document-preview'),
  previewContainer: document.getElementById('preview-container'),
  pdfPreviewContainer: document.getElementById('pdf-preview-container'),
  pdfViewerIframe: document.getElementById('pdf-viewer-iframe'),
  pdfEmptyMsg: document.getElementById('pdf-empty-msg'),
  
  // Tab Switcher Buttons
  tabBtnMarkdown: document.getElementById('tab-btn-markdown'),
  tabBtnPdf: document.getElementById('tab-btn-pdf'),
  
  // Uploader Inputs
  inputUploadMd: document.getElementById('input-upload-md'),
  inputUploadPdf: document.getElementById('input-upload-pdf'),
  
  // Settings & Options
  fontSelect: document.getElementById('font-family-select'),
  sizeSelect: document.getElementById('font-size-select'),
  marginSelect: document.getElementById('margin-select'),
  lineHeightSelect: document.getElementById('line-height-select'),
  bgToggleBtns: document.querySelectorAll('.bg-toggle-btn'),
  
  // Translation Options
  translateLangSelect: document.getElementById('translate-lang-select'),
  btnTranslateDoc: document.getElementById('btn-translate-doc'),
  
  // Actions
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

// Tab Switching logic
function switchTab(tabName) {
  state.currentTab = tabName;
  if (tabName === 'markdown') {
    elements.tabBtnMarkdown.classList.add('active');
    elements.tabBtnPdf.classList.remove('active');
    elements.documentPreview.style.display = 'block';
    elements.pdfPreviewContainer.style.display = 'none';
  } else if (tabName === 'pdf') {
    elements.tabBtnPdf.classList.add('active');
    elements.tabBtnMarkdown.classList.remove('active');
    elements.documentPreview.style.display = 'none';
    elements.pdfPreviewContainer.style.display = 'block';
  }
}

elements.tabBtnMarkdown.addEventListener('click', () => switchTab('markdown'));
elements.tabBtnPdf.addEventListener('click', () => switchTab('pdf'));

// MD File Upload Listener
elements.inputUploadMd.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (event) => {
    elements.markdownInput.value = event.target.result;
    updatePreview();
    switchTab('markdown');
    showToast('Đã tải lên tệp tin Markdown thành công!', 'success');
  };
  reader.readAsText(file);
});

// PDF File Upload Listener
elements.inputUploadPdf.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  // Generate object URL for embedding
  const blobUrl = URL.createObjectURL(file);
  elements.pdfViewerIframe.src = blobUrl;
  elements.pdfViewerIframe.style.display = 'block';
  elements.pdfEmptyMsg.style.display = 'none';
  
  switchTab('pdf');
  showToast('Đã tải lên tệp tin PDF đối chiếu!', 'success');
});

// Document Translation with preservation of code and math blocks
async function translateDocument() {
  const targetLang = elements.translateLangSelect.value;
  let text = elements.markdownInput.value;
  
  if (!text.trim()) {
    showToast('Văn bản trống, không thể dịch!', 'error');
    return;
  }
  
  showToast('Đang tiến hành dịch tài liệu... Vui lòng đợi.', 'info');
  elements.btnTranslateDoc.disabled = true;
  elements.btnTranslateDoc.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang dịch...';
  
  try {
    // 1. Protect fenced code blocks (```)
    const codeBlocks = [];
    text = text.replace(/```[\s\S]*?```/g, (match) => {
      const placeholder = `__PROTECTED_CODE_BLOCK_${codeBlocks.length}__`;
      codeBlocks.push({ placeholder, original: match });
      return placeholder;
    });
    
    // 2. Protect math blocks (display math $$...$$ and inline math $...$)
    const mathBlocks = [];
    // Display Math
    text = text.replace(/\$\$[\s\S]*?\$\$/g, (match) => {
      const placeholder = `__PROTECTED_MATH_BLOCK_${mathBlocks.length}__`;
      mathBlocks.push({ placeholder, original: match });
      return placeholder;
    });
    // Inline Math
    text = text.replace(/\$[^\$]+?\$/g, (match) => {
      const placeholder = `__PROTECTED_MATH_BLOCK_${mathBlocks.length}__`;
      mathBlocks.push({ placeholder, original: match });
      return placeholder;
    });
    
    // 3. Split text by paragraphs to respect API length limits (~2000 chars)
    const paragraphs = text.split(/\n\n+/);
    const translatedParagraphs = [];
    
    for (let p of paragraphs) {
      if (!p.trim()) {
        translatedParagraphs.push(p);
        continue;
      }
      
      // Skip translation if the paragraph is just a placeholder
      if (/^__(PROTECTED_CODE_BLOCK|PROTECTED_MATH_BLOCK)_\d+__$/.test(p.trim())) {
        translatedParagraphs.push(p);
        continue;
      }
      
      // Call free Google Translate API
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(p)}`;
      const response = await fetch(url);
      
      if (!response.ok) throw new Error("Translation request failed");
      
      const json = await response.json();
      let translatedText = "";
      if (json && json[0]) {
        json[0].forEach(segment => {
          if (segment[0]) {
            translatedText += segment[0];
          }
        });
      }
      translatedParagraphs.push(translatedText || p);
    }
    
    // Reconstruct the translated document
    let translatedDoc = translatedParagraphs.join('\n\n');
    
    // 4. Restore protected blocks (regex match with spaces allowed around underscores)
    mathBlocks.forEach(block => {
      const placeholderPattern = new RegExp(block.placeholder.replace(/_/g, '\\s*\\_\\s*'), 'gi');
      translatedDoc = translatedDoc.replace(placeholderPattern, block.original);
    });
    
    codeBlocks.forEach(block => {
      const placeholderPattern = new RegExp(block.placeholder.replace(/_/g, '\\s*\\_\\s*'), 'gi');
      translatedDoc = translatedDoc.replace(placeholderPattern, block.original);
    });
    
    // Set the value back to the editor and update preview
    elements.markdownInput.value = translatedDoc;
    updatePreview();
    switchTab('markdown');
    showToast('Dịch tài liệu thành công!', 'success');
    
  } catch (err) {
    console.error('Translation error:', err);
    showToast('Lỗi dịch thuật. Vui lòng kiểm tra lại kết nối mạng!', 'error');
  } finally {
    elements.btnTranslateDoc.disabled = false;
    elements.btnTranslateDoc.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Dịch tài liệu';
  }
}

elements.btnTranslateDoc.addEventListener('click', translateDocument);

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
