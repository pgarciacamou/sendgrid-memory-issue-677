#!/bin/bash
set -eu

readonly environment=${1:-}
readonly branch=${2:-"master"}

if [ "$environment" != "production" ] && [ "$environment" != "staging" ]; then
  echo "Environment $environment not supported"
  exit 1
fi

if [ "$environment" = "production" ] && [ "$branch" != "master" ]; then
  echo "Only master branch can be deployed to production"
  exit 1
fi

echo ""
echo "==============="
echo "DEPLOYING TO ENV: ${environment} BRANCH: ${branch}"
echo "==============="
echo ""

git pull origin "$branch" && git push "$environment" "$branch":master --force

echo ""
echo "All done. Very good! Now remember to test!"
