<!-- AUTO-GENERATED-CONTENT:START (STARTER) -->
<h1 align="center">
  <img alt="Logo" src="resources/logo.png" height="100px" />
  <br/>
  JAM Stack Box
</h1>

Your own self hosted continuous deployment solution for JAM Stack websites.

## Start

### Build Docker image

```
docker build -t jamstackbox .
```

### Run Docker image

```
docker run -v /Users/your-user-name/.jamstackbox:/data -d -p 4757:3000 --restart always jamstackbox
```

#### Flags

| -v        | Defines the directory on your machine where Docker saves the persistent data. Do not change the part after the colonD                                                                                                                           |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| -d        | Tells Docker in detached mode (in the background).                                                                                                                                                                                              |
| -p        | Defines the ports docker uses for communication between container and host. The number before the colon specifies the host port. Do not change the number after the colon.                                                                      |
| --restart | The always flag tells Docker to restart the container if it crashes or when the docker process restarts (e.g after system reboot). Read [here](https://docs.docker.com/config/containers/start-containers-automatically/) for more information. |

<!-- ToDo Explain Flags -->

## 📌 ToDo

- [] Reduce Docker image size.
- [] Split server and builder into dedicated docker containers.
