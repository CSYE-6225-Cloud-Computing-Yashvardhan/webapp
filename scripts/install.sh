#!/bin/bash

# Install required utilities for unzipping
echo "Installing unzip utility..."
sudo apt install unzip -y

# Install Node.js and npm
echo "Installing Node.js and npm..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Install MySQL server
echo "Installing MySQL..."
sudo apt install mysql-server -y

# Start MySQL and secure installation
echo "Securing MySQL installation..."

# Start the MySQL service
sudo systemctl start mysql

# Enable MySQL to start on boot
sudo systemctl enable mysqld

mysql -e "CREATE DATABASE IF NOT EXISTS cloud_native_app;"
mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';"
mysql -e "GRANT ALL PRIVILEGES ON cloud_native_app.* TO 'root'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

mysqlSetup=$?
if [ $mysqlSetup -eq 0 ]; then 
    echo "Success - Database Created."
else
    echo "Failed - Database Creation Failed."
fi