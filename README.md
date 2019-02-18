# 132nd Web Backend

This node+express application will serve the client web app with information via a REST API. Othe applications can also access the data by passing having an authenticated user.

### Dev deployment:

Make sure you have origin set to

Pushes the branch to live (remote) and triggers a rebuild and deployment:

```
git push live <branch, i.e. master>
```

Resources:
[Set up deployment via GIT](https://www.digitalocean.com/community/tutorials/how-to-set-up-automatic-deployment-with-git-with-a-vps)

[Set up a NodeJS application for production](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04)

## Post-Receive Hook

```
#!/bin/sh

_TREE=/var/www/132nd-backend
_APPNAME=132-API

echo "Stopping PM2 services..."
pm2 stop $_APPNAME

echo "Checking out files..."
GIT_WORK_TREE=$_TREE git checkout -f

echo "Entering working folder..."
cd $_TREE
pwd

echo "Installing dependencies..."
npm install
ls -la $_TREE

echo "Building..."
npm run build

echo "Staring PM2 Services..."
pm2 start

echo " -- Finished -- "
```
