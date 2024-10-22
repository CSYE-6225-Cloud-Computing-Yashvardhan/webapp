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


: << 'END_COMMENT'
# temp - creating env file
cd /home/csye6225/webapp || exit
sudo touch .env
echo > sudo tee -a .env
sudo ls -al | grep .env


# Setting values in .env file
echo DB_HOST=127.0.0.1 | sudo tee -a .env
echo DB_USER="$DB_USER" | sudo tee -a .env
echo DB_PASSWORD="$DB_PASSWORD" | sudo tee -a .env
echo DB_NAME="$DB_NAME" | sudo tee -a .env
echo DB_PORT=3306 | sudo tee -a .env
echo PORT=3000 | sudo tee -a .env
cd /home/csye6225/ || exit
END_COMMENT


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