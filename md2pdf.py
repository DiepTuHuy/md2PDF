#!/usr/bin/env python3
import os
import sys
import shutil
import argparse
import subprocess

# ANSI colors for styling the CLI output
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def print_status(message, status_type='info'):
    if status_type == 'info':
        print(f"{Colors.OKBLUE}[*]{Colors.ENDC} {message}")
    elif status_type == 'success':
        print(f"{Colors.OKGREEN}[✓]{Colors.ENDC} {Colors.BOLD}{message}{Colors.ENDC}")
    elif status_type == 'warning':
        print(f"{Colors.WARNING}[!]{Colors.ENDC} {message}")
    elif status_type == 'error':
        print(f"{Colors.FAIL}[✗]{Colors.ENDC} {Colors.BOLD}{Colors.FAIL}{message}{Colors.ENDC}")

def check_dependencies(pdf_engine):
    # Check for pandoc
    if not shutil.which('pandoc'):
        print_status("Không tìm thấy 'pandoc' trên hệ thống của bạn.", 'error')
        print_status("Vui lòng cài đặt qua Homebrew: 'brew install pandoc'", 'info')
        sys.exit(1)
        
    # Check for PDF engine (usually xelatex)
    if not shutil.which(pdf_engine):
        # Check standard MacTeX path as fallback
        fallback_path = f"/Library/TeX/texbin/{pdf_engine}"
        if os.path.exists(fallback_path):
            # Append fallback path to PATH
            os.environ["PATH"] += os.pathsep + "/Library/TeX/texbin"
        else:
            print_status(f"Không tìm thấy công cụ PDF engine '{pdf_engine}' trên hệ thống.", 'error')
            print_status("Vui lòng cài đặt MacTeX hoặc kiểm tra lại cấu hình PATH của bạn.", 'info')
            sys.exit(1)

def main():
    parser = argparse.ArgumentParser(
        description="MathForge MD-to-PDF: Công cụ chuyển đổi Markdown sang PDF chất lượng cao, hỗ trợ công thức toán học và tiếng Việt.",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )
    
    parser.add_argument('input', help='Đường dẫn tới file Markdown (.md) cần chuyển đổi.')
    parser.add_argument('-o', '--output', help='Đường dẫn file PDF đầu ra (mặc định trùng tên file md).')
    parser.add_argument('-f', '--font', default='Arial', help='Font chữ chính của tài liệu (Arial, Times New Roman, Georgia...). Sử dụng font hệ thống có hỗ trợ tiếng Việt.')
    parser.add_argument('-m', '--margin', default='1in', help='Kích thước lề của tài liệu (ví dụ: 1in, 2cm, 20mm).')
    parser.add_argument('-s', '--size', default='12pt', help='Cỡ chữ chính (10pt, 11pt, 12pt).')
    parser.add_argument('--stretch', default='1.25', help='Độ giãn dòng (line spacing/stretch).')
    parser.add_argument('--toc', action='store_true', help='Tự động tạo Mục lục (Table of Contents).')
    parser.add_argument('--numbered', action='store_true', help='Đánh số thứ tự các đề mục (1., 1.1, 1.2...).')
    parser.add_argument('--engine', default='xelatex', help='Động cơ biên dịch PDF (xelatex, pdflatex, lualatex). Nên dùng xelatex cho tiếng Việt.')
    parser.add_argument('--highlight', default='tango', help='Phong cách tô sáng cú pháp code (tango, pygments, monochrome, kate).')
    parser.add_argument('--open', action='store_true', default=True, help='Tự động mở file PDF sau khi biên dịch thành công.')
    parser.add_argument('--no-open', dest='open', action='store_false', help='Không tự động mở file PDF sau khi biên dịch.')
    
    args = parser.parse_args()
    
    # Verify input file exists
    if not os.path.exists(args.input):
        print_status(f"File đầu vào không tồn tại: {args.input}", 'error')
        sys.exit(1)
        
    # Check system dependencies
    check_dependencies(args.engine)
    
    # Determine output file path
    input_path = os.path.abspath(args.input)
    if args.output:
        output_path = os.path.abspath(args.output)
    else:
        output_path = os.path.splitext(input_path)[0] + '.pdf'
        
    print_status(f"Đang chuẩn bị biên dịch file: {Colors.BOLD}{os.path.basename(input_path)}{Colors.ENDC}", 'info')
    
    # Construct pandoc command
    cmd = [
        'pandoc',
        input_path,
        '-o', output_path,
        f'--pdf-engine={args.engine}',
        '-V', f'geometry:margin={args.margin}',
        '-V', f'mainfont={args.font}',
        '-V', f'fontsize={args.size}',
        '-V', f'linestretch={args.stretch}',
        f'--highlight-style={args.highlight}'
    ]
    
    # Add optional flags
    if args.toc:
        cmd.append('--toc')
    if args.numbered:
        cmd.append('--number-sections')
        
    # Run pandoc
    try:
        print_status("Đang chạy Pandoc để sinh tệp PDF...", 'info')
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
        
        print_status(f"Biên dịch hoàn tất thành công!", 'success')
        print_status(f"Đầu ra PDF: {Colors.UNDERLINE}{output_path}{Colors.ENDC}", 'success')
        
        # Open the PDF if requested
        if args.open:
            if sys.platform == 'darwin':  # macOS
                subprocess.run(['open', output_path])
            elif sys.platform.startswith('linux'):
                subprocess.run(['xdg-open', output_path])
            elif sys.platform == 'win32':
                os.startfile(output_path)
                
    except subprocess.CalledProcessError as e:
        print_status("Có lỗi xảy ra trong quá trình biên dịch Pandoc/LaTeX:", 'error')
        print(f"\n{Colors.WARNING}Chi tiết lỗi từ trình biên dịch:{Colors.ENDC}")
        print(e.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
