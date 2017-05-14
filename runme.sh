#!/bin/bash
# Build microservices example
echo "Make sure you are on the SpringMusic home directory"

docker-compose kill && docker-compose rm -f

cd nginx
docker build -t pedropacheco/spring-music-nginx .
rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi

cd ../app_tomcat
./gradlew assemble
docker build -t pedropacheco/spring-music-tomcat .
rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi

cd ../cart
docker build -t pedropacheco/spring-music-cart .
rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi

cd ../mongodb
docker build -t pedropacheco/spring-music-mongodb .
rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi

cd ../mysql
docker build -t pedropacheco/spring-music-mysql .
rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi

cd ../zookeeper+kafka
docker build -t pedropacheco/spring-music-kafka .
rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi

cd ../
docker-compose up -d
#jmeter -n -t load/load.jmx&
