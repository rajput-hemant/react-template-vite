<div align=center>

![views] ![stars] ![forks] ![issues] ![license] ![repo-size]

<div style="font-size: 2.5rem; display: flex; align-items: center; justify-content: center; gap: 1rem;">
<img src="public/react.svg" style="width: 100px; height: 100px;"> + <img src="public/vite.svg" style="width: 90px; height: 100px;">
</div>

# React Starter Template w/ Vite

### A Minimal React Starter Template with Vite, TailwindCSS, and TypeScript pre-configured with ESLint, Prettier and Husky.

</div>

## Features

- ⚡ **[Vite](https://vitejs.dev/)** - Lightning fast frontend tooling
- ⚛️ **[React 18](https://reactjs.org/)** - A JavaScript library for building user interfaces
- 🎨 **[TailwindCSS](https://tailwindcss.com/)** - A utility-first CSS framework for rapidly building custom designs
- 📦 **[TypeScript](https://www.typescriptlang.org/)** - A typed superset of JavaScript that compiles to plain JavaScript
- 📦 **[react-router](https://reactrouter.com/)** - Declarative routing for React
- 📦 **[lucide-react](https://lucide.dev/)** - Beautiful & consistent icons
- 📝 **[ESLint](https://eslint.org/)** - The pluggable linting utility for JavaScript and JSX
- ✨ **[Prettier](https://prettier.io/)** - An opinionated code formatter
- 🐶 **[Husky](https://typicode.github.io/husky/#/)** - Git hooks made easy
- 🚫 **[lint-staged](https://github.com/okonet/lint-staged)** - Run linters against staged git files
- 📄 **[commitlint](https://commitlint.js.org/#/)** - Lint commit messages
- 📦 **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager

## Getting Started

**Install `degit` globally:**

```bash
# pnpm
pnpm i -g degit

# yarn
yarn global add degit

# npm
npm i -g degit
```

**Scaffold the project:**

```bash
# w/ react-router-dom
degit rajput-hemant/react-template-vite#router my-app

# basic template
degit rajput-hemant/react-template-vite my-app
cd my-app
```

**Install dependencies:**

```bash
# pnpm
pnpm i

# yarn
yarn

# npm
npm i
```

**Initialize a new git repository _(Optional)_:**

```bash
git init
git add .
git commit --no-verify -m "init"
```

## Available Scripts

In the project directory, you can run:

- **`pnpm dev`** - Runs the app in the development mode.
- **`pnpm build`** - Builds the app for production to the `dist` folder.
- **`pnpm serve`** - Serves the production build from the `dist` folder.
- **`pnpm preview`** - Bundles and serves the production build from the `dist` folder.
- **`pnpm type-check`** - Runs TypeScript type-checking.
- **`pnpm lint`** - Runs ESLint with Prettier.
- **`pnpm fmt:check`** - Checks if the code is formatted with Prettier.
- **`pnpm fmt:write`** - Formats the code with Prettier.
- **`pnpm prepare`** - Runs Husky install.

## Switching Package Manager

This template uses [pnpm](https://pnpm.io/) as the default package manager. If you want to use `npm` or `yarn`, you need to remove the `pnpm-lock.yaml` file and run `npm i` or `yarn` to generate the lock file for the respective package manager.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributors:

<div align=center>

[![][contributors]][contributors-graph]

_Note: It may take up to 24h for the [contrib.rocks][contrib-rocks] plugin to update because it's refreshed once a day._

</div>

<!----------------------------------{ Labels }--------------------------------->

[views]: https://komarev.com/ghpvc/?username=react-template-vite&label=view%20counter&color=red&style=flat
[repo-size]: https://img.shields.io/github/repo-size/rajput-hemant/react-template-vite
[issues]: https://img.shields.io/github/issues-raw/rajput-hemant/react-template-vite
[license]: https://img.shields.io/github/license/rajput-hemant/react-template-vite
[forks]: https://img.shields.io/github/forks/rajput-hemant/react-template-vite?style=flat
[stars]: https://img.shields.io/github/stars/rajput-hemant/react-template-vite
[contributors]: https://contrib.rocks/image?repo=rajput-hemant/react-template-vite&max=500
[contributors-graph]: https://github.com/rajput-hemant/react-template-vite/graphs/contributors
[contrib-rocks]: https://contrib.rocks/preview?repo=rajput-hemant%2Freact-template-vite
