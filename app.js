// DOM Elements & State
const state = {
  fontFamily: "Arial, sans-serif",
  fontSize: "12pt",
  margin: "1in",
  lineHeight: "1.25",
  theme: "light",
  currentTab: "markdown" // "markdown" or "pdf"
};

const uploadedImages = {}; // Map of filename -> blobURL

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
  inputUploadImages: document.getElementById('input-upload-images'),
  inputUploadPdf: document.getElementById('input-upload-pdf'),
  
  // Image Status Elements
  imageStatusBar: document.getElementById('image-status-bar'),
  imageCount: document.getElementById('image-count'),
  btnClearImages: document.getElementById('btn-clear-images'),
  
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
      let text = markdownText;
      
      // 1. Protect code blocks so they aren't parsed as math
      const codeBlocks = [];
      text = text.replace(/```[\s\S]*?```/g, (match) => {
        const placeholder = `CODEBLOCKFENCEDPLACEHOLDER${codeBlocks.length}`;
        codeBlocks.push({ placeholder, original: match });
        return placeholder;
      });
      text = text.replace(/`[^`\n]+?`/g, (match) => {
        const placeholder = `CODEBLOCKINLINEPLACEHOLDER${codeBlocks.length}`;
        codeBlocks.push({ placeholder, original: match });
        return placeholder;
      });
      
      // 2. Protect math blocks from being corrupted by Markdown syntax (e.g. underscores parsed as italics)
      const mathBlocks = [];
      // Display Math $$...$$
      text = text.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
        const placeholder = `MATHBLOCKDISPLAYPLACEHOLDER${mathBlocks.length}`;
        mathBlocks.push({ placeholder, math, display: true });
        return placeholder;
      });
      // Inline Math $...$ (restricted to single line to prevent matching across lines/paragraphs)
      text = text.replace(/\$([^\$\n]+?)\$/g, (match, math) => {
        const placeholder = `MATHBLOCKINLINEPLACEHOLDER${mathBlocks.length}`;
        mathBlocks.push({ placeholder, math, display: false });
        return placeholder;
      });
      
      // 3. Restore code blocks back to markdown format (using regex and lookahead to prevent substring matching and protect dollar signs)
      codeBlocks.forEach(block => {
        text = text.replace(new RegExp(block.placeholder + '(?!\\d)', 'g'), () => block.original);
      });
      
      // 4. Parse Markdown to HTML
      let htmlContent = marked.parse(text);
      
      // 5. Resolve relative images with local uploaded Blob URLs
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      const imgs = doc.querySelectorAll('img');
      let imgReplaced = false;
      
      imgs.forEach(img => {
        const src = img.getAttribute('src');
        if (src && !src.startsWith('blob:') && !src.startsWith('data:') && !src.startsWith('http://') && !src.startsWith('https://')) {
          const filename = src.split('/').pop();
          if (uploadedImages[filename]) {
            img.setAttribute('src', uploadedImages[filename]);
            imgReplaced = true;
          }
        }
      });
      
      if (imgReplaced) {
        htmlContent = doc.body.innerHTML;
      }
      
      // 6. Restore math blocks using katex.renderToString directly (using boundary and safe callback function)
      mathBlocks.forEach(block => {
        try {
          // If the math contains \tag, it MUST be rendered in display mode to avoid KaTeX parse errors
          let displayMode = block.display;
          if (block.math.includes('\\tag')) {
            displayMode = true;
          }
          
          const mathHtml = katex.renderToString(block.math, {
            displayMode: displayMode,
            throwOnError: false
          });
          
          const replacement = displayMode ? `<div class="katex-display-wrapper">${mathHtml}</div>` : mathHtml;
          htmlContent = htmlContent.replace(new RegExp(block.placeholder + '(?!\\d)', 'g'), () => replacement);
        } catch (katexErr) {
          console.error(katexErr);
          htmlContent = htmlContent.replace(new RegExp(block.placeholder + '(?!\\d)', 'g'), () => `<span class="katex-error" style="color: #ef4444;">${block.math}</span>`);
        }
      });
      
      elements.documentPreview.innerHTML = htmlContent;
      
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

// Document Translation with preservation of code, math, tables, images and link blocks
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
    // 1. Protect fenced code blocks (```) - wrap in newlines to isolate from adjacent text paragraphs
    const codeBlocks = [];
    text = text.replace(/```[\s\S]*?```/g, (match) => {
      const placeholderKey = `__PROTECTED_CODE_BLOCK_${codeBlocks.length}__`;
      const placeholder = `\n\n${placeholderKey}\n\n`;
      codeBlocks.push({ placeholder: placeholderKey, original: match });
      return placeholder;
    });
    
    // 2. Protect Markdown tables from being corrupted by translation
    const tableBlocks = [];
    const lines = text.split(/\r?\n/);
    const newLines = [];
    const separatorRegex = /^(?=.*\|)[ \t]*\|?[ \t]*:?-+:?[ \t]*(?:\|[ \t]*:?-+:?[ \t]*)*\|?[ \t]*$/;
    const blockIndicatorRegex = /^(?:#|>|`{3,}| {0,3}[*\-+](?:[ \t]|$)| {0,3}\d+\.(?:[ \t]|$))/;
    
    let i = 0;
    while (i < lines.length) {
      if (i + 1 < lines.length && 
          lines[i].trim() !== "" && 
          !blockIndicatorRegex.test(lines[i].trim()) && 
          separatorRegex.test(lines[i+1])) {
        
        const tableLines = [lines[i], lines[i+1]];
        let j = i + 2;
        while (j < lines.length) {
          const nextLine = lines[j];
          if (nextLine.trim() === "" || blockIndicatorRegex.test(nextLine.trim())) {
            break;
          }
          if (nextLine.includes('|')) {
            tableLines.push(nextLine);
            j++;
          } else {
            break;
          }
        }
        
        const tableContent = tableLines.join('\n');
        const placeholderKey = `__PROTECTED_TABLE_BLOCK_${tableBlocks.length}__`;
        tableBlocks.push({ placeholder: placeholderKey, original: tableContent });
        
        newLines.push(`\n\n${placeholderKey}\n\n`);
        i = j;
      } else {
        newLines.push(lines[i]);
        i++;
      }
    }
    text = newLines.join('\n');
    
    // 3. Protect math blocks (display math $$...$$ and inline math $...$)
    const mathBlocks = [];
    // Display Math
    text = text.replace(/\$\$[\s\S]*?\$\$/g, (match) => {
      const placeholderKey = `__PROTECTED_MATH_BLOCK_${mathBlocks.length}__`;
      const placeholder = `\n\n${placeholderKey}\n\n`;
      mathBlocks.push({ placeholder: placeholderKey, original: match });
      return placeholder;
    });
    // Inline Math (restrict to single line to prevent matching across paragraphs/lines)
    text = text.replace(/\$[^\$\n]+?\$/g, (match) => {
      const placeholderKey = `__PROTECTED_MATH_BLOCK_${mathBlocks.length}__`;
      mathBlocks.push({ placeholder: placeholderKey, original: match });
      return placeholderKey;
    });
    
    // 4. Protect images (![alt](src))
    const imageBlocks = [];
    text = text.replace(/!\[.*?\]\(.*?\)/g, (match) => {
      const placeholderKey = `__PROTECTED_IMAGE_BLOCK_${imageBlocks.length}__`;
      imageBlocks.push({ placeholder: placeholderKey, original: match });
      return placeholderKey;
    });
    
    // 5. Protect standard links ([text](url))
    const linkBlocks = [];
    text = text.replace(/\[.*?\]\(.*?\)/g, (match) => {
      const placeholderKey = `__PROTECTED_LINK_BLOCK_${linkBlocks.length}__`;
      linkBlocks.push({ placeholder: placeholderKey, original: match });
      return placeholderKey;
    });
    
    // 6. Split text by paragraphs to respect API length limits (~2000 chars)
    const paragraphs = text.split(/\n\n+/);
    // Concurrency-limited parallel mapping helper (concurrency limit of 5 to avoid 429 rate limits)
    async function mapLimit(array, limit, fn) {
      const results = [];
      const promises = [];
      let i = 0;
      async function worker() {
        while (i < array.length) {
          const index = i++;
          results[index] = await fn(array[index]);
        }
      }
      for (let j = 0; j < Math.min(limit, array.length); j++) {
        promises.push(worker());
      }
      await Promise.all(promises);
      return results;
    }
    
    const translatedParagraphs = await mapLimit(paragraphs, 5, async (p) => {
      if (!p.trim()) {
        return p;
      }
      
      // Skip translation if the paragraph is just a placeholder
      if (/^__(PROTECTED_CODE_BLOCK|PROTECTED_MATH_BLOCK|PROTECTED_TABLE_BLOCK|PROTECTED_IMAGE_BLOCK|PROTECTED_LINK_BLOCK)_\d+__$/.test(p.trim())) {
        return p.trim();
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
      return translatedText || p;
    });
    
    // Reconstruct the translated document
    let translatedDoc = translatedParagraphs.join('\n\n');
    
    // Helper to generate highly robust regex for placeholders to prevent prefix/substring collisions and space/underscore mangling
    const getRobustPattern = (type, index) => {
      return new RegExp(`_*[ \\t]*PROTECTED[ \\t]*\\_[ \\t]*${type}[ \\t]*\\_[ \\t]*BLOCK[ \\t]*\\_[ \\t]*${index}(?!\\d)[ \\t]*_*`, 'gi');
    };

    // Restore protected blocks (regex match with spaces allowed around underscores and strict boundary check)
    linkBlocks.forEach((block, idx) => {
      translatedDoc = translatedDoc.replace(getRobustPattern('LINK', idx), () => block.original);
    });
    
    imageBlocks.forEach((block, idx) => {
      translatedDoc = translatedDoc.replace(getRobustPattern('IMAGE', idx), () => block.original);
    });
    
    mathBlocks.forEach((block, idx) => {
      translatedDoc = translatedDoc.replace(getRobustPattern('MATH', idx), () => block.original);
    });
    
    tableBlocks.forEach((block, idx) => {
      translatedDoc = translatedDoc.replace(getRobustPattern('TABLE', idx), () => block.original);
    });
    
    codeBlocks.forEach((block, idx) => {
      translatedDoc = translatedDoc.replace(getRobustPattern('CODE', idx), () => block.original);
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

// Action triggers: Direct PDF Export using html2pdf.js
async function exportToPdfDirect() {
  const btn = elements.btnExportPdf;
  const originalText = btn.innerHTML;
  
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Khởi tạo...';
  
  const element = elements.documentPreview;
  
  // 1. Temporarily save original styles
  const originalBg = document.documentElement.style.getPropertyValue('--document-bg');
  const originalColor = document.documentElement.style.getPropertyValue('--document-color');
  const originalBoxShadow = element.style.boxShadow;
  const originalBorderRadius = element.style.borderRadius;
  const originalPadding = element.style.padding;
  const originalTextJustify = element.style.textAlign;
  const originalDisplay = element.style.display;
  const originalTransition = element.style.transition;
  
  try {
    // 2. Temporarily display block and disable transitions to measure height accurately
    element.style.display = 'block';
    element.style.transition = 'none';
    element.offsetHeight; // Force browser layout reflow
    
    // Estimate page count based on height (A4 page height is approx. 1120px at screen resolution)
    const estimatedPages = Math.ceil(element.scrollHeight / 1120);
    
    // Fallback to native print for large documents to avoid browser canvas size memory limit crashes/blank page renders
    if (estimatedPages > 8) {
      // Restore original display styles first
      element.style.display = originalDisplay;
      element.style.transition = originalTransition;
      
      showToast('Tài liệu lớn được tối ưu hóa xuất bằng hội thoại in của hệ thống để đảm bảo chất lượng đầy đủ.', 'info');
      switchTab('markdown'); // Ensure we are on the markdown preview tab
      await new Promise(resolve => setTimeout(resolve, 150)); // Wait for tab layout to stabilize
      window.print();
      return;
    }
    
    // 3. Dynamically load html2pdf.js library if not loaded
    if (typeof html2pdf === 'undefined') {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = resolve;
        script.onerror = () => reject(new Error('Không thể tải thư viện xuất PDF!'));
        document.head.appendChild(script);
      });
    }
    
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang xuất...';
    
    // 4. Apply styling changes to force print mode (white page, black text, zero padding)
    const originalMarginVal = state.margin; // e.g. "1in", "0.5in"
    let marginInches = 0.5;
    if (originalMarginVal.includes('in')) {
      marginInches = parseFloat(originalMarginVal);
    } else if (originalMarginVal.includes('cm')) {
      marginInches = parseFloat(originalMarginVal) / 2.54;
    }
    
    // Set styles for A4 layout rendering
    document.documentElement.style.setProperty('--document-bg', '#ffffff');
    document.documentElement.style.setProperty('--document-color', '#000000');
    element.style.boxShadow = 'none';
    element.style.borderRadius = '0';
    element.style.padding = '0'; // let html2pdf margins handle page spacing
    element.style.textAlign = 'justify';
    
    // Force reflow and introduce a small delay to ensure browser layout & style paint finishes before canvas capture
    element.offsetHeight;
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const opt = {
      margin:       marginInches,
      filename:     `document-${Date.now()}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { 
        scale: 2.5, // Crisp print resolution
        useCORS: true,
        logging: false
      },
      jsPDF:        { 
        unit: 'in', 
        format: 'a4', 
        orientation: 'portrait' 
      },
      pagebreak: { mode: ['css', 'legacy'] }
    };
    
    // Run html2pdf and await download completion
    await html2pdf().set(opt).from(element).save();
    
    showToast('Tải xuống PDF thành công!', 'success');
  } catch (err) {
    console.error(err);
    showToast(err.message || 'Lỗi xuất tệp PDF.', 'error');
  } finally {
    // Restore original styles
    document.documentElement.style.setProperty('--document-bg', originalBg);
    document.documentElement.style.setProperty('--document-color', originalColor);
    element.style.boxShadow = originalBoxShadow;
    element.style.borderRadius = originalBorderRadius;
    element.style.padding = originalPadding;
    element.style.textAlign = originalTextJustify;
    element.style.display = originalDisplay;
    element.style.transition = originalTransition;
    
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}

elements.btnExportPdf.addEventListener('click', exportToPdfDirect);

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

// Image Upload listener
elements.inputUploadImages.addEventListener('change', (e) => {
  const files = e.target.files;
  if (!files.length) return;
  
  let added = 0;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const url = URL.createObjectURL(file);
    uploadedImages[file.name] = url;
    added++;
  }
  
  const count = Object.keys(uploadedImages).length;
  elements.imageCount.textContent = count;
  elements.imageStatusBar.style.display = count > 0 ? 'flex' : 'none';
  
  updatePreview();
  showToast(`Đã tải lên ${added} ảnh minh họa thành công!`, 'success');
});

// Clear Images listener
elements.btnClearImages.addEventListener('click', () => {
  for (let key in uploadedImages) {
    URL.revokeObjectURL(uploadedImages[key]);
    delete uploadedImages[key];
  }
  elements.imageCount.textContent = '0';
  elements.imageStatusBar.style.display = 'none';
  
  updatePreview();
  showToast('Đã xóa toàn bộ ảnh minh họa.', 'info');
});

// Drag and drop files on editor textarea
const textarea = elements.markdownInput;

textarea.addEventListener('dragover', (e) => {
  e.preventDefault();
  textarea.style.borderColor = 'rgba(255, 255, 255, 0.3)';
});

textarea.addEventListener('dragleave', (e) => {
  e.preventDefault();
  textarea.style.borderColor = '';
});

textarea.addEventListener('drop', (e) => {
  e.preventDefault();
  textarea.style.borderColor = '';
  
  const files = e.dataTransfer.files;
  if (!files.length) return;
  
  let mdFile = null;
  let imageFiles = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.name.toLowerCase().endsWith('.md')) {
      mdFile = file;
    } else if (file.type.startsWith('image/')) {
      imageFiles.push(file);
    }
  }
  
  if (mdFile) {
    const reader = new FileReader();
    reader.onload = (event) => {
      elements.markdownInput.value = event.target.result;
      updatePreview();
      switchTab('markdown');
      showToast(`Đã tải tệp Markdown: ${mdFile.name}`, 'success');
    };
    reader.readAsText(mdFile);
  }
  
  if (imageFiles.length > 0) {
    let added = 0;
    for (let file of imageFiles) {
      const url = URL.createObjectURL(file);
      uploadedImages[file.name] = url;
      added++;
    }
    const count = Object.keys(uploadedImages).length;
    elements.imageCount.textContent = count;
    elements.imageStatusBar.style.display = count > 0 ? 'flex' : 'none';
    updatePreview();
    showToast(`Đã tải thêm ${added} ảnh minh họa từ kéo thả!`, 'success');
  }
});

// Start app and render default markdown
window.addEventListener('load', () => {
  elements.markdownInput.value = defaultMarkdown;
  applySettings();
  updatePreview();
});

// Input listener on typing
elements.markdownInput.addEventListener('input', updatePreview);
