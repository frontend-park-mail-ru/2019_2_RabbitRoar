#!/bin/bash

# Stop execution on fails
set -e

# Set work dir
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PROJ_DIR="$SCRIPT_DIR/../.."

echo "Running build $PROJ_DIR."

pushd $PROJ_DIR

docker build -f deployments/Dockerfile-app -t alexnav/svoyak-frontend-chat .
docker tag alexnav/svoyak-frontend-chat alexnav/svoyak-frontend-chat:$TRAVIS_BUILD_NUMBER

docker build -f deployments/Dockerfile-app -t alexnav/svoyak-frontend-app .
docker tag alexnav/svoyak-frontend-app alexnav/svoyak-frontend-app:$TRAVIS_BUILD_NUMBER

docker login --username=alexnav --password=$DOCKER_HUB_TOKEN

docker push alexnav/svoyak-frontend-chat
docker push alexnav/svoyak-frontend-app

popd

