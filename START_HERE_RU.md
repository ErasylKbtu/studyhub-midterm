# С чего начать — StudyHub Midterm

В этом архиве **весь исходный код React-проекта**, включая 120 исходных записей и CSS. Папку `node_modules` загружать и копировать не требуется: она устанавливается командой `npm install`.

## Шаг 1. Распакуй архив

Пример расположения:

```text
C:\Users\USER\Desktop\React.project\studyhub-midterm
```

Открой именно папку **studyhub-midterm** через VS Code: `File → Open Folder`.

## Шаг 2. Установка и запуск

Открой Terminal → New Terminal в VS Code. Убедись, что путь заканчивается на `studyhub-midterm`.

```powershell
npm install
npm run dev
```

Открой адрес **Local** из терминала. Из-за `base` в Vite это может быть `http://localhost:5173/studyhub-midterm/`.

Для остановки сервера: `Ctrl + C`.

## Шаг 3. Проверь приложение

1. В каталоге должны быть 120 курсов в 8 категориях.
2. Напиши `React` в строку поиска.
3. Поменяй категорию на `Design`, затем выбери уровень `Advanced`.
4. Проверь сортировки `Title A–Z` и `Shortest first`.
5. Нажми `Next` для перехода на следующую страницу.
6. Нажми стрелку на карточке для открытия подробной страницы.
7. Нажми значок закладки и открой `Saved`.
8. Нажми `Add course`, заполни поля и опубликуй курс.
9. Обнови страницу: новый курс должен остаться (он хранится в `localStorage`).
10. Проверь интерфейс в узком окне браузера.

## Шаг 4. Создай новый репозиторий

На GitHub создай новый **Public repository** с названием:

```text
studyhub-midterm
```

Желательно оставить его пустым: не ставить галочки `Add a README` и `Add .gitignore`, так как эти файлы уже есть в проекте.

Затем в терминале VS Code, внутри `studyhub-midterm`:

```powershell
git init
git add .
git commit -m "Complete StudyHub React midterm"
git branch -M main
git remote add origin https://github.com/ErasylKbtu/studyhub-midterm.git
git push -u origin main
```

Если Git пишет, что репозиторий `origin` уже существует, сначала проверь `git remote -v` — не нужно менять чужой репозиторий наугад. Если GitHub требует вход, авторизуйся в браузере.

## Шаг 5. Опубликуй на GitHub Pages

```powershell
npm run build
npm run deploy
```

Дождись `Published`.

Открой репозиторий на GitHub → `Settings` → `Pages`:

```text
Source: Deploy from a branch
Branch: gh-pages
Folder: / (root)
```

Сохрани. Через некоторое время появится `Your site is live at...`.

Предполагаемый адрес (после успешной публикации):

```text
https://erasylkbtu.github.io/studyhub-midterm/
```

Если ты **переименуешь репозиторий**, сначала измени `base` в `vite.config.js` на его точное имя, затем сделай `npm run deploy` снова.

## Шаг 6. Сдача

1. Ссылка на публичный GitHub-репозиторий.
2. Ссылка на работающий опубликованный сайт.
3. Нажать **Turn In** до дедлайна.

## Где объяснение кода?

Открой `DEFENSE_GUIDE_RU.md`: там подробно по-русски объяснён каждый файл, все ключевые понятия (`useState`, `useEffect`, props, map, filter, keys, cleanup, race conditions), схема работы API и сценарий защиты.

`README.md` — описание по-английски, которое можно оставить в GitHub для преподавателя.
