#!/bin/bash

npm ls -all 2>/dev/null | \

  grep -o -e '@\?aws-amplify[^ ]*' | \

  sort | uniq | \

  sed -E 's/^(@?[^@]+).*$/\1/g' | \

  uniq -d | sort
