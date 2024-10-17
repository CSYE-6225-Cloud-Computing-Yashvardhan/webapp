#!/bin/bash

# Update system packages
echo "Updating system packages..."
sudo apt update -y
sudo apt upgrade -y

echo "Creating User and user group"
# Create the csye6225 group
sudo groupadd csye6225

# Create the csye6225 user with the primary group csye6225 and no login shell
sudo useradd -r -g csye6225 -s /usr/sbin/nologin csye6225
echo " - User csye6225 created."