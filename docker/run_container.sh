#!/bin/bash

echo 'Building container.'
docker build --no-cache=true -t frontend .
echo 'Built.'

echo 'Running container.'
docker run -p '8083:8000' -it frontend
