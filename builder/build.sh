#!/bin/bash

export LANG=en_US.UTF-8
export LANGUAGE=en_US:en
export LC_ALL=en_US.UTF-8
export FORCE_COLOR=0
export NO_COLOR=1

. $HOME/.nvm/nvm.sh
. ./build-functions.sh --source-only

main() {
  if [ "$REPO_URL" == "undefined" ]; then
    echo "No repository URL provided."
    exit 0
  fi

  mkdir $SITE_ID
  cd $SITE_ID

  echo git clone $REPO_URL
  if git clone $REPO_URL .; then
    echo "Cloned $REPO_URL."
  else
    echo "Cloning $REPO_URL failed!"
    exit 1
  fi

  if [ "$USE_CACHE" == "true" ]; then
    echo "Using cache for $SITE_ID."
    link_node_modules
    restore_build_cache
  fi

  if [ "$NODE_VERSION" != "undefined" ]; then
    switch_node_version
  fi

  if [ -f "yarn.lock" ]; then
    run_yarn
  else
    run_npm
  fi

  copy_build_cache
  deploy_files
}

main "$@"
