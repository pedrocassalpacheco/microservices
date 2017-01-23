#!/bin/bash
# Build microservices example
echo "Make sure you are on the SpringMusic home directory"
cd nginx
docker build -t local/spring-music-nginx .
rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi

cd ../app_tomcat
./gradlew assemble
docker build -t local/spring-music-tomcat .
rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi

cd ../mongodb
docker build -t local/spring-music-mongodb .
rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi

docker-compose up -d




