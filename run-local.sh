#!/bin/bash
docker run $OPTION \
  --name "$NAME" \
  --rm \
  -p 8000:80 \
  -v $(pwd)/src:/var/www/html/\
  $(docker build -q .)