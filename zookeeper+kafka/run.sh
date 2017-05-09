docker run -p 2181:2181 -p 9092:9092 -d --env ADVERTISED_HOST=localhost --env ADVERTISED_PORT=9092 local/spring-music-zookeeperkafka
