# StudyHub — React Midterm Project

A complete responsive React Single Page Application for exploring and saving courses. Built with Vite, React 19, CSS, `lucide-react`, and **one simulated asynchronous API**.

## Features

- **120 initial courses** saved in `src/data/courses.json` across eight categories.
- **Simulated API** in `src/api/coursesApi.js`: asynchronous Promise-based operations, realistic request delays, JSON serialization, and `localStorage` persistence.
- **List and detail views**; detail pages use their own asynchronous API request.
- **Controlled form** to add a new course, including field validation and success/error feedback.
- **Search**, category and level **filtering**, **sorting**, and **pagination** (9 items per page).
- Save and unsave courses; explore your **Saved** library.
- Loading skeletons, explicit error handling with a retry button, empty states, and success notifications.
- `useState`, `useEffect`, stable keys, abortable asynchronous requests with cleanup, debounced search, and immutable state updates.
- Mobile-friendly, responsive UI. No external CSS framework and no direct DOM manipulation to update React content.

> The catalog and instructor names are sample data for this academic demonstration. The app does not collect personal information or make network requests to a real backend.

## How to run in VS Code

Requirements: Node.js 20+ and npm.

```powershell
cd C:\Users\USER\Desktop\React.project\studyhub-midterm
npm install
npm run dev
```

Open the **Local** URL reported by Vite, usually `http://localhost:5173/studyhub-midterm/` (the configured base path includes the repository name).

### Build and preview

```powershell
npm run build
npm run preview
```

## GitHub Pages deployment

This project is configured for a repository **named `studyhub-midterm`** in `vite.config.js`:

```js
base: '/studyhub-midterm/'
```

If you choose another repository name, update `base` to `'/YOUR_REPOSITORY_NAME/'` before deployment.

### 1. Create a blank repository

Create a **new public repository** on GitHub named `studyhub-midterm`. Do not initialize it with a README/license if you want to use the following exact Git commands.

### 2. Push the full project

In the `studyhub-midterm` directory (not in an existing parent Git repo):

```powershell
git init
git add .
git commit -m "Build StudyHub React midterm project"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/studyhub-midterm.git
git push -u origin main
```

`node_modules/` and `dist/` are intentionally ignored. The project must be committed with all other files, not only `src`.

### 3. Deploy

```powershell
npm run deploy
```

This runs `npm run build` automatically and publishes the `dist` folder to the `gh-pages` branch.

On GitHub, open **Settings → Pages** and choose:

- Source: **Deploy from a branch**
- Branch: **gh-pages**
- Folder: **/(root)**

Your eventual link will be:

`https://YOUR_USERNAME.github.io/studyhub-midterm/`

The site is not published by creating the files alone. Deploy it and verify it loads before submitting.

## Architecture / component tree

```text
main.jsx
└── App.jsx                         shared state, events, effects, routing
    ├── Header.jsx                  Discover/Saved navigation and add action
    ├── Hero.jsx                    catalog overview from the API
    ├── Filters.jsx                 controlled search, category, level, sorting
    ├── CourseGrid.jsx              list loading/error/empty/success states
    │   ├── CourseCard.jsx          each course with stable key and save action
    │   └── StatePanel.jsx          error/empty states and retry actions
    ├── Pagination.jsx              paginated results controls
    ├── CourseDetails.jsx           individual asynchronous course request
    ├── AddCourseModal.jsx          controlled form and validation
    ├── Toast.jsx                   temporary success notifications
    └── Footer.jsx                  information about the demo
```

Supporting modules:

- `src/api/coursesApi.js` — ONE source for getting the list, catalog summary, one course, and adding a course.
- `src/data/courses.json` — exactly 120 initial records.
- `src/lib/courseUi.js` — category labels, icons, and display helpers.
- `src/styles.css` — component styles, layout, breakpoints, states, focus styles, and animations.
- `public/favicon.svg` — brand icon.
- `vite.config.js` — Vite React plugin and GitHub Pages base path.

## Important state and effects

| State | Component | Purpose |
|---|---|---|
| `search`, `category`, `level`, `sort`, `page` | `App` | Controls API list requests |
| `courses`, `listStatus`, `listError` | `App` | Server response + loading/error/success |
| `savedIds`, `view` | `App` | Saved-course collection and view |
| `courseId`, `detail`, `detailStatus` | `App` | Detail view and its asynchronous data |
| `showAddForm`, `toast` | `App` | Modal visibility and success notification |
| `form`, `isSubmitting`, `error` | `AddCourseModal` | Local controlled-form state |

Key `useEffect` examples:

1. Debounce search by 250ms with a cleared timer.
2. Fetch paginated catalog with dependencies and `AbortController` cleanup.
3. Fetch selected course details with `AbortController` cleanup.
4. Persist `savedIds` to `localStorage` after changes.
5. Listen for browser back/forward with listener cleanup.
6. Dismiss toast after 3.8 seconds with cleared timer.

## Manual test checklist

- [ ] First visit shows at least 120 courses and loads a page of 9 cards.
- [ ] Search for “React” returns a matching course; unknown keyword shows empty state.
- [ ] Choose the Design category; choose Advanced; reset filters.
- [ ] Sort by Title A–Z, Newest, and Shortest; results change accordingly.
- [ ] Change page; different cards display.
- [ ] Open course details and return to list (browser back works too).
- [ ] Save a course; find it on Saved tab; unsave it.
- [ ] Submit a valid course through Add course; success toast shows and the total increases.
- [ ] Refresh; new course remains (via browser `localStorage`).
- [ ] Resize browser to mobile width; cards and controls are usable.
- [ ] `npm run build` succeeds and deployed GitHub Pages URL works.

## Data and error notes

- On first use, the API seeds browser `localStorage` from `courses.json`.
- If browser storage is disabled or corrupted, requests reject and the UI displays an error with a retry button.
- API requests use `AbortController` to cancel superseded requests. React StrictMode in development intentionally exercises setup/cleanup; abort prevents stale updates.
- React re-renders when state or props change. All course cards use `key={course.id}`, which is stable across filtering, sorting, and pagination. Because pagination unmounts off-page cards, local card state is deliberately **not** used for information that must persist: saved IDs live in `App` and browser storage.

## Midterm defense

A detailed Russian-language explanation of each file, common questions, and demonstration scenarios is included in **`DEFENSE_GUIDE_RU.md`**.

## Submission

1. GitHub repository URL
2. Working GitHub Pages URL
3. Click **Turn In** before the platform deadline.
