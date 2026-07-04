import json
import uuid
import sys
import re
try:
    from bs4 import BeautifulSoup
    import requests
except ImportError:
    print("Please install required packages: pip install beautifulsoup4 requests")
    sys.exit(1)

def extract_course_json(html_content, course_url=""):
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # 1. Course Title
    title_tag = soup.find('h1')
    if title_tag:
        course_title = title_tag.get_text(strip=True)
    else:
        title_tag = soup.find('title')
        course_title = title_tag.get_text(strip=True).replace("آموزش", "").replace("مکتب‌خونه", "").strip() if title_tag else "Course Title"
        
    result = {
        "id": str(uuid.uuid4()),
        "title": course_title,
        "url": course_url,  # اضافه شدن URL
        "provider": "maktabkhoone.org",  # اضافه شدن Provider
        "chapters": []
    }
    
    # 2. Extract Chapters
    chapter_divs = soup.find_all('div', id=lambda x: x and str(x).startswith('course-chapter-'))
    
    for c_div in chapter_divs:
        # Title of chapter
        ch_title_span = c_div.find('span', class_=lambda x: x and 'font-semibold' in x and 'md:text-16' in x)
        chapter_title = ch_title_span.get_text(strip=True) if ch_title_span else "Untitled Chapter"
        
        sections_data = []
        # Find section titles inside the chapter div
        section_tags = c_div.find_all('section')
        for sec in section_tags:
            sec_title_span = sec.find('span', class_=lambda x: x and isinstance(x, str) and 'ellipsis' in x)
            if sec_title_span and sec_title_span.has_attr('title'):
                sec_title = sec_title_span['title'].strip()
                sections_data.append({
                    "id": str(uuid.uuid4()),
                    "title": sec_title,
                    "isCompleted": False
                })
        
        # Fallback if structure varies
        if not sections_data:
            spans_with_title = c_div.find_all('span', attrs={"title": True})
            for s in spans_with_title:
                if 'ellipsis' in s.get('class', []):
                    sections_data.append({
                        "id": str(uuid.uuid4()),
                        "title": s['title'].strip(),
                        "isCompleted": False
                    })

        # Remove duplicates preserving order
        seen = set()
        unique_sections = []
        for s in sections_data:
            if s['title'] not in seen:
                seen.add(s['title'])
                unique_sections.append(s)
                
        # Only add chapters that have sections
        if unique_sections:
            result["chapters"].append({
                "id": str(uuid.uuid4()),
                "title": chapter_title,
                "sections": unique_sections
            })
            
    # برگرداندن نتیجه به صورت آرایه
    return [result]

if __name__ == "__main__":
    if len(sys.argv) > 1:
        source = sys.argv[1]
        try:
            course_url = ""
            # بررسی اینکه آیا ورودی یک لینک است یا فایل محلی
            if source.startswith('http') or source.startswith('https'):
                response = requests.get(source)
                response.raise_for_status()
                html = response.text
                course_url = source  # استخراج URL از ورودی کاربر
            else:
                with open(source, 'r', encoding='utf-8') as f:
                    html = f.read()
                    
            # پاس دادن محتوا و url به تابع استخراج
            result = extract_course_json(html, course_url)
            print(json.dumps(result, ensure_ascii=False, indent=2))
        except Exception as e:
            print(f"Error: {e}")
    else:
        print("Usage: python maktabkhooneh_extractor.py <URL or local_html_file>")