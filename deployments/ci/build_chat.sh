#!/bin/bash

# Stop execution on fails
set -e

# Set work dir
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PROJ_DIR="$SCRIPT_DIR/../.."

echo "Running build chat $PROJ_DIR."

pushd $PROJ_DIR

docker build -f deployments/Dockerfile-chat -t alexnav/svoyak-frontend-chat .
docker tag alexnav/svoyak-frontend-chat alexnav/svoyak-frontend-chat:$TRAVIS_BUILD_NUMBER

popd
