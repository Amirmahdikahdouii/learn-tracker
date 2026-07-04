# MaktabKhooneh Course Extractor

A small Python script that scrapes a course page from [maktabkhoone.org](https://maktabkhoone.org) and converts its chapter/section outline into the JSON format LearnTrack expects, so you can import it straight into the app instead of typing it in by hand.

## Setup

```bash
cd utils/maktabKhooneCourseExtractor
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Usage

Pass either a course URL or a path to a locally saved HTML file:

```bash
python main.py https://maktabkhoone.org/path/to/course
# or
python main.py course_page.html
```

The script prints a JSON array to stdout containing one course object (`id`, `title`, `url`, `provider`, `chapters[].sections[]`), matching the `Course` shape used by the LearnTrack frontend. Redirect it to a file and import it from LearnTrack's "Import" button:

```bash
python main.py https://maktabkhoone.org/path/to/course > course.json
```

## Notes

- If the course page requires a login to view its full chapter/section list, fetching by URL may return incomplete or empty chapters. In that case, save the fully rendered page HTML from your browser (after logging in) and pass that file path to the script instead.
- All extracted sections start with `isCompleted: false`.
- Chapters with no detected sections are dropped from the output; if a course is missing chapters after extraction, the page's HTML structure may differ from what the script expects.
