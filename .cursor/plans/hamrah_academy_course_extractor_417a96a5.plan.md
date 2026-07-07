---
name: Hamrah Academy Course Extractor
overview: Add a standalone Python scraper, `utils/hamrahAcademyCourseExtractor/`, that takes a hamrah.academy course URL and prints a JSON array in LearnTrack's `Course[]` format, mirroring the existing `utils/maktabKhooneCourseExtractor/` tool.
todos:
  - id: create-dir-files
    content: Create utils/hamrahAcademyCourseExtractor/ with main.py, requirements.txt, .gitignore, README.md
    status: completed
  - id: implement-extraction
    content: Implement RSC payload extraction + balanced-JSON parsing + LearnTrack JSON mapping in main.py
    status: completed
  - id: verify
    content: Run the script against the real course URL and confirm correct JSON output
    status: completed
isProject: false
---

## Key finding from research

Unlike maktabkhoone.org (server-rendered HTML with chapters/sections directly in the DOM), hamrah.academy is a Next.js app where the "مطالب دوره" (course contents) section renders as loading skeletons — the chapter/lesson data is **not** in visible DOM elements. However, it **is** present in the raw HTML response: Next.js streams the full course object (via React Server Components) into inline `self.__next_f.push([1, "..."])` script calls. I fetched the real page (`https://hamrah.academy/course/1101/comprehensive-python-programming`) and confirmed a `"courseDetails": {...}` JSON object is embedded there containing `id`, `title`, `imageUrl`, and `chapters[]` → each with `title`, `order`, `lessons[]` → each with `title`, `order`. This was verified end-to-end against the real course (11 chapters, correct titles/order/lesson counts matching the live site).

This means **no headless browser is needed** — a plain `requests.get()` + payload reconstruction is sufficient, keeping this tool as lightweight as the maktabkhoone one.

## New files

`utils/hamrahAcademyCourseExtractor/main.py`:
- `_extract_next_f_strings(html)`: scans for every `self.__next_f.push([1,"..."])` call and manually walks the quoted string (respecting `\"` escapes) to pull out each raw JSON string literal, decoding it with `json.loads`. (A naive regex like `".*?"` breaks here because some chunks contain escaped quotes, e.g. embedded JSON-LD; verified this during research.)
- `_extract_balanced_json_object(text, start)`: brace-matching scanner (also quote/escape aware) to pull a complete `{...}` object out of the concatenated payload text, since the payload isn't valid JSON as a whole (it's a stream of JS array literals mixed with data).
- `_find_course_details(html)`: joins all decoded chunks in document order, locates the `"courseDetails":` key, and extracts+parses that object.
- `extract_course_json(html_content, course_url="")`: builds the LearnTrack shape:
  - `id`: new `uuid4`
  - `title`: `course["title"]`
  - `url`: passed-in course URL
  - `imageUrl`: `course["imageUrl"]` if present (optional field, per `learntrack-template.json`)
  - `provider`: `"hamrah.academy"`
  - `chapters`: `course["chapters"]` sorted by `order`, each mapped to `{id, title, sections}`; `sections` built from `chapter["lessons"]` sorted by `order`, each mapped to `{id, title, isCompleted: false}`. Chapters with no lessons are dropped (matches existing tool's behavior).
  - Returns `[result]` (array, matching the template file and existing tool's output shape).
- CLI entrypoint identical in spirit to [utils/maktabKhooneCourseExtractor/main.py](utils/maktabKhooneCourseExtractor/main.py): accepts a URL (fetched with `requests` + a browser-like `User-Agent` header, since a default UA may be blocked) or a local saved HTML file path (fallback for courses needing login), prints pretty JSON to stdout, and prints `Error: ...` on failure (e.g. clear message if `courseDetails` can't be found, meaning the page structure changed or the course doesn't exist/isn't accessible).

`utils/hamrahAcademyCourseExtractor/requirements.txt`: just `requests` (+ its transitive deps pinned), no BeautifulSoup needed since we don't do DOM/CSS-selector parsing at all — it's pure text/JSON extraction.

`utils/hamrahAcademyCourseExtractor/.gitignore`: same as the existing tool (`.venv`, `venv`, `__pycache__/`, `*.pyc`).

`utils/hamrahAcademyCourseExtractor/README.md`: setup/usage instructions mirroring [utils/maktabKhooneCourseExtractor/README.md](utils/maktabKhooneCourseExtractor/README.md), plus a note explaining *why* this works differently (data is embedded in the initial HTML response as a streamed RSC payload, not in the visible DOM — so unlike the maktabkhoone tool, "View Page Source" / a plain HTTP fetch is sufficient even though the visible page looks empty until JS runs), and the same caveat that this is undocumented site-internal structure that could change if hamrah.academy's frontend changes.

## Verification

- Run `python main.py https://hamrah.academy/course/1101/comprehensive-python-programming` and confirm the printed JSON has 11 chapters with correct titles/lesson counts (already manually confirmed the underlying extraction logic produces this).
- Spot-check the output validates against the shape in [learntrack-template.json](learntrack-template.json).
