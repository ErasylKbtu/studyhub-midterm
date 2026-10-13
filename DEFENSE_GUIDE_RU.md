# StudyHub — объяснение проекта для защиты React Midterm

## 1. Идея

StudyHub — индивидуальное SPA-приложение для поиска и изучения каталога курсов. В приложении 120 исходных записей из `src/data/courses.json` (8 категорий), получаемых не напрямую, а через симулированное асинхронное API. Можно искать курсы, фильтровать по категории/уровню, сортировать, переключать страницы, смотреть подробности, сохранять понравившиеся курсы и добавлять новые.

Важно: API симулируется через Promise, задержки, JSON и `localStorage`. Настоящий сервер не нужен, поэтому приложение целиком работает на GitHub Pages.

## 2. Что делает каждый файл

1. **`index.html`** — HTML-оболочка; содержит `<div id="root"></div>`, куда React вставляет приложение.
2. **`src/main.jsx`** — входная точка React, `createRoot`, подключение `App` и CSS. `StrictMode` проверяет корректность работы эффектов в development.
3. **`src/App.jsx`** — главный компонент и «координатор»: общие state, навигация между каталогом и подробностями, сохранённые курсы, обработчики событий и несколько `useEffect`.
4. **`src/api/coursesApi.js`** — асинхронные `getCourses`, `getCatalogOverview`, `getCourseById`, `createCourse`. Основной каталог читает и сохраняет через `localStorage`. Поиск, фильтрация, сортировка и pagination выполняются на уровне simulated API.
5. **`src/data/courses.json`** — 120 исходных записей; у курса есть `id`, `title`, `category`, `level`, `durationHours`, `lessons`, `instructor`, `description`, `publishedAt`, `outcomes`.
6. **`src/lib/courseUi.js`** — 8 категорий, 3 уровня, иконки для категорий, helper `formatDuration`.
7. **`src/components/Header.jsx`** — логотип, вкладки Discover/Saved, количество избранных, кнопка Add course. Получает значения и callbacks через props.
8. **`src/components/Hero.jsx`** — приветствие, оформление и динамические данные обзора: общее количество курсов, категорий, уроков.
9. **`src/components/Filters.jsx`** — controlled input поиска, кнопки категорий, select для уровня и сортировки. Сами значения state хранятся в App; Filters передаёт события родителю.
10. **`src/components/CourseGrid.jsx`** — отображение loading skeletons, error, empty или success; для успешного списка использует `courses.map(...)`.
11. **`src/components/CourseCard.jsx`** — карточка одного курса: фон категории, название, уровень, длительность, уроки, инструктор и кнопки открытия/сохранения. `console.log` показывает re-render.
12. **`src/components/StatePanel.jsx`** — единый переиспользуемый дизайн для ошибки, пустого поиска, пустого списка Saved.
13. **`src/components/Pagination.jsx`** — переключает страницы, показывает текущую страницу и кнопки Next/Previous.
14. **`src/components/CourseDetails.jsx`** — отдельный детальный экран: описание, результаты обучения, параметры курса и сохранение.
15. **`src/components/AddCourseModal.jsx`** — controlled form; локальные state `form`, `isSubmitting`, `error`; обработка ввода, валидация и вызов `onCreate`.
16. **`src/components/Toast.jsx`** — ненавязчивое уведомление после добавления или сохранения.
17. **`src/components/Footer.jsx`** — нижняя часть приложения с информацией о демонстрационных данных.
18. **`src/styles.css`** — полный чистый CSS: цвета, типографика, сетка, карточки, формы, состояния, адаптивность для планшета и телефона.
19. **`public/favicon.svg`** — иконка вкладки браузера.
20. **`package.json`** — зависимости React, Vite, lucide-react и gh-pages; команды `dev`, `build`, `deploy`.
21. **`vite.config.js`** — подключает React plugin; `base: '/studyhub-midterm/'` нужен, чтобы ассеты открывались на GitHub Pages.
22. **`.gitignore`** — не загружать в Git папки `node_modules` и `dist`.
23. **`README.md`** — назначение, установка, структура, особенности API, деплой и тест-чеклист.

## 3. Как работает путь данных

```text
courses.json (120 записей)
        ↓ (первый запуск)
localStorage
        ↓
getCourses({ search, category, level, sort, page })
        ↓ Promise + задержка
useEffect в App.jsx
        ↓ setCourses(result)
CourseGrid.jsx → courses.map(...)
        ↓
CourseCard.jsx × 9 (одна страница)
```

Нажатие на карточку:

```text
CourseCard → onOpen(id) → App.openCourse(id)
    → setCourseId(id) → useEffect → getCourseById(id)
    → setDetail(course) → CourseDetails.jsx
```

Добавление:

```text
AddCourseModal (controlled fields)
    → onCreate(form)
    → App.handleCreate(form)
    → createCourse(form) (API)
    → localStorage сохраняет новый объект
    → обновление reloadToken
    → useEffect загружает новый список
    → toast показывает сообщение об успехе
```

## 4. State: где и зачем

**Общий/поднятый state** в App: `search`, `category`, `level`, `sort`, `page`, `courses`, `listStatus`, `savedIds`, `view`, `courseId`, `detail`. Эти данные нужны нескольким компонентам и поэтому хранятся в общего родителя, передаются через props. Это **shared state**, не Redux и не Context API.

**Локальный state** в AddCourseModal: `form`, `isSubmitting`, `error`. Эти значения нужны только форме, поэтому оставлены внутри неё; это соответствует критерию «не хранить всё в App».

`useState` не делает состояние глобальным. Оно локально тому компоненту, где объявлено, и может передаваться ниже через props.

## 5. Теория, которую могут спросить

**Что такое props?** Данные и функции от родительского компонента к дочернему. Например `App` передаёт в `Filters` `search` и `onSearch`.

**Что такое controlled form?** Значение input приходит из React state (`value={form.title}`), а изменение меняет state (`onChange={change}`). Источник истины — состояние React.

**Что такое `map`?** Создаёт новый массив результатов на основе каждого элемента. Например `courses.map(course => <CourseCard key={course.id} .../>)` рисует карточки.

**Что такое `filter`?** Создаёт новый массив только из элементов, удовлетворяющих условию. В API используется `all.filter(course => ...)` для поиска/фильтрации.

**Что вызывает re-render?** Изменение state в компоненте; обновление props, когда родитель снова его рендерит; изменение контекста (мы его не используем). Вычисление JSX само по себе не означает полную замену DOM.

**Что такое reconciliation?** React сопоставляет предыдущую и следующую структуру элементов, определяя, какие части интерфейса сохранить или изменить.

**Зачем нужны keys?** Позволяют React отличать элементы списка. `key={course.id}` стабилен при сортировке. Индекс списка плох для элементов, которые можно переставлять.

**Preservation/reset state?** React обычно сохраняет локальный state, пока компонент того же типа имеет ту же позицию/ключ в дереве. Если компонент размонтирован, state сбрасывается. Наше избранное хранится в App/localStorage, поэтому не теряется при удалении карточки с экрана во время пагинации. Для намеренного сброса можно поменять `key` компонента.

**Render vs commit?** На стадии render React вычисляет новый JSX; на стадии commit применяет нужные изменения к DOM. Не каждое повторное вычисление означает реальную замену DOM-узлов.

**Что такое state snapshot?** Каждый render видит значения state на момент именно этого render; обновление через `setState` не изменяет существующую переменную синхронно.

**Batching?** React группирует несколько обновлений state в одно обновление интерфейса, где это возможно. Например после успешного добавления мы обновляем фильтры, страницу и токен загрузки.

**`useEffect`?** Запускает побочные действия после commit: получение данных, таймеры, подписки, синхронизация с браузером. Зависимости задают, при изменении каких значений эффект перезапускается.

**Cleanup?** Возвращаемая из эффекта функция, например `return () => controller.abort()` или `return () => clearTimeout(timer)`. Выполняется перед следующим запуском эффекта и при размонтировании.

**Stale closure?** Асинхронный callback может использовать старые значения state, захваченные из старого render. Поэтому для обновлений, зависящих от предыдущего значения, используем функциональную форму, например `setReloadToken(n => n + 1)` или `setSavedIds(previous => ...)`, как в нашем коде.

**Race condition?** Старый запрос может завершиться после нового и перезаписать правильные результаты устаревшими. Мы отменяем старый запрос `AbortController` при изменении фильтров или поисковой строки.

**Четыре состояния UI:** loading (скелетоны), error (сообщение + Retry), empty (нет совпадений), success (карточки, статистика, toast после действий).

## 6. Практическая демонстрация на защите

1. Открыть каталог и показать 120 курсов и 9 на странице.
2. Написать в поиск `React`. Объяснить `onChange` → state → debounce → `useEffect` → simulated API → `filter` → новые карточки.
3. Выбрать категорию Design, уровень Advanced. Объяснить два фильтра одновременно.
4. Изменить сортировку на Shortest first. Объяснить comparator `a.durationHours - b.durationHours`.
5. Перейти на страницу 2. Объяснить `(page - 1) * pageSize` и `.slice()` внутри API.
6. Открыть курс. Объяснить второй `useEffect` и функцию `getCourseById`.
7. Нажать Save, открыть вкладку Saved. Показать shared state `savedIds` и browser `localStorage`.
8. Открыть Add course, заполнить, отправить. Объяснить локальный controlled form и `createCourse`.
9. Обновить браузер: добавленный курс остался. Объяснить `localStorage`.
10. Открыть DevTools Console: увидеть лог `App rendered` и `CourseCard rendered` при обновлениях.

## 7. Возможные изменения прямо на защите

**Добавить фильтр:** добавить новое поле в `App`, controlled input в `Filters`, зависимость в эффект списка и условие фильтрации в `getCourses`.

**Показать дополнительное поле:** у курса уже есть `publishedAt` и `lessons`; вывести `<span>{course.lessons} lessons</span>` в CourseCard.

**Изменить сортировку:** добавить `<option value="title-desc">Title Z–A</option>` и компаратор `"title-desc": (a,b) => b.title.localeCompare(a.title)` в API.

**Добавить reset action:** вызывать `setSearch(''); setCategory('All'); setLevel('All'); setPage(1)` (уже есть `resetFilters`).

**Изменить useEffect dependencies:** если убрать `category` из зависимостей, изменение категории не будет сразу повторно запрашивать каталог. Это ошибка.

**Добавить loading condition:** использовать `listStatus === 'loading'` для отображения skeleton or spinner (уже реализовано).

## 8. Короткий рассказ по-английски

> My individual project is StudyHub, a React single-page application for exploring a course catalog. It contains 120 initial courses and uses one simulated asynchronous API backed by JSON and localStorage. Users can search, filter by category and level, sort courses, switch pages, view details, save courses, and add their own courses. I use useState for UI and application state, useEffect for API requests, debouncing, browser history, and cleanup. API requests are cancelled with AbortController to avoid stale responses. The app handles loading, error, empty, and success states. I also use stable keys in lists and keep form-only state inside the form component. Finally, the app is responsive and can be deployed to GitHub Pages.

## 9. Что сдавать

1. Ссылка на **отдельный публичный GitHub репозиторий**.
2. Ссылка на **работающее GitHub Pages приложение**.
3. Нажать **Turn In** до дедлайна.

Проект индивидуальный. Перед сдачей запусти `npm run build` и проверь опубликованный адрес.
