import json
import sys
import uuid

try:
    from bs4 import BeautifulSoup
    import requests
except ImportError:
    print("Please install required packages: pip install -r requirements.txt")
    sys.exit(1)


def _find_chapters_container(soup):
    """Locate the accordion widget holding the course chapters.

    academy.arvancloud.ir (WordPress + Elementor + LearnDash) marks the
    chapters accordion with a `course-headline` class, but a FAQ section
    further down the page uses the exact same accordion widget structure
    (just a `faq` class instead), so we can't just grab the first
    `elementor-widget-accordion` on the page - that would pick up FAQ
    entries as if they were chapters.
    """
    container = soup.find(
        "div",
        class_=lambda c: c and "course-headline" in c.split() and "elementor-widget-accordion" in c.split(),
    )
    if container:
        return container

    # Fallback: first accordion widget that isn't the FAQ section.
    for candidate in soup.find_all("div", class_="elementor-widget-accordion"):
        classes = candidate.get("class") or []
        if "faq" not in classes:
            return candidate

    return None


def extract_course_json(html_content, course_url=""):
    soup = BeautifulSoup(html_content, "html.parser")

    # Course title
    title_tag = soup.find("h1")
    if title_tag:
        course_title = title_tag.get_text(strip=True)
    else:
        title_tag = soup.find("title")
        course_title = (
            title_tag.get_text(strip=True).replace("- آروان آکادمی", "").strip()
            if title_tag
            else "Course Title"
        )
    course_title = course_title or "Course Title"

    result = {
        "id": str(uuid.uuid4()),
        "title": course_title,
        "url": course_url,
        "provider": "academy.arvancloud.ir",
        "chapters": [],
    }

    og_image = soup.find("meta", property="og:image")
    if og_image and og_image.get("content"):
        result["imageUrl"] = og_image["content"]

    chapters_container = _find_chapters_container(soup)
    if chapters_container is None:
        raise ValueError(
            "Could not find the course chapters accordion (expected a "
            "'course-headline' elementor-widget-accordion div). The page "
            "structure may have changed, or the page may be login-gated - "
            "try saving the fully rendered page HTML from your browser and "
            "passing that file instead of a URL."
        )

    for item in chapters_container.find_all("div", class_="elementor-accordion-item"):
        title_el = item.find("a", class_="elementor-accordion-title")
        chapter_title = title_el.get_text(strip=True) if title_el else "Untitled Chapter"

        sections = []
        for link in item.select(".elementor-tab-content li a"):
            section_title = link.get_text(strip=True)
            if section_title:
                sections.append({
                    "id": str(uuid.uuid4()),
                    "title": section_title,
                    "isCompleted": False,
                })

        # Only add chapters that have sections
        if sections:
            result["chapters"].append({
                "id": str(uuid.uuid4()),
                "title": chapter_title,
                "sections": sections,
            })

    return [result]


if __name__ == "__main__":
    if len(sys.argv) > 1:
        source = sys.argv[1]
        try:
            course_url = ""
            # بررسی اینکه آیا ورودی یک لینک است یا فایل محلی
            if source.startswith("http://") or source.startswith("https://"):
                headers = {
                    "User-Agent": (
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                        "AppleWebKit/537.36 (KHTML, like Gecko) "
                        "Chrome/124.0 Safari/537.36"
                    )
                }
                response = requests.get(source, headers=headers, timeout=30)
                response.raise_for_status()
                html = response.text
                course_url = source
            else:
                with open(source, "r", encoding="utf-8") as f:
                    html = f.read()

            result = extract_course_json(html, course_url)
            print(json.dumps(result, ensure_ascii=False, indent=2))
        except Exception as e:
            print(f"Error: {e}")
    else:
        print("Usage: python main.py <URL or local_html_file>")
