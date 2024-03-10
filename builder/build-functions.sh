#!/bin/bash

run_custom_command() {
  if $BUILD_COMMAND; then
    echo "Successfully build with custom command \"$BUILD_COMMAND\"."
  else 
    echo "Custom build command \"$BUILD_COMMAND\" failed."
    exit 1
  fi
}

link_node_modules() {
  if ! mkdir -p /build-cache/$SITE_ID/node_modules; then
    echo "Creating node_modules cache failed!"
    exit 1
  fi

  if ! ln -s /build-cache/$SITE_ID/node_modules $(pwd)/node_modules; then
    echo "Linking node_modules cache failed!"
    exit 1
  fi
}

run_yarn() {
  if ! npm install -g yarn; then 
    echo "Failed installing yarn!"
    exit 1
  fi

  if yarn install; then
    echo "Sucessfully installed packages with yarn."
  else
    echo "Installing packages with yarn $(yarn --version) failed."
    exit 1
  fi

  if [ "$BUILD_COMMAND" != "undefined" ]; then
    run_custom_command
  else
    if yarn build; then
      echo "Sucessfully build with yarn."
    else
      echo "Build with yarn failed."
      exit 1
    fi
  fi
}

run_npm() {
  if npm install; then
    echo "Sucessfully installed packages with npm."
  else
    echo "Installing packages with npm ($(npm --version)) failed."
    exit 1
  fi

  if [ "$BUILD_COMMAND" != "undefined" ]; then
    run_custom_command
  else
    if npm run build; then
      echo "Sucessfully build with npm."
    else
      echo "Build with npm failed."
      exit 1
    fi
  fi
}

switch_node_version() {
  if ! nvm install $NODE_VERSION; then
    echo "Switching to node version $NODE_VERSION failed!"
    echo "Using node version $(node -v)."
  fi
}

copy_build_cache() {
  if rsync -aru --delete $(pwd)/.cache /build-cache/$SITE_ID; then
    echo "Sucessfully copied .cache to /build-cache/$SITE_ID."
  else
    echo "Copying .cache to /build-cache/$SITE_ID failed!"
  fi

  if rsync -aru --delete $(pwd)/$BUILD_DIR /build-cache/$SITE_ID; then
    echo "Sucessfully copied $BUILD_DIR to /build-cache/$SITE_ID."
  else
    echo "Copying $BUILD_DIR to /build-cache/$SITE_ID failed!"
  fi
}

restore_build_cache() {
  if rsync -aru --delete /build-cache/$SITE_ID/.cache $(pwd); then
    echo "Sucessfully restored .cache from /build-cache/$SITE_ID."
  else
    echo "Restoring .cache from /build-cache/$SITE_ID failed!"
  fi

  if rsync -aru --delete /build-cache/$SITE_ID/$BUILD_DIR $(pwd); then
    echo "Sucessfully restored $BUILD_DIR from /build-cache/$SITE_ID."
  else
    echo "Restoring $BUILD_DIR from /build-cache/$SITE_ID failed!"
  fi
}

deploy_files() {
  if ! mkdir -p $DEPLOY_DIR; then
    echo "Creating $DEPLOY_DIR failed!"
    exit 1
  fi

  if rsync -aru --delete ./$BUILD_DIR/ $DEPLOY_DIR; then
    echo "Sucessfully deployed!"
    exit 0
  else
    echo "Deploy failed!"
    exit 1
  fi
}