#!/bin/bash

# This script installs prerequesites and deploy the application for Unix based
# system.

# Install prerequesites
. install-prepreqs-unix.sh

# Deploy the application
echo "Deploying the application..."
yarn deploy
echo
