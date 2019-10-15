# 132nd Web Backend

This node+express application will serve the client web app with information via a REST API. Othe applications can also access the data by passing having an authenticated user.

- [132nd Web Backend](#132nd-web-backend)
    - [Scripts](#scripts)
    - [Dev deployment](#dev-deployment)
  - [Documentation](#documentation)
    - [How To Update Docs](#how-to-update-docs)
  - [Post-Receive Hook](#post-receive-hook)

### Scripts

Create a full production build:

```
npm run build
```

Create a development build, with additional debugging features enabled:

```
npm run build:dev
```

After perfomin any two of the above, run the command below to run your build

```
npm start
```

### Dev deployment

Make sure you have origin set to

Pushes the branch to live (remote) and triggers a rebuild and deployment:

```
git push live <branch, i.e. master>
```

Resources:
[Set up deployment via GIT](https://www.digitalocean.com/community/tutorials/how-to-set-up-automatic-deployment-with-git-with-a-vps)

[Set up a NodeJS application for production](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04)

### Commits and Releases

All commits should be one of three types:
- `new`: A new feature or addition
- `change`: A cheange to an existing feature or addition
- `fix`: A fix for a certain posted issue or bug
- `ignore`: A commit that will not appear on the changelog

Example commit message:
`(change) Updated README.md to reflect new changes in information`

## Releases

*The below scripts have to be executed in a LINUX or WSL environment in order to work!*

The following scripts are included for creating releases via [Release](https://github.com/zeit/release)

Major: Incompatible API changes were introduced:
```
$ npm run release:major
```

Minor: Functionality was added in a backwards-compatible manner
```
$ npm run release:minor
```

Patch: Backwards-compatible bug fixes were applied
```
$ npm run release:patch
```

Pre-releases
```
$ npm run release:pre
```


## Documentation

The documentation for this repo is written according to the [API Blueprint](https://apiblueprint.org) spec, and uses [Snowboard](https://github.com/bukalapak/snowboard) for parsing and rendering.

*Note that Snowboard will have to be run in a Linux or WSL environment to work!*

### How To Update Docs
Install Snowboard
```
$ npm install -g snowboard
```

Then make sure you are in the project root folder and run
```
$ snowboard html -o ./www ./.apib/index.apib
```

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
