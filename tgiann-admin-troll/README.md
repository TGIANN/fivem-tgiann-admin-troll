# fivem-tgiann-admin-troll

## Development

Install any LTS release of [`Node.js`](https://nodejs.org/) from v18.

Install the [`pnpm`](https://pnpm.io/installation) package manager globally `npm install -g pnpm`.

Install the necessary packages with `pnpm install`

Use `pnpm watch` to actively rebuild modified files while developing the resource.

During web development, use `pnpm web:dev` to start vite's webserver and watch for changes.

### Build

Use `pnpm build` to build all project files in production mode.

### Layout

- [/dist/](dist)
  - Compiled project files.
- [/locales/](locales)
  - JSON files used for translations with [ox_lib](https://coxdocs.dev/ox_lib/Modules/Locale/Shared).
- [/scripts/](scripts)
  - Scripts used in the development process, but not part of the compiled resource.
- [/src/](src)
  - Project source code.
- [/static/](static)
  - Files to include with the resource that aren't compiled or loaded (e.g. config).
- [/web/](web)
  - UI Files
