#!/bin/bash

# Install required utilities for unzipping
echo "Installing unzip utility..."
sudo apt install unzip -y

# Install Node.js and npm
echo "Installing Node.js and npm..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Install AWS Cloud Watch
echo "Installing Amazon Cloud Watch..."
sudo apt install -y amazon-cloudwatch-agent
