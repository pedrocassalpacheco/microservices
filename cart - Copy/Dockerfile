FROM mhart/alpine-node:6.3

RUN mkdir -p /usr/src/app

# Prepare app directory
RUN apk update
RUN apk add make gcc g++ python
WORKDIR /usr/src/app
COPY server.js /usr/src/app
COPY package.json /usr/src/app
RUN npm install
RUN npm install --save git://github.com/instana/nodejs-sensor.git#mysql-instrumentation
EXPOSE 8080

# Start the app
CMD ["npm", "start"]
