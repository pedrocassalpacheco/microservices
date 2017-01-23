# Apache Tomcat image with build artifact

FROM openjdk:alpine

# Assumes that application is already built. Copys to working directory
RUN mkdir -p /opt/app
COPY app/build/libs/spring-music.jar /opt/app/spring-music.jar 
WORKDIR /opt/app 

# Updates to alpine
RUN touch /var/log/spring-music.log \
    && chmod 666 /var/log/spring-music.log

# Default port
EXPOSE 8080

# Starts Application
ENTRYPOINT ["java","-Dspring.profiles.active=mongodb","-jar","/opt/app/spring-music.jar"] 
CMD [""]
