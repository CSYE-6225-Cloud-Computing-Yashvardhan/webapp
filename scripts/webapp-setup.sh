#!/bin/bash

# Webapp setup
echo "Creating new directory csye6225"
sudo mkdir -p /home/csye6225

# Copy the application files
echo "Copying the webapp zip file form /tmp"
sudo cp /tmp/webapp.zip /home/csye6225/webapp.zip

cd /home/csye6225/ || exit

# Unzip the webapp project
echo "Unzipping webapp..."
sudo unzip webapp.zip

# Changing permissions
echo "Changing Permissions"
sudo chown -R csye6225:csye6225 /home/csye6225/webapp
sudo chmod 500 /home/csye6225/webapp/server.js

# Remove the zip file
echo "Removing the zip file"
sudo rm -f webapp.zip

# Install project dependencies
echo "Installing project dependencies."
cd /home/csye6225/webapp || exit
sudo npm install
echo "Webapp setup complete."

# Copy Amazon Cloud Watch
sudo mv /tmp/cloudwatch-config.json /opt/cloudwatch-config.json
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/opt/cloudwatch-config.json -s