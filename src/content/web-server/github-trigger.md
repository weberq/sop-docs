---
title: GitHub Trigger Deployment
eleventyNavigation:
  key: GitHub Trigger
  title: GitHub Trigger
  parent: Web Server
  order: 1
---

# S.O.P for Automated Trigger from GitHub to Web Server

**Date:** 21/11/2024  
**Updated Date:** 21/11/2024
**SOP Title:** Automated trigger from GitHub repo to web server and pull updates  
**Principal Investigator:** Deepak Reddy  

---

## Step 1 – Create Demo Repo

Make a PHP demo POC repo like this:  
[https://github.com/deepak4566/demo-fresh-poc.git](https://github.com/deepak4566/demo-fresh-poc.git)  
Then add a `script.sh` file which will run inside the server.

---

## Step 2 – Setup GCP Server

Go to Google Cloud Console and create a demo web server:  
[https://console.cloud.google.com/compute/instances](https://console.cloud.google.com/compute/instances)

Login into the server and create private and public keys using:  
[GitHub SSH key generation guide](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)

---

## Step 3 – Add SSH Keys to GitHub

- Add the **private key** to GitHub repository secrets as `GCP_SSH_PRIVATE_KEY`.
- Add the **public key** to your GitHub profile settings under SSH keys.

---

## Step 4 – Add GitHub Workflow

Here is a sample GitHub workflow to deploy:

```yaml
name: Deploy to Google Cloud Instance

on:
  push:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to Compute Engine Instance
        run: |
          INSTANCE_NAME="fresh-poc"
          ZONE="us-central1-b"
          SSH_USER="deepakreddyats1"
          SSH_KEY="${{ secrets.GCP_SSH_PRIVATE_KEY }}"
          DEPLOY_SCRIPT="Script.sh"

          echo "$SSH_KEY" > private_key
          chmod 600 private_key

          ssh-keygen -y -f private_key > private_key.pub
          mkdir -p ~/.ssh
          ssh-keyscan -H 34.45.123.96 >> ~/.ssh/known_hosts

          scp -i private_key $DEPLOY_SCRIPT "$SSH_USER@34.45.123.96:~/"
          ssh -i private_key "$SSH_USER@34.45.123.96" "bash ~/Script.sh"
```

Make sure to replace IP, zone, and usernames with your own values.

---

## Conclusion

This SOP demonstrates automated deployment from GitHub to a web server. It significantly reduces manual deployment effort.

---

**Prepared by:** Deepak Reddy  
**Reviewed by:** *To be assigned*  
**Approved by:** *To be assigned*