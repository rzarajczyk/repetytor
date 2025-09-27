#!/bin/bash
docker build -t repetytor:local .
docker run $OPTION \
  --name "$NAME" \
  --rm \
  -p 8080:8080 \
  repetytor:local