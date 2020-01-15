<!-- AUTO-GENERATED-CONTENT:START (STARTER) -->
<h1 align="center">
  <img alt="Logo" src="resources/logo.png" height="100px" />
  <br/>
  JAMStackBox
</h1>

Your own self hosted continuous deployment solution for JAM Stack websites.

JamStackBox is a continuous deployment service for the Jam Stack.

It takes GitHub repositories containing GatsbyJS sites and builts them once an POST request to a specific URL has been called.

The build happens inside a Docker container to assure that a stable enviroment is provided. Once the build is finished the static files are saved to a dedicated folder inside of `sites-public`.

## Prerequisites

- You need to have a running Docker instance on your machine.
  ⚠️ It currently only works with Docker on Linux or MacOS.
- Even though its called JAMStackBox, currently only sites based on [GatsbyJS](https://www.gatsbyjs.org) are supported.
  Feel free to contribute by editing the builder to support other static site generators.

## Start

### Download this repo

```
git clone https://github.com/AlexanderProd/jam-stack-box
```

### Install packages and build server

Simply run the install script in the downloaded directory.

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

## Usage

Since this project is currently in development theres no frontend to control your sites yet. Though you can still use it simply by doing requests agains the rest server.

When a new site gets added all parameters get saves to the DB and the sites gets a unique 6 digit alphanumeric string as ID.

A new site gets created by posting a POST request against `/site` and a build gets triggered with a POST to `/build/[id]`.

## REST Endpoints

The most important API endpoints are the following, checkout index.js in the server directory for the rest.

### POST `/site`

Creates a new site instance and saves it to the database, returns the id of the site.
Expects content type `x-www-form-urlencoded`.

| field  | required | description                                                                                                               |
| ------ | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| name   | true     | Name of the site, only used for front-end purposes.                                                                       |
| source | true     | GitHub link to a repository with the site content. <br/> ( e.g. https://github.com/AlexanderProd/gatsby-shopify-starter ) |

### POST `/build/[id]`

Triggers a new build for the site with the ID. Returns an error if the ID doesn't exist.

### GET `/sites`

Returns a JSON array with all sites in the database.

### GET `/sites/[id]`

Returns all details of a specific site.

### DELETE `/site/[id]`

Deletes the site with given ID.

## 📌 ToDo

- [ ] Use dynamic NodeJS version in Builder using NVM.
- [ ] Add frontend to control sites and builds.
- [ ] Add support for other static site generators than Gatsby.
- [x] Split server and builder into dedicated docker containers.
