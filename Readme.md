Cards Server
========

API server for the credit card rewards demo site.

This project uses the following scripts, frameworks, libraries:

* [NodeJS](https://nodejs.org/)
* [Hapi](http://hapijs.com/)
* [Swagger](http://swagger.io/)
* [Rethinkdb](http://www.rethinkdb.com/)
* [Influxdb](http://influxdb.com/) and [Grafana](http://grafana.org/)
* Many others, check the package.json file

## Getting Started
Running the server depends on being able to access a few backend services before operating properly.

### Rethinkdb
The easiest way to run Rethinkdb is using their official docker image:

```
  docker pull rethinkdb:2.0.0

  docker run --name=rethinkdb -d -p 28015:28015 -p 8080:8080 rethinkdb:2.0.0
```

*Note:* This will store all of the data in the container and will be deleted if the container is removed.
You can use the [import](http://rethinkdb.com/docs/importing/) command to bulk push test data to the database.

### Influxdb and Grafana
I couldn't find a docker image that I liked for these services, so I just installed them using the 
instructions on their websites. By default they will start on boot. The only required configuration is
that a 'cards' database be created in Influxdb.

```
  curl -X POST 'http://localhost:8086/db?u=root&p=root' -d '{"name": "cards"}'
```

## Development

### NodeJS
Install all required dependencies using the command: `npm install`

### Dev Mode
Start the server using the helper NPM script: `npm start`

By default, it will not attempt to log to the local Influx server. To enable Influx use: `INFLUX_ENABLE=1 npm start`

### Configuration
All configuration variables can be set using environment variables or by editing the config.js defaults.
It is set up this way so that the code can be quickly set up for a development environment, staging, or
final deployment. The defaults in the config.js file represent a development environment. **Make sure
production usernames/password/keys don't accidentally get checked in to the repo!**

### Tests
Any tests can be run using the command: `npm test`

### Swagger
The API is documented using the [hapi-swagger](https://github.com/glennjones/hapi-swagger) plugin and
can be viewed in a browser at [http://localhost:5555/documentation](http://localhost:5555/documentation). 
The swagger UI also allows quick manual testing of the API.

*Note:* Should look into a way to have a view-only version deployed in production

## Release Build
This project is designed to be deployed inside of a docker container. The Dockerfile is based on the official NodeJS 
container and overlays the code with all dependencies. [Docker](https://www.docker.com/) must be installed on your 
platform and be in your user's path. Then follow the steps:

* Bump the version number in the package.json file (using sem versioning: major.minor.patch format)
* Build the code and image: `npm run docker-build`
* Run the tests inside the container: `npm run docker-test`
* *Optional:* Edit the env-dev file to set up the environment
* Manually test the container: `npm run docker-run`
* *Optional:* Check the container logs: `npm run docker-logs`
* *Optional:* Stop and remove the container: `npm run docker-stop`
* Push the image to a local docker registry: `npm run docker-push`
* Deploy the update on the cluster(TBD)

### API Versioning
The entire API is versioned by prefixing '/v{major}' to every API endpoint. If a breaking change is made,
the config.js file and/or environment variable must be bumped. Minor or patch version updates may add
new optional fields to the API but cannot change/remove existing fields.

*Note:* Still need to figure out if supporting multiple API versions simulateously will be supported. This
can possibly be done by adding more Hapi server instances with version tags. HAProxy will also need to update
to support a version to backend port mapping.
