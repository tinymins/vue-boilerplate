if [ ! -f node_modules/package.gitlab-ci.json ] || ! cmp -s package.json node_modules/package.gitlab-ci.json\
  # || [ ! -f node_modules/package-lock.gitlab-ci.json ] || ! cmp -s package-lock.json node_modules/package-lock.gitlab-ci.json
then
  cp -rf package.json node_modules/package.gitlab-ci.json.tmp
  # cp -rf package-lock.json node_modules/package-lock.gitlab-ci.json.tmp
  # npm config set registry https://registry.npm.taobao.org
  npm install
  mv -f node_modules/package.gitlab-ci.json.tmp node_modules/package.gitlab-ci.json
  # mv -f node_modules/package-lock.gitlab-ci.json.tmp node_modules/package-lock.gitlab-ci.json
  cp -f static/js/id-match.js node_modules/eslint/lib/rules/id-match.js
fi
