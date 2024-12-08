#!/bin/bash

# Update and install required packages
sudo apt-get update
sudo apt-get install -y nodejs npm git

# Clone your repository
git clone https://rafayak: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@github.com/dcsc-project-68/project.git
cd project/code/frontend

# Install frontend dependencies
npm install

# Build and start the frontend application
npm run build
nohup npm start &