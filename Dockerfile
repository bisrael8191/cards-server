###
# Cards NodeJS application server container
#
# build: docker build -t bisrael8191/cards-server:<VERSION> .
# test: docker run --rm bisrael8191/cards-server:<VERSION> npm test
# run: docker run --rm -d --name=cards-server -p 5555:5555 bisrael8191/cards-server:<VERSION>
###

FROM node:0.10
MAINTAINER Brad Israel "bisrael8191@gmail.com"

# Setup user and app paths so the app doesn't run as root
RUN groupadd -r node -g 65123 && \
  useradd -u 65123 -r -g node -d /app -s /bin/bash -c "Node user" node && \
  mkdir -p /app
WORKDIR /app

# Set any static environment variables,
# all other environment variables can be
# overridden. See config.js for a complete list.
ENV NODE_ENV production

# Copy the package.json over separately
# so that it is only rebuilt when the
# app's dependencies change
COPY package.json /app/
RUN npm install --production

# Copy the source except anything in .dockerignore
COPY . /app

# Reset permissions to the node user
RUN chown -R node:node /app

# Run all commands as the node user in the user's home
# NOTE: All commands after the USER tag will be run as that user
USER node
ENV HOME /app

# Expose any app listening ports
EXPOSE 5555

# Set the default command
CMD [ "npm", "start" ]