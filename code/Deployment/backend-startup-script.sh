#!/bin/bash

sudo apt-get update
sudo apt-get install -y python3 python3-pip git

git clone https://rafayak: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@github.com/dcsc-project-68/project.git
cd project/code/backend

# Install Python dependencies
pip3 install --no-cache-dir -r requirements.txt

export SECRET_KEY="rafay"
export GOOGLE_APPLICATION_CREDENTIALS="gcp-key.json"

flask run --host=0.0.0.0 --port=5000 &