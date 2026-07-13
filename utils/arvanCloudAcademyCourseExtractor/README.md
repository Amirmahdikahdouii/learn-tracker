# ArvanCloud Academy Course Extractor

A small Python script that scrapes a course page from [academy.arvancloud.ir](https://academy.arvancloud.ir) and converts its chapter/lesson outline into the JSON format LearnTrack expects, so you can import it straight into the app instead of typing it in by hand.

## Setup

```bash
cd utils/arvanCloudAcademyCourseExtractor
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Usage

Pass either a course URL or a path to a locally saved HTML file:

```bash
python main.py https://academy.arvancloud.ir/courses/associate-devops-engineer/
# or
python main.py course_page.html
```

The script prints a JSON array to stdout containing one course object (`id`, `title`, `url`, `imageUrl`, `provider`, `chapters[].sections[]`), matching the `Course` shape used by the LearnTrack frontend. Redirect it to a file and import it from LearnTrack's "Import" button:

```bash
python main.py https://academy.arvancloud.ir/courses/associate-devops-engineer/ > course.json
```

## Notes

- If a course page requires login to view its full chapter/lesson list, fetching by URL may return incomplete HTML. In that case, save the page's HTML from your browser (View Page Source - the page is server-rendered, so no need to wait for it to fully load) and pass that file path to the script instead.
- All extracted sections start with `isCompleted: false`.
- Chapters with no detected lessons are dropped from the output.
- Per-lesson metadata such as duration, video/quiz type, or free/locked status isn't present on the course page itself, so it isn't captured.
- `imageUrl` is read from the page's `og:image` meta tag, which on this site is a generic ArvanCloud Academy banner shared across all courses, not a per-course cover image.
- Chapters are found via the accordion widget's `course-headline` class, which is scoped specifically to avoid the page's FAQ section (an unrelated accordion with an identical structure just below the chapters).
