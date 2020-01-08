#!/bin/bash

TEMP_FOLDER=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 16 | head -n 1)

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

  if [ -f "yarn.lock" ]; then
    run_yarn
  else
    run_npm
  fi
  
  if [ "$LOCAL_DEPLOY_PATH" != "true" ]; then
    if ! mkdir -p $LOCAL_DEPLOY_PATH; then
      echo "Creating $LOCAL_DEPLOY_PATH failed!"
      exit 1
    fi
  fi

  deploy_files
}

main "$@"
