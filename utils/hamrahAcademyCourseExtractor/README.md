# Hamrah Academy Course Extractor

A small Python script that scrapes a course page from [hamrah.academy](https://hamrah.academy) and converts its chapter/lesson outline into the JSON format LearnTrack expects, so you can import it straight into the app instead of typing it in by hand.

## How it works

Unlike maktabkhoone.org, hamrah.academy's course page renders its "مطالب دوره" (course contents) section as loading skeletons in the DOM - the chapter/lesson list isn't in visible HTML elements, it's fetched client-side. However, the full course data (title, image, chapters, lessons, etc.) is still present in the raw HTML response: it's a Next.js app that streams this data via React Server Components into inline `self.__next_f.push([1, "..."])` script calls. This script reconstructs that stream and reads the embedded course object directly, so a plain HTTP fetch (no headless browser/JS execution needed) is enough.

## Setup

```bash
cd utils/hamrahAcademyCourseExtractor
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Usage

Pass either a course URL or a path to a locally saved HTML file:

```bash
python main.py https://hamrah.academy/course/1101/comprehensive-python-programming
# or
python main.py course_page.html
```

The script prints a JSON array to stdout containing one course object (`id`, `title`, `url`, `imageUrl` if available, `provider`, `chapters[].sections[]`), matching the `Course` shape used by the LearnTrack frontend. Redirect it to a file and import it from LearnTrack's "Import" button:

```bash
python main.py https://hamrah.academy/course/1101/comprehensive-python-programming > course.json
```

## Notes

- If a course requires login to view its full chapter/lesson list, fetching by URL may return incomplete data or fail entirely. In that case, save the page's HTML from your browser (View Page Source, after logging in - no need to wait for the page to fully render first, since the data is embedded in the initial response) and pass that file path to the script instead.
- All extracted sections start with `isCompleted: false`.
- Chapters with no detected lessons are dropped from the output.
- This relies on hamrah.academy's current (undocumented) internal data format; if the site's frontend framework or data structure changes, extraction may start failing and this script will need updating.
