import zipfile
import xml.etree.ElementTree as ET
import sys

sys.stdout.reconfigure(encoding='utf-8')

def read_docx(path):
    with zipfile.ZipFile(path) as z:
        xml_content = z.read('word/document.xml')
    root = ET.fromstring(xml_content)
    paragraphs = []
    for p in root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
        texts = [r.text for r in p.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if r.text]
        if texts:
            paragraphs.append(''.join(texts))
    return '\n'.join(paragraphs)

files = ['Files/2.docx', 'Files/3.docx', 'Files/4.docx']
for f in files:
    print(f'=== {f} ===')
    print(read_docx(f))
    print()
