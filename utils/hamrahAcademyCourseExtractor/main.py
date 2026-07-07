import json
import sys
import uuid

try:
    import requests
except ImportError:
    print("Please install required packages: pip install -r requirements.txt")
    sys.exit(1)

# hamrah.academy is a Next.js app: the "مطالب دوره" (course contents) section
# renders as loading skeletons in the DOM and its data is fetched client-side.
# But the full course object is still present in the raw HTML response,
# streamed via React Server Components into inline
# `self.__next_f.push([1, "..."])` calls. We reconstruct that stream and pull
# the `courseDetails` object out of it instead of parsing visible DOM nodes.
NEXT_F_MARKER = "self.__next_f.push([1,"


def _extract_next_f_strings(html):
    """Find every `self.__next_f.push([1,"..."])` call and decode its quoted
    JSON string literal, in document order.

    A naive regex like `".*?"` breaks here because some chunks contain
    escaped quotes (e.g. embedded JSON-LD `<script>` markup), so we walk the
    string manually, respecting `\\"` escapes, to find its true end.
    """
    strings = []
    pos = 0
    while True:
        idx = html.find(NEXT_F_MARKER, pos)
        if idx == -1:
            break
        qstart = html.find('"', idx + len(NEXT_F_MARKER))
        if qstart == -1:
            break
        i = qstart + 1
        escaped = False
        while i < len(html):
            ch = html[i]
            if escaped:
                escaped = False
            elif ch == '\\':
                escaped = True
            elif ch == '"':
                break
            i += 1
        literal = html[qstart:i + 1]
        try:
            strings.append(json.loads(literal))
        except (json.JSONDecodeError, ValueError):
            pass
        pos = i + 1
    return strings


def _extract_balanced_json_object(text, start):
    """Return the substring of `text` starting at index `start` (which must
    point at a `{`) up to its matching closing `}`, respecting quoted
    strings/escapes. The surrounding payload isn't valid JSON as a whole (it's
    a stream of JS array literals mixed with data), so we can't just
    `json.loads` the full thing - we need to carve out one balanced object.
    """
    depth = 0
    in_string = False
    escaped = False
    for i in range(start, len(text)):
        ch = text[i]
        if in_string:
            if escaped:
                escaped = False
            elif ch == '\\':
                escaped = True
            elif ch == '"':
                in_string = False
        else:
            if ch == '"':
                in_string = True
            elif ch == '{':
                depth += 1
            elif ch == '}':
                depth -= 1
                if depth == 0:
                    return text[start:i + 1]
    return None


def _find_course_details(html):
    full_payload = "".join(_extract_next_f_strings(html))
    key = '"courseDetails":'
    idx = full_payload.find(key)
    if idx == -1:
        return None
    obj_str = _extract_balanced_json_object(full_payload, idx + len(key))
    if obj_str is None:
        return None
    try:
        return json.loads(obj_str)
    except json.JSONDecodeError:
        return None


def extract_course_json(html_content, course_url=""):
    course = _find_course_details(html_content)
    if course is None:
        raise ValueError(
            "Could not find course data in the page. hamrah.academy loads the "
            "syllabus from a data payload embedded in the page; if this keeps "
            "failing, the site's structure may have changed, or the course "
            "requires login to view (try saving the page's HTML while logged "
            "in and passing that file instead of a URL)."
        )

    result = {
        "id": str(uuid.uuid4()),
        "title": course.get("title") or "Course Title",
        "url": course_url,
        "provider": "hamrah.academy",
        "chapters": [],
    }

    image_url = course.get("imageUrl")
    if image_url:
        result["imageUrl"] = image_url

    chapters = sorted(course.get("chapters") or [], key=lambda c: c.get("order", 0))
    for chapter in chapters:
        lessons = sorted(chapter.get("lessons") or [], key=lambda l: l.get("order", 0))
        sections = [
            {
                "id": str(uuid.uuid4()),
                "title": lesson["title"].strip(),
                "isCompleted": False,
            }
            for lesson in lessons
            if lesson.get("title")
        ]

        # Only add chapters that have sections
        if sections:
            result["chapters"].append({
                "id": str(uuid.uuid4()),
                "title": (chapter.get("title") or "Untitled Chapter").strip(),
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
