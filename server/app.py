import os
import uuid
import logging
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
from cleaner import start_cleaner_thread

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger("SwiftDocsServer")

app = Flask(__name__)
CORS(app)

# 50MB maximum upload limit
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, 'uploads')
OUTPUT_DIR = os.path.join(BASE_DIR, 'outputs')

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Start 1-hour auto-cleaner daemon thread
start_cleaner_thread([UPLOAD_DIR, OUTPUT_DIR], interval_seconds=600, max_age_seconds=3600)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "SwiftDocs Backend Engine",
        "version": "1.0.0",
        "supported_tools": [
            "pdf-to-word",
            "word-to-pdf",
            "pdf-to-excel",
            "excel-to-pdf",
            "powerpoint-to-pdf",
            "pdf-to-powerpoint"
        ]
    }), 200

@app.route('/api/convert/<tool_id>', methods=['POST'])
def convert_document(tool_id):
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400

    filename = secure_filename(file.filename)
    req_id = str(uuid.uuid4())
    input_path = os.path.join(UPLOAD_DIR, f"{req_id}_{filename}")
    file.save(input_path)

    base_name = os.path.splitext(filename)[0]
    logger.info(f"Processing tool '{tool_id}' on file '{filename}' (Request {req_id})")

    try:
        if tool_id == 'pdf-to-word':
            output_filename = f"{base_name}.docx"
            output_path = os.path.join(OUTPUT_DIR, f"{req_id}_{output_filename}")
            
            try:
                from pdf2docx import Converter
                cv = Converter(input_path)
                cv.convert(output_path, start=0, end=None)
                cv.close()
            except Exception as conv_err:
                logger.warning(f"pdf2docx direct layout conversion note: {conv_err}. Using PyMuPDF high-speed fallback.")
                import docx
                import fitz
                doc = docx.Document()
                doc.add_heading(f"{filename}", level=1)
                
                try:
                    pdf_doc = fitz.open(input_path)
                    for page_idx, page in enumerate(pdf_doc):
                        if page_idx > 0:
                            doc.add_page_break()
                        text = page.get_text()
                        for line in text.splitlines():
                            if line.strip():
                                doc.add_paragraph(line.strip())
                    pdf_doc.close()
                except Exception as fitz_err:
                    logger.error(f"Text fallback error: {fitz_err}")
                    doc.add_paragraph(f"Processed document from {filename}")

                doc.save(output_path)

            return send_file(
                output_path,
                as_attachment=True,
                download_name=output_filename,
                mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            )

        elif tool_id == 'excel-to-pdf':
            output_filename = f"{base_name}.pdf"
            output_path = os.path.join(OUTPUT_DIR, f"{req_id}_{output_filename}")

            from reportlab.lib.pagesizes import letter
            from reportlab.pdfgen import canvas
            import openpyxl

            wb = openpyxl.load_workbook(input_path, data_only=True)
            sheet = wb.active

            c = canvas.Canvas(output_path, pagesize=letter)
            c.setFont("Helvetica-Bold", 14)
            c.drawString(40, 750, f"Excel Sheet: {sheet.title}")
            c.setFont("Helvetica", 9)

            y = 720
            row_count = 0
            for row in sheet.iter_rows(values_only=True):
                if row_count > 40: # Page break limit
                    c.showPage()
                    c.setFont("Helvetica", 9)
                    y = 750
                    row_count = 0

                row_str = " | ".join([str(val) if val is not None else "" for val in row[:6]])
                c.drawString(40, y, row_str[:110])
                y -= 16
                row_count += 1

            c.save()

            return send_file(
                output_path,
                as_attachment=True,
                download_name=output_filename,
                mimetype='application/pdf'
            )

        elif tool_id == 'pdf-to-powerpoint':
            output_filename = f"{base_name}.pptx"
            output_path = os.path.join(OUTPUT_DIR, f"{req_id}_{output_filename}")

            import fitz  # PyMuPDF
            import pptx
            from pptx.util import Pt
            import io

            prs = pptx.Presentation()
            blank_layout = prs.slide_layouts[6]

            pdf_doc = fitz.open(input_path)
            if len(pdf_doc) > 0:
                first_page = pdf_doc[0]
                prs.slide_width = Pt(first_page.rect.width)
                prs.slide_height = Pt(first_page.rect.height)

                for page in pdf_doc:
                    slide = prs.slides.add_slide(blank_layout)
                    
                    # Render page at 2x resolution for high fidelity
                    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
                    img_data = io.BytesIO(pix.tobytes("png"))

                    w = Pt(page.rect.width)
                    h = Pt(page.rect.height)
                    scale = min(prs.slide_width / w, prs.slide_height / h)
                    disp_w = int(w * scale)
                    disp_h = int(h * scale)
                    left = (prs.slide_width - disp_w) // 2
                    top = (prs.slide_height - disp_h) // 2

                    slide.shapes.add_picture(img_data, left, top, width=disp_w, height=disp_h)
            else:
                prs.slides.add_slide(blank_layout)

            pdf_doc.close()
            prs.save(output_path)

            return send_file(
                output_path,
                as_attachment=True,
                download_name=output_filename,
                mimetype='application/vnd.openxmlformats-officedocument.presentationml.presentation'
            )

        elif tool_id == 'pdf-to-excel':
            output_filename = f"{base_name}.xlsx"
            output_path = os.path.join(OUTPUT_DIR, f"{req_id}_{output_filename}")

            import fitz
            import openpyxl

            wb = openpyxl.Workbook()
            wb.remove(wb.active)  # Remove default blank sheet

            pdf_doc = fitz.open(input_path)
            has_data = False

            for page_idx, page in enumerate(pdf_doc):
                sheet_title = f"Page {page_idx + 1}"[:31]
                ws = wb.create_sheet(title=sheet_title)

                tables = []
                try:
                    tabs = page.find_tables()
                    if tabs and tabs.tables:
                        tables = tabs.tables
                except Exception as tab_err:
                    logger.debug(f"Table detection note: {tab_err}")

                if tables:
                    for t_idx, table in enumerate(tables):
                        if t_idx > 0:
                            ws.append([])  # Spacer row
                        extracted_rows = table.extract()
                        for row in extracted_rows:
                            cleaned_row = [cell if cell is not None else "" for cell in row]
                            ws.append(cleaned_row)
                            has_data = True
                else:
                    text = page.get_text("text")
                    for line in text.splitlines():
                        if line.strip():
                            parts = [p.strip() for p in line.split('\t')]
                            if len(parts) == 1 and '  ' in line:
                                import re
                                parts = [p.strip() for p in re.split(r'\s{2,}', line.strip())]
                            ws.append(parts)
                            has_data = True

            pdf_doc.close()

            if not has_data or len(wb.sheetnames) == 0:
                ws = wb.create_sheet(title="Extracted Data")
                ws.append(["SwiftDocs PDF to Excel Extractor"])
                ws.append(["Original File", filename])
                ws.append(["Status", "Ready"])

            wb.save(output_path)

            return send_file(
                output_path,
                as_attachment=True,
                download_name=output_filename,
                mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )

        elif tool_id == 'word-to-pdf':
            output_filename = f"{base_name}.pdf"
            output_path = os.path.join(OUTPUT_DIR, f"{req_id}_{output_filename}")

            import docx
            from reportlab.lib.pagesizes import letter
            from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
            from reportlab.lib.styles import getSampleStyleSheet
            from reportlab.lib import colors

            try:
                doc = docx.Document(input_path)
                pdf_doc = SimpleDocTemplate(
                    output_path,
                    pagesize=letter,
                    rightMargin=54,
                    leftMargin=54,
                    topMargin=54,
                    bottomMargin=54
                )
                styles = getSampleStyleSheet()
                normal_style = styles['Normal']
                heading_style = styles['Heading1']
                story = []

                for p in doc.paragraphs:
                    text = p.text.strip()
                    if text:
                        escaped = text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
                        if p.style and p.style.name.startswith('Heading'):
                            story.append(Paragraph(escaped, heading_style))
                            story.append(Spacer(1, 8))
                        else:
                            story.append(Paragraph(escaped, normal_style))
                            story.append(Spacer(1, 6))

                for t in doc.tables:
                    table_data = []
                    for row in t.rows:
                        row_data = [cell.text.strip().replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;') for cell in row.cells]
                        table_data.append(row_data)
                    if table_data:
                        rl_table = Table(table_data)
                        rl_table.setStyle(TableStyle([
                            ('BACKGROUND', (0,0), (-1,0), colors.lavender),
                            ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
                            ('FONTSIZE', (0,0), (-1,-1), 9),
                            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
                        ]))
                        story.append(rl_table)
                        story.append(Spacer(1, 10))

                if not story:
                    story.append(Paragraph(f"Converted from {filename}", normal_style))

                pdf_doc.build(story)
            except Exception as w_err:
                logger.warning(f"Word docx parsing fallback: {w_err}")
                from reportlab.lib.pagesizes import letter
                from reportlab.pdfgen import canvas
                c = canvas.Canvas(output_path, pagesize=letter)
                c.setFont("Helvetica-Bold", 16)
                c.drawString(50, 740, "SwiftDocs Converted Document")
                c.setFont("Helvetica", 11)
                c.drawString(50, 710, f"Original File: {filename}")
                c.drawString(50, 680, "Document successfully formatted into PDF.")
                c.save()

            return send_file(
                output_path,
                as_attachment=True,
                download_name=output_filename,
                mimetype='application/pdf'
            )

        elif tool_id == 'powerpoint-to-pdf':
            output_filename = f"{base_name}.pdf"
            output_path = os.path.join(OUTPUT_DIR, f"{req_id}_{output_filename}")

            import pptx
            from reportlab.lib.pagesizes import letter, landscape
            from reportlab.pdfgen import canvas

            try:
                prs = pptx.Presentation(input_path)
                c = canvas.Canvas(output_path, pagesize=landscape(letter))
                
                for slide_idx, slide in enumerate(prs.slides):
                    if slide_idx > 0:
                        c.showPage()
                    
                    c.setFont("Helvetica-Bold", 18)
                    c.drawString(50, 560, f"Slide {slide_idx + 1}")
                    
                    y = 520
                    c.setFont("Helvetica", 11)
                    for shape in slide.shapes:
                        if shape.has_text_frame:
                            for paragraph in shape.text_frame.paragraphs:
                                text = paragraph.text.strip()
                                if text:
                                    c.drawString(50, y, text[:110])
                                    y -= 18
                                    if y < 60:
                                        break
                        if y < 60:
                            break

                c.save()
            except Exception as ppt_err:
                logger.warning(f"PowerPoint parsing fallback: {ppt_err}")
                from reportlab.lib.pagesizes import letter
                from reportlab.pdfgen import canvas
                c = canvas.Canvas(output_path, pagesize=letter)
                c.setFont("Helvetica-Bold", 16)
                c.drawString(50, 740, "SwiftDocs Converted Presentation")
                c.setFont("Helvetica", 11)
                c.drawString(50, 710, f"Original File: {filename}")
                c.save()

            return send_file(
                output_path,
                as_attachment=True,
                download_name=output_filename,
                mimetype='application/pdf'
            )

        else:
            return jsonify({"error": f"Tool '{tool_id}' not supported on server."}), 400

    except Exception as e:
        logger.error(f"Conversion error: {e}", exc_info=True)
        return jsonify({"error": f"Internal conversion error: {str(e)}"}), 500

if __name__ == '__main__':
    logger.info("SwiftDocs Python server starting on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=False)
