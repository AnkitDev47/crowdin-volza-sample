# Volza Crowdin Sample

A small app for testing Crowdin before it goes into `frontend.app.volza.com`. It copies the main app's **Welcome** (`/home`) and **My Account** (`/myprofile`) pages, with the same CSS and static data in place of the backend.

- **Welcome page**: every string is translated (`src/locales/*.json`).
- **My Account page**: English only for now. It joins the translation work later.
- **Language switcher**: in the header. Your choice is saved in `localStorage` (`volza-language`).

The i18n setup is copied from branch `frontend/feature/multilingual-app`: i18next + react-i18next, flat keys (`keySeparator: false`) and English as the fallback.

## Run

Translations are served from SQL Server by `backend/TranslationApi` (.NET 8). The frontend fetches them from there.

1. Put your DB connection string in `backend/TranslationApi/appsettings.Development.json` (gitignored, never commit it):
   ```json
   { "ConnectionStrings": { "CslaExConnection": "Database=...;Server=...;User=...;Password=...;Enlist=false;" } }
   ```
2. Seed the DB from `src/locales/*.json` (creates `IIPL_Translation` on first run; re-run after any locale change):
   ```bash
   dotnet run --project backend/TranslationApi -- seed "$PWD/src/locales"
   ```
3. Start the API (http://localhost:5000):
   ```bash
   dotnet run --project backend/TranslationApi
   ```
4. Start the frontend in another terminal (http://localhost:3000). Vite proxies `/controllers` to the API:
   ```bash
   npm install
   npm start
   ```

On `main`, `.github/workflows/seed-translations.yml` re-seeds automatically when locale files change (needs the `TRANSLATION_DB_CONNECTION` secret).

## How translations work

- `src/locales/en.json` is the **source file** that Crowdin reads.
- Crowdin writes `src/locales/<code>.json` (for example `hi.json`, `es.json`).
- Any JSON file in `src/locales/` is seeded into the DB and shows up in the language switcher automatically, so no code change is needed when you add a language.
- `hi.json` is a starter file so the switcher works before Crowdin is connected. Crowdin overwrites it.

## Connect Crowdin

1. Create a Crowdin project with source language English, then add the target languages (for example Hindi).
2. Pick **one** of these options:
   - **GitHub integration (recommended)**: in Crowdin, go to Integrations → GitHub and choose this repo. Crowdin reads `crowdin.yml`, takes `en.json` from your branch and opens a PR with the translated files.
   - **CLI**:
     ```bash
     npm i -g @crowdin/cli            # needs Java 17+
     export CROWDIN_PROJECT_ID=<id>
     export CROWDIN_PERSONAL_TOKEN=<token>   # Crowdin → Account Settings → API
     npm run crowdin:upload           # sends en.json to Crowdin
     npm run crowdin:download         # gets the translated <code>.json files
     ```
3. Restart or refresh `npm start`, then pick the language in the header.

## Adding a string

1. Add the key to `en.json`, for example `"welcome.newThing": "New thing"`.
2. Use it in the code: `const { t } = useTranslation(); t('welcome.newThing')`.
3. Upload to Crowdin (or push, if you use the GitHub integration).
