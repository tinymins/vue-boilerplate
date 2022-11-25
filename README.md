# vue-boilerplate

> This repo is a boilerplate for `Vue.js v2` project. You could use it as a base to build your own web app or chrome extension.

## Features

> Notice: This branch is not only SPA version but also chrome-extension version, you can just run build to build a chrome extension.
  * Equip with Vue, TypeScript & ES6 & Babel 6 & Postcss (SCSS, LESS, STYLUS), build with Webpack 4.
  * Support hot module replacement, it will hot reload the page when you modified the code.
  * Support auto px2rem (default on) and auto px2viewport (default off).
  * Lint codes with [eslint](https://github.com/eslint/eslint), [stylelint](https://github.com/stylelint/stylelint) and [vuelint](https://github.com/vuejs/eslint-plugin-vue), [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint).
  * Support build a chrome extension, makes chrome extension development much easier.

## Branches

  `master` branch is a pure vue boilerplate without any 3rd-party ui framework.
  `cube-ui` branch is a vue boilerplate with [cube-ui](https://github.com/didi/cube-ui) installed.
  `element-ui` branch is a vue boilerplate with [element-ui](https://github.com/ElemeFE/element) installed.

## How to use

  ```bash
  # First, clone this repo.
  git clone https://github.com/tinymins/vue-scaffolding.git <yourAppName> && cd <yourAppName>

  # Second, change git remote url to your own git repo and push.
  git remote set-url origin <yourAppGitRepoUrl> && git push

  # If you are in China, you can modify the npm registry for better network speed
  npm config set registry https://registry.npm.taobao.org

  # Then, run start, dependencies will be installed automaticly, and app will be launched.
  npm start
  ```

## How to build

  With everything in the previous chapter done first, build is very easy to do.

  ``` bash
  # build for production with minification
  npm run build

  # build for development
  npm run build:development
  ```

  Nginx config sample

  ```ini
  location / {
    try_files $uri $uri/ /index.html;
  }
  ```

## How to switch to chrome-extension mode

  Use extra parameter `--build-type="chrome-ext"`:

  ```shell
  npm start -- --build-type="chrome-ext"
  npm run build -- --build-type="chrome-ext"
  ```

### Debug Chrome extension

  Start project

  ```shell
  npm start
  ```

  Quit all your Chrome instances, then start Chrome with web security disabled.

  For OSX:

  ```shell
  open -a "Google Chrome" --args --disable-web-security --user-data-dir
  ```

  For WINDOWS:

  ```bat
  chrome.exe --disable-web-security --user-data-dir
  ```

### Build and publish Chrome extension

  Run `npm run build:chrome-ext`, then you can load unpacked extension in chrome and select folder `dist`. You just need to packaging this folder and publish it to [Chrome web store](https://chrome.google.com/webstore/developer/dashboard).
