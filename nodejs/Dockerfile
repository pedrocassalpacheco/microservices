FROM mhart/alpine-node:6.3

RUN apk update
RUN apk add make gcc g++ python

# Prepare app directory
RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/bin
RUN mkdir -p /usr/src/app/routes

WORKDIR /usr/src/app

# Copy all sources
COPY *.js /usr/src/app/
COPY package.json /usr/src/app/
COPY routes/*.* /usr/src/app/routes/
COPY bin/* /usr/src/app/bin/

RUN npm install
EXPOSE 8080

# Start the app
CMD ["npm", "start"]
