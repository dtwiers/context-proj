#!/usr/bin/env bash

set -e;

# Set the default env
env="--dev"

# Parse the command line arguments
while [ $# -gt 0 ]; do
  case "$1" in
    --prod)
      env="--prod"
      shift
      ;;
    --dev)
      env="--dev"
      shift
      ;;
    *)
      echo "Unknown argument: $1"
      exit 1
      ;;
  esac
done



# Print the appropriate message based on the env
if [ "$env" = "--prod" ]; then
  cp ./.env.production ./.env
  npm ci
  npm run migrate-prod
  npm run generate
  npm run build
else
  rm -f ./env
  cp ./.env.dev ./.env
  npm ci
  npm run migrate
  npm run generate
  npm run build
fi