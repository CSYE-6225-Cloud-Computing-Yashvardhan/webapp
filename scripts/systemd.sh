#!/bin/bash

# Copying service from /tmp directory
sudo cp /tmp/webapp.service /etc/systemd/system/

# Reload the systemd daemon to recognize the new service
sudo systemctl daemon-reload

# Enable webapp.service to start on boot
sudo systemctl enable webapp.service

: << 'END_COMMENT'
# Start the webapp.service
sudo systemctl start webapp.service

webappStarted=$?
if [ $webappStarted -eq 0 ]; then 
    echo "Success - webapp running."
else
    echo "Failed - webapp not running."
fi
END_COMMENT

#Removing git
sudo apt-get remove -y git
gitRemoved=$?

if [ $gitRemoved -eq 0 ]; then 
    echo "Git is present and it is removed successfully."
else
    echo "Git is not present."
fi

