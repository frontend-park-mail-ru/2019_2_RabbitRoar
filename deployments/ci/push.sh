#!/bin/bash

# Stop execution on fails
set -e

# Set work dir
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PROJ_DIR="$SCRIPT_DIR/../.."

echo "Running push $PROJ_DIR."

pushd $PROJ_DIR

docker login --username=alexnav --password=$DOCKER_HUB_TOKEN

docker push alexnav/svoyak-frontend-chat
docker push alexnav/svoyak-frontend-app

popd
