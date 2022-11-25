#!/bin/bash
__DIR__=$(dirname "$0")

# includes
. ${__DIR__}/includes/env.sh

# check npm require install
if [ ! -f node_modules/.package-ci.json ] || ! cmp -s package.json node_modules/.package-ci.json
then
  echoenv
  if [ "${RUNNER_TYPE}" = "CI" ]
  then
    ${NPM} ci || exit 1
  else
    ${NPM} install || exit 1
  fi
  cp -f package.json node_modules/.package-ci.json || exit 1
else
  echo "> package.json has not changed since last setup, ${NPM} install skipped."
fi

# check git-cz global hook install
if [ "${RUNNER_TYPE}" != "CI" ] && [ -z "$(command -v commitizen 2> /dev/null)" ]; then
  echo "> Git-cz: commitizen not found, installation start."
  npm install -g commitizen
fi
