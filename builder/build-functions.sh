#!/bin/bash

cleanup() {
  if [[ "$(pwd)" == *"$TEMP_FOLDER"* ]]; then
    cd ..
    rm -rf $TEMP_FOLDER
  else
    exit
  fi
}

run_custom_command() {
  if $BUILD_COMMAND; then
    echo "Successfully build with custom command \"$BUILD_COMMAND\"."
  else 
    echo "Custom build command \"$BUILD_COMMAND\" failed."
    exit 1
  fi
}

run_yarn() {
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

deploy_files() {
  if ! mkdir -p $DEPLOY_DIR; then
    echo "Creating $DEPLOY_DIR failed!"
    exit 1
  fi

  if rsync -aru --delete ./public/ $DEPLOY_DIR; then
    echo "Sucessfully deployed!"
    exit 0
  else
    echo "Deploy failed!"
    exit 1
  fi
}