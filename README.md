<!-- AUTO-GENERATED-CONTENT:START (STARTER) -->
<h1 align="center">
  <img alt="Logo" src="frontend/assets/logo.png" height="100px" />
  <br/>
  JAMStackBox
</h1>

Your own self hosted continuous deployment solution for JAM Stack websites.

It takes GitHub repositories containing GatsbyJS sites and builts them once an POST request to a specific URL has been called.

The build happens inside a Docker container to assure that a stable enviroment is provided. Once the build is finished the static files are saved to a dedicated folder inside of `sites-public`.

Feel free to contact me on Twitter [@alexanderhorl](https://twitter.com/alexanderhorl) or send me a mail (on my GitHub profile) if you like this project or would want to know more about it.

## ⚠️ Prerequisites

- You need to have a running Docker instance on your machine.
  Currently only Docker on Linux or MacOS is supported.
- Currently only sites based on [GatsbyJS](https://www.gatsbyjs.org) are supported.
  Feel free to contribute by editing the builder to support other static site generators.

## 🚀 Quick Start

1.  **Download this repo**

    ```sh
    git clone https://github.com/AlexanderProd/jam-stack-box
    ```

2.  **Install packages and build server**

    Simply run the install script in the downloaded directory.

    ```sh
    $ bash install.sh
    ```

3.  **Create .env file from example**

    Use the `.env example` file to a create a file called `.env` in the server directory. This file contains all the necessary enviroment variables like the admin password.

4.  **Start the server process**

    The server process is a NodeJS server listening to a specific port, default `3000`.
    You can change the port by providing a `PORT` enviroment variable.

    The server process can be started manually.

    ```sh
    $ node server/dist/index.js
    ```

    Or using the [PM2 process manager](https://pm2.keymetrics.io) by running the following command in the downloaded directory.

    ```sh
    $ pm2 start
    ```

    or

    ```sh
    $ pm2 start --env production
    ```

## Usage

Since this project is currently in development theres no frontend to control your sites yet. Though you can still use it simply by doing requests agains the rest server.

When a new site gets added all parameters get saves to the DB and the sites gets a unique 6 digit alphanumeric string as ID.

A new site gets created by posting a POST request against `/site` and a build gets triggered with a POST to `/build/[id]`.

## REST Endpoints

The most important API endpoints are the following, checkout index.js in the server directory for the rest.
The default development port is 3000. It can be changed with a either PORT enviroment variable or in the config file in the server directory.

### POST `/site`

Creates a new site instance and saves it to the database, returns the id of the site.
Expects content type `x-www-form-urlencoded`.

| field  | required | description                                                                                                               |
| ------ | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| name   | true     | Name of the site, only used for front-end purposes.                                                                       |
| source | true     | GitHub link to a repository with the site content. <br/> ( e.g. https://github.com/AlexanderProd/gatsby-shopify-starter ) |

If you want to use a private repo as source you have to supply a GitHub OAuth token in the source URL, like this. `https://<token>@github.com/owner/repo.git`. JamStackBox is using [this technique](https://docs.github.com/en/github/extending-github/git-automation-with-oauth-tokens) to clone private repos.
You can read how to create a personal OAuth token [here](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token).

### POST `/build/[id or name]`

Triggers a new build for the site with the ID.

### GET `/sites`

Returns a JSON array with all sites in the database.

### GET `/sites/[id]`

Returns all details of a specific site.

### DELETE `/site/[id]`

Deletes the site with given ID.

### GET `/badge/[id or name]`

Returns an svg image with the current state of a site, for example building or success.

<img alt="success badge" src="frontend/assets/success-status.svg" />

## 📌 ToDo

- [x] Use dynamic NodeJS version in Builder using NVM.
- [ ] Remote Deployment
- [ ] Add frontend to control sites and builds.
- [ ] Add support for other static site generators than Gatsby.
- [ ] Implement a message broker.
- [x] Deploy status badge.
- [x] Split server and builder into dedicated docker containers.
