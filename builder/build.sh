#!/bin/bash

TEMP_FOLDER=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 16 | head -n 1)

. $HOME/.nvm/nvm.sh
. ./build-functions.sh --source-only

main() {
  trap cleanup EXIT SIGHUP SIGINT SIGTERM

  if [ "$REPO_URL" == "undefined" ]; then
    exit 0
  fi

  mkdir $TEMP_FOLDER
  cd $TEMP_FOLDER

  echo git clone $REPO_URL
  if git clone $REPO_URL .; then
    echo "Cloned $REPO_URL."
  else
    echo "Cloning $REPO_URL failed!"
    exit 1
  fi

  if [ "$NODE_VERSION" != "undefined" ]; then
    switch_node_version
  fi

  if [ -f "yarn.lock" ]; then
    run_yarn
  else
    run_npm
  fi

  deploy_files
}

main "$@"
