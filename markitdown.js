/**
 * MarkItDown JS - Client-side Document Conversion Engine
 * 
 * Based on the architecture and design of Microsoft MarkItDown (https://github.com/microsoft/markitdown)
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 * 
 * Ported and optimized for client-side JavaScript by Antigravity AI.
 */

function loadScript(src) {
  return new Promise((resolve, reject) => {
    // Avoid double loading
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === 'true') {
        resolve();
      } else {
        existing.addEventListener('load', resolve);
        existing.addEventListener('error', reject);
      }
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.dataset.loaded = 'false';
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function getMimeTypeByExt(ext) {
  const mimes = {
    'txt': 'text/plain',
    'md': 'text/markdown',
    'html': 'text/html',
    'htm': 'text/html',
    'csv': 'text/csv',
    'pdf': 'application/pdf',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'xls': 'application/vnd.ms-excel',
    'zip': 'application/zip'
  };
  return mimes[ext] || 'application/octet-stream';
}

class DocumentConverter {
  supports(file, ext, mime) {
    return false;
  }
  async convert(file, ext, mime) {
    throw new Error("Not implemented");
  }
}

class PlainTextConverter extends DocumentConverter {
  supports(file, ext, mime) {
    return ['txt', 'md', 'json', 'xml', 'js', 'py', 'css', 'go', 'c', 'cpp', 'java'].includes(ext) || mime.startsWith('text/');
  }
  async convert(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }
}

class CsvConverter extends DocumentConverter {
  supports(file, ext) {
    return ext === 'csv';
  }
  async convert(file) {
    const text = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
    const rows = text.split(/\r?\n/).map(line => {
      return line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''));
    }).filter(row => row.length > 0 && row.some(cell => cell !== ''));
    
    if (rows.length === 0) return '';
    
    let md = '';
    md += '| ' + rows[0].join(' | ') + ' |\n';
    md += '| ' + rows[0].map(() => '---').join(' | ') + ' |\n';
    for (let i = 1; i < rows.length; i++) {
      md += '| ' + rows[i].join(' | ') + ' |\n';
    }
    return md;
  }
}

class XlsxConverter extends DocumentConverter {
  supports(file, ext) {
    return ['xlsx', 'xls'].includes(ext);
  }
  async convert(file) {
    if (typeof XLSX === 'undefined') {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js');
    }
    
    const data = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(new Uint8Array(e.target.result));
      reader.onerror = (e) => reject(e);
      reader.readAsArrayBuffer(file);
    });
    
    const workbook = XLSX.read(data, { type: 'array' });
    let mdContent = '';
    
    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      if (json.length === 0) return;
      
      mdContent += `### Sheet: ${sheetName}\n\n`;
      mdContent += '| ' + json[0].join(' | ') + ' |\n';
      mdContent += '| ' + json[0].map(() => '---').join(' | ') + ' |\n';
      for (let i = 1; i < json.length; i++) {
        const row = json[i];
        const paddedRow = Array.from({ length: json[0].length }, (_, k) => row[k] !== undefined ? row[k] : '');
        mdContent += '| ' + paddedRow.join(' | ') + ' |\n';
      }
      mdContent += '\n';
    });
    
    return mdContent.trim();
  }
}

class DocxConverter extends DocumentConverter {
  supports(file, ext) {
    return ext === 'docx';
  }
  async convert(file) {
    if (typeof mammoth === 'undefined') {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js');
    }
    if (typeof TurndownService === 'undefined') {
      await loadScript('https://unpkg.com/turndown/dist/turndown.js');
    }
    
    const arrayBuffer = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsArrayBuffer(file);
    });
    
    const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
    const html = result.value;
    
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced'
    });
    
    return turndownService.turndown(html);
  }
}

class HtmlConverter extends DocumentConverter {
  supports(file, ext) {
    return ['html', 'htm'].includes(ext);
  }
  async convert(file) {
    if (typeof TurndownService === 'undefined') {
      await loadScript('https://unpkg.com/turndown/dist/turndown.js');
    }
    
    const html = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
    
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced'
    });
    
    return turndownService.turndown(html);
  }
}

class PdfConverter extends DocumentConverter {
  supports(file, ext) {
    return ext === 'pdf';
  }
  async convert(file) {
    if (typeof pdfjsLib === 'undefined') {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
    
    const arrayBuffer = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsArrayBuffer(file);
    });
    
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;
    
    // Concurrently process all PDF pages to maximize performance
    const pagePromises = [];
    for (let i = 1; i <= pdfDoc.numPages; i++) {
      pagePromises.push((async (pageNum) => {
        const page = await pdfDoc.getPage(pageNum);
        const textContent = await page.getTextContent();
        let lastY = -1;
        let pageText = '';
        
        const items = textContent.items;
        items.sort((a, b) => {
          if (Math.abs(a.transform[5] - b.transform[5]) < 5) {
            return a.transform[4] - b.transform[4];
          }
          return b.transform[5] - a.transform[5];
        });
        
        items.forEach(item => {
          const y = item.transform[5];
          if (lastY === -1) {
            pageText += item.str;
          } else if (Math.abs(y - lastY) > 5) {
            pageText += '\n' + item.str;
          } else {
            pageText += ' ' + item.str;
          }
          lastY = y;
        });
        
        return { pageNum, text: pageText.trim() };
      })(i));
    }
    
    const pages = await Promise.all(pagePromises);
    pages.sort((a, b) => a.pageNum - b.pageNum);
    
    let md = '';
    pages.forEach(p => {
      md += `## Page ${p.pageNum}\n\n${p.text}\n\n`;
    });
    
    return md.trim();
  }
}

class ZipConverter extends DocumentConverter {
  constructor(markitdown) {
    super();
    this.markitdown = markitdown;
  }
  supports(file, ext) {
    return ext === 'zip';
  }
  async convert(file) {
    if (typeof JSZip === 'undefined') {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
    }
    
    const arrayBuffer = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsArrayBuffer(file);
    });
    
    const zip = await JSZip.loadAsync(arrayBuffer);
    const fileKeys = Object.keys(zip.files).filter(key => !zip.files[key].dir);
    
    // Concurrently process all ZIP inner files to maximize performance
    const filePromises = fileKeys.map(async (key) => {
      const zipFile = zip.files[key];
      const ext = key.split('.').pop().toLowerCase();
      const blob = await zipFile.async('blob');
      const innerFile = new File([blob], key, { type: getMimeTypeByExt(ext) });
      
      try {
        const text = await this.markitdown.convert(innerFile);
        return { key, text, success: true };
      } catch (err) {
        return { key, text: `Error: ${err.message}`, success: false };
      }
    });
    
    const results = await Promise.all(filePromises);
    let md = '# Zip File Contents\n\n';
    results.forEach(res => {
      if (res.success) {
        md += `## File: ${res.key}\n\n${res.text}\n\n---\n\n`;
      } else {
        md += `## File: ${res.key} (Failed to convert)\n\n${res.text}\n\n---\n\n`;
      }
    });
    
    return md.trim();
  }
}

class MarkItDown {
  constructor() {
    this.converters = [];
    this.registerBuiltins();
  }
  
  registerConverter(converter) {
    this.converters.push(converter);
  }
  
  registerBuiltins() {
    this.registerConverter(new PlainTextConverter());
    this.registerConverter(new CsvConverter());
    this.registerConverter(new XlsxConverter());
    this.registerConverter(new DocxConverter());
    this.registerConverter(new HtmlConverter());
    this.registerConverter(new PdfConverter());
    this.registerConverter(new ZipConverter(this));
  }
  
  async convert(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    const mime = file.type || '';
    
    for (let converter of this.converters) {
      if (converter.supports(file, ext, mime)) {
        return await converter.convert(file, ext, mime);
      }
    }
    
    throw new Error(`Unsupported file format: .${ext}`);
  }
}

// Expose to window scope
window.MarkItDown = MarkItDown;

// Background Prefetching of external libraries to make conversion instantaneous on first use
window.addEventListener('load', () => {
  // Wait 2 seconds to avoid blocking the initial page rendering
  setTimeout(() => {
    const libs = [
      'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js',
      'https://unpkg.com/turndown/dist/turndown.js',
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
    ];
    
    libs.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = src;
      document.head.appendChild(link);
    });
  }, 2000);
});
