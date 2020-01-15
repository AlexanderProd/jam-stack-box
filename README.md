<!-- AUTO-GENERATED-CONTENT:START (STARTER) -->
<h1 align="center">
  <img alt="Logo" src="resources/logo.png" height="100px" />
  <br/>
  JAM Stack Box
</h1>

Your own self hosted continuous deployment solution for JAM Stack websites.

JamStackBox takes GitHub repositories containing GatsbyJS sites and builts them once an POST request to a specific URL has been called. The build happens inside a Docker container to assure that a stable enviroment is provided. Once the build is finished the static files are saved to a dedicated folder inside of `sites-public`.

## Prerequisites

- You need to have a running Docker instance on your machine.
  ⚠️ It currently only works with Docker on Linux or MacOS listening to `/var/run/docker.sock`.
- Even though its called JAMStackBox, currently only sites based on [GatsbyJS](https://www.gatsbyjs.org) are supported.
  Feel free to contribute by editing the builder to support other static site generators.

## Start

### Download this repo

```
git clone https://github.com/AlexanderProd/jam-stack-box
```

### Install packages and build server

Simply run the following command in the downloaded directory.

```
$ bash install.sh
```

### Start the server process

The server process is a NodeJS server listening to a specific port, default 3000.
You can change the port by providing a PORT ENV variable. (e.g. PORT=2345).

The server process can be started manually.

```
$ node server/dist/index.js
```

Or using the [PM2 process manager](https://pm2.keymetrics.io) by running the following command in the downloaded directory.

```
$ pm2 start
```

## 📌 ToDo

- [ ] Use dynamic NodeJS version in Builder using NVM.
- [ ] Add frontend to control sites and builds.
- [ ] Add support for other static site generators than Gatsby.
- [x] Split server and builder into dedicated docker containers.
