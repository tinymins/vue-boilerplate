#!/bin/bash
__DIR__=$(dirname "$0")

# includes
. ${__DIR__}/includes/env.sh

# check npm require install
if [ ! -f node_modules/.package-ci.json ] || ! cmp -s package.json node_modules/.package-ci.json
then
  if [ "${PUBLISH_MODE}" = "CI" ]
  then
    ${NPM} ci || exit 1
  else
    ${NPM} install || exit 1
  fi
  cp -f package.json node_modules/.package-ci.json || exit 1
else
  echo "> package.json has not changed since last setup, npm install skipped."
fi
