# vue-scaffolding

> This repo is a scaffolding for vue project, based on [vue-mobile-boilerplate](https://github.com/luckyyyyy/vue-example) repo.

## Feature

  * Inherit all features of luckyyyyy's [vue-mobile-boilerplate](https://github.com/luckyyyyy/vue-example) project.
  * Support render different page depends on device type within the same route.

## How to use

  ```bash
  # First, clone this repo.
  git clone https://github.com/tinymins/vue-scaffolding.git <yourAppName> && cd <yourAppName>

  # Second, change git remote url to your own git repo and push.
  git remote set-url origin <yourAppGitRepoUrl> && git push

  # If you are in China, please modify the npm registry
  npm config set registry https://registry.npm.taobao.org

  # Third, install the dependencies.
  npm install

  # Then, launch it with development version.
  npm run dev
  ```

## How to build

  With everything in the previous chapter done first, build is very easy to do.

  ``` bash
  # build for production with minification
  npm run build

  # build for development
  npm run build:dev

  # build for production and view the bundle analyzer report
  npm run build --report
  ```

  Nginx config sample

  ```ini
  location / {
    try_files $uri $uri/ /index.html;
  }
  ```
