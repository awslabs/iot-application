#!/bin/bash

# This script installs Node.JS related prerequesites for Unix based system.

# Install Volta
echo "Installing Volta..."
curl https://get.volta.sh | bash
export VOLTA_HOME="$HOME/.volta"
export PATH="$VOLTA_HOME/bin:$PATH"
echo

# Install Node.js@18 with Volta
echo "Installing Node.js@18..."
volta install node@18
echo

# Install Yarn with Volta
echo "Install Yarn..."
volta install yarn
echo
