#!/bin/bash

# Install required utilities for unzipping
echo "Installing unzip utility..."
sudo apt install unzip -y

# Install Node.js and npm
echo "Installing Node.js and npm..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

#Install JSON parsor
echo "Installing JSON parsor..."
sudo apt install -y jq


#Install AWS CLI
echo "Installing AWS CLI..."
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
if ! command -v aws &> /dev/null; then
  echo "AWS CLI installation failed!"
  exit 1
fi

# Install AWS Cloud Watch
echo "Installing Amazon Cloud Watch..."
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
#sudo apt install -y amazon-cloudwatch-agent
sudo dpkg -i amazon-cloudwatch-agent.deb
