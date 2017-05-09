FROM mhart/alpine-node:6.3

RUN mkdir -p /usr/src/app

# Prepare app directory
WORKDIR /usr/src/app
COPY server.js /usr/src/app
COPY package.json /usr/src/app
RUN npm install
#RUN npm install --save instana-nodejs-sensor
EXPOSE 8081

# Start the app
CMD ["npm", "start"]
