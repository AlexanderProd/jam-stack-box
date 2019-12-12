#!/bin/bash
# 
# Builds JAM Stack Site.

readonly REPO_URL=$1
readonly BUILD_COMMAND=$2

trap "exit" SIGHUP SIGINT SIGTERM

variable_is_set() {
  declare -p "$1" &>/dev/null
}

main() {
  git clone $REPO_URL .
  if variable_is_set $BUILD_COMMAND; then
    npm install
    $BUILD_COMMAND
  elif [ -f "./yarn.lock" ]; then
    yarn install
    yarn build
  else 
    npm install
    npm run-script build
  fi
}

main "$@"
